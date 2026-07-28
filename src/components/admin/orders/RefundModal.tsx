'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface RefundModalProps {
  isOpen: boolean;
  orderId: string;
  orderNumber: string;
  maxRefundAmount: number;
  onClose: () => void;
  onRefundProcessed: () => void;
}

export default function RefundModal({
  isOpen,
  orderId,
  orderNumber,
  maxRefundAmount,
  onClose,
  onRefundProcessed,
}: RefundModalProps) {
  const [refundAmount, setRefundAmount] = useState(maxRefundAmount);
  const [reason, setReason] = useState('');
  const [mode, setMode] = useState<'gateway' | 'manual'>('gateway');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      setMessage({ type: 'error', text: 'Please provide a refund reason' });
      return;
    }

    if (!refundAmount || refundAmount <= 0 || refundAmount > maxRefundAmount) {
      setMessage({
        type: 'error',
        text: `Refund amount must be between ₹1 and ₹${maxRefundAmount}`,
      });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: refundAmount,
          reason,
          mode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Refund initiated successfully. Refund ID: ${data.order.refundId}`,
        });

        // Reset form
        setRefundAmount(maxRefundAmount);
        setReason('');
        setMode('gateway');

        // Notify parent and close after 2 seconds
        setTimeout(() => {
          onRefundProcessed();
          onClose();
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to process refund',
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: 'Error: ' + error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Process Refund</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Order Info */}
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <div className="text-gray-600">Order</div>
            <div className="font-medium text-gray-900">{orderNumber}</div>
          </div>

          {/* Max Refundable */}
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <div className="text-blue-600">Max Refundable Amount</div>
            <div className="font-semibold text-blue-900">
              ₹{maxRefundAmount.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Refund Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refund Mode
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="gateway"
                  checked={mode === 'gateway'}
                  onChange={(e) => setMode(e.target.value as 'gateway' | 'manual')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">
                  Gateway (Cashfree)
                  <span className="text-xs text-gray-500 ml-1">- Automated refund to original payment method</span>
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="manual"
                  checked={mode === 'manual'}
                  onChange={(e) => setMode(e.target.value as 'gateway' | 'manual')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">
                  Manual (COD/Offline)
                  <span className="text-xs text-gray-500 ml-1">- Manual refund processing</span>
                </span>
              </label>
            </div>
          </div>

          {/* Refund Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refund Amount (₹)
            </label>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(parseFloat(e.target.value))}
              min={1}
              max={maxRefundAmount}
              step={0.01}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter refund reason..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm font-medium ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-cp-crimson text-white rounded-lg text-sm font-medium hover:bg-cp-crimson-dark disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Process Refund'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
