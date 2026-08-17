import Link from "next/link";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-cp-crimson py-16">
      <RajasthaniPattern variant="jali" opacity={0.06} color="#ffffff" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl">
          Order Authentic Ghar Ka Achar Today
        </h2>
        <p className="mt-4 font-serif text-[15px] text-white/80">
          Free delivery above ₹999 · Pan India shipping · FSSAI licensed
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="rounded-lg bg-white px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-cp-crimson transition-transform hover:-translate-y-px"
          >
            Shop Now →
          </Link>
          <a
            href="https://wa.me/919717243306"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#25D366] px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-white transition-transform hover:-translate-y-px"
          >
            WhatsApp Order
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTABanner;
