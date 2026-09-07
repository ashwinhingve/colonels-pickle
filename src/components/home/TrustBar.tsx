"use client";

import {
  NoPreservativeIcon,
  NoChemicalIcon,
  ShieldCheckIcon,
  LeafIcon,
  NoVinegarIcon,
} from "@/components/illustrations";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";

const TRUST_ITEMS = [
  { Icon: NoPreservativeIcon, title: "Zero Preservatives", sub: "No chemicals, ever", insignia: "★" },
  { Icon: NoChemicalIcon, title: "Cold Press Oils", sub: "Kachi ghani wooden press", insignia: "⚔️" },
  { Icon: ShieldCheckIcon, title: "FSSAI Certified", sub: "Safe & trusted", insignia: "🛡️" },
  { Icon: LeafIcon, title: "Rock & Black Salt", sub: "No table salt used", insignia: "★" },
  { Icon: LeafIcon, title: "24 Whole Spices", sub: "Sun-dried & freshly ground", insignia: "⚔️" },
  { Icon: NoVinegarIcon, title: "No Vinegar", sub: "Premium ₹30,000/kg", insignia: "🛡️" },
];

export function TrustBar() {
  return (
    <section className="border-b border-cp-gold bg-gradient-to-r from-white via-cp-cream-muted to-white py-5">
      <div className="mx-auto max-w-7xl px-4">
        <StaggerContainer staggerDelay={0.08}>
          <div className="grid grid-cols-3 gap-6 md:grid-cols-6">
            {TRUST_ITEMS.map((item, index) => (
              <StaggerItem key={item.title}>
                <div className="flex flex-col items-center gap-2 text-center relative">
                  {/* ── Rank badge ── */}
                  {index % 2 === 0 && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-cp-gold text-lg">
                      {index < 3 ? "★" : "★★"}
                    </span>
                  )}
                  
                  <div className="h-12 w-12 rounded-full bg-cp-gold/15 flex items-center justify-center">
                    <item.Icon className="h-6 w-6 text-cp-olive" aria-hidden />
                  </div>
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
