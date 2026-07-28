import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import AdminActivity from '@/models/AdminActivity';

/**
 * PATCH /api/admin/reviews/[id]
 * Action: 'approve' | 'reject' | 'reply'
 * Body: { action, rejectionReason?, adminReply? }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;

  try {
    const { id } = await params;
    const body = await req.json();
    const { action, rejectionReason, adminReply } = body;

    if (!action || !['approve', 'reject', 'reply'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    await connectDB();
    const session = adminCheck.session;

    const review = await Review.findById(id).populate('productId', '_id');
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    let updated: any = {};

    if (action === 'approve') {
      updated.isApproved = true;
      updated.rejectionReason = undefined;
      updated.adminId = new ObjectId(session.user.id);
    } else if (action === 'reject') {
      if (!rejectionReason?.trim()) {
        return NextResponse.json(
          { error: 'Rejection reason is required' },
          { status: 400 }
        );
      }
      updated.isApproved = false;
      updated.rejectionReason = rejectionReason.trim();
      updated.adminId = new ObjectId(session.user.id);
    } else if (action === 'reply') {
      if (!adminReply?.trim()) {
        return NextResponse.json(
          { error: 'Reply cannot be empty' },
          { status: 400 }
        );
      }
      updated.adminReply = adminReply.trim();
      updated.adminReplyAt = new Date();
      updated.adminId = new ObjectId(session.user.id);
    }

    // Update review
    const updatedReview = await Review.findByIdAndUpdate(id, updated, {
      new: true,
    }).populate('userId', 'name email');

    // Recompute product stats if approved/rejected
    if (action === 'approve' || action === 'reject') {
      const stats = await Review.aggregate([
        { $match: { productId: review.productId._id, isApproved: true } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' },
            count: { $sum: 1 },
          },
        },
      ]);

      if (stats.length > 0) {
        await Product.updateOne(
          { _id: review.productId._id },
          {
            averageRating: Math.round(stats[0].avgRating * 10) / 10,
            totalReviews: stats[0].count,
          }
        );
      } else {
        // No approved reviews left
        await Product.updateOne(
          { _id: review.productId._id },
          { averageRating: 0, totalReviews: 0 }
        );
      }
    }

    // Log admin activity
    const activityDetails: any = { action };
    if (rejectionReason) activityDetails.rejectionReason = rejectionReason;
    if (adminReply) activityDetails.adminReply = adminReply;

    await AdminActivity.create({
      adminId: session.user.id,
      adminName: session.user.name || 'Admin',
      adminEmail: session.user.email,
      action: `review_${action}`,
      entityType: 'product',
      entityId: review.productId._id,
      entityIdentifier: `Review #${review._id.toString().slice(-8)}`,
      details: activityDetails,
    });

    const serialized = {
      id: updatedReview._id.toString(),
      productId: updatedReview.productId.toString(),
      userId: updatedReview.userId.toString(),
      rating: updatedReview.rating,
      title: updatedReview.title || '',
      comment: updatedReview.comment,
      isVerifiedPurchase: updatedReview.isVerifiedPurchase,
      images: updatedReview.images || [],
      isApproved: updatedReview.isApproved,
      rejectionReason: updatedReview.rejectionReason || null,
      adminReply: updatedReview.adminReply || null,
      adminReplyAt: updatedReview.adminReplyAt
        ? updatedReview.adminReplyAt.toISOString()
        : null,
      createdAt: updatedReview.createdAt.toISOString(),
    };

    return NextResponse.json({ success: true, review: serialized });
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
