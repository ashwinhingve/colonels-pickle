'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverLift } from '@/components/shared/HoverLift';
import { StaggerContainer, StaggerItem } from '@/components/shared/AnimatedSection';
import { EmptyWishlistIllustration } from '@/components/illustrations';

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-16"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-cp-crimson border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-cp-text-muted">Loading your wishlist...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-cp-terracotta/25 bg-cp-terracotta-light p-6 text-center"
      >
        <p className="text-cp-terracotta-deep font-medium mb-3">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchWishlist}
          className="text-cp-terracotta hover:text-cp-terracotta-deep underline font-medium"
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-cp-border bg-white p-12 text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-28 h-28 mx-auto mb-6"
        >
          <EmptyWishlistIllustration />
        </motion.div>
        <h3 className="font-display text-2xl font-bold text-cp-text mb-2">
          Your Wishlist is Empty
        </h3>
        <p className="text-cp-text-muted mb-6">
          Start adding your favorite products to save them for later.
        </p>
        <Link href="/products">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cp-crimson text-white font-medium rounded-lg hover:bg-cp-crimson-dark transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Products
          </motion.button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 flex items-center justify-between"
      >
        <p className="text-sm text-cp-text-muted">
          {wishlistItems.length} product{wishlistItems.length !== 1 ? 's' : ''} saved
        </p>
      </motion.div>

      <StaggerContainer staggerDelay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {wishlistItems.map((item) => {
              const product = item.productId;
              return (
                <StaggerItem key={product._id}>
                  <HoverLift lift={4}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative group"
                    >
                      <ProductCard product={product} />
                      <motion.button
                        onClick={() => handleRemove(product._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-3 right-3 z-10 inline-flex items-center justify-center w-8 h-8 bg-cp-crimson text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-cp-crimson-dark"
                        aria-label={`Remove ${product.name} from wishlist`}
                        title="Remove from wishlist"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </motion.button>
                    </motion.div>
                  </HoverLift>
                </StaggerItem>
              );
            })}
          </AnimatePresence>
        </div>
      </StaggerContainer>
    </div>
  );
}

export default WishlistGrid;
