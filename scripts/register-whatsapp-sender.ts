import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });

async function main() {
  if (!process.argv.includes('--register')) {
    console.log('Preview only. After adding and verifying a NEW production sender in Meta, set WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and WHATSAPP_TWO_STEP_PIN locally, then rerun with --register. Never use Sir\'s existing recipient number as the sender.');
    return;
  }
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  const pin = process.env.WHATSAPP_TWO_STEP_PIN || '';
  const version = process.env.WHATSAPP_API_VERSION || 'v23.0';
  if (!token || !/^\d+$/.test(phoneId) || !/^\d{6}$/.test(pin) || !/^v\d+\.\d+$/.test(version)) {
    throw new Error('Configure token, sender phone-number ID, six-digit two-step PIN and API version');
  }
  const response = await fetch(`https://graph.facebook.com/${version}/${phoneId}/register`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', pin }), signal: AbortSignal.timeout(15000),
  });
  const result = await response.json();
  if (!response.ok || result.success !== true) throw new Error(`Sender registration failed: HTTP ${response.status}, Meta code ${Number(result.error?.code || 0)}`);
  console.log('Sender registered successfully. Keep its two-step PIN in your password manager.');
}
main().catch((error: Error) => { console.error(error.message); process.exitCode = 1; });
