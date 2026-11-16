/**
 * Admin order-notification dispatcher.
 *
 * Centralizes the "a new order was confirmed" admin alert that previously lived
 * inline (and duplicated) across the payment callback (GET + webhook) and the
 * COD confirmation route. It does two things:
 *
 *   1. DEDUPE — claims an atomic flag on the Order (`adminNotifiedAt`) so that
 *      when both the browser GET callback and the Cashfree server webhook fire
 *      for the same online order, only ONE set of admin alerts is sent.
 *
 *   2. FAN OUT — sends on every configured free channel (CallMeBot WhatsApp,
 *      Telegram, admin email, admin SMS). Each channel is independently
 *      error-isolated so one failing provider never blocks the others, and none
 *      can ever throw into the order-processing path.
 *
 * Customer-facing notifications are intentionally NOT handled here — those are
 * sent directly by the routes and are unaffected.
 */

import type { Types } from 'mongoose';
import Order from '@/models/Order';
import { callMeBotService } from '@/lib/notifications/whatsapp-callmebot';
import { whatsappService } from '@/lib/notifications/whatsapp'; // Telegram (free fallback)
import { emailService } from '@/lib/notifications/email';
import { smsService } from '@/lib/notifications/sms';

export interface AdminNewOrderParams {
  orderId: Types.ObjectId | string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  itemCount: number;
  paymentMethod: string;
  shippingAddress?: unknown;
}

class AdminOrderNotifier {
  /**
   * Atomically claim the right to send admin alerts for this order.
   * Returns true for the FIRST caller only; false if already claimed.
   * On a DB error we return true (fail-open) — a rare duplicate alert is far
   * less harmful than silently dropping the owner's only order notification.
   */
  private async claim(orderId: Types.ObjectId | string): Promise<boolean> {
    try {
      const claimed = await Order.findOneAndUpdate(
        { _id: orderId, adminNotifiedAt: { $exists: false } },
        { $set: { adminNotifiedAt: new Date() } },
        { new: false }
      );
      return !!claimed;
    } catch (err) {
      console.error('adminOrderNotifier: dedup claim failed, sending anyway:', err);
      return true;
    }
  }

  /**
   * Notify the admin that a new order was confirmed. Idempotent per order.
   * Never throws.
   */
  async notifyNewOrder(params: AdminNewOrderParams): Promise<void> {
    const {
      orderId,
      orderNumber,
      customerName,
      customerEmail,
      totalAmount,
      itemCount,
      paymentMethod,
      shippingAddress,
    } = params;

    const isFirst = await this.claim(orderId);
    if (!isFirst) {
      console.log(`adminOrderNotifier: order ${orderNumber} already notified, skipping`);
      return;
    }

    // WhatsApp via CallMeBot (primary, real WhatsApp to the business number).
    callMeBotService
      .notifyNewOrder({ orderNumber, customerName, totalAmount, itemCount, paymentMethod })
      .catch((err) => console.error('Admin WhatsApp (CallMeBot) notification error:', err));

    // Telegram (free parallel fallback).
    whatsappService
      .notifyNewOrder({ orderNumber, customerName, totalAmount, itemCount, paymentMethod })
      .catch((err) => console.error('Admin Telegram notification error:', err));

    // Admin email.
    emailService
      .notifyAdminNewOrder({
        orderNumber,
        customerName,
        customerEmail,
        totalAmount,
        itemCount,
        paymentMethod,
        shippingAddress,
      })
      .catch((err) => console.error('Admin email notification error:', err));

    // Admin SMS.
    smsService
      .notifyAdminOrderConfirmed(orderNumber, customerName, totalAmount, paymentMethod)
      .catch((err) => console.error('Admin order confirmed SMS error:', err));
  }
}

export const adminOrderNotifier = new AdminOrderNotifier();
