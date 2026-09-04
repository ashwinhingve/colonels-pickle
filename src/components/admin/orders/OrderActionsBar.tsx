'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RefundModal from './RefundModal';

interface OrderActionsBarProps {
  orderId: string;
  orderNumber: string;
  paymentStatus: string;
  refundAmount: number;
  totalAmount: number;
}

export default function OrderActionsBar({
  orderId,
  orderNumber,
  paymentStatus,
  refundAmount,
  totalAmount,
}: OrderActionsBarProps) {
  const router = useRouter();
  const [showRefundModal, setShowRefundModal] = useState(false);

  const maxRefundAmount = totalAmount - (refundAmount || 0);
  const canRefund = paymentStatus === 'paid' && maxRefundAmount > 0;

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => window.open(`/api/orders/${orderId}/invoice`, '_blank', 'noopener,noreferrer')}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Print Order
        </button>
        <a
          href={`/api/orders/${orderId}/invoice/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Download Invoice
        </a>

        {canRefund && (
          <button
            type="button"
            onClick={() => setShowRefundModal(true)}
            className="px-4 py-2 bg-cp-crimson text-white rounded-lg text-sm font-medium hover:bg-cp-crimson-dark"
          >
            Process Refund
          </button>
        )}

        {refundAmount > 0 && (
          <div className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm">
            <div className="text-purple-600 font-medium">
              Refunded: ₹{refundAmount.toLocaleString('en-IN')}
            </div>
          </div>
        )}
      </div>

      <RefundModal
        isOpen={showRefundModal}
        orderId={orderId}
        orderNumber={orderNumber}
        maxRefundAmount={maxRefundAmount}
        onClose={() => setShowRefundModal(false)}
        onRefundProcessed={() => {
          router.refresh();
        }}
      />
    </>
  );
}
