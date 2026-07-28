'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Check,
  X,
  MessageSquare,
  Loader2,
  AlertCircle,
  Send,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Review {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  images: string[];
  isApproved: boolean;
  rejectionReason: string | null;
  adminReply: string | null;
  adminReplyAt: string | null;
  adminName: string | null;
  createdAt: string;
}

interface ReviewsManagerProps {
  initialData: {
    reviews: Review[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewsManager({ initialData }: ReviewsManagerProps) {
  const [reviews, setReviews] = useState<Review[]>(initialData.reviews);
  const [pagination, setPagination] = useState({
    page: initialData.page,
    pageSize: initialData.pageSize,
    total: initialData.total,
    totalPages: initialData.totalPages,
  });

  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  async function fetchReviews(page: number = 1, filterStatus: string = '') {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
      });
      if (filterStatus) {
        params.append('status', filterStatus);
      }
      const res = await fetch(`/api/admin/reviews?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setReviews(data.reviews);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleStatusChange(newStatus: string) {
    setStatus(newStatus);
    fetchReviews(1, newStatus);
  }

  async function handleApprove(id: string) {
    setActioningId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Optimistic update
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, isApproved: true, rejectionReason: null }
            : r
        )
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActioningId(null);
    }
  }

  async function handleReject(id: string) {
    if (!rejectReason.trim()) {
      setError('Rejection reason is required');
      return;
    }

    setActioningId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          rejectionReason: rejectReason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Optimistic update
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                isApproved: false,
                rejectionReason: rejectReason,
              }
            : r
        )
      );
      setRejectingId(null);
      setRejectReason('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActioningId(null);
    }
  }

  async function handleReply(id: string) {
    if (!replyText.trim()) {
      setError('Reply cannot be empty');
      return;
    }

    setActioningId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          adminReply: replyText,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Optimistic update
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                adminReply: replyText,
                adminReplyAt: new Date().toISOString(),
              }
            : r
        )
      );
      setReplyingId(null);
      setReplyText('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActioningId(null);
    }
  }

  const pendingCount = reviews.filter(
    (r) => !r.isApproved && !r.rejectionReason
  ).length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;
  const rejectedCount = reviews.filter((r) => r.rejectionReason).length;

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        <button
          onClick={() => handleStatusChange('')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            status === ''
              ? 'border-cp-crimson text-cp-crimson'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({pagination.total})
        </button>
        <button
          onClick={() => handleStatusChange('pending')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            status === 'pending'
              ? 'border-cp-crimson text-cp-crimson'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => handleStatusChange('approved')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            status === 'approved'
              ? 'border-cp-crimson text-cp-crimson'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Approved ({approvedCount})
        </button>
        <button
          onClick={() => handleStatusChange('rejected')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            status === 'rejected'
              ? 'border-cp-crimson text-cp-crimson'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="py-12 text-center">
          <Loader2 className="w-6 h-6 text-cp-crimson animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-600 font-medium">No reviews found</p>
          <p className="text-sm text-gray-500 mt-1">
            {status ? 'Try changing your filter' : 'Check back later'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <StarRating rating={review.rating} />
                    {review.title && (
                      <span className="font-semibold text-gray-900">
                        {review.title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">{review.userName}</span>
                    {review.isVerifiedPurchase && (
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                        Verified
                      </span>
                    )}
                    <span className="text-gray-400">
                      on{' '}
                      <Link
                        href={`/products/${review.productSlug}`}
                        className="text-cp-crimson hover:underline"
                      >
                        {review.productName}
                      </Link>
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  {review.isApproved ? (
                    <div className="text-xs bg-green-100 text-green-700 px-2.5 py-1.5 rounded-full font-medium">
                      Approved
                    </div>
                  ) : review.rejectionReason ? (
                    <div className="text-xs bg-red-100 text-red-700 px-2.5 py-1.5 rounded-full font-medium">
                      Rejected
                    </div>
                  ) : (
                    <div className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1.5 rounded-full font-medium">
                      Pending
                    </div>
                  )}
                </div>
              </div>

              {/* Comment */}
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {review.comment}
              </p>

              {/* Images */}
              {review.images.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {review.images.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLightboxUrl(url)}
                      className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity flex-shrink-0"
                    >
                      <Image
                        src={url}
                        alt={`Review photo ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Rejection Reason */}
              {review.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                  <p className="text-xs font-medium text-red-700">
                    Rejection Reason:
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    {review.rejectionReason}
                  </p>
                </div>
              )}

              {/* Admin Reply */}
              {review.adminReply && (
                <div className="bg-cp-cream border border-cp-saffron rounded-lg p-3 mb-3">
                  <p className="text-xs font-medium text-cp-crimson">
                    Response from Colonel&apos;s Pickle
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {review.adminReply}
                  </p>
                  {review.adminReplyAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(review.adminReplyAt).toLocaleDateString(
                        'en-IN',
                        {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        }
                      )}
                    </p>
                  )}
                </div>
              )}

              {/* Reply Form */}
              {replyingId === review.id && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    rows={3}
                    className="w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cp-crimson resize-none"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => handleReply(review.id)}
                      disabled={actioningId !== null}
                      className="bg-cp-crimson hover:bg-cp-crimson-dark"
                    >
                      {actioningId === review.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 mr-1" />
                          Send Reply
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReplyingId(null);
                        setReplyText('');
                      }}
                      disabled={actioningId !== null}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Reject Form */}
              {rejectingId === review.id && (
                <div className="bg-red-50 rounded-lg p-3 mb-3 border border-red-200">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Reason for rejection (visible to team)..."
                    rows={2}
                    className="w-full text-sm rounded-md border border-red-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => handleReject(review.id)}
                      disabled={actioningId !== null}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {actioningId === review.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5 mr-1" />
                          Confirm Reject
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setRejectingId(null);
                        setRejectReason('');
                      }}
                      disabled={actioningId !== null}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Actions */}
              {!replyingId && !rejectingId && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                  {!review.isApproved && !review.rejectionReason && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(review.id)}
                        disabled={actioningId !== null}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {actioningId === review.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setRejectingId(review.id)}
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <X className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}

                  <Button
                    size="sm"
                    onClick={() => setReplyingId(review.id)}
                    variant="outline"
                    className="text-cp-crimson hover:bg-cp-cream"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1" />
                    {review.adminReply ? 'Edit Reply' : 'Reply'}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchReviews(pagination.page - 1, status)}
              disabled={pagination.page === 1 || loading}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchReviews(pagination.page + 1, status)}
              disabled={pagination.page === pagination.totalPages || loading}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            onClick={() => setLightboxUrl(null)}
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div
            className="relative max-w-2xl max-h-[80vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxUrl}
              alt="Review photo"
              width={800}
              height={800}
              className="object-contain rounded-lg max-h-[80vh] w-auto mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
