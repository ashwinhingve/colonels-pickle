"use client";

import {
  NoPreservativeIcon,
  NoChemicalIcon,
  NoVinegarIcon,
} from "@/components/illustrations";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";

const PURITY_CLAIMS = [
  {
    Icon: NoPreservativeIcon,
    title: "No Artificial Preservatives",
    description: "Pure, natural ingredients only",
  },
  {
    Icon: NoChemicalIcon,
    title: "No Chemicals",
    description: "Not a single synthetic compound",
  },
  {
    Icon: NoVinegarIcon,
    title: "No Vinegar",
    description: "Premium ₹30,000/kg Afghani Hing instead",
  },
];

export function PurityPledge({ className }: { className?: string }) {
  return (
    <section className={`bg-cp-cream py-12 md:py-16 ${className || ""}`}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-10">
          <p className="font-hindi text-xs font-bold uppercase tracking-[0.2em] text-cp-terracotta">
            OUR PURE PROMISE
          </p>
          <h2 className="sec-title-underline mt-2 font-display text-2xl font-extrabold text-cp-text sm:text-3xl">
            Pure Purity, Nothing Else
          </h2>
        </div>

        <StaggerContainer staggerDelay={0.1}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PURITY_CLAIMS.map((claim) => (
              <StaggerItem key={claim.title}>
                <div className="group rounded-2xl border-2 border-cp-crimson/20 bg-white p-8 text-center transition-all duration-300 hover:border-cp-crimson hover:shadow-lg">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cp-crimson/10 transition-transform duration-300 group-hover:scale-110">
                      <claim.Icon
                        className="h-8 w-8 text-cp-crimson transition-colors duration-300 group-hover:text-cp-crimson"
                        aria-hidden
                      />
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-bold text-cp-text">
                    {claim.title}
                  </h3>
                  <p className="mt-2 font-serif text-sm text-cp-text-muted leading-relaxed">
                    {claim.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}

export default PurityPledge;
