"use client";

import Link from "next/link";
import { BadgePercent, Wallet, Truck } from "lucide-react";
import { WHATSAPP_URL, OFFERS } from "@/lib/constants";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";
import { HoverLift } from "@/components/shared/HoverLift";
import { TapScale } from "@/components/shared/TapScale";

const BENEFITS = [
  {
    Icon: BadgePercent,
    title: "20% Bulk Discount",
    description: "Competitive wholesale rates on every product",
  },
  {
    Icon: Wallet,
    title: "Credit Basis Supply",
    description: "Flexible monthly credit terms for registered retailers",
  },
  {
    Icon: Truck,
    title: "Transport Covered",
    description: "We bear transportation costs for your orders",
  },
];

export function WholesaleTeaser() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* LEFT — Text content */}
          <div>
            <p className="mb-2 font-hindi text-xs font-bold uppercase tracking-widest text-cp-crimson">
              GROW WITH US
            </p>
            <h2 className="mb-4 font-display text-3xl font-extrabold text-cp-text md:text-4xl">
              Partner With Us
            </h2>
            <h3 className="mb-6 font-display text-xl font-bold text-cp-crimson">
              For Retailers &amp; Distributors
            </h3>

            <p className="mb-4 font-serif text-[15.5px] leading-relaxed text-cp-text-muted">
              {OFFERS.bulk1kg} on wholesale orders. Supply on monthly credit basis for registered businesses. Transportation costs borne by Colonel&apos;s Pickle.
            </p>
            <p className="mb-8 font-serif text-[15.5px] leading-relaxed text-cp-text-muted">
              {OFFERS.bulk5kg}. Dedicated support, competitive wholesale pricing, and consistent supply to grow your business.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <TapScale asChild>
                <Link
                  href="/wholesale"
                  className="rounded-lg bg-cp-crimson px-8 py-3.5 text-center font-sans text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-cp-crimson-dark hover:shadow-lg"
                >
                  Apply for Wholesale
                </Link>
              </TapScale>
              <TapScale asChild>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[#25D366] px-8 py-3.5 text-center font-sans text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-[#20BA5A] hover:shadow-lg"
                >
                  Chat on WhatsApp
                </a>
              </TapScale>
            </div>
          </div>

          {/* RIGHT — Benefit tiles */}
          <StaggerContainer staggerDelay={0.1}>
            <div className="grid gap-5">
              {BENEFITS.map((benefit) => (
                <StaggerItem key={benefit.title}>
                  <HoverLift lift={4}>
                    <div className="flex items-start gap-4 rounded-xl border border-cp-border bg-cp-cream p-6 transition-all duration-300 hover:border-cp-crimson hover:shadow-md">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cp-olive-light text-cp-olive">
                        <benefit.Icon className="h-6 w-6" strokeWidth={1.75} />
                      </div>
                      <div>
                        <h4 className="mb-1 font-display text-lg font-bold text-cp-text">
                          {benefit.title}
                        </h4>
                        <p className="font-serif text-[14px] leading-relaxed text-cp-text-muted">
                          {benefit.description}
                        </p>
                      </div>
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

export default WholesaleTeaser;
