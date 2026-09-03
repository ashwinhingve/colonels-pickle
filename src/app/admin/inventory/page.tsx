import { requireAdmin } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import Product from '@/models/Product';
import RawMaterial from '@/models/RawMaterial';
import StockMovement from '@/models/StockMovement';
import Link from 'next/link';
import ThresholdEditor from '@/components/admin/inventory/ThresholdEditor';
import { AlertTriangle, AlertCircle, Package, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface InventoryItem {
  _id: string;
  name: string;
  sku: string;
  category: string;
  image: string | null;
  isActive: boolean;
  effectiveStock: number;
  hasVariants: boolean;
  variantDetails: Array<{
    id: string;
    name: string;
    sku: string;
    stock: number;
    isOutOfStock: boolean;
    isLowStock: boolean;
  }>;
  isOutOfStock: boolean;
}

async function getInventoryData() {
  await connectDB();

  // Get threshold
  let settings = await SiteSettings.findOne({ key: 'global' }).lean() as any;
  if (!settings) {
    settings = await SiteSettings.create({
      key: 'global',
      inventory: { lowStockThreshold: 10 },
    });
  }
  const threshold = (settings?.inventory?.lowStockThreshold ?? 10) as number;

  // Get all active products
  const products = await Product.find({ isActive: true })
    .select('_id name sku category stock hasVariants variants images isActive')
    .lean();

  const items: InventoryItem[] = [];
  let outOfStockCount = 0;
  let lowStockCount = 0;

  products.forEach((product: any) => {
    if (product.hasVariants && product.variants && product.variants.length > 0) {
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
          _id: product._id.toString(),
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
      if (product.stock === 0) {
        outOfStockCount++;
        items.push({
          _id: product._id.toString(),
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
          _id: product._id.toString(),
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

  // Sort by stock (ascending)
  items.sort((a, b) => a.effectiveStock - b.effectiveStock);

  return { threshold, outOfStockCount, lowStockCount, items };
}

async function getDashboardData() {
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

  return {
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
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function AdminInventoryPage() {
  await requireAdmin();

  const { threshold, outOfStockCount, lowStockCount, items } =
    await getInventoryData();

  const dashboardData = await getDashboardData();

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-red-700 bg-clip-text text-transparent">
          Inventory & Low Stock Alerts
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor product stock levels and configure low-stock alerts
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Items</p>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {dashboardData.totalItems}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {dashboardData.totalRawMaterials} raw + {dashboardData.totalProducts}{' '}
            products
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Raw Materials</p>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {dashboardData.totalRawMaterials}
          </p>
          <p className="text-xs text-gray-500 mt-1">active inventory</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Finished Products</p>
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {dashboardData.totalProducts}
          </p>
          <p className="text-xs text-gray-500 mt-1">active inventory</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Stock Value</p>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-600">
            {formatCurrency(
              dashboardData.rawMaterialStockValue +
                dashboardData.productStockValue
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">raw + finished</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Combined Low Stock</p>
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-600">
            {dashboardData.rawMaterialLowStockCount +
              dashboardData.productLowStockCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">items need attention</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Combined Out of Stock</p>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">
            {dashboardData.rawMaterialOutOfStockCount +
              dashboardData.productOutOfStockCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">out of stock</p>
        </div>
      </div>

      {/* Recent Stock Movements */}
      {dashboardData.recentMovements.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Stock Movements
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Latest {dashboardData.recentMovements.length} transactions
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {dashboardData.recentMovements.map((movement: any) => {
              const isIn = movement.movementType === 'in';
              const isOut = movement.movementType === 'out';
              const isAdjustment = movement.movementType === 'adjustment';

              const MovementIcon = isIn
                ? TrendingUp
                : isOut
                  ? TrendingDown
                  : Minus;

              const badgeColor = isIn
                ? 'bg-green-100 text-green-700'
                : isOut
                  ? 'bg-red-100 text-red-700'
                  : 'bg-amber-100 text-amber-700';

              const iconColor = isIn
                ? 'text-green-600'
                : isOut
                  ? 'text-red-600'
                  : 'text-amber-600';

              const itemName =
                movement.itemId?.name ||
                (typeof movement.itemId === 'object'
                  ? movement.itemId?.name
                  : 'Unknown Item');

              const performedByName =
                movement.performedBy?.name ||
                movement.performedBy?.email ||
                'System';

              return (
                <div key={movement._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-2 rounded-lg ${badgeColor} mt-1`}>
                        <MovementIcon className={`w-4 h-4 ${iconColor}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {itemName}
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${badgeColor}`}
                          >
                            {movement.movementType === 'in'
                              ? 'Stock In'
                              : movement.movementType === 'out'
                                ? 'Stock Out'
                                : 'Adjustment'}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600">
                          <p>
                            <span className="font-semibold">
                              {movement.quantity}
                            </span>{' '}
                            units •{' '}
                            <span className="text-gray-500">
                              Reason: {movement.reason.replace('_', ' ')}
                            </span>
                          </p>
                          {movement.notes && (
                            <p className="text-xs text-gray-500 mt-1">
                              Notes: {movement.notes}
                            </p>
                          )}
                        </div>

                        <div className="text-xs text-gray-500 mt-2">
                          <p>
                            Performed by {performedByName} •{' '}
                            {formatDistanceToNow(new Date(movement.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {movement.quantity} units
                      </p>
                      <p className="text-xs text-gray-500">
                        Balance: {movement.balanceAfter}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Threshold Editor Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Low Stock Threshold
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Products with stock at or below this threshold will be flagged as low
          stock.
        </p>
        <ThresholdEditor currentThreshold={threshold} />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Current Threshold</p>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">{threshold}</p>
          <p className="text-xs text-gray-500 mt-1">units</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Low Stock</p>
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-600">{lowStockCount}</p>
          <p className="text-xs text-gray-500 mt-1">products</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Out of Stock</p>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
          <p className="text-xs text-gray-500 mt-1">products</p>
        </div>
      </div>

      {/* Low Stock Items Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Low Stock & Out of Stock Products
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {items.length} product(s) need attention
          </p>
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No low stock or out of stock products</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className={
                      item.isOutOfStock
                        ? 'bg-red-50 hover:bg-red-100'
                        : 'hover:bg-gray-50'
                    }
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          // eslint-disable-next-line @next/next/no-img-element -- Cloudinary thumbnail in admin table; next/image adds no value here
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                          {item.hasVariants && (
                            <p className="text-xs text-gray-500">
                              {item.variantDetails.length} variant(s)
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-mono">
                        {item.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            item.isOutOfStock
                              ? 'text-red-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {item.effectiveStock} unit(s)
                        </p>
                        {item.hasVariants && item.variantDetails.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {item.variantDetails.map((v) => (
                              <div
                                key={v.id}
                                className="text-xs px-2 py-1 rounded bg-gray-100"
                              >
                                <span className="text-gray-700">{v.name}: </span>
                                <span
                                  className={
                                    v.stock === 0
                                      ? 'text-red-600 font-medium'
                                      : 'text-amber-600 font-medium'
                                  }
                                >
                                  {v.stock}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {item.isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            Out of Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                            <AlertCircle className="w-3 h-3" />
                            Low Stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/products/${item._id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Restock
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
