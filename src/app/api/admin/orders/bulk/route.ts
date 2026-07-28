import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Transaction from '@/models/Transaction';
import AdminActivity from '@/models/AdminActivity';
import { createLogger } from '@/lib/utils/logger';

interface BulkActionRequestBody {
  orderIds: string[];
  action: 'status' | 'cancel';
  status?: string;
}

interface BulkActionResult {
  id: string;
  ok: boolean;
  error?: string;
}

/**
 * POST /api/admin/orders/bulk
 * Perform bulk operations on orders (status update, cancel)
 */
export async function POST(request: NextRequest) {
  const logger = createLogger({ component: 'AdminOrdersBulk', endpoint: '/api/admin/orders/bulk' });

  try {
    // Verify admin access
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;

    // Connect to database
    await connectDB();
    const body = (await request.json()) as BulkActionRequestBody;
    const { orderIds, action, status } = body;

    // Validate request
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: 'orderIds must be a non-empty array' },
        { status: 400 }
      );
    }

    if (!action || !['status', 'cancel'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action: must be "status" or "cancel"' },
        { status: 400 }
      );
    }

    // For status action, validate status parameter
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (action === 'status' && (!status || !validStatuses.includes(status))) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const results: BulkActionResult[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Process each order
    for (const orderId of orderIds) {
      try {
        const order = await Order.findById(orderId);

        if (!order) {
          results.push({ id: orderId, ok: false, error: 'Order not found' });
          errorCount++;
          continue;
        }

        if (action === 'status') {
          // Validate payment status for forward-progression statuses
          if (['confirmed', 'processing', 'shipped', 'delivered'].includes(status!)) {
            if (!['paid', 'refunded'].includes(order.paymentStatus)) {
              results.push({
                id: orderId,
                ok: false,
                error: `Cannot update to ${status}: payment not successful`,
              });
              errorCount++;
              continue;
            }
          }

          // Update status
          const previousStatus = order.orderStatus;
          order.orderStatus = status!;
          order.lastStatusUpdate = new Date();

          // Handle cancellation with refund
          if (status === 'cancelled' && order.paymentStatus === 'paid') {
            order.paymentStatus = 'refunded';
            order.refundAmount = order.totalAmount;
            order.refundedAt = new Date();

            // Create refund transaction
            await Transaction.create({
              orderId: order._id,
              gatewayOrderId: `REFUND-${order.orderNumber}`,
              amount: order.totalAmount,
              status: 'refunded',
              retryCount: 0,
              gatewayResponse: {
                type: 'refund',
                reason: 'Order cancelled by admin (bulk action)',
                refundedAt: new Date(),
              },
            });
          }

          await order.save();
          results.push({ id: orderId, ok: true });
          successCount++;
        } else if (action === 'cancel') {
          // Cancel action
          if (order.orderStatus === 'cancelled') {
            results.push({ id: orderId, ok: false, error: 'Order already cancelled' });
            errorCount++;
            continue;
          }

          order.orderStatus = 'cancelled';
          order.lastStatusUpdate = new Date();

          // Refund if payment was received
          if (order.paymentStatus === 'paid') {
            order.paymentStatus = 'refunded';
            order.refundAmount = order.totalAmount;
            order.refundedAt = new Date();

            // Create refund transaction
            await Transaction.create({
              orderId: order._id,
              gatewayOrderId: `REFUND-${order.orderNumber}`,
              amount: order.totalAmount,
              status: 'refunded',
              retryCount: 0,
              gatewayResponse: {
                type: 'refund',
                reason: 'Order cancelled by admin (bulk action)',
                refundedAt: new Date(),
              },
            });
          }

          await order.save();
          results.push({ id: orderId, ok: true });
          successCount++;
        }
      } catch (err: any) {
        logger.error('Bulk action failed for order', err, { orderId });
        results.push({ id: orderId, ok: false, error: err.message });
        errorCount++;
      }
    }

    // Log single summarizing AdminActivity
    await AdminActivity.create({
      adminId: adminCheck.session.user.id,
      adminName: adminCheck.session.user.name || 'Admin',
      adminEmail: adminCheck.session.user.email,
      action: 'orders_bulk_update',
      entityType: 'order',
      details: {
        action,
        status: action === 'status' ? status : undefined,
        count: orderIds.length,
        successCount,
        errorCount,
        failedOrderIds: results.filter((r) => !r.ok).map((r) => r.id),
      },
    });

    logger.info('Bulk order action completed', {
      action,
      totalOrders: orderIds.length,
      successCount,
      errorCount,
      adminId: adminCheck.session.user.id,
    });

    return NextResponse.json({
      success: true,
      message: `Bulk ${action} completed: ${successCount} succeeded, ${errorCount} failed`,
      results,
      summary: {
        total: orderIds.length,
        success: successCount,
        failed: errorCount,
      },
    });
  } catch (error: any) {
    logger.error('Failed to process bulk order action', error);

    return NextResponse.json(
      { error: 'Failed to process bulk action', details: error.message },
      { status: 500 }
    );
  }
}
