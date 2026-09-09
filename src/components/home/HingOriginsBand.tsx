"use client";

import Image from "next/image";
import { HingIllustration, CornerFlourish } from "@/components/illustrations";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";
import { HoverLift } from "@/components/shared/HoverLift";

const ORIGINS = [
  {
    name: "Afghani",
    note: "The world's finest — prized for its deep, resinous aroma.",
    image: "https://images.pexels.com/photos/20590330/pexels-photo-20590330.jpeg",
    filter: undefined,
  },
  {
    name: "Tajiki",
    note: "High-altitude harvest — clean, pungent and remarkably pure.",
    image: "https://images.pexels.com/photos/8250269/pexels-photo-8250269.jpeg",
    filter: undefined,
  },
  {
    name: "Uzbeki",
    note: "Rare and aromatic — for that unmistakable ghar-ka-tadka.",
    image: "https://images.pexels.com/photos/20590330/pexels-photo-20590330.jpeg",
    filter: "hue-rotate(15deg) saturate(1.15)",
  },
];

export function HingOriginsBand() {
  return (
    <section className="relative overflow-hidden bg-cp-cream-muted py-14">
      {/* Warm origin-terrain backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <Image
          src="https://images.pexels.com/photos/8250269/pexels-photo-8250269.jpeg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Decorative top flourish */}
      <CornerFlourish
        aria-hidden
        className="pointer-events-none absolute right-8 top-8 h-12 w-12 opacity-15"
      />

      {/* top hairline accent */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-cp-olive via-cp-gold to-cp-terracotta" />

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <HingIllustration aria-hidden className="h-12 w-12 animate-float" />
          <p className="font-hindi text-xs font-bold uppercase tracking-[0.2em] text-cp-terracotta">
            The Soul of Every Jar
          </p>
          <h2 className="sec-title-underline font-display text-2xl font-extrabold text-cp-text sm:text-3xl">
            Our Hing, from the world&apos;s finest origins
          </h2>
          <p className="max-w-2xl font-serif text-[15px] leading-relaxed text-cp-text-muted">
            True asafoetida (<span className="font-hindi">हींग</span>) is what
            separates an authentic achar from an ordinary one. We source ours from
            the world&apos;s most legendary hing-producing regions — never a compromise on aroma.
          </p>
        </div>

        <StaggerContainer staggerDelay={0.1}>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {ORIGINS.map((o) => (
              <StaggerItem key={o.name}>
                <HoverLift lift={4}>
                  <div className="group rounded-2xl border border-cp-border bg-white p-6 text-center shadow-sm transition-all duration-300 hover:border-cp-gold/50 hover:shadow-md">
                    <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-full ring-2 ring-cp-gold/40 transition-transform duration-300 group-hover:scale-105">
                      <Image
                        src={o.image}
                        alt={`${o.name} hing`}
                        fill
                        className="object-cover"
                        style={o.filter ? { filter: o.filter } : undefined}
                        sizes="64px"
                      />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold text-cp-olive">
                      {o.name} Hing
                    </h3>
                    <p className="mt-2 font-serif text-sm leading-relaxed text-cp-text-muted">
                      {o.note}
                    </p>
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>

      {/* Decorative bottom flourish */}
      <CornerFlourish
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-8 h-12 w-12 rotate-180 opacity-15"
      />
    </section>
  );
}

export default HingOriginsBand;
