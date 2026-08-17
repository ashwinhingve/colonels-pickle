// Force SSR so MongoDB is queried on every request — featured products stay fresh
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { HingOriginsBand } from "@/components/home/HingOriginsBand";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { OurStory } from "@/components/home/OurStory";
import { PremiumIngredients } from "@/components/home/PremiumIngredients";
import { ProcessSection } from "@/components/home/ProcessSection";
import { VerifiedAuthentic } from "@/components/home/VerifiedAuthentic";
import { CTABanner } from "@/components/home/CTABanner";
import { WholesaleTeaser } from "@/components/home/WholesaleTeaser";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://colonelspickle.in';

export const metadata: Metadata = {
  title: "Colonel's Pickle® — Maa Ka Pyaar, Ghar Ka Achar",
  description:
    "Authentic homemade pickles & cold press oils. No artificial preservatives, 24 whole spices, mother's recipe. FSSAI certified. Pan India delivery from Jaipur.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Colonel's Pickle® — Maa Ka Pyaar, Ghar Ka Achar",
    description:
      "Authentic homemade pickles, gulkand & cold press oils. No artificial preservatives, 24 whole spices, mother's recipe. FSSAI certified. Pan India delivery from Jaipur.",
    url: SITE_URL,
    type: 'website',
    siteName: "Colonel's Pickle",
    locale: 'en_IN',
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Colonel's Pickle — Maa Ka Pyaar, Ghar Ka Achar",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Colonel's Pickle® — Maa Ka Pyaar, Ghar Ka Achar",
    description:
      "Authentic homemade pickles & cold press oils. No preservatives. FSSAI certified. Pan India delivery from Jaipur.",
    images: [`${SITE_URL}/logo.png`],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HingOriginsBand />
      <TrustBar />
      <AnimatedSection direction="up">
        <FeaturedProducts />
      </AnimatedSection>
      <AnimatedSection direction="up">
        <CategoryGrid />
      </AnimatedSection>
      <AnimatedSection direction="up">
        <PremiumIngredients />
      </AnimatedSection>
      <AnimatedSection direction="up">
        <ProcessSection />
      </AnimatedSection>
      <AnimatedSection direction="fade">
        <OurStory />
      </AnimatedSection>
      <AnimatedSection direction="up">
        <VerifiedAuthentic />
      </AnimatedSection>
      <AnimatedSection direction="up">
        <CTABanner />
      </AnimatedSection>
      <AnimatedSection direction="up">
        <WholesaleTeaser />
      </AnimatedSection>
    </>
  );
}
