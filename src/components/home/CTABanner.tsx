"use client";

import Link from "next/link";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { TapScale } from "@/components/shared/TapScale";
import { SpiceScatter } from "@/components/illustrations";

export function CTABanner() {
  return (
    <section
      className="animate-gradient relative overflow-hidden py-16"
      style={{
        backgroundImage:
          "linear-gradient(120deg, #3A4A1F 0%, #4B5D2A 45%, #2E3818 100%)",
      }}
    >
      <RajasthaniPattern variant="jali" opacity={0.06} color="#ffffff" />
      <SpiceScatter
        aria-hidden
        className="pointer-events-none absolute left-8 top-8 h-12 w-12 opacity-15"
      />
      <SpiceScatter
        aria-hidden
        className="pointer-events-none absolute bottom-8 right-8 h-14 w-14 rotate-45 opacity-10"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-cp-gold/40 bg-white/10 px-4 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-cp-gold-light backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cp-gold-light opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cp-gold-light" />
          </span>
          Free delivery above ₹999
        </span>

        <h2 className="mt-5 font-display text-3xl font-extrabold text-white md:text-4xl">
          Order Authentic Ghar Ka Achaar Today
        </h2>
        <p className="mt-4 font-serif text-[15px] text-white/80">
          Pan India shipping · FSSAI licensed · Made with a mother&apos;s love
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <TapScale asChild>
            <Link
              href="/products"
              className="btn-sheen group inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-cp-crimson shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <span>Shop Now</span>
              <span
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </TapScale>
          <TapScale asChild>
            <a
              href="https://wa.me/919717243306"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sheen inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#20BA5A] hover:shadow-xl"
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
