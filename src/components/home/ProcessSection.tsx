import { SectionHeader } from "@/components/common/SectionHeader";

const STEPS = [
  {
    number: 1,
    icon: "🌾",
    title: "Premium Sourcing",
    description: "Afghani hing, whole spices, cold-pressed mustard oil sourced directly from trusted farms",
  },
  {
    number: 2,
    icon: "👩‍🍳",
    title: "Traditional Preparation",
    description: "Every batch made using mother's recipes, sun-dried spices, and time-tested methods",
  },
  {
    number: 3,
    icon: "🫙",
    title: "Quality Packaging",
    description: "Glass jars sealed with care, labeled with love, ready to protect the freshness inside",
  },
  {
    number: 4,
    icon: "🚚",
    title: "Pan India Delivery",
    description: "Shipped with care across the country to your doorstep in 3–7 days",
  },
];

export function ProcessSection() {
  return (
    <section className="bg-cp-cream-dark py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="OUR PROCESS"
          title="From Kitchen to Your Doorstep"
          subtitle="Every jar is a labour of love — from sourcing the finest ingredients to delivering it to your home."
        />

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connecting line (desktop only) */}
              {index < STEPS.length - 1 && (
                <div className="absolute top-[60px] left-[calc(100%+0px)] hidden w-[calc(100%-32px)] h-1 bg-gradient-to-r from-cp-crimson to-transparent lg:block" />
              )}

              {/* Step card */}
              <div className="flex flex-col h-full rounded-2xl bg-white p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
                {/* Step circle */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cp-crimson text-white font-display text-2xl font-extrabold">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-4 text-4xl">{step.icon}</div>

                {/* Title */}
                <h3 className="mb-3 font-display text-lg font-bold text-cp-text">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="font-serif text-[14px] leading-relaxed text-cp-text-muted">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
