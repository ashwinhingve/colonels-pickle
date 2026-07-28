import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { createLogger } from '@/lib/utils/logger';

interface SearchParams {
  status?: string;
  paymentStatus?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

const MAX_ROWS = 5000;

/**
 * Escape CSV field values
 */
function escapeCSVField(field: string | number | null | undefined): string {
  if (field === null || field === undefined) {
    return '';
  }

  const fieldStr = String(field);

  // If field contains comma, newline, or quote, wrap in quotes and escape quotes
  if (fieldStr.includes(',') || fieldStr.includes('\n') || fieldStr.includes('"')) {
    return `"${fieldStr.replace(/"/g, '""')}"`;
  }

  return fieldStr;
}

/**
 * GET /api/admin/orders/export
 * Export orders to CSV with applied filters
 */
export async function GET(request: NextRequest) {
  const logger = createLogger({ component: 'AdminOrdersExport', endpoint: '/api/admin/orders/export' });

  try {
    // Verify admin access
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;

    // Connect to database
    await connectDB();

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';
    const paymentStatus = searchParams.get('paymentStatus') || '';
    const search = searchParams.get('search') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';

    // Build query (same as orders page)
    const query: any = {};

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.email': { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.orderStatus = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    // Fetch orders (with row limit)
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(MAX_ROWS)
      .populate('userId', 'name email')
      .lean();

    // Build CSV header
    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Customer Email',
      'Order Status',
      'Payment Status',
      'Payment Method',
      'Items Count',
      'Subtotal',
      'Shipping Cost',
      'Discount Amount',
      'Total Amount',
    ];

    // Build CSV rows
    const rows: string[] = [headers.map((h) => escapeCSVField(h)).join(',')];

    for (const order of orders) {
      const row = [
        escapeCSVField(order.orderNumber),
        escapeCSVField(new Date(order.createdAt).toLocaleDateString('en-IN')),
        escapeCSVField((order as any).userId?.name || 'Guest'),
        escapeCSVField((order as any).userId?.email || 'N/A'),
        escapeCSVField(order.orderStatus),
        escapeCSVField(order.paymentStatus),
        escapeCSVField(order.paymentMethod),
        escapeCSVField(order.items?.length || 0),
        escapeCSVField(order.subtotal.toFixed(2)),
        escapeCSVField((order.shippingCost || 0).toFixed(2)),
        escapeCSVField((order.discountAmount || 0).toFixed(2)),
        escapeCSVField(order.totalAmount.toFixed(2)),
      ];

      rows.push(row.join(','));
    }

    // Add note if data was capped
    if (orders.length === MAX_ROWS) {
      rows.push('');
      rows.push(`# Note: Export limited to ${MAX_ROWS} orders. Use filters to narrow the result set.`);
    }

    const csv = rows.join('\n');

    logger.info('Orders exported to CSV', {
      rowCount: orders.length,
      capped: orders.length === MAX_ROWS,
      adminId: adminCheck.session.user.id,
    });

    // Return as CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="orders-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    logger.error('Failed to export orders', error);

    return NextResponse.json(
      { error: 'Failed to export orders', details: error.message },
      { status: 500 }
    );
  }
}
