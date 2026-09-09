"use client";

import Image from "next/image";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";
import { HoverLift } from "@/components/shared/HoverLift";

const INGREDIENTS: {
  image: string;
  title: string;
  sub: string;
  note: string;
  color: string;
  tint: string;
}[] = [
  {
    image: "https://images.pexels.com/photos/20590330/pexels-photo-20590330.jpeg",
    title: "3 Rare Hing Origins",
    sub: "Afghani · Tajiki · Uzbeki",
    note: "The soul of every jar · ~₹30,000/kg",
    color: "#4B5D2A",
    tint: "#E8EBD9",
  },
  {
    image: "https://images.pexels.com/photos/18346906/pexels-photo-18346906.jpeg",
    title: "Kachi Ghani Mustard Oil",
    sub: "Cold Pressed Wooden Press",
    note: "~₹300/litre · Pure & unrefined",
    color: "#7C4A1E",
    tint: "#F3E6CE",
  },
  {
    image: "https://images.pexels.com/photos/672046/pexels-photo-672046.jpeg",
    title: "20–24 Exotic Whole Spices",
    sub: "Sun-dried, Roasted & Ground",
    note: "From across India & Central Asia",
    color: "#C05621",
    tint: "#FBE5D6",
  },
  {
    image: "https://images.pexels.com/photos/6690838/pexels-photo-6690838.jpeg",
    title: "Rock Salt & Black Salt",
    sub: "Sendha & Kala Namak",
    note: "No iodized table salt, ever",
    color: "#9C4420",
    tint: "#F0C9A8",
  },
];

export function PremiumIngredients() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="WHAT MAKES US DIFFERENT"
          title="Premium Ingredients, No Compromises"
          subtitle="We source the finest — and refuse every cheap substitute the industry quietly relies on."
        />

        <StaggerContainer staggerDelay={0.1}>
          <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {INGREDIENTS.map((item) => (
              <StaggerItem key={item.title}>
                <HoverLift lift={4}>
                  <div
                    style={
                      {
                        "--ing": item.color,
                        "--ing-soft": `${item.color}33`,
                        background: `linear-gradient(135deg, ${item.color}0D 0%, #FFFFFF 70%)`,
                      } as React.CSSProperties
                    }
                    className="group rounded-2xl border-2 border-[color:var(--ing-soft)] p-6 transition-[border-color] duration-300 hover:border-[color:var(--ing)]"
                  >
                    <div
                      className="relative mx-auto mb-4 h-16 w-16 overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: item.tint }}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <h3 className="font-display text-base font-bold text-cp-text">
                      {item.title}
                    </h3>
                    <p className="mt-1 font-sans text-sm text-cp-text-muted">
                      {item.sub}
                    </p>
                    <p
                      className="mt-3 font-sans text-xs font-semibold"
                      style={{ color: item.color }}
                    >
                      {item.note}
                    </p>
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}

export default PremiumIngredients;
