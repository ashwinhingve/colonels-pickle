import { requireAdmin } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import Product from '@/models/Product';
import Link from 'next/link';
import ThresholdEditor from '@/components/admin/inventory/ThresholdEditor';
import { AlertTriangle, AlertCircle, Package } from 'lucide-react';

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
