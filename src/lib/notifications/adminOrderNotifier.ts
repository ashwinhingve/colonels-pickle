/** Admin alerts: durable Meta WhatsApp job plus existing email/SMS dispatch. */

import type { Types } from 'mongoose';
import Order from '@/models/Order';
import { enqueueWhatsAppOrder, processWhatsAppJobs } from './whatsappJobs';
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

    // Independent of the legacy email/SMS flag. Persist before attempting delivery.
    try {
      await enqueueWhatsAppOrder(String(orderId), { orderNumber, customerName, totalAmount, itemCount, paymentMethod });
      await processWhatsAppJobs(String(orderId));
    } catch {
      console.error('Admin WhatsApp enqueue failed; scheduled reconciliation will recover eligible orders');
    }

    if (!await this.claim(orderId)) return;

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
