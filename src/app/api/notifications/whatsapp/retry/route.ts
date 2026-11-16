import { NextRequest, NextResponse } from 'next/server';
import { safeSecretEqual } from '@/lib/notifications/whatsappWebhook';
import { processWhatsAppJobs, reconcileWhatsAppOrders } from '@/lib/notifications/whatsappJobs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export async function GET(request: NextRequest) {
  if (!safeSecretEqual(request.headers.get('authorization') || '', `Bearer ${process.env.WHATSAPP_RETRY_SECRET || ''}`) || !process.env.WHATSAPP_RETRY_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const recovered = await reconcileWhatsAppOrders();
    return NextResponse.json({ recovered, ...await processWhatsAppJobs() });
  } catch {
    console.error('WhatsApp retry processing failed; check database and rollout configuration');
    return NextResponse.json({ error: 'Retry processing failed' }, { status: 503 });
  }
}
