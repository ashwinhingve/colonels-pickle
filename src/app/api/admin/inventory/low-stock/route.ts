import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import SiteSettings from '@/models/SiteSettings';

/**
 * GET /api/admin/inventory/low-stock
 * Get list of low-stock and out-of-stock products
 * Supports ?threshold=X to override the configured threshold
 */
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;

    await connectDB();

    // Get threshold from query param or from settings
    const queryThreshold = request.nextUrl.searchParams.get('threshold');
    let threshold = 10; // default fallback

    if (queryThreshold) {
      const parsed = parseInt(queryThreshold, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        threshold = parsed;
      }
    } else {
      // Fetch from SiteSettings
      const settings = (await SiteSettings.findOne({ key: 'global' }).lean()) as any;
      if (settings?.inventory?.lowStockThreshold !== undefined) {
        threshold = settings.inventory.lowStockThreshold;
      }
    }

    // Fetch all active products with variants
    const products = await Product.find({ isActive: true })
      .select('_id name sku category stock hasVariants variants images isActive')
      .lean();

    const items: any[] = [];
    let outOfStockCount = 0;
    let lowStockCount = 0;

    products.forEach((product: any) => {
      if (product.hasVariants && product.variants && product.variants.length > 0) {
        // Check variants
        const activeVariants = product.variants.filter((v: any) => v.isActive);
        let minVariantStock = Infinity;
        let hasLowOrOut = false;
        const variantDetails: any[] = [];

        activeVariants.forEach((variant: any) => {
          minVariantStock = Math.min(minVariantStock, variant.stock);

          if (variant.stock === 0) {
            variantDetails.push({
              id: variant.id,
              name: variant.name,
              sku: variant.sku,
              stock: variant.stock,
              isOutOfStock: true,
              isLowStock: false,
            });
            hasLowOrOut = true;
          } else if (variant.stock <= threshold) {
            variantDetails.push({
              id: variant.id,
              name: variant.name,
              sku: variant.sku,
              stock: variant.stock,
              isOutOfStock: false,
              isLowStock: true,
            });
            hasLowOrOut = true;
          }
        });

        if (hasLowOrOut) {
          const effectiveStock = minVariantStock === Infinity ? 0 : minVariantStock;
          if (effectiveStock === 0) {
            outOfStockCount++;
          } else {
            lowStockCount++;
          }

          items.push({
            _id: product._id,
            name: product.name,
            sku: product.sku,
            category: product.category,
            image: product.images?.[0]?.url || null,
            isActive: product.isActive,
            effectiveStock,
            hasVariants: true,
            variantDetails,
            isOutOfStock: effectiveStock === 0,
          });
        }
      } else {
        // No variants - check top-level stock
        if (product.stock === 0) {
          outOfStockCount++;
          items.push({
            _id: product._id,
            name: product.name,
            sku: product.sku,
            category: product.category,
            image: product.images?.[0]?.url || null,
            isActive: product.isActive,
            effectiveStock: 0,
            hasVariants: false,
            variantDetails: [],
            isOutOfStock: true,
          });
        } else if (product.stock <= threshold) {
          lowStockCount++;
          items.push({
            _id: product._id,
            name: product.name,
            sku: product.sku,
            category: product.category,
            image: product.images?.[0]?.url || null,
            isActive: product.isActive,
            effectiveStock: product.stock,
            hasVariants: false,
            variantDetails: [],
            isOutOfStock: false,
          });
        }
      }
    });

    // Sort by effective stock (ascending)
    items.sort((a, b) => a.effectiveStock - b.effectiveStock);

    return NextResponse.json({
      threshold,
      outOfStockCount,
      lowStockCount,
      items,
    });
  } catch (error: any) {
    console.error('Error fetching low-stock products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
