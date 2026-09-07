"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";
import { HoverLift } from "@/components/shared/HoverLift";
import { EASE } from "@/components/shared/variants";
import {
  MountainOriginIllustration,
  SpiceBowlIllustration,
  PickleJarIllustration,
  DeliveryTruckIllustration,
} from "@/components/illustrations";

const STEPS = [
  {
    number: 1,
    Icon: MountainOriginIllustration,
    title: "Premium Sourcing",
    description:
      "Afghani hing, whole spices, cold-pressed mustard oil sourced directly from trusted farms",
  },
  {
    number: 2,
    Icon: SpiceBowlIllustration,
    title: "Traditional Preparation",
    description:
      "Every batch made using mother's recipes, sun-dried spices, and time-tested methods",
  },
  {
    number: 3,
    Icon: PickleJarIllustration,
    title: "Quality Packaging",
    description:
      "Glass jars sealed with care, labeled with love, ready to protect the freshness inside",
  },
  {
    number: 4,
    Icon: DeliveryTruckIllustration,
    title: "Pan India Delivery",
    description: "Shipped with care across the country to your doorstep in 3–7 days",
  },
];

export function ProcessSection() {
  return (
    <section className="bg-cp-cream-dark py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="OUR PROCESS"
          title="From Kitchen to Your Doorstep"
          subtitle="Every jar is a labour of love — from sourcing the finest ingredients to delivering it to your home."
        />

        <div className="relative mt-16">
          {/* Scroll-drawn connecting track (desktop) behind the step icons */}
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[68px] hidden h-[3px] lg:block">
            <div className="absolute inset-0 rounded-full bg-cp-border" />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.3, ease: EASE }}
              className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-cp-olive via-cp-terracotta to-cp-gold"
            />
          </div>

          <StaggerContainer staggerDelay={0.14}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <StaggerItem key={step.number} className="h-full">
                  <HoverLift lift={5} className="h-full">
                    <div className="relative flex h-full flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-xl">
                      {/* Illustration medallion + step badge */}
                      <div className="relative mb-5">
                        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-cp-cream ring-1 ring-cp-border">
                          <step.Icon className="h-11 w-11" aria-hidden />
                        </div>
                        <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-cp-crimson font-display text-sm font-extrabold text-white shadow ring-2 ring-white">
                          {step.number}
                        </span>
                      </div>

                      <h3 className="mb-3 font-display text-lg font-bold text-cp-text">
                        {step.title}
                      </h3>
                      <p className="font-serif text-[14px] leading-relaxed text-cp-text-muted">
                        {step.description}
                      </p>
                    </div>
                  </HoverLift>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
