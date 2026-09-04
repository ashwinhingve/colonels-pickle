import type { Metadata } from "next";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { GalleryClient } from "@/components/gallery/GalleryClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://colonelspickle.in';

export const metadata: Metadata = {
  title: "Photo & Video Gallery | Colonel's Pickle",
  description:
    "Real photos and videos from the Colonel's Pickle kitchen — hand-sorted chillies, traditional spice blending, and the people behind Maa Ka Pyaar, Ghar Ka Achar.",
  alternates: { canonical: `${SITE_URL}/gallery` },
  openGraph: {
    title: "Photo & Video Gallery | Colonel's Pickle",
    description:
      "Real photos and videos from the Colonel's Pickle kitchen and production process.",
    url: `${SITE_URL}/gallery`,
    type: 'website',
    siteName: "Colonel's Pickle",
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Photo & Video Gallery | Colonel's Pickle",
    description: "Real photos and videos from the Colonel's Pickle kitchen and production process.",
  },
};

export default function GalleryPage() {
  return (
    <div className="bg-cp-cream py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <AnimatedSection direction="up" duration={0.5}>
          <SectionHeader
            eyebrow="Real Photos, Real Process"
            title="Our Gallery"
            subtitle="From hand-sorted chillies to the family behind every jar — a look inside how Colonel's Pickle is really made."
          />
        </AnimatedSection>

        <div className="mt-12">
          <GalleryClient />
        </div>
      </div>
    </div>
  );
}
