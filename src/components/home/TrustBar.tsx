"use client";

import {
  NoPreservativeIcon,
  NoChemicalIcon,
  NoVinegarIcon,
  LeafIcon,
  ShieldCheckIcon,
  InkStampRound,
} from "@/components/illustrations";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";

const TRUST_ITEMS = [
  { Icon: NoPreservativeIcon, title: "Zero Preservatives", sub: "No chemicals, ever" },
  { Icon: NoChemicalIcon, title: "Cold Press Oils", sub: "Kachi ghani wooden press" },
  { Icon: ShieldCheckIcon, title: "FSSAI Certified", sub: "Safe & trusted" },
  { Icon: LeafIcon, title: "Rock & Black Salt", sub: "No table salt used" },
  { Icon: LeafIcon, title: "24 Whole Spices", sub: "Sun-dried & freshly ground" },
  { Icon: NoVinegarIcon, title: "No Vinegar", sub: "Premium ₹30,000/kg" },
];

// Rotates through the warm stamp accent palette (olive / terracotta / gold).
const STAMP_COLORS = ["#4B5D2A", "#C05621", "#D4A017"];

export function TrustBar() {
  return (
    <section className="border-b border-cp-border bg-white py-6">
      <div className="mx-auto max-w-7xl px-4">
        <StaggerContainer staggerDelay={0.08}>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-6">
            {TRUST_ITEMS.map((item, index) => (
              <StaggerItem key={item.title} className="h-full">
                <div className="group flex h-full flex-col items-center gap-2 rounded-xl px-2 py-3 text-center transition-colors duration-300 hover:bg-cp-cream/70">
                  <div className="relative flex h-12 w-12 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <InkStampRound
                      label=""
                      color={STAMP_COLORS[index % STAMP_COLORS.length]}
                      className="pointer-events-none absolute inset-0 opacity-25 transition-opacity duration-300 group-hover:opacity-45"
                      aria-hidden
                    />
                    <item.Icon
                      className="relative h-6 w-6 text-cp-olive transition-colors duration-300 group-hover:text-cp-terracotta"
                      aria-hidden
                    />
                  </div>
                  <span className="font-tactical text-sm text-cp-text">
                    {item.title}
                  </span>
                  <span className="font-sans text-xs text-cp-text-muted">
                    {item.sub}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}

export default TrustBar;
