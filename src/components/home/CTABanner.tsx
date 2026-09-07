"use client";

import Link from "next/link";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { TapScale } from "@/components/shared/TapScale";
import { SpiceScatter } from "@/components/illustrations";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-cp-olive py-16">
      <RajasthaniPattern variant="camo" opacity={0.08} color="#F5EBDA" />
      <SpiceScatter
        aria-hidden
        className="pointer-events-none absolute left-8 top-8 h-12 w-12 opacity-15"
      />

      {/* ── Floating insignia ── */}
      <span aria-hidden className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 text-cp-gold-light text-6xl opacity-10">⚔️</span>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl uppercase tracking-wide">
          ⚔️ Cantonment Kitchen Call to Arms
        </h2>
        <p className="mt-4 font-serif text-[15px] text-white/80">
          Order Authentic Ghar Ka Achar Today · Free delivery above ₹999 · Pan India shipping · FSSAI licensed
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <TapScale asChild>
            <Link
              href="/products"
              className="rounded-lg bg-white px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-[0.08em] text-cp-olive transition-all hover:shadow-lg hover:-translate-y-px"
            >
              PLACE ORDER
            </Link>
          </TapScale>
          <TapScale asChild>
            <a
              href="https://wa.me/919717243306"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#25D366] px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-[0.08em] text-white transition-all hover:shadow-lg hover:bg-[#20BA5A] hover:-translate-y-px"
            >
              WhatsApp Order
            </a>
          </TapScale>
        </div>
      </div>
    </section>
  );
}

export default CTABanner;
