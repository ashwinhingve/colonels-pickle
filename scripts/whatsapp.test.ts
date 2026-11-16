import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { test, mock } from 'node:test';
import { sendWhatsAppOrder, templatePayload, WhatsAppError } from '../src/lib/notifications/whatsapp';
import { safeSecretEqual, validSignature } from '../src/lib/notifications/whatsappWebhook';

const sample = { orderNumber: 'CP-1', customerName: 'Aarav Sharma', totalAmount: 1299.5, itemCount: 3, paymentMethod: 'cod' };
function config() {
  Object.assign(process.env, { WHATSAPP_ACCESS_TOKEN: 'secret-token', WHATSAPP_PHONE_NUMBER_ID: '123456',
    WHATSAPP_ADMIN_PHONE: '919999999999', NEXT_PUBLIC_APP_URL: 'https://example.com', WHATSAPP_API_VERSION: 'v23.0',
    WHATSAPP_ORDER_TEMPLATE: 'colonels_pickle_admin_new_order', WHATSAPP_TEMPLATE_LANGUAGE: 'en_US',
    WHATSAPP_START_AT: '2026-11-16T00:00:00Z', MONGODB_URI: 'mongodb://127.0.0.1:27017/unused' });
}

test('template fields stay in approved order and exclude personal contact/address data', () => {
  config();
  const p = templatePayload(sample);
  assert.deepEqual(p.template.components[0].parameters.map(v => v.text),
    ['CP-1', 'Aarav', '1299.50', '3', 'Cash on Delivery', 'https://example.com/admin/orders']);
  assert.equal(p.template.language.code, 'en_US');
  assert.equal(p.to, '919999999999');
});

test('transport uses bearer auth, correlation ID, and returns acceptance ID', async () => {
  config();
  const spy = mock.method(globalThis, 'fetch', async (url: string | URL | Request, init?: RequestInit) => {
    assert.equal(url, 'https://graph.facebook.com/v23.0/123456/messages');
    assert.equal((init?.headers as Record<string, string>).Authorization, 'Bearer secret-token');
    assert.equal(JSON.parse(String(init?.body)).biz_opaque_callback_data, 'job-1');
    return Response.json({ messages: [{ id: 'wamid.1' }] });
  });
  try { assert.equal(await sendWhatsAppOrder(sample, 'job-1'), 'wamid.1'); } finally { spy.mock.restore(); }
});

test('transport classifies configuration, permanent, rate-limit, server and uncertain failures safely', async () => {
  config();
  process.env.WHATSAPP_ADMIN_PHONE = 'invalid';
  await assert.rejects(sendWhatsAppOrder(sample), (e: unknown) => e instanceof WhatsAppError && !e.retryable);
  config();
  for (const [status, retryable] of [[400, false], [401, false], [429, true], [500, true]] as const) {
    const spy = mock.method(globalThis, 'fetch', async () => Response.json({ error: { code: 190, message: 'SECRET should never escape' } }, { status }));
    try {
      await assert.rejects(sendWhatsAppOrder(sample), (e: unknown) => e instanceof WhatsAppError && e.retryable === retryable && !e.message.includes('SECRET'));
    } finally { spy.mock.restore(); }
  }
  const spy = mock.method(globalThis, 'fetch', async () => { throw new Error('network secret'); });
  try { await assert.rejects(sendWhatsAppOrder(sample), (e: unknown) => e instanceof WhatsAppError && e.code === 'network_or_timeout_delivery_uncertain' && e.retryable); }
  finally { spy.mock.restore(); }
});

test('webhook signatures authenticate exact bytes and reject missing or malformed secrets', () => {
  const raw = '{"object":"whatsapp_business_account"}';
  const signature = 'sha256=' + createHmac('sha256', 'app-secret').update(raw).digest('hex');
  assert.equal(validSignature(raw, signature, 'app-secret'), true);
  assert.equal(validSignature(raw + ' ', signature, 'app-secret'), false);
  assert.equal(validSignature(raw, 'sha256=bad', 'app-secret'), false);
  assert.equal(validSignature(raw, signature, ''), false);
  assert.equal(safeSecretEqual('', ''), false);
  assert.equal(safeSecretEqual('Bearer x', 'Bearer y'), false);
});

