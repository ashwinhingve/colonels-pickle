'use client';

import { useState, useEffect, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  showLabel?: boolean;
  onToggle?: (isSaved: boolean) => void;
  className?: string;
  ariaLabel?: string;
}

export function WishlistButton({
  productId,
  size = 'md',
  variant = 'icon',
  showLabel = false,
  onToggle,
  className,
  ariaLabel = 'Toggle wishlist',
}: WishlistButtonProps) {
  const { data: session, status } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const checkWishlistStatus = useCallback(async () => {
    try {
      setIsCheckingStatus(true);
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        const isInWishlist = data.wishlistItems?.some(
          (item: any) => item.productId?._id === productId
        );
        setIsSaved(isInWishlist || false);
      }
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [productId]);

  // Check if product is in user's wishlist on mount
  useEffect(() => {
    if (status === 'authenticated') {
      checkWishlistStatus();
    } else {
      setIsCheckingStatus(false);
    }
  }, [status, productId, checkWishlistStatus]);

  const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (status !== 'authenticated') {
      // Could redirect to login here
      console.log('User not authenticated');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isSaved) {
        // Remove from wishlist
        const response = await fetch(
          `/api/wishlist?productId=${productId}`,
          { method: 'DELETE' }
        );
        if (response.ok) {
          setIsSaved(false);
          onToggle?.(false);
        } else {
          console.error('Failed to remove from wishlist');
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
        if (response.ok) {
          setIsSaved(true);
          onToggle?.(true);
        } else if (response.status === 409) {
          // Already in wishlist
          setIsSaved(true);
        } else {
          console.error('Failed to add to wishlist');
        }
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (isCheckingStatus) {
    return (
      <button
        disabled
        className={cn(
          'rounded-lg transition-colors',
          sizeClasses[size],
          'bg-gray-100 cursor-not-allowed',
          className
        )}
        aria-label={ariaLabel}
      />
    );
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg transition-all duration-300',
          sizeClasses[size],
          isSaved
            ? 'bg-cp-crimson-light text-cp-crimson hover:bg-cp-crimson hover:text-white'
            : 'bg-white border border-cp-border text-cp-text-muted hover:border-cp-crimson hover:text-cp-crimson',
          isLoading && 'opacity-50 cursor-not-allowed',
          className
        )}
        aria-label={ariaLabel}
      >
        <Heart
          className={cn(iconSizes[size], isSaved && 'fill-current')}
        />
      </button>
    );
  }

  // Button variant
  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300',
        isSaved
          ? 'bg-cp-crimson text-white hover:bg-cp-crimson-dark'
          : 'border-2 border-cp-crimson text-cp-crimson hover:bg-cp-crimson-light',
        isLoading && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-label={ariaLabel}
    >
      <Heart
        className={cn('w-5 h-5', isSaved && 'fill-current')}
      />
      {showLabel && (
        <span>{isSaved ? 'Saved' : 'Save'}</span>
      )}
    </button>
  );
}

export default WishlistButton;
