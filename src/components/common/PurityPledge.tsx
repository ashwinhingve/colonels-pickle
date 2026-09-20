"use client";

import Image from "next/image";
import {
  NoPreservativeIcon,
  NoChemicalIcon,
  NoVinegarIcon,
} from "@/components/illustrations";
import { SectionHeader } from "@/components/common/SectionHeader";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";
import { TiltCard } from "@/components/shared/TiltCard";

const PURITY_CLAIMS = [
  {
    Icon: NoPreservativeIcon,
    title: "No Artificial Preservatives",
    description: "Pure, natural ingredients only",
    // jars of naturally preserved homemade food — the pure way we preserve
    image: "/home/purity/no-preservatives.png",
    alt: "Jars of naturally preserved homemade food — Colonel's Pickle uses no artificial preservatives",
    color: "#4B5D2A",
  },
  {
    Icon: NoChemicalIcon,
    title: "No Chemicals",
    description: "Not a single synthetic compound",
    // a spread of processed, packaged foods — the chemical additives we never use
    image: "/home/purity/no-chemicals.webp",
    alt: "A spread of processed, packaged foods laden with additives — the synthetic chemicals Colonel's Pickle never uses",
    color: "#C05621",
  },
  {
    Icon: NoVinegarIcon,
    title: "No Vinegar",
    description: "Premium ₹30,000/kg Afghani Hing instead",
    // bottles of vinegar — the shortcut we never use
    image: "/home/purity/no-vinegar.jpg",
    alt: "Bottles of vinegar on a rustic shelf — the industry shortcut Colonel's Pickle never uses; premium Afghani hing is used instead",
    color: "#7C4A1E",
  },
];

export function PurityPledge({ className }: { className?: string }) {
  return (
    <section
      className={`relative overflow-hidden bg-cp-cream py-12 md:py-16 ${className || ""}`}
    >
      {/* Ambient texture so the band never reads as bare against its neighbours */}
      <RajasthaniPattern variant="trellis" opacity={0.05} color="#4B5D2A" />

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="OUR PURE PROMISE"
          title="Pure Purity, Nothing Else"
          subtitle="Every jar is a promise — only what nature intended, and never a single shortcut the industry quietly relies on."
        />

        <StaggerContainer staggerDelay={0.12}>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PURITY_CLAIMS.map((claim) => (
              <StaggerItem key={claim.title} className="h-full">
                <TiltCard max={6} scale={1.02} className="h-full">
                  <div
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-cp-border bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
                    style={{ borderBottom: `3px solid ${claim.color}` }}
                  >
                    {/* Image banner + scrim (own overflow clip for the hover zoom) */}
                    <div className="relative h-32 w-full overflow-hidden sm:h-40">
                      <Image
                        src={claim.image}
                        alt={claim.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                      <span
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background: `linear-gradient(to top, ${claim.color}CC 0%, ${claim.color}33 45%, transparent 100%)`,
                        }}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Icon badge overlapping the image/body seam — sibling of the
                        banner so its lower half isn't clipped by the zoom container */}
                    <span
                      className="absolute left-6 top-[104px] flex h-14 w-14 items-center justify-center rounded-2xl border border-cp-border bg-white shadow-md transition-transform duration-300 group-hover:scale-110 sm:top-[136px]"
                      aria-hidden="true"
                    >
                      <claim.Icon
                        className="h-7 w-7"
                        style={{ color: claim.color }}
                      />
                    </span>

                    <div className="flex flex-1 flex-col px-6 pb-6 pt-9">
                      <h3 className="font-display text-lg font-bold text-cp-text">
                        {claim.title}
                      </h3>
                      <p className="mt-2 font-serif text-sm leading-relaxed text-cp-text-muted">
                        {claim.description}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}

export default PurityPledge;
