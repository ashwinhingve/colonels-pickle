// Force SSR so MongoDB is queried on every request — featured products stay fresh
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { OurStory } from "@/components/home/OurStory";
import { PremiumIngredients } from "@/components/home/PremiumIngredients";
import { CTABanner } from "@/components/home/CTABanner";

export const metadata: Metadata = {
  title: "Colonel's Pickle® — Maa Ka Pyaar, Ghar Ka Achar",
  description:
    "Authentic homemade pickles & cold press oils. No artificial preservatives, 24 whole spices, mother's recipe. FSSAI certified. Pan India delivery from Jaipur.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <CategoryGrid />
      <FeaturedProducts />
      <OurStory />
      <PremiumIngredients />
      <CTABanner />
    </>
  );
}
