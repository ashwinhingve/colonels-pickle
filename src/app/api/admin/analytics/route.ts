import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import User from '@/models/User';

type DateRange = '7d' | '30d' | '90d' | '12m';

interface AnalyticsResponse {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  newCustomers: number;
  revenueSeries: Array<{ date: string; revenue: number }>;
  ordersSeries: Array<{ date: string; orders: number }>;
  statusBreakdown: Array<{ status: string; count: number }>;
  paymentSplit: Array<{
    method: string;
    count: number;
    revenue: number;
  }>;
  newCustomersSeries: Array<{ date: string; count: number }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    totalQty: number;
    totalRevenue: number;
  }>;
  priorPeriodTotals: {
    revenue: number;
    orders: number;
    customers: number;
  };
}

function getDateRanges(range: DateRange): {
  current: { start: Date; end: Date };
  prior: { start: Date; end: Date };
} {
  const now = new Date();
  let currentStart: Date, priorStart: Date, priorEnd: Date;

  switch (range) {
    case '7d':
      currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      priorEnd = currentStart;
      priorStart = new Date(priorEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      priorEnd = currentStart;
      priorStart = new Date(priorEnd.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      currentStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      priorEnd = currentStart;
      priorStart = new Date(priorEnd.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '12m':
      currentStart = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      priorEnd = currentStart;
      priorStart = new Date(priorEnd.getFullYear() - 1, priorEnd.getMonth(), priorEnd.getDate());
      break;
    default:
      currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      priorEnd = currentStart;
      priorStart = new Date(priorEnd.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return {
    current: { start: currentStart, end: now },
    prior: { start: priorStart, end: priorEnd },
  };
}

function getDateFormat(range: DateRange): string {
  if (range === '12m') {
    return '%Y-%m'; // Monthly for 12m
  }
  return '%Y-%m-%d'; // Daily for 7d, 30d, 90d
}

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;

    await connectDB();

    const { searchParams } = new URL(request.url);
    const range = (searchParams.get('range') || '30d') as DateRange;

    const dateRanges = getDateRanges(range);
    const dateFormat = getDateFormat(range);

    // Fetch current period metrics
    const [
      totalRevenueData,
      totalOrdersCount,
      newCustomersCount,
      statusBreakdownData,
      paymentSplitData,
      topProductsData,
      revenueSeriesData,
      ordersSeriesData,
      newCustomersSeriesData,
      priorRevenueData,
      priorOrdersCount,
      priorCustomersCount,
    ] = await Promise.all([
      // Current revenue (paid orders only)
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: dateRanges.current.start, $lte: dateRanges.current.end },
            paymentStatus: 'paid',
          },
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),

      // Current total orders
      Order.countDocuments({
        createdAt: { $gte: dateRanges.current.start, $lte: dateRanges.current.end },
        paymentStatus: 'paid',
      }),

      // New customers in current period
      User.countDocuments({
        createdAt: { $gte: dateRanges.current.start, $lte: dateRanges.current.end },
      }),

      // Order status breakdown
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: dateRanges.current.start, $lte: dateRanges.current.end },
          },
        },
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
      ]),

      // Payment method split (count and revenue)
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: dateRanges.current.start, $lte: dateRanges.current.end },
            paymentStatus: 'paid',
          },
        },
        {
          $group: {
            _id: '$paymentMethod',
            count: { $sum: 1 },
            revenue: { $sum: '$totalAmount' },
          },
        },
      ]),

      // Top products by revenue and quantity
      OrderItem.aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: 'orderId',
            foreignField: '_id',
            as: 'order',
          },
        },
        { $unwind: '$order' },
        {
          $match: {
            'order.createdAt': { $gte: dateRanges.current.start, $lte: dateRanges.current.end },
            'order.paymentStatus': 'paid',
          },
        },
        {
          $group: {
            _id: '$productId',
            productName: { $first: '$productName' },
            totalQty: { $sum: '$quantity' },
            totalRevenue: { $sum: '$subtotal' },
          },
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 8 },
      ]),

      // Revenue series
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: dateRanges.current.start, $lte: dateRanges.current.end },
            paymentStatus: 'paid',
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
            revenue: { $sum: '$totalAmount' },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Orders series
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: dateRanges.current.start, $lte: dateRanges.current.end },
            paymentStatus: 'paid',
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // New customers series
      User.aggregate([
        {
          $match: {
            createdAt: { $gte: dateRanges.current.start, $lte: dateRanges.current.end },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Prior period revenue
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: dateRanges.prior.start, $lte: dateRanges.prior.end },
            paymentStatus: 'paid',
          },
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),

      // Prior period orders
      Order.countDocuments({
        createdAt: { $gte: dateRanges.prior.start, $lte: dateRanges.prior.end },
        paymentStatus: 'paid',
      }),

      // Prior period customers
      User.countDocuments({
        createdAt: { $gte: dateRanges.prior.start, $lte: dateRanges.prior.end },
      }),
    ]);

    const totalRevenue = totalRevenueData[0]?.total || 0;
    const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
    const priorRevenue = priorRevenueData[0]?.total || 0;

    // Format series data
    const revenueSeries = revenueSeriesData.map((item) => ({
      date: item._id,
      revenue: item.revenue,
    }));

    const ordersSeries = ordersSeriesData.map((item) => ({
      date: item._id,
      orders: item.orders,
    }));

    const newCustomersSeries = newCustomersSeriesData.map((item) => ({
      date: item._id,
      count: item.count,
    }));

    // Format status breakdown
    const statusBreakdown = statusBreakdownData.map((item) => ({
      status: item._id,
      count: item.count,
    }));

    // Format payment split
    const paymentSplit = paymentSplitData.map((item) => ({
      method: item._id,
      count: item.count,
      revenue: item.revenue,
    }));

    // Format top products
    const topProducts = topProductsData.map((item) => ({
      productId: item._id.toString(),
      productName: item.productName,
      totalQty: item.totalQty,
      totalRevenue: item.totalRevenue,
    }));

    const response: AnalyticsResponse = {
      totalRevenue,
      totalOrders: totalOrdersCount,
      avgOrderValue,
      newCustomers: newCustomersCount,
      revenueSeries,
      ordersSeries,
      statusBreakdown,
      paymentSplit,
      newCustomersSeries,
      topProducts,
      priorPeriodTotals: {
        revenue: priorRevenue,
        orders: priorOrdersCount,
        customers: priorCustomersCount,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
