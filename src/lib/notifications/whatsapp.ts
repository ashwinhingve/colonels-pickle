/** Server-side Meta Cloud API transport. No customer address or phone is sent. */
export interface WhatsAppOrder {
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  itemCount: number;
  paymentMethod: string;
}

export class WhatsAppError extends Error {
  constructor(public readonly code: string, public readonly retryable: boolean) {
    super(code);
  }
}

export function whatsappConfig() {
  const config = {
    token: process.env.WHATSAPP_ACCESS_TOKEN || '',
    phoneId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    recipient: process.env.WHATSAPP_ADMIN_PHONE || '',
    version: process.env.WHATSAPP_API_VERSION || 'v23.0',
    template: process.env.WHATSAPP_ORDER_TEMPLATE || 'colonels_pickle_admin_new_order',
    language: process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en_US',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || '',
  };
  if (!config.token || !/^\d+$/.test(config.phoneId) || !/^[1-9]\d{7,14}$/.test(config.recipient) ||
      !/^v\d+\.\d+$/.test(config.version) || !/^[a-z0-9_]+$/.test(config.template) ||
      !/^https:\/\//.test(config.appUrl)) {
    throw new WhatsAppError('configuration_missing_or_invalid', false);
  }
  return config;
}

export function templatePayload(order: WhatsAppOrder) {
  const c = whatsappConfig();
  const values = [order.orderNumber, order.customerName.trim().split(/\s+/)[0] || 'Customer',
    order.totalAmount.toFixed(2), String(order.itemCount),
    order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
    `${c.appUrl.replace(/\/$/, '')}/admin/orders`];
  return { messaging_product: 'whatsapp', to: c.recipient, type: 'template',
    template: { name: c.template, language: { code: c.language },
      components: [{ type: 'body', parameters: values.map(text => ({ type: 'text', text })) }] } };
}

export async function sendWhatsAppOrder(order: WhatsAppOrder, correlationId?: string): Promise<string> {
  const c = whatsappConfig();
  try {
    const response = await fetch(`https://graph.facebook.com/${c.version}/${c.phoneId}/messages`, {
      method: 'POST', headers: { Authorization: `Bearer ${c.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...templatePayload(order), ...(correlationId ? { biz_opaque_callback_data: correlationId } : {}) }), signal: AbortSignal.timeout(8000),
    });
    const body = await response.json().catch(() => ({}));
    if (response.ok && !body.messages?.[0]?.id) throw new WhatsAppError('invalid_response_delivery_uncertain', true);
    if (!response.ok) {
      const code = Number(body.error?.code || 0);
      throw new WhatsAppError(`meta_${response.status}_${code}`, response.status === 429 || response.status >= 500 || [130429, 131000, 131016, 131048, 131056].includes(code));
    }
    return String(body.messages[0].id);
  } catch (error) {
    if (error instanceof WhatsAppError) throw error;
    // A network timeout can mean Meta accepted the message. A retry may duplicate it.
    throw new WhatsAppError('network_or_timeout_delivery_uncertain', true);
  }
}
