// Force SSR so MongoDB is queried on every request — featured products stay fresh
export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { OurStory } from "@/components/home/OurStory";
import { PremiumIngredients } from "@/components/home/PremiumIngredients";
import { CTABanner } from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <FeaturedProducts />
      <OurStory />
      <PremiumIngredients />
      <CTABanner />
    </>
  );
}
