'use client';

interface Product {
  productId: string;
  productName: string;
  totalQty: number;
  totalRevenue: number;
}

interface BarChartProps {
  title: string;
  products: Product[];
}

export default function BarChart({ title, products }: BarChartProps) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...products.map((p) => p.totalRevenue));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>

      <div className="space-y-4">
        {products.map((product, index) => {
          const percentage = (product.totalRevenue / maxRevenue) * 100;
          const barColor = ['bg-cp-crimson', 'bg-cp-saffron', 'bg-amber-500', 'bg-orange-400', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'][index % 8];

          return (
            <div key={product.productId} className="group">
              {/* Product name and stats */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate hover:text-cp-crimson cursor-help" title={product.productName}>
                    {product.productName}
                  </p>
                </div>
                <div className="ml-4 text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900">₹{product.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{product.totalQty} units</p>
                </div>
              </div>

              {/* Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${barColor} rounded-full transition-all duration-300 group-hover:brightness-110`}
                  style={{ width: `${Math.max(percentage, 5)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 font-medium">Total Revenue</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            ₹{products.reduce((sum, p) => sum + p.totalRevenue, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Total Units Sold</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{products.reduce((sum, p) => sum + p.totalQty, 0)}</p>
        </div>
      </div>
    </div>
  );
}
