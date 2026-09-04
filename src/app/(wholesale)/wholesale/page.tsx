import type { Metadata } from "next";
import { BadgePercent, Wallet, Truck, Boxes, ShieldCheck, Headset } from "lucide-react";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { SectionHeader } from "@/components/common/SectionHeader";
import { WholesaleForm } from "@/components/wholesale/WholesaleForm";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";
import { HoverLift } from "@/components/shared/HoverLift";
import { WebbingStitchAccent } from "@/components/illustrations";
import { OFFERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Wholesale & Retailer Program",
  description:
    "Partner with Colonel's Pickle — 20% wholesale discount, monthly credit, free transportation, and bulk order discounts. Apply now.",
};

const BENEFITS = [
  {
    Icon: BadgePercent,
    title: "20% Discount on MRP",
    desc: "Flat 20% off MRP on every wholesale order — healthy margins from day one.",
  },
  {
    Icon: Wallet,
    title: "Monthly Credit Basis",
    desc: "Stock now, pay later — flexible monthly credit for registered businesses.",
  },
  {
    Icon: Truck,
    title: "Free Transportation",
    desc: "Pan-India delivery cost borne entirely by us — no hidden freight.",
  },
  {
    Icon: Boxes,
    title: "Bulk Order Discounts",
    desc: `${OFFERS.bulk1kg}; ${OFFERS.bulk5kg}.`,
  },
  {
    Icon: ShieldCheck,
    title: "Preservative-Free Stock",
    desc: "FSSAI-licensed pickles featuring our Colonel Special blend of 24 hand-selected whole spices — the authentic quality your customers return for.",
  },
  {
    Icon: Headset,
    title: "Dedicated Support",
    desc: "A wholesale team that reaches out within 2 working days of your enquiry.",
  },
];

export default function WholesalePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden py-20"
        style={{
          background:
            "linear-gradient(135deg, #3A4A1F 0%, #4B5D2A 55%, #2E3818 100%)",
        }}
      >
        <RajasthaniPattern variant="medallion" opacity={0.05} color="#F5EBDA" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <AnimatedSection direction="up" duration={0.65}>
            <p className="font-hindi text-xs font-bold uppercase tracking-widest text-cp-gold-light">
              Retailer Program
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold text-cp-beige md:text-5xl">
              Partner With Colonel&apos;s Pickle
            </h1>
            <p className="mt-4 font-serif text-lg text-cp-beige/80">
              Stock authentic, preservative-free homemade pickles and masalas —
              with margins, credit, and delivery support built for retailers.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-cp-cream py-20">
        <div className="mx-auto max-w-6xl px-4">
          <AnimatedSection direction="up" duration={0.65}>
            <SectionHeader
              eyebrow="WHY PARTNER WITH US"
              title="Wholesale Benefits"
            />
            <div className="mt-3 flex justify-center">
              <WebbingStitchAccent className="h-3 w-48 text-cp-terracotta/35" />
            </div>
          </AnimatedSection>
          <StaggerContainer
            staggerDelay={0.1}
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {BENEFITS.map((b) => (
              <StaggerItem key={b.title}>
                <HoverLift lift={4}>
                  <div className="flex h-full flex-col rounded-2xl border border-cp-border bg-white p-6 transition-shadow duration-300 hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cp-olive-light text-cp-olive">
                      <b.Icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-cp-text">
                      {b.title}
                    </h3>
                    <p className="mt-1 font-serif text-sm leading-relaxed text-cp-text-muted">
                      {b.desc}
                    </p>
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Application form */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4">
          <AnimatedSection direction="up" duration={0.65}>
            <SectionHeader
              eyebrow="BECOME A PARTNER"
              title="Wholesale Application"
              subtitle="Fill in your details and our team will reach out within 2 working days."
            />
          </AnimatedSection>
          <div className="mt-10">
            <WholesaleForm />
          </div>
        </div>
      </section>
    </>
  );
}
