/**
 * Admin WhatsApp Notification Service — CallMeBot (100% Free)
 *
 * Sends real WhatsApp alerts to the business owner's own number at ₹0:
 * no WhatsApp Business account, no Twilio, no per-message charge, no subscription.
 *
 * HOW IT WORKS
 *   CallMeBot is a free relay. You opt in ONCE from the admin phone, receive an
 *   API key, and this service then POSTs order alerts to that number for free.
 *   Messages arrive FROM CallMeBot's WhatsApp number (not the brand number).
 *
 * VERIFIED LIMITATIONS (keep in mind)
 *   - Self-notifications only — can message ONLY the opted-in number (the admin).
 *     It cannot message customers. That is exactly what we want here.
 *   - ~80 messages/day soft limit (ample for order alerts).
 *   - Unofficial, no SLA — Telegram remains wired as a parallel free fallback.
 *   - Third-party relay — the message text transits CallMeBot's servers, so we
 *     send only minimal order metadata (order #, first name, amount, item count,
 *     payment method) and NEVER the customer's address or phone.
 *
 * ONE-TIME SETUP (admin phone holding WhatsApp 9350406289):
 *   1. Open https://www.callmebot.com/blog/free-api-whatsapp-messages/ and note
 *      the CURRENT CallMeBot WhatsApp number (it changes over time).
 *   2. Add that number as a contact, then send the exact text:
 *        I allow callmebot to send me messages
 *   3. CallMeBot replies with your API key (wait up to ~2 minutes).
 *   4. Add to .env.local:
 *        CALLMEBOT_PHONE=919350406289
 *        CALLMEBOT_API_KEY=<the key CallMeBot sent you>
 */

class CallMeBotWhatsAppService {
  // Env vars are read per-call (not at module init) so serverless cold-starts
  // never permanently disable the service if vars are injected after first load.
  private get phone(): string {
    // Accept with or without leading + ; CallMeBot wants the country-coded number.
    return (process.env.CALLMEBOT_PHONE || '').trim();
  }

  private get apiKey(): string {
    return (process.env.CALLMEBOT_API_KEY || '').trim();
  }

  private get enabled(): boolean {
    return !!(this.phone && this.apiKey);
  }

  /**
   * Low-level send. Never throws — all failures are logged and swallowed so a
   * notification problem can never break order processing.
   */
  private async send(message: string): Promise<void> {
    if (!this.enabled) {
      console.warn(
        'CallMeBot WhatsApp not configured — set CALLMEBOT_PHONE and CALLMEBOT_API_KEY'
      );
      return;
    }

    const url =
      `https://api.callmebot.com/whatsapp.php` +
      `?phone=${encodeURIComponent(this.phone)}` +
      `&text=${encodeURIComponent(message)}` +
      `&apikey=${encodeURIComponent(this.apiKey)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(url, { method: 'GET', signal: controller.signal });
      const body = await res.text();

      // CallMeBot returns HTML/plain text. A 200 with a "Message queued"/"sent"
      // style body means success; anything else is logged for diagnosis.
      if (res.ok && /queued|sent|message to/i.test(body)) {
        console.log('CallMeBot WhatsApp notification sent to admin');
      } else {
        // Never log the API key; `body` is CallMeBot's own response text.
        console.error('CallMeBot WhatsApp error:', res.status, body.slice(0, 300));
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        console.error('CallMeBot WhatsApp send timed out');
      } else {
        console.error('CallMeBot WhatsApp send failed:', err?.message || err);
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  /** Keep only the customer's first name out of the third-party relay. */
  private firstName(name: string): string {
    return (name || 'Customer').trim().split(/\s+/)[0] || 'Customer';
  }

  /**
   * Notify admin when a new order is confirmed (online or COD).
   */
  async notifyNewOrder(order: {
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    itemCount: number;
    paymentMethod: string;
  }): Promise<void> {
    const method = order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.colonelspicklebyridhwika.com';
    const items = `${order.itemCount} item${order.itemCount !== 1 ? 's' : ''}`;

    // WhatsApp formatting: *bold*. Newlines are literal \n (URL-encoded in send()).
    const message =
      `*New Order Received!*\n\n` +
      `Order: ${order.orderNumber}\n` +
      `Customer: ${this.firstName(order.customerName)}\n` +
      `Amount: Rs.${order.totalAmount.toFixed(2)}\n` +
      `Items: ${items}\n` +
      `Payment: ${method}\n\n` +
      `View: ${appUrl}/admin/orders`;

    await this.send(message);
  }

  /**
   * Notify admin when a payment fails.
   */
  async notifyPaymentFailed(order: {
    orderNumber: string;
    customerName: string;
    totalAmount: number;
  }): Promise<void> {
    const message =
      `*Payment Failed!*\n\n` +
      `Order: ${order.orderNumber}\n` +
      `Customer: ${this.firstName(order.customerName)}\n` +
      `Amount: Rs.${order.totalAmount.toFixed(2)}\n\n` +
      `Customer may need help retrying.`;

    await this.send(message);
  }
}

export const callMeBotService = new CallMeBotWhatsAppService();
