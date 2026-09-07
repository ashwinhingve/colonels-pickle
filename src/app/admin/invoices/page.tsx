import { requireAdmin } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import InvoiceHistoryTable from '@/components/admin/InvoiceHistoryTable';

interface SearchParams {
  page?: string;
  search?: string;
  paymentStatus?: string;
}

export const metadata = {
  title: 'Invoice History | Colonel\'s Pickle Admin',
};

export default async function InvoiceHistoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  await connectDB();

  const params = await searchParams;
  const page = Math.max(parseInt(params.page || '1', 10), 1);
  const limit = 20;
  const skip = (page - 1) * limit;
  const search = (params.search || '').trim();
  const paymentStatus = params.paymentStatus || '';

  const query: any = { invoiceNumber: { $exists: true, $ne: null } };
  if (search) {
    query.$or = [
      { invoiceNumber: { $regex: search, $options: 'i' } },
      { orderNumber: { $regex: search, $options: 'i' } },
    ];
  }
  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email phoneNumber')
      .lean(),
    Order.countDocuments(query),
  ]);

  const invoices = orders.map((order: any) => ({
    id: order._id.toString(),
    invoiceNumber: order.invoiceNumber,
    orderNumber: order.orderNumber,
    customerName: order.userId?.name || 'Guest',
    customerContact: order.userId?.email || order.userId?.phoneNumber || 'N/A',
    totalAmount: order.totalAmount,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    createdAt: order.createdAt.toISOString(),
  }));

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice History</h1>
          <p className="text-sm text-gray-500 mt-1">
            All GST invoices issued from the store ({total.toLocaleString()} total)
          </p>
        </div>
        <a
          href="/admin/invoices/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-red-700 text-white rounded-lg text-sm font-medium hover:from-amber-700 hover:to-red-800"
        >
          Create Invoice
        </a>
      </div>

      <InvoiceHistoryTable
        invoices={invoices}
        page={page}
        totalPages={totalPages}
        search={search}
        paymentStatus={paymentStatus}
      />
    </div>
  );
}
