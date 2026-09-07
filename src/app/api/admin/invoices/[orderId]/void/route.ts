import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import Product, { IProduct } from '@/models/Product';
import AdminActivity from '@/models/AdminActivity';
import { logStockMovement } from '@/lib/inventory/logStockMovement';

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * POST /api/admin/invoices/[orderId]/void
 * Cancel a manually-created invoice. Restores the stock it decremented and
 * marks the order cancelled. The invoice number is never reused — the audit
 * trail (and GST filing continuity) depends on numbers only ever going
 * forward, so a voided invoice is a permanent, visible gap, not a deletion.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;
  const session = adminCheck.session;

  try {
    const { orderId } = await params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: 'Invalid order reference' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const reason: string = body.reason || 'Voided by admin';

    await connectDB();

    const mongoSession = await mongoose.startSession();
    let order!: any;
    const stockRestorations: Array<{ productId: string; quantity: number; balanceAfter: number }> = [];

    try {
      await mongoSession.withTransaction(async () => {
        const existingOrder = await Order.findById(orderId).session(mongoSession);
        if (!existingOrder) {
          throw new HttpError(404, 'Invoice not found');
        }
        if (!existingOrder.invoiceNumber) {
          throw new HttpError(400, 'This order is not an issued invoice');
        }
        if (existingOrder.orderStatus === 'cancelled') {
          throw new HttpError(409, 'This invoice has already been voided');
        }

        const items = await OrderItem.find({ orderId: existingOrder._id }).session(mongoSession);
        for (const item of items) {
          let restored: IProduct | null;
          if (item.variantId) {
            restored = await Product.findOneAndUpdate(
              { _id: item.productId, 'variants.id': item.variantId },
              { $inc: { 'variants.$.stock': item.quantity, stock: item.quantity } },
              { new: true, session: mongoSession }
            );
          } else {
            restored = await Product.findOneAndUpdate(
              { _id: item.productId },
              { $inc: { stock: item.quantity } },
              { new: true, session: mongoSession }
            );
          }
          if (restored) {
            stockRestorations.push({ productId: item.productId.toString(), quantity: item.quantity, balanceAfter: restored.stock });
          }
        }

        existingOrder.orderStatus = 'cancelled';
        existingOrder.cancelReason = reason;
        existingOrder.cancelledAt = new Date();
        await existingOrder.save({ session: mongoSession });
        order = existingOrder;
      });
    } catch (error: any) {
      if (error instanceof HttpError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }
      throw error;
    } finally {
      await mongoSession.endSession();
    }

    for (const r of stockRestorations) {
      await logStockMovement({
        productId: r.productId,
        movementType: 'in',
        quantity: r.quantity,
        reason: 'return',
        balanceAfter: r.balanceAfter,
        performedBy: session.user.id,
        reference: order.orderNumber,
        notes: `Invoice ${order.invoiceNumber} voided: ${reason}`,
      });
    }

    try {
      await AdminActivity.create({
        adminId: session.user.id,
        adminName: session.user.name || 'Unknown Admin',
        adminEmail: session.user.email,
        action: 'manual_invoice_voided',
        entityType: 'order',
        entityId: order._id,
        details: { orderNumber: order.orderNumber, invoiceNumber: order.invoiceNumber, reason },
      });
    } catch (logError) {
      console.error('Error logging admin activity:', logError);
    }

    return NextResponse.json({ success: true, orderId: order._id.toString(), invoiceNumber: order.invoiceNumber });
  } catch (error: any) {
    console.error('Invoice void error:', error);
    return NextResponse.json({ error: 'Failed to void invoice', details: error.message }, { status: 500 });
  }
}
