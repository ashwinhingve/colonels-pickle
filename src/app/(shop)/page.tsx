// Force SSR so MongoDB is queried on every request — featured products stay fresh
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { PurityPledge } from "@/components/common/PurityPledge";
import { HingOriginsBand } from "@/components/home/HingOriginsBand";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { OurStory } from "@/components/home/OurStory";
import { PremiumIngredients } from "@/components/home/PremiumIngredients";
import { SignatureMasala } from "@/components/home/SignatureMasala";
import { ProcessSection } from "@/components/home/ProcessSection";
import { VerifiedAuthentic } from "@/components/home/VerifiedAuthentic";
import { CTABanner } from "@/components/home/CTABanner";
import { WholesaleTeaser } from "@/components/home/WholesaleTeaser";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { WebbingStitchAccent } from "@/components/illustrations";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.colonelspicklebyridhwika.com';

export const metadata: Metadata = {
  title: {
    absolute:
      "Colonel's Pickle® — Buy Homemade Indian Pickles Online",
  },
  description:
    "Colonel's Pickle — authentic homemade Indian pickles (achaar), gulkand & cold-press mustard oil, made by the mother of an Indian Army Colonel. No preservatives, no vinegar, 20–24 whole spices. FSSAI licensed. Order online with pan-India delivery from Jaipur.",
  keywords: [
    "colonels pickle",
    "kernel pickle",
    "indian pickles online",
    "buy pickle online india",
    "homemade achaar",
    "mango pickle",
    "green chilli pickle",
    "garlic pickle",
    "cold press mustard oil",
    "gulkand",
    "no preservatives pickle",
    "Jaipur pickle",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "Colonel's Pickle® — Buy Homemade Indian Pickles Online",
    description:
      "Authentic homemade Indian pickles, gulkand & cold-press oils. No preservatives, no vinegar, 20–24 whole spices, a mother's recipe. FSSAI certified. Pan-India delivery from Jaipur.",
    url: SITE_URL,
    type: 'website',
    siteName: "Colonel's Pickle",
    locale: 'en_IN',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Colonel's Pickle® — homemade Indian pickles · Maa Ka Pyaar, Ghar Ka Achaar",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      "Colonel's Pickle® — Buy Homemade Indian Pickles Online",
    description:
      "Authentic homemade Indian pickles & cold-press oils. No preservatives, no vinegar. FSSAI certified. Pan-India delivery from Jaipur.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <AnimatedSection direction="up" duration={0.5}>
        <PurityPledge />
      </AnimatedSection>

      <div className="relative">
        <SectionDivider variant="curve" color="#FDF8F0" height={80} />
        {/* One signature moment: the heavier rope motif, reserved for this seam only. */}
        <WebbingStitchAccent
          variant="rope"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-3 mx-auto h-2 w-40 text-cp-gold-light/50 sm:w-56"
        />
      </div>

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
      <SectionDivider variant="wave" color="#FBF4E7" height={70} flip />

      <AnimatedSection direction="up" duration={0.5}>
        <SignatureMasala />
      </AnimatedSection>
      <SectionDivider variant="scallop" color="#EADFC8" height={64} />

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
