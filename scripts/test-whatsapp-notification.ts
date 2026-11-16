import dotenv from 'dotenv';
import { templatePayload, sendWhatsAppOrder } from '../src/lib/notifications/whatsapp';
dotenv.config({ path: '.env.local', quiet: true });
const sample = { orderNumber: 'CP-TEST-001', customerName: 'Aarav Sharma', totalAmount: 1299.5, itemCount: 3, paymentMethod: 'cod' };
async function main() {
  if (process.argv.includes('--live')) {
    const messageId = await sendWhatsAppOrder(sample);
    console.log({ accepted: true, messageId });
    console.log('Check the recipient phone. API acceptance alone does not confirm delivery. This test does not create a database job.');
    return;
  }
  // Synthetic values are used only in preview, never in live mode.
  process.env.WHATSAPP_ACCESS_TOKEN ||= 'preview-only';
  process.env.WHATSAPP_PHONE_NUMBER_ID ||= '123456789';
  process.env.WHATSAPP_ADMIN_PHONE ||= '919999999999';
  process.env.NEXT_PUBLIC_APP_URL ||= 'https://example.com';
  const payload = templatePayload(sample);
  console.log(JSON.stringify({ ...payload, to: '[recipient hidden]' }, null, 2));
  console.log('Preview only. Use --live explicitly to send a real message.');
}
main().catch((error: Error) => { console.error(error.message); process.exitCode = 1; });
