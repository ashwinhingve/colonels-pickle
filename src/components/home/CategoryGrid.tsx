"use client";

import Link from "next/link";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";
import { TiltCard } from "@/components/shared/TiltCard";
import {
  PickleJarIllustration,
  SpiceBowlIllustration,
  GulkandRoseIllustration,
  WholesaleCrateIllustration,
} from "@/components/illustrations";

const CATEGORIES = [
  {
    title: "Achaar Collection",
    subtitle: "16 varieties",
    Icon: PickleJarIllustration,
    bg: "#4B5D2A",
    href: "/products?category=achaar",
  },
  {
    title: "Achaar Masale",
    subtitle: "6 spice blends",
    Icon: SpiceBowlIllustration,
    bg: "#C05621",
    href: "/products?category=masala",
  },
  {
    title: "Gulkand & More",
    subtitle: "Rose preserve & snacks",
    Icon: GulkandRoseIllustration,
    bg: "#7C4A1E",
    href: "/products?category=organic",
  },
  {
    title: "Wholesale Orders",
    subtitle: "20% off MRP",
    Icon: WholesaleCrateIllustration,
    bg: "#2E3818",
    href: "/wholesale",
  },
];

export function CategoryGrid() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader eyebrow="BROWSE BY CATEGORY" title="Shop Our Range" />

        <StaggerContainer staggerDelay={0.1}>
          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
            {CATEGORIES.map((c) => (
              <StaggerItem key={c.title} className="h-full">
                <TiltCard max={7} scale={1.03} className="h-full">
                  <Link
                    href={c.href}
                    className="group relative flex h-[200px] flex-col items-center justify-center overflow-hidden rounded-2xl text-center shadow-md ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-2xl"
                    style={{ backgroundColor: c.bg }}
                  >
                    <RajasthaniPattern variant="jali" opacity={0.08} color="#ffffff" />
                    {/* depth vignette */}
                    <span
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10"
                      aria-hidden="true"
                    />
                    <div className="relative z-10 px-4">
                      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/12 ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <c.Icon className="h-10 w-10 drop-shadow" aria-hidden />
                      </span>
                      <h3 className="mt-3 font-display text-lg font-bold text-white">
                        {c.title}
                      </h3>
                      <p className="mt-1 font-hindi text-sm text-white/70">
                        {c.subtitle}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 font-sans text-xs font-semibold uppercase tracking-wide text-cp-gold-light opacity-0 transition-all duration-300 group-hover:opacity-100">
                        Explore
                        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                          →
                        </span>
                      </span>
                    </div>
                  </Link>
                </TiltCard>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}

export default CategoryGrid;
