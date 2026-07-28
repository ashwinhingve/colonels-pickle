import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthentication } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb/connection';
import WishlistItem from '@/models/WishlistItem';
import Product from '@/models/Product';

/**
 * GET /api/wishlist
 * Get all wishlist items for the authenticated user with populated product data
 */
export async function GET(req: NextRequest) {
  try {
    const authCheck = await verifyAuthentication();
    if (authCheck.error) return authCheck.error;

    const userId = authCheck.session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    await connectDB();

    const wishlistItems = await WishlistItem.find({ userId })
      .populate('productId')
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        wishlistItems: wishlistItems.map((item) => ({
          _id: item._id,
          productId: item.productId,
          createdAt: item.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Get wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wishlist
 * Add a product to the user's wishlist
 * Body: { productId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const authCheck = await verifyAuthentication();
    if (authCheck.error) return authCheck.error;

    const userId = authCheck.session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Missing required field: productId' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if already in wishlist (due to unique constraint, this will fail gracefully)
    const existingItem = await WishlistItem.findOne({
      userId,
      productId,
    });

    if (existingItem) {
      return NextResponse.json(
        { error: 'Product already in wishlist' },
        { status: 409 }
      );
    }

    // Create new wishlist item
    const wishlistItem = await WishlistItem.create({
      userId,
      productId,
    });

    return NextResponse.json(
      {
        _id: wishlistItem._id,
        productId: wishlistItem.productId,
        createdAt: wishlistItem.createdAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Add to wishlist error:', error);
    return NextResponse.json(
      {
        error: 'Failed to add to wishlist',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/wishlist?productId=<id>
 * Remove a product from the user's wishlist
 */
export async function DELETE(req: NextRequest) {
  try {
    const authCheck = await verifyAuthentication();
    if (authCheck.error) return authCheck.error;

    const userId = authCheck.session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    const productId = req.nextUrl.searchParams.get('productId');
    if (!productId) {
      return NextResponse.json(
        { error: 'Missing query parameter: productId' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await WishlistItem.findOneAndDelete({
      userId,
      productId,
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Wishlist item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Removed from wishlist' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Delete from wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}
