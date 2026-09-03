import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import RawMaterial from '@/models/RawMaterial';
import Product from '@/models/Product';
import StockMovement from '@/models/StockMovement';
import SiteSettings from '@/models/SiteSettings';

/**
 * GET /api/admin/inventory/dashboard
 * Return KPI aggregation for inventory dashboard
 * Admin only
 */
export async function GET(req: NextRequest) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;

  try {
    await connectDB();

    // Get site settings for product low stock threshold
    let settings = (await SiteSettings.findOne({ key: 'global' }).lean()) as any;
    if (!settings) {
      settings = await SiteSettings.create({
        key: 'global',
        inventory: { lowStockThreshold: 10 },
      });
    }
    const productThreshold =
      (settings?.inventory?.lowStockThreshold ?? 10) as number;

    // === RAW MATERIALS ===
    const rawMaterials = await RawMaterial.find({ isActive: true }).lean();

    let rawMaterialLowStockCount = 0;
    let rawMaterialOutOfStockCount = 0;
    let rawMaterialStockValue = 0;

    rawMaterials.forEach((rm: any) => {
      if (rm.currentStock === 0) {
        rawMaterialOutOfStockCount++;
      } else if (rm.currentStock > 0 && rm.currentStock <= rm.lowStockThreshold) {
        rawMaterialLowStockCount++;
      }

      // Calculate stock value: currentStock * purchaseCost
      rawMaterialStockValue += rm.currentStock * (rm.purchaseCost || 0);
    });

    // === PRODUCTS ===
    // Mirror the logic from src/app/admin/inventory/page.tsx for consistency
    const products = await Product.find({ isActive: true })
      .select('_id name sku category stock hasVariants variants price images isActive')
      .lean();

    let productLowStockCount = 0;
    let productOutOfStockCount = 0;
    let productStockValue = 0;

    products.forEach((product: any) => {
      if (product.hasVariants && product.variants && product.variants.length > 0) {
        const activeVariants = product.variants.filter((v: any) => v.isActive);
        let minVariantStock = Infinity;
        let hasLowOrOut = false;

        activeVariants.forEach((variant: any) => {
          minVariantStock = Math.min(minVariantStock, variant.stock);

          if (variant.stock === 0 || variant.stock <= productThreshold) {
            hasLowOrOut = true;
          }
        });

        if (hasLowOrOut) {
          const effectiveStock =
            minVariantStock === Infinity ? 0 : minVariantStock;
          if (effectiveStock === 0) {
            productOutOfStockCount++;
          } else {
            productLowStockCount++;
          }
        }
      } else {
        // No variants, use top-level stock
        if (product.stock === 0) {
          productOutOfStockCount++;
        } else if (product.stock > 0 && product.stock <= productThreshold) {
          productLowStockCount++;
        }
      }

      // Calculate stock value: stock * price (top-level only, ignoring variants)
      productStockValue += product.stock * (product.price || 0);
    });

    // === RECENT MOVEMENTS ===
    const recentMovements = await StockMovement.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('itemId', 'name itemCode currentStock stock')
      .populate('performedBy', 'name email')
      .lean();

    return NextResponse.json({
      totalRawMaterials: rawMaterials.length,
      totalProducts: products.length,
      totalItems: rawMaterials.length + products.length,
      rawMaterialLowStockCount,
      rawMaterialOutOfStockCount,
      productLowStockCount,
      productOutOfStockCount,
      rawMaterialStockValue: Math.round(rawMaterialStockValue * 100) / 100,
      productStockValue: Math.round(productStockValue * 100) / 100,
      recentMovements,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch dashboard data',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