test('durable job enqueue enforces confirmed-order and rollout eligibility; concurrency sends once', async () => {
  config();
  const { default: mongoose } = await import('mongoose');
  // Stub persistence at the model boundary. No database/network is contacted.
  globalThis.mongoose = { conn: mongoose.connection, promise: null };
  const { default: Job } = await import('../src/models/WhatsAppNotification');
  const { default: Order } = await import('../src/models/Order');
  const { enqueueWhatsAppOrder, processWhatsAppJobs } = await import('../src/lib/notifications/whatsappJobs');
  const mocks: { mock: { restore(): void } }[] = [mock.method(Job, 'init', async () => Job), mock.method(Job, 'countDocuments', async () => 0), mock.method(Job, 'updateMany', async () => ({}))];
  let eligible = false; let upserts = 0;
  mocks.push(mock.method(Order, 'exists', async (query: any) => {
    assert.deepEqual(query.orderStatus.$in, ['confirmed', 'processing', 'shipped', 'delivered']);
    assert.deepEqual(query.$or, [{ paymentStatus: 'paid' }, { paymentMethod: 'cod' }]);
    assert.equal(query.createdAt.$gte.toISOString(), '2026-11-16T00:00:00.000Z');
    return eligible ? { _id: 'order' } : null;
  }));
  const state = { _id: 'job', payload: sample, attempts: 0, status: 'pending', claimToken: '', messageId: '' };
  mocks.push(mock.method(Job, 'updateOne', async (query: any, update: any, options?: any) => {
    if (options?.upsert) { upserts++; return {}; }
    if (query.claimToken === state.claimToken && state.status === 'sending') Object.assign(state, update.$set);
    return {};
  }));
  mocks.push(mock.method(Job, 'findOneAndUpdate', async (query: any, update: any) => {
    assert.equal(query.attempts.$lt, 5);
    assert.equal(query.$or[1].status, 'sending');
    assert.ok(query.$or[1].leaseUntil.$lte instanceof Date);
    if (state.status !== 'pending') return null;
    Object.assign(state, update.$set); state.attempts++;
    return { ...state };
  }));
  const fetchMock = mock.method(globalThis, 'fetch', async () => Response.json({ messages: [{ id: 'wamid.concurrent' }] }));
  try {
    await enqueueWhatsAppOrder('012345678901234567890123', sample);
    assert.equal(upserts, 0, 'ineligible or historical orders must not enqueue');
    eligible = true;
    await enqueueWhatsAppOrder('012345678901234567890123', sample);
    assert.equal(upserts, 1);
    await Promise.all([processWhatsAppJobs('order'), processWhatsAppJobs('order')]);
    assert.equal(fetchMock.mock.callCount(), 1);
    assert.equal(state.status, 'accepted');
    assert.equal(state.messageId, 'wamid.concurrent');
    // A retryable error after an earlier failed attempt returns to durable pending.
    state.status = 'pending';
    fetchMock.mock.mockImplementation(async () => Response.json({ error: { code: 1 } }, { status: 503 }));
    await processWhatsAppJobs('order');
    assert.equal(state.status, 'pending');
    state.attempts = 4;
    await processWhatsAppJobs('order');
    assert.equal(state.status, 'failed', 'fifth attempt exhausts retries');
  } finally { fetchMock.mock.restore(); mocks.forEach(s => s.mock.restore()); }
});

test('webhook verification, authentication, correlation, and monotonic receipt query', async () => {
  config(); process.env.WHATSAPP_VERIFY_TOKEN = 'verify'; process.env.WHATSAPP_APP_SECRET = 'app-secret';
  const { NextRequest } = await import('next/server');
  const { GET, POST } = await import('../src/app/api/notifications/whatsapp/webhook/route');
  const ok = await GET(new NextRequest('https://example.com/api?hub.mode=subscribe&hub.verify_token=verify&hub.challenge=123'));
  assert.equal(await ok.text(), '123');
  assert.equal((await GET(new NextRequest('https://example.com/api?hub.mode=subscribe&hub.verify_token=wrong'))).status, 403);
  assert.equal((await POST(new NextRequest('https://example.com/api', { method: 'POST', body: '{}' }))).status, 403);
  const { default: Job } = await import('../src/models/WhatsAppNotification');
  const updates: { query: any; update: any }[] = [];
  const spy = mock.method(Job, 'updateOne', async (query: any, update: any) => { updates.push({ query, update }); return {}; });
  try {
    const raw = JSON.stringify({ object: 'whatsapp_business_account', entry: [{ changes: [{ value: {
      metadata: { phone_number_id: '123456' }, statuses: [{ id: 'wamid.1', status: 'delivered', timestamp: '100', biz_opaque_callback_data: '012345678901234567890123' }],
    } }] }] });
    const signature = 'sha256=' + createHmac('sha256', 'app-secret').update(raw).digest('hex');
    assert.equal((await POST(new NextRequest('https://example.com/api', { method: 'POST', body: raw, headers: { 'x-hub-signature-256': signature } }))).status, 200);
    assert.equal(updates[0].update.$set.messageId, 'wamid.1');
    assert.equal(updates[1].query.status.$in.includes('read'), false, 'delivered must not regress read');
    assert.equal(updates[1].query.$or[1].statusTimestamp.$lte, 100);
    assert.equal(updates[1].update.$set.status, 'delivered');
  } finally { spy.mock.restore(); }
});

test('retry endpoint rejects absent/wrong secrets before database access', async () => {
  const { NextRequest } = await import('next/server');
  const { GET } = await import('../src/app/api/notifications/whatsapp/retry/route');
  delete process.env.WHATSAPP_RETRY_SECRET;
  assert.equal((await GET(new NextRequest('https://example.com/api'))).status, 401);
  process.env.WHATSAPP_RETRY_SECRET = 'retry-secret';
  assert.equal((await GET(new NextRequest('https://example.com/api', { headers: { Authorization: 'Bearer wrong' } }))).status, 401);
});
