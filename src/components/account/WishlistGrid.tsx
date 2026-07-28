'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';

interface WishlistProduct {
  _id: string;
  productId: {
    _id: string;
    name: string;
    slug: string;
    images: Array<{ url: string }>;
    price: number;
    originalPrice?: number;
    description?: string;
    shortDescription?: string;
    variants?: Array<{
      name: string;
      price: number;
      originalPrice?: number;
      isActive?: boolean;
    }>;
    weight?: number;
    weightUnit?: string;
    isBestseller?: boolean;
    isTrending?: boolean;
    isFeatured?: boolean;
  };
  createdAt: string;
}

export function WishlistGrid() {
  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/wishlist');

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      setWishlistItems(data.wishlistItems || []);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load your wishlist. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWishlistItems(
          wishlistItems.filter((item) => item.productId._id !== productId)
        );
      } else {
        setError('Failed to remove item from wishlist');
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('Failed to remove item. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cp-crimson border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cp-text-muted">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700 font-medium mb-3">{error}</p>
        <button
          onClick={fetchWishlist}
          className="text-red-600 hover:text-red-800 underline font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="rounded-2xl border border-cp-border bg-white p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-cp-crimson-light rounded-full flex items-center justify-center">
          <Heart className="w-10 h-10 text-cp-crimson" />
        </div>
        <h3 className="font-display text-2xl font-bold text-cp-text mb-2">
          Your Wishlist is Empty
        </h3>
        <p className="text-cp-text-muted mb-6">
          Start adding your favorite products to save them for later.
        </p>
        <Link href="/products">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-cp-crimson text-white font-medium rounded-lg hover:bg-cp-crimson-dark transition-colors">
            <ShoppingBag className="w-5 h-5" />
            Browse Products
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-cp-text-muted">
          {wishlistItems.length} product{wishlistItems.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlistItems.map((item) => {
          const product = item.productId;
          return (
            <div key={product._id} className="relative group">
              <ProductCard product={product} />
              <button
                onClick={() => handleRemove(product._id)}
                className="absolute top-3 right-3 z-10 inline-flex items-center justify-center w-8 h-8 bg-cp-crimson text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-cp-crimson-dark"
                aria-label={`Remove ${product.name} from wishlist`}
                title="Remove from wishlist"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WishlistGrid;
