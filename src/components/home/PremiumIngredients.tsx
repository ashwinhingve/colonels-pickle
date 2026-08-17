import type { ComponentType, SVGProps } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import {
  HingIllustration,
  MustardOilIllustration,
  SpiceBowlIllustration,
} from "@/components/illustrations";

const INGREDIENTS: {
  Illustration?: ComponentType<SVGProps<SVGSVGElement>>;
  icon?: string;
  title: string;
  sub: string;
  note: string;
  color: string;
  tint: string;
}[] = [
  {
    Illustration: HingIllustration,
    title: "Afghani Hing",
    sub: "Premium Asafoetida",
    note: "~₹30,000/kg · World's finest",
    color: "#4B5D2A",
    tint: "#E8EBD9",
  },
  {
    Illustration: MustardOilIllustration,
    title: "Kachi Ghani Mustard Oil",
    sub: "Cold Pressed Wooden Press",
    note: "~₹300/litre · Pure & unrefined",
    color: "#7C4A1E",
    tint: "#F3E6CE",
  },
  {
    Illustration: SpiceBowlIllustration,
    title: "24 Exotic Whole Spices",
    sub: "Sun-dried, Roasted & Ground",
    note: "From across India & Central Asia",
    color: "#C05621",
    tint: "#FBE5D6",
  },
  {
    icon: "🧂",
    title: "Rock Salt & Black Salt",
    sub: "Sendha & Kala Namak",
    note: "No iodized table salt, ever",
    color: "#9C4420",
    tint: "#F0C9A8",
  },
];

export function PremiumIngredients() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="WHAT MAKES US DIFFERENT"
          title="Premium Ingredients, No Compromises"
          subtitle="We source the finest — and refuse every cheap substitute the industry quietly relies on."
        />

        <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {INGREDIENTS.map((item) => (
            <div
              key={item.title}
              style={
                {
                  "--ing": item.color,
                  "--ing-soft": `${item.color}33`,
                  background: `linear-gradient(135deg, ${item.color}0D 0%, #FFFFFF 70%)`,
                } as React.CSSProperties
              }
              className="group rounded-2xl border-2 border-[color:var(--ing-soft)] p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[color:var(--ing)]"
            >
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: item.tint }}
              >
                {item.Illustration ? (
                  <item.Illustration className="h-10 w-10" aria-hidden />
                ) : (
                  <span className="text-4xl">{item.icon}</span>
                )}
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
          ))}
        </div>
      </div>
    </section>
  );
}

export default PremiumIngredients;
