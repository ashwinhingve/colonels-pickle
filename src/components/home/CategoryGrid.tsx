"use client";

import Link from "next/link";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";
import { HoverLift } from "@/components/shared/HoverLift";

const CATEGORIES = [
  {
    title: "Achaar Collection",
    subtitle: "16 varieties",
    icon: "🫙",
    bg: "#4B5D2A",
    href: "/products?category=achaar",
  },
  {
    title: "Achaar Masale",
    subtitle: "6 spice blends",
    icon: "🌶️",
    bg: "#C05621",
    href: "/products?category=masala",
  },
  {
    title: "Gulkand & More",
    subtitle: "Rose preserve & snacks",
    icon: "🌹",
    bg: "#7C4A1E",
    href: "/products?category=organic",
  },
  {
    title: "Wholesale Orders",
    subtitle: "20% off MRP",
    icon: "📦",
    bg: "#2E3818",
    href: "/wholesale",
  },
];

export function CategoryGrid() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader eyebrow="BROWSE BY CATEGORY" title="Shop Our Range" />

        <StaggerContainer staggerDelay={0.1}>
          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
            {CATEGORIES.map((c) => (
              <StaggerItem key={c.title}>
                <HoverLift lift={5} scale={1.02}>
                  <Link
                    href={c.href}
                    className="group relative flex h-[180px] flex-col items-center justify-center overflow-hidden rounded-2xl text-center shadow-md transition-all duration-[250ms] hover:shadow-xl"
                    style={{ backgroundColor: c.bg }}
                  >
                    <RajasthaniPattern variant="jali" opacity={0.08} color="#ffffff" />
                    <div className="relative z-10 px-4">
                      <span className="text-5xl">{c.icon}</span>
                      <h3 className="mt-3 font-display text-lg font-bold text-white">
                        {c.title}
                      </h3>
                      <p className="mt-1 font-hindi text-sm text-white/70">
                        {c.subtitle}
                      </p>
                    </div>
                  </Link>
                </HoverLift>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}

export default CategoryGrid;
