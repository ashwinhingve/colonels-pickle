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
import { SectionDivider } from "@/components/shared/SectionDivider";

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
      <SectionDivider variant="curve" color="#FDF8F0" height={80} />

      <AnimatedSection direction="up" duration={0.5}>
        <HingOriginsBand />
      </AnimatedSection>
      <SectionDivider variant="tilt" color="#FFFFFF" height={60} />

      <AnimatedSection direction="fade" duration={0.5}>
        <TrustBar />
      </AnimatedSection>
      <SectionDivider variant="wave" color="#FDF8F0" height={70} />

      <AnimatedSection direction="up" duration={0.5}>
        <FeaturedProducts />
      </AnimatedSection>
      <SectionDivider variant="curve" color="#FFFFFF" height={65} flip />

      <AnimatedSection direction="up" duration={0.5}>
        <CategoryGrid />
      </AnimatedSection>
      <SectionDivider variant="tilt" color="#FDF8F0" height={60} />

      <AnimatedSection direction="up" duration={0.5}>
        <PremiumIngredients />
      </AnimatedSection>
      <SectionDivider variant="wave" color="#F5ECD8" height={70} flip />

      <AnimatedSection direction="up" duration={0.5}>
        <ProcessSection />
      </AnimatedSection>
      <SectionDivider variant="curve" color="#2A2417" height={80} />

      <AnimatedSection direction="fade" duration={0.5}>
        <OurStory />
      </AnimatedSection>
      <SectionDivider variant="tilt" color="#FFFFFF" height={65} flip />

      <AnimatedSection direction="up" duration={0.5}>
        <VerifiedAuthentic />
      </AnimatedSection>
      <SectionDivider variant="wave" color="#4B5D2A" height={75} />

      <AnimatedSection direction="up" duration={0.5}>
        <CTABanner />
      </AnimatedSection>
      <SectionDivider variant="curve" color="#FFFFFF" height={70} flip />

      <AnimatedSection direction="up" duration={0.5}>
        <WholesaleTeaser />
      </AnimatedSection>
    </>
  );
}
