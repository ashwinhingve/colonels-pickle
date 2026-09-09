"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";
import { TiltCard } from "@/components/shared/TiltCard";

const CATEGORIES = [
  {
    title: "Achaar Collection",
    subtitle: "16 varieties",
    image: "https://images.pexels.com/photos/7812134/pexels-photo-7812134.jpeg",
    bg: "#4B5D2A",
    href: "/products?category=achaar",
  },
  {
    title: "Achaar Masale",
    subtitle: "6 spice blends",
    image: "https://images.pexels.com/photos/672046/pexels-photo-672046.jpeg",
    bg: "#C05621",
    href: "/products?category=masala",
  },
  {
    title: "Gulkand & More",
    subtitle: "Rose preserve & snacks",
    image: "https://images.pexels.com/photos/33016934/pexels-photo-33016934.jpeg",
    bg: "#7C4A1E",
    href: "/products?category=organic",
  },
  {
    title: "Wholesale Orders",
    subtitle: "20% off MRP",
    image: "https://images.pexels.com/photos/10224325/pexels-photo-10224325.jpeg",
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
                  >
                    <Image
                      src={c.image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {/* brand-tinted depth vignette for legibility */}
                    <span
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, ${c.bg}E6 0%, ${c.bg}66 55%, ${c.bg}1A 100%)`,
                      }}
                      aria-hidden="true"
                    />
                    <div className="relative z-10 px-4">
                      <h3 className="font-display text-lg font-bold text-white">
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
