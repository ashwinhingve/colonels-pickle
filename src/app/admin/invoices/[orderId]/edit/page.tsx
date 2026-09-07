import { requireAdmin } from '@/lib/auth-helpers';
import CreateInvoiceForm from '@/components/admin/CreateInvoiceForm';

export const metadata = {
  title: 'Edit Invoice | Colonel\'s Pickle Admin',
};

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  await requireAdmin();
  const { orderId } = await params;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Invoice</h1>
        <p className="text-sm text-gray-500 mt-1">
          Only available while the invoice is still pending payment. Once paid, void it and create a fresh invoice instead.
        </p>
      </div>

      <CreateInvoiceForm editOrderId={orderId} />
    </div>
  );
}
