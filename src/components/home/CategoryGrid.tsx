import Link from "next/link";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { SectionHeader } from "@/components/common/SectionHeader";

const CATEGORIES = [
  {
    title: "Achaar Collection",
    subtitle: "16 varieties",
    icon: "🫙",
    bg: "#7C2D12",
    href: "/products?category=achaar",
  },
  {
    title: "Achaar Masale",
    subtitle: "6 spice blends",
    icon: "🌶️",
    bg: "#B91C1C",
    href: "/products?category=masala",
  },
  {
    title: "Gulkand & More",
    subtitle: "Rose preserve & snacks",
    icon: "🌹",
    bg: "#78350F",
    href: "/products?category=organic",
  },
  {
    title: "Wholesale Orders",
    subtitle: "20% off MRP",
    icon: "📦",
    bg: "#1C1917",
    href: "/wholesale",
  },
];

export function CategoryGrid() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader eyebrow="BROWSE BY CATEGORY" title="Shop Our Range" />

        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group relative flex h-[180px] flex-col items-center justify-center overflow-hidden rounded-2xl text-center shadow-md transition-transform duration-[250ms] hover:scale-[1.02] hover:shadow-xl"
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
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;
