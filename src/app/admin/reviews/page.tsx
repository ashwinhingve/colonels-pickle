import { requireAdmin } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import ReviewsManager from '@/components/admin/ReviewsManager';

async function getInitialReviews() {
  await connectDB();

  const reviews = await Review.find()
    .populate('userId', 'name email')
    .populate('productId', 'name slug')
    .populate('adminId', 'name email')
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const total = await Review.countDocuments();

  return {
    reviews: reviews.map((r: any) => ({
      id: r._id.toString(),
      productId: r.productId._id.toString(),
      productName: r.productId.name,
      productSlug: r.productId.slug,
      userId: r.userId._id.toString(),
      userName: r.userId?.name || 'Anonymous',
      userEmail: r.userId?.email || '',
      rating: r.rating,
      title: r.title || '',
      comment: r.comment,
      isVerifiedPurchase: r.isVerifiedPurchase,
      images: r.images || [],
      isApproved: r.isApproved,
      rejectionReason: r.rejectionReason || null,
      adminReply: r.adminReply || null,
      adminReplyAt: r.adminReplyAt ? r.adminReplyAt.toISOString() : null,
      adminName: r.adminId?.name || null,
      createdAt: r.createdAt.toISOString(),
    })),
    total,
    page: 1,
    pageSize: 20,
    totalPages: Math.ceil(total / 20),
  };
}

export default async function AdminReviewsPage() {
  await requireAdmin();

  const initialData = await getInitialReviews();

  return (
    <div className="p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Review Moderation</h1>
        <p className="text-sm text-gray-500 mt-1">
          Approve, reject, and reply to customer reviews
        </p>
      </div>

      <ReviewsManager initialData={initialData} />
    </div>
  );
}
