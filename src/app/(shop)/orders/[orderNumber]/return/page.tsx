'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/shared/AnimatedSection';

interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  image: string;
}

export default function ReturnRequestPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);

  const [returnType, setReturnType] = useState<'refund' | 'exchange'>('refund');
  const [reason, setReason] = useState('');
  const [reasonDetails, setReasonDetails] = useState('');
  const [selectedItems, setSelectedItems] = useState<
    { productId: string; quantity: number; returnReason?: string }[]
  >([]);

  const fetchOrderDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderNumber}`);
      if (response.ok) {
        const data = await response.json();
        setOrderItems(data.items || []);
        setOrderTotal(data.totalAmount || 0);

        // Pre-select all items
        setSelectedItems(
          data.items?.map((item: OrderItem) => ({
            productId: item.productId,
            quantity: item.quantity,
          })) || []
        );
      } else {
        setError('Failed to load order details');
      }
    } catch (err) {
      setError('An error occurred while loading order details');
    } finally {
      setIsLoading(false);
    }
  }, [orderNumber]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/orders/' + orderNumber + '/return');
    } else if (status === 'authenticated') {
      fetchOrderDetails();
    }
  }, [status, fetchOrderDetails, orderNumber, router]);

  const handleItemToggle = (productId: string, quantity: number) => {
    const exists = selectedItems.find((item) => item.productId === productId);
    if (exists) {
      setSelectedItems(selectedItems.filter((item) => item.productId !== productId));
    } else {
      setSelectedItems([...selectedItems, { productId, quantity }]);
    }
  };

  const calculateRefundAmount = () => {
    return selectedItems.reduce((total, selectedItem) => {
      const item = orderItems.find((oi) => oi.productId === selectedItem.productId);
      if (item) {
        return total + item.price * selectedItem.quantity;
      }
      return total;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      setError('Please select at least one item to return');
      return;
    }

    if (!reason) {
      setError('Please select a return reason');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/orders/${orderNumber}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnType,
          reason,
          reasonDetails,
          items: selectedItems.map((si) => {
            const item = orderItems.find((oi) => oi.productId === si.productId);
            return {
              productId: si.productId,
              productName: item?.productName || '',
              sku: item?.sku || '',
              quantity: si.quantity,
              price: item?.price || 0,
            };
          }),
          refundAmount: calculateRefundAmount(),
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/orders/${orderNumber}`);
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit return request');
      }
    } catch (err) {
      setError('An error occurred while submitting your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cp-cream">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-cp-crimson border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-serif text-cp-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cp-cream">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 bg-cp-green-light rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-10 h-10 text-cp-green" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-cp-text mb-2">
            Return Request Submitted!
          </h2>
          <p className="font-serif text-cp-text-muted mb-6">
            Your return request has been submitted successfully. Our team will review it
            shortly.
          </p>
          <p className="font-sans text-sm text-cp-text-light">Redirecting to order details...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cp-cream py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection direction="up">
            {/* Header */}
            <div className="mb-8">
              <Link
                href={`/orders/${orderNumber}`}
                className="inline-flex items-center gap-2 text-cp-crimson hover:text-cp-crimson-dark mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Order
              </Link>

              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-cp-olive to-cp-terracotta bg-clip-text text-transparent">
                  Request Return/Refund
                </span>
              </h1>
              <p className="font-serif text-cp-text-muted">Order #{orderNumber}</p>
            </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Return Type */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Return Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setReturnType('refund')}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    returnType === 'refund'
                      ? 'border-cp-crimson bg-red-50'
                      : 'border-cp-border hover:border-cp-crimson/50'
                  }`}
                >
                  <p className="font-semibold text-cp-text">Refund</p>
                  <p className="text-sm text-cp-text-muted">Get your money back</p>
                </button>
                <button
                  type="button"
                  onClick={() => setReturnType('exchange')}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    returnType === 'exchange'
                      ? 'border-cp-crimson bg-red-50'
                      : 'border-cp-border hover:border-cp-crimson/50'
                  }`}
                >
                  <p className="font-semibold text-cp-text">Exchange</p>
                  <p className="text-sm text-cp-text-muted">Replace with same product</p>
                </button>
              </div>
            </div>

            {/* Select Items */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select Items</h3>
              <div className="space-y-3">
                {orderItems.map((item) => {
                  const isSelected = selectedItems.some(
                    (si) => si.productId === item.productId
                  );

                  return (
                    <label
                      key={item.productId}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-cp-crimson bg-red-50'
                          : 'border-cp-border hover:border-cp-crimson/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleItemToggle(item.productId, item.quantity)}
                        className="w-5 h-5 text-cp-crimson rounded focus:ring-cp-crimson"
                      />
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.productName}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">
                        ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                      </p>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Return Reason */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Return Reason</h3>
              <div className="space-y-4">
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-cp-border bg-white text-cp-text transition-all duration-200 focus:border-cp-crimson focus:outline-none focus:shadow-md"
                >
                  <option value="">Select a reason</option>
                  <option value="defective">Defective or damaged product</option>
                  <option value="wrong">Wrong item received</option>
                  <option value="size">Size/fit issue</option>
                  <option value="quality">Quality not as expected</option>
                  <option value="description">Not as described</option>
                  <option value="other">Other</option>
                </select>

                <textarea
                  value={reasonDetails}
                  onChange={(e) => setReasonDetails(e.target.value)}
                  placeholder="Please provide additional details (optional)"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-cp-border bg-white text-cp-text transition-all duration-200 focus:border-cp-crimson focus:outline-none focus:shadow-md resize-none"
                />
              </div>
            </div>

            {/* Refund Summary */}
            {selectedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-cp-crimson shadow-xl p-6"
              >
                <h3 className="font-display text-lg font-bold text-cp-text mb-3">
                  {returnType === 'refund' ? 'Refund' : 'Exchange'} Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-serif text-cp-text-muted">Items Selected:</span>
                    <span className="font-semibold text-cp-text">
                      {selectedItems.length}
                    </span>
                  </div>
                  {returnType === 'refund' && (
                    <div className="flex justify-between text-lg font-bold border-t border-cp-crimson/20 pt-2">
                      <span className="font-display text-cp-text">Refund Amount:</span>
                      <span className="text-cp-crimson">
                        ₹{calculateRefundAmount().toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 border-cp-border text-cp-text hover:bg-cp-cream"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || selectedItems.length === 0}
                className="flex-1 bg-cp-crimson hover:bg-cp-crimson-dark text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  `Submit ${returnType === 'refund' ? 'Refund' : 'Exchange'} Request`
                )}
              </Button>
            </div>
          </form>

          {/* Policy Info */}
          <div className="mt-6 bg-cp-green-light border-2 border-cp-green rounded-xl p-6">
            <h4 className="font-display font-semibold text-cp-green mb-2">Return Policy</h4>
            <ul className="space-y-1 text-sm font-serif text-cp-green">
              <li>• Returns are accepted within 7 days of delivery</li>
              <li>• Items must be unused and in original packaging</li>
              <li>• Refunds will be processed within 5-7 business days</li>
              <li>• Pickup will be scheduled after approval</li>
            </ul>
          </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
