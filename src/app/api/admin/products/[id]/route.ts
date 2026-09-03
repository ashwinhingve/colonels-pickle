import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb/connection';
import Product from '@/models/Product';
import StockMovement from '@/models/StockMovement';
import AdminActivity from '@/models/AdminActivity';
import { productUpdateSchema } from '@/lib/validations/product';
import cloudinary from '@/lib/cloudinary/config';
import { Types } from 'mongoose';

/**
 * PATCH /api/admin/products/[id]
 * Update a product
 * Admin only
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin access
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;

  const { id } = await params;

  try {
    const body = await req.json();

    // Sanitize SEO fields — strip empty strings that fail URL validation
    if (body.seo) {
      if (!body.seo.ogImage || body.seo.ogImage === '') {
        delete body.seo.ogImage;
      }
      if (!body.seo.metaTitle) body.seo.metaTitle = undefined;
      if (!body.seo.metaDescription) body.seo.metaDescription = undefined;
    }
    if (body.videoUrl === '') {
      delete body.videoUrl;
    }

    // Validate with Zod (partial update)
    const validated = productUpdateSchema.parse(body);

    await connectDB();

    // Capture current stock before update (if stock is being changed)
    let stockBefore: number | undefined;
    if (validated.stock !== undefined) {
      const currentProduct = (await Product.findById(id)
        .select('stock')
        .lean()) as { stock?: number } | null;
      if (currentProduct) {
        stockBefore = currentProduct.stock;
      }
    }

    // Calculate discount percentage if prices are updated
    if (validated.originalPrice && validated.price) {
      if (validated.originalPrice > validated.price) {
        validated.discountPercentage = Math.round(
          ((validated.originalPrice - validated.price) / validated.originalPrice) * 100
        );
      } else {
        validated.discountPercentage = 0;
      }
    }

    // Update product
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: validated },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Log stock movement if stock was actually changed via this update
    if (
      validated.stock !== undefined &&
      stockBefore !== undefined &&
      stockBefore !== product.stock
    ) {
      try {
        // adminCheck.session is guaranteed non-null here since verifyAdminAccess()
        // already returned without an error above.
        const session = adminCheck.session;

        // Create StockMovement record (append-only ledger)
        await StockMovement.create({
          itemType: 'product',
          itemId: new Types.ObjectId(id),
          movementType: 'adjustment',
          quantity: product.stock, // For adjustment, quantity = new absolute stock level
          reason: 'manual_adjustment',
          balanceAfter: product.stock,
          performedBy: new Types.ObjectId(session.user.id),
        });

        // Log admin activity
        try {
          await AdminActivity.create({
            adminId: session.user.id,
            adminName: session.user.name || 'Unknown Admin',
            adminEmail: session.user.email,
            action: 'stock_movement_created',
            entityType: 'product',
            entityId: new Types.ObjectId(id),
            details: {
              movementType: 'adjustment',
              quantity: product.stock,
              reason: 'manual_adjustment',
              newStock: product.stock,
              previousStock: stockBefore,
            },
          });
        } catch (logError) {
          console.error('Error logging admin activity for stock adjustment:', logError);
          // Don't fail the request if logging fails
        }
      } catch (movementError) {
        console.error('Error creating stock movement for product update:', movementError);
        // Fail-open: don't fail the product update if the audit log write fails
      }
    }

    // Invalidate homepage and products page cache
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath(`/products/${product.slug}`);

    return NextResponse.json({
      success: true,
      product,
      message: 'Product updated successfully',
    });
  } catch (error: any) {
    console.error('❌ Error updating product:', error);

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          error: `${field} already exists`,
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update product',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/[id]
 * Delete a product and its images from Cloudinary
 * Admin only
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin access
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;

  const { id } = await params;

  try {
    await connectDB();

    // Find product
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete images from Cloudinary
    const deletePromises = product.images.map(async (image: any) => {
      if (image.publicId) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
        } catch (err) {
          console.error(`Failed to delete image ${image.publicId}:`, err);
        }
      }
    });

    await Promise.all(deletePromises);

    // Delete product from database
    await product.deleteOne();

    // Invalidate homepage and products page cache
    revalidatePath('/');
    revalidatePath('/products');

    return NextResponse.json({
      success: true,
      message: 'Product and associated images deleted successfully',
    });
  } catch (error: any) {
    console.error('❌ Error deleting product:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete product',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/products/[id]
 * Get a single product (including inactive)
 * Admin only
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin access
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;

  const { id } = await params;

  try {
    await connectDB();

    const product = await Product.findById(id).select('-__v').lean();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('❌ Error fetching product:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch product',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
