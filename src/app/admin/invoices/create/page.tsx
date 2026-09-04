import { requireAdmin } from '@/lib/auth-helpers';
import CreateInvoiceForm from '@/components/admin/CreateInvoiceForm';

export const metadata = {
  title: 'Create Invoice | Colonel\'s Pickle Admin',
};

export default async function CreateInvoicePage() {
  await requireAdmin();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
        <p className="text-sm text-gray-500 mt-1">
          Bill a walk-in or offline sale — stock is deducted and the invoice number assigned immediately.
        </p>
      </div>

      <CreateInvoiceForm />
    </div>
  );
}
