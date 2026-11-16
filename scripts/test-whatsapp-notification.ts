import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

import { callMeBotService } from '../src/lib/notifications/whatsapp-callmebot';

/**
 * Test harness for the CallMeBot WhatsApp admin notification.
 *
 *   npx tsx scripts/test-whatsapp-notification.ts
 *
 * Two modes, chosen automatically:
 *
 *  • LIVE (CALLMEBOT_PHONE + CALLMEBOT_API_KEY set in .env.local)
 *      Sends a REAL WhatsApp message. Open WhatsApp on the admin phone and
 *      confirm the alert actually arrived before trusting the integration.
 *
 *  • COMPOSE-ONLY (creds missing)
 *      Intercepts fetch to verify the exact message + URL the service builds
 *      (encoding, formatting, success-detection) WITHOUT sending or needing creds.
 */

const sampleOrder = {
  orderNumber: 'ORD-TEST-9Z4K',
  customerName: 'Aarav Sharma',
  totalAmount: 1299.5,
  itemCount: 3,
  paymentMethod: 'cod',
};

function mask(key: string): string {
  if (!key) return '(none)';
  if (key.length <= 4) return '****';
  return `${key.slice(0, 2)}****${key.slice(-2)}`;
}

async function runLive() {
  console.log('▶ LIVE MODE — sending a real WhatsApp message via CallMeBot');
  console.log(`  Recipient (CALLMEBOT_PHONE): ${process.env.CALLMEBOT_PHONE}`);
  console.log(`  API key: ${mask(process.env.CALLMEBOT_API_KEY || '')}`);
  console.log('  Sample order:', sampleOrder);
  console.log('  Sending...\n');

  await callMeBotService.notifyNewOrder(sampleOrder);

  console.log(
    '\n✔ Request completed. Now OPEN WHATSAPP on the admin phone and confirm the\n' +
      '  "New Order Received!" message actually arrived. If it did NOT arrive,\n' +
      '  the integration is NOT working regardless of what the logs above say.'
  );
}

async function runComposeOnly() {
  console.log('▶ COMPOSE-ONLY MODE — creds not set, nothing will be sent.');
  console.log('  (Set CALLMEBOT_PHONE + CALLMEBOT_API_KEY to run a real delivery test.)\n');

  // Inject dummy creds + intercept fetch so we can inspect exactly what the
  // real service would transmit — this exercises the actual compose/encode path.
  process.env.CALLMEBOT_PHONE = '919350406289';
  process.env.CALLMEBOT_API_KEY = 'DUMMY_KEY_1234';

  const realFetch = globalThis.fetch;
  let capturedUrl = '';
  // @ts-expect-error — minimal fetch stub for the test
  globalThis.fetch = async (url: string) => {
    capturedUrl = String(url);
    return {
      ok: true,
      status: 200,
      text: async () => 'Message queued. You will receive it in a few seconds.',
    } as Response;
  };

  try {
    await callMeBotService.notifyNewOrder(sampleOrder);
  } finally {
    globalThis.fetch = realFetch;
    delete process.env.CALLMEBOT_PHONE;
    delete process.env.CALLMEBOT_API_KEY;
  }

  const parsed = new URL(capturedUrl);
  const text = parsed.searchParams.get('text') || '';
  const phone = parsed.searchParams.get('phone') || '';
  const apikey = parsed.searchParams.get('apikey') || '';

  console.log('Endpoint:', `${parsed.origin}${parsed.pathname}`);
  console.log('phone   :', phone);
  console.log('apikey  :', mask(apikey));
  console.log('\nDecoded message that would be delivered:\n');
  console.log('────────────────────────────────────────');
  console.log(text);
  console.log('────────────────────────────────────────');
  console.log('\nRaw encoded URL (key masked):');
  console.log(capturedUrl.replace(apikey, mask(apikey)));

  // Basic assertions so the script fails loudly if composition breaks.
  const problems: string[] = [];
  if (!capturedUrl.startsWith('https://api.callmebot.com/whatsapp.php?')) {
    problems.push('wrong endpoint');
  }
  if (!text.includes(sampleOrder.orderNumber)) problems.push('order number missing');
  if (!text.includes('Aarav')) problems.push('customer first name missing');
  if (text.includes('Sharma')) problems.push('last name leaked (should send first name only)');
  if (!text.includes('1299.50')) problems.push('amount missing/misformatted');
  if (!capturedUrl.includes('%0A') && !capturedUrl.includes('+')) {
    problems.push('newlines/spaces not URL-encoded');
  }

  if (problems.length) {
    console.error('\nX COMPOSE CHECK FAILED:', problems.join(', '));
    process.exit(1);
  }
  console.log('\n✔ Compose check passed (endpoint, encoding, fields, first-name-only).');
}

async function main() {
  const configured = !!(process.env.CALLMEBOT_PHONE && process.env.CALLMEBOT_API_KEY);
  if (configured) {
    await runLive();
  } else {
    await runComposeOnly();
  }
}

main().catch((err) => {
  console.error('Test script error:', err);
  process.exit(1);
});
