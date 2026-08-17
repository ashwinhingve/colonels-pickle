import { requireAuth } from '@/lib/auth-helpers';
import { SectionHeader } from '@/components/common/SectionHeader';
import { WishlistGrid } from '@/components/account/WishlistGrid';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: "Wishlist — Colonel's Pickle",
  description: 'View your saved products and favorite pickles from Colonel\'s Pickle.',
};

export default async function WishlistPage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-cp-cream py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Back link */}
        <AnimatedSection direction="up">
          <Link
            href="/account"
            className="mb-8 inline-flex items-center gap-2 text-cp-crimson hover:text-cp-crimson-dark font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Account
          </Link>

          {/* Header */}
          <SectionHeader
            title="My Wishlist"
            subtitle="Your collection of favorite Colonel's Pickle products. Save items to keep track of them and get notified when they go on sale."
            className="mb-12"
          />
        </AnimatedSection>

        {/* Wishlist grid */}
        <AnimatedSection direction="up" delay={0.05} className="max-w-7xl mx-auto">
          <WishlistGrid />
        </AnimatedSection>
      </div>
    </div>
  );
}
