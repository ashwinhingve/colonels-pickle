import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';

/**
 * GET /api/admin/reviews
 * List reviews with optional filters
 * Query params: ?status=pending|approved|rejected&productId=&rating=&page=1
 */
export async function GET(req: NextRequest) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const productId = searchParams.get('productId');
    const rating = searchParams.get('rating');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = 20;

    // Build filter
    const filter: any = {};

    if (status === 'pending') {
      filter.isApproved = false;
      filter.rejectionReason = { $exists: false };
    } else if (status === 'approved') {
      filter.isApproved = true;
    } else if (status === 'rejected') {
      filter.isApproved = false;
      filter.rejectionReason = { $exists: true };
    }

    if (productId) {
      filter.productId = productId;
    }

    if (rating) {
      filter.rating = parseInt(rating);
    }

    // Count total
    const total = await Review.countDocuments(filter);

    // Fetch paginated reviews
    const reviews = await Review.find(filter)
      .populate('userId', 'name email')
      .populate('productId', 'name slug')
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const serialized = reviews.map((r: any) => ({
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
    }));

    return NextResponse.json({
      success: true,
      reviews: serialized,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
