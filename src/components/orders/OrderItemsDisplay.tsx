import Image from 'next/image';
import { Package } from 'lucide-react';

interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
  image: string;
}

interface OrderItemsDisplayProps {
  items: OrderItem[];
}

export default function OrderItemsDisplay({ items }: OrderItemsDisplayProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold text-cp-text mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-cp-terracotta" />
        Order Items ({items.length})
      </h3>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-4 p-4 bg-cp-cream rounded-xl">
            {/* Product Image */}
            <div className="flex-shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.productName}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-lg border-2 border-cp-border"
                />
              ) : (
                <div className="w-20 h-20 bg-cp-cream-dark rounded-lg border-2 border-cp-border flex items-center justify-center">
                  <Package className="w-8 h-8 text-cp-text-light" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold text-cp-text mb-1">
                {item.productName}
              </h4>
              <p className="text-sm text-cp-text-muted mb-2">SKU: {item.sku}</p>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-cp-text-muted">Price: </span>
                  <span className="font-medium text-cp-text">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-cp-text-muted">Qty: </span>
                  <span className="font-medium text-cp-text">×{item.quantity}</span>
                </div>
              </div>
            </div>

            {/* Item Total */}
            <div className="flex-shrink-0 text-right">
              <p className="text-xs text-cp-text-muted mb-1">Total</p>
              <p className="text-lg font-bold text-cp-text">
                ₹{item.total.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
