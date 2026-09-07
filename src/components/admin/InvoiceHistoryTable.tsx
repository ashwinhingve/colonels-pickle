'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Printer, Download, Pencil, Ban, ChevronLeft, ChevronRight } from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  customerName: string;
  customerContact: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

interface InvoiceHistoryTableProps {
  invoices: Invoice[];
  page: number;
  totalPages: number;
  search: string;
  paymentStatus: string;
}

const statusColorMap: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function InvoiceHistoryTable({
  invoices,
  page,
  totalPages,
  search,
  paymentStatus,
}: InvoiceHistoryTableProps) {
  const router = useRouter();
  const [localSearch, setLocalSearch] = useState(search);
  const [localStatus, setLocalStatus] = useState(paymentStatus);
  const [voidingId, setVoidingId] = useState<string | null>(null);
  const [voidReason, setVoidReason] = useState('');
  const [isVoiding, setIsVoiding] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const updateURL = (nextSearch: string, nextStatus: string, nextPage = 1) => {
    const params = new URLSearchParams();
    if (nextPage > 1) params.set('page', nextPage.toString());
    if (nextSearch) params.set('search', nextSearch);
    if (nextStatus) params.set('paymentStatus', nextStatus);
    router.push(`/admin/invoices?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL(localSearch, localStatus);
  };

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(
      amount
    );

  const handleVoid = async (id: string) => {
    setIsVoiding(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/invoices/${id}/void`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: voidReason || 'Voided by admin' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: `Invoice ${data.invoiceNumber} voided and stock restored.` });
        setVoidingId(null);
        setVoidReason('');
        router.refresh();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to void invoice' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Error: ' + err.message });
    } finally {
      setIsVoiding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 space-y-3">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by invoice or order number..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <select
            value={localStatus}
            onChange={(e) => {
              setLocalStatus(e.target.value);
              updateURL(localSearch, e.target.value);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Payment Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-cp-crimson text-white text-sm font-medium rounded-lg hover:bg-cp-crimson-dark"
          >
            Search
          </button>
        </form>

        {message && (
          <div
            className={`text-sm px-3 py-2 rounded-lg ${
              message.type === 'success' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Invoice #
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Order Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((inv) => {
                const isCancelled = inv.orderStatus === 'cancelled';
                const canEdit = inv.paymentStatus === 'pending' && !isCancelled;
                const canVoid = !isCancelled;
                return (
                  <tr key={inv.id} className="hover:bg-cp-crimson-light">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{inv.invoiceNumber}</div>
                      <div className="text-xs text-gray-500">Order: {inv.orderNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{inv.customerName}</div>
                      <div className="text-xs text-gray-500">{inv.customerContact}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(inv.totalAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                          statusColorMap[inv.paymentStatus] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                          statusColorMap[inv.orderStatus] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {inv.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(inv.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/api/orders/${inv.id}/invoice`}
                          target="_blank"
                          title="Print"
                          className="text-gray-500 hover:text-amber-600"
                        >
                          <Printer className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/api/orders/${inv.id}/invoice/pdf`}
                          target="_blank"
                          title="Download PDF"
                          className="text-gray-500 hover:text-amber-600"
                        >
                          <Download className="w-4 h-4" />
                        </Link>
                        {canEdit && (
                          <Link
                            href={`/admin/invoices/${inv.id}/edit`}
                            title="Edit"
                            className="text-gray-500 hover:text-blue-600"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                        )}
                        {canVoid && (
                          <button
                            type="button"
                            title="Void"
                            onClick={() => setVoidingId(inv.id)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => updateURL(search, paymentStatus, page - 1)}
              className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => updateURL(search, paymentStatus, page + 1)}
              className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {voidingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Void Invoice</h3>
            <p className="text-sm text-gray-600">
              This restores the stock that was decremented for this invoice and marks it cancelled.
              The invoice number will never be reused. This cannot be undone.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
              <input
                type="text"
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                placeholder="e.g. Customer cancelled order"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setVoidingId(null);
                  setVoidReason('');
                }}
                disabled={isVoiding}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleVoid(voidingId)}
                disabled={isVoiding}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isVoiding ? 'Voiding...' : 'Void Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
