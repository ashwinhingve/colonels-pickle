"use client";

import {
  NoPreservativeIcon,
  NoChemicalIcon,
  NoVinegarIcon,
  LeafIcon,
  ShieldCheckIcon,
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

export function TrustBar() {
  return (
    <section className="border-b border-cp-border bg-white py-5">
      <div className="mx-auto max-w-7xl px-4">
        <StaggerContainer staggerDelay={0.08}>
          <div className="grid grid-cols-3 gap-6 md:grid-cols-6">
            {TRUST_ITEMS.map((item) => (
              <StaggerItem key={item.title}>
                <div className="flex flex-col items-center gap-2 text-center">
                  <item.Icon className="h-6 w-6 text-cp-olive" aria-hidden />
                  <span className="font-sans text-sm font-bold text-cp-text">
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
