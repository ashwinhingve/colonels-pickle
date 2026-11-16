import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });

export const orderTemplate = {
  name: process.env.WHATSAPP_ORDER_TEMPLATE || 'colonels_pickle_admin_new_order',
  language: process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en_US',
  category: 'UTILITY',
  components: [{ type: 'BODY',
    text: 'New confirmed order received.\nOrder: {{1}}\nCustomer: {{2}}\nTotal: INR {{3}}\nQuantity: {{4}}\nPayment method: {{5}}\nView orders: {{6}}',
    example: { body_text: [['CP-2026-001', 'Aarav', '1299.50', '3', 'Cash on Delivery', 'https://example.com/admin/orders']] },
  }],
};

async function main() {
  if (!process.argv.includes('--submit')) { console.log(JSON.stringify(orderTemplate, null, 2)); return; }
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const account = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '';
  const version = process.env.WHATSAPP_API_VERSION || 'v23.0';
  if (!token || !/^\d+$/.test(account) || !/^v\d+\.\d+$/.test(version)) throw new Error('Configure access token, Business Account ID, and API version first');
  const response = await fetch(`https://graph.facebook.com/${version}/${account}/message_templates`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(orderTemplate), signal: AbortSignal.timeout(15000),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(`Template submission failed: HTTP ${response.status}, Meta code ${Number(result.error?.code || 0)}`);
  console.log({ id: result.id, status: result.status, category: result.category });
}
main().catch((error: Error) => { console.error(error.message); process.exitCode = 1; });
