import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Transaction from '@/models/Transaction';
import AdminActivity from '@/models/AdminActivity';
import { cashfreeService } from '@/lib/payment/cashfree';
import { emailService } from '@/lib/notifications/email';
import { createLogger } from '@/lib/utils/logger';

interface RefundRequestBody {
  amount?: number;
  reason: string;
  mode: 'gateway' | 'manual';
}

/**
 * POST /api/admin/orders/[orderId]/refund
 * Process a refund for an order (gateway or manual)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const logger = createLogger({ component: 'AdminOrderRefund', endpoint: '/api/admin/orders/[orderId]/refund' });

  const { orderId } = await params;

  try {
    // Verify admin access
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;

    // Connect to database
    await connectDB();
    const body = (await request.json()) as RefundRequestBody;
    const { amount, reason, mode } = body;

    // Validate request
    if (!reason || !mode) {
      return NextResponse.json(
        { error: 'Missing required fields: reason, mode' },
        { status: 400 }
      );
    }

    if (!['gateway', 'manual'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode: must be "gateway" or "manual"' },
        { status: 400 }
      );
    }

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // For gateway refunds, verify payment status
    if (mode === 'gateway') {
      if (order.paymentStatus !== 'paid') {
        return NextResponse.json(
          { error: 'Cannot refund order with payment status: ' + order.paymentStatus },
          { status: 400 }
        );
      }
    }

    // Validate amount
    const refundAmount = amount || order.totalAmount;
    if (!refundAmount || refundAmount <= 0) {
      return NextResponse.json(
        { error: 'Refund amount must be greater than 0' },
        { status: 400 }
      );
    }

    const alreadyRefunded = order.refundAmount || 0;
    const maxRefundable = order.totalAmount - alreadyRefunded;
    if (refundAmount > maxRefundable) {
      return NextResponse.json(
        {
          error: `Cannot refund more than ₹${maxRefundable}. Already refunded: ₹${alreadyRefunded}`,
        },
        { status: 400 }
      );
    }

    // Generate unique refund ID for idempotency
    const refundId = `REFUND-${order.orderNumber}-${Date.now()}`;
    let gatewayRefundId: string | null = null;
    let refundStatus: 'initiated' | 'processed' | 'failed' = 'initiated';

    // Process refund
    if (mode === 'gateway') {
      // Check if Cashfree is configured
      try {
        const refundResult = await cashfreeService.refundOrder({
          orderId: order.orderNumber,
          refundAmount,
          refundId,
          refundNote: reason,
        });

        if (!refundResult.success || !refundResult.refundId) {
          return NextResponse.json(
            { error: 'Failed to initiate gateway refund' },
            { status: 503 }
          );
        }

        gatewayRefundId = refundResult.refundId;
        refundStatus = refundResult.status === 'SUCCESS' ? 'processed' : 'initiated';
      } catch (error: any) {
        if (error.message.includes('not configured')) {
          return NextResponse.json(
            { error: 'Cashfree payment gateway is not configured. Cannot process gateway refunds.' },
            { status: 503 }
          );
        }
        logger.error('Gateway refund failed', error, { orderId, refundAmount });
        return NextResponse.json(
          { error: 'Failed to initiate gateway refund: ' + error.message },
          { status: 400 }
        );
      }
    } else {
      // Manual refund (COD or offline) - mark as processed immediately
      refundStatus = 'processed';
    }

    // Update order with refund info
    order.paymentStatus = 'refunded';
    order.refundAmount = (order.refundAmount || 0) + refundAmount;
    order.refundedAt = new Date();
    order.refundReason = reason;
    order.refundId = gatewayRefundId || refundId;
    order.refundStatus = refundStatus;
    await order.save();

    // Create transaction record for refund
    await Transaction.create({
      orderId: order._id,
      gatewayOrderId: `REFUND-${order.orderNumber}`,
      transactionId: gatewayRefundId || refundId,
      amount: refundAmount,
      status: refundStatus === 'processed' ? 'refunded' : 'initiated',
      retryCount: 0,
      gatewayResponse: {
        type: 'refund',
        mode,
        reason,
        refundedAt: new Date(),
        gatewayRefundId,
      },
    });

    // Log admin activity
    await AdminActivity.create({
      adminId: adminCheck.session.user.id,
      adminName: adminCheck.session.user.name || 'Admin',
      adminEmail: adminCheck.session.user.email,
      action: 'refund_processed',
      entityType: 'payment',
      entityId: order._id,
      entityIdentifier: order.orderNumber,
      details: {
        refundAmount,
        refundReason: reason,
        mode,
        refundStatus,
        gatewayRefundId,
      },
    });

    logger.info('Order refund processed', {
      orderId,
      orderNumber: order.orderNumber,
      refundAmount,
      mode,
      refundStatus,
      adminId: adminCheck.session.user.id,
    });

    // Send refund email (non-blocking)
    Promise.resolve().then(async () => {
      try {
        const populatedOrder = await Order.findById(orderId).populate('userId');
        if (!populatedOrder) return;

        emailService
          .sendOrderCancelled(populatedOrder)
          .catch((err) => {
            console.error('Admin refund: error sending refund email:', err);
          });
      } catch (err) {
        console.error('Admin refund: error sending customer notification:', err);
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Refund processed successfully',
      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        refundAmount: order.refundAmount,
        refundStatus: order.refundStatus || null,
        refundId: order.refundId || null,
        refundedAt: order.refundedAt?.toISOString() || null,
      },
    });
  } catch (error: any) {
    logger.error('Failed to process refund', error, {
      orderId,
    });

    return NextResponse.json(
      { error: 'Failed to process refund', details: error.message },
      { status: 500 }
    );
  }
}
