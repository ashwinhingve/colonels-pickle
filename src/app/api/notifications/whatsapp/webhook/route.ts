import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/connection';
import Job from '@/models/WhatsAppNotification';
import { deliveryRanks, safeSecretEqual, validSignature } from '@/lib/notifications/whatsappWebhook';

export const runtime = 'nodejs';
export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  if (p.get('hub.mode') !== 'subscribe' || !safeSecretEqual(p.get('hub.verify_token') || '', process.env.WHATSAPP_VERIFY_TOKEN || '')) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  return new NextResponse(p.get('hub.challenge') || '', { headers: { 'Content-Type': 'text/plain' } });
}

export async function POST(request: NextRequest) {
  const raw = await request.text();
  if (!validSignature(raw, request.headers.get('x-hub-signature-256'), process.env.WHATSAPP_APP_SECRET || '')) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }
  let body;
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (body.object !== 'whatsapp_business_account') return NextResponse.json({ received: true });
  try {
    await connectDB();
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value;
        if (value?.metadata?.phone_number_id !== process.env.WHATSAPP_PHONE_NUMBER_ID) continue;
        for (const event of value.statuses || []) {
          const timestamp = Number(event.timestamp);
          if (!event.id || !Number.isFinite(timestamp) || !(Object.prototype.hasOwnProperty.call(deliveryRanks, event.status) || event.status === 'failed')) continue;
          // Correlate callbacks even if they beat the API response to our database.
          const correlation = String(event.biz_opaque_callback_data || '');
          if (/^[a-f0-9]{24}$/i.test(correlation)) {
            await Job.updateOne({ _id: correlation, status: { $in: ['sending', 'pending', 'failed'] }, messageId: { $exists: false } },
              { $set: { messageId: event.id, status: 'accepted' }, $unset: { leaseUntil: 1, claimToken: 1 } });
          }
          const rank = deliveryRanks[event.status];
          // Never regress read/delivered because callbacks can arrive out of order.
          const previous = event.status === 'failed' ? ['accepted', 'sent'] :
            [...Object.keys(deliveryRanks).filter(s => deliveryRanks[s] <= rank), ...(rank >= 2 ? ['failed'] : [])];
          await Job.updateOne({ messageId: event.id, status: { $in: previous },
            $or: [{ statusTimestamp: { $exists: false } }, { statusTimestamp: { $lte: timestamp } }] },
          { $set: { status: event.status, statusTimestamp: timestamp,
            ...(event.status === 'failed' ? { errorCode: `delivery_${Number(event.errors?.[0]?.code || 0)}` } : {}) },
            ...(event.status !== 'failed' ? { $unset: { errorCode: 1 } } : {}) });
        }
      }
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Status storage failed' }, { status: 500 });
  }
}
