import Link from "next/link";
import { WHATSAPP_URL, OFFERS } from "@/lib/constants";

const BENEFITS = [
  {
    icon: "🎯",
    title: "20% Bulk Discount",
    description: "Competitive wholesale rates on every product",
  },
  {
    icon: "💳",
    title: "Credit Basis Supply",
    description: "Flexible monthly credit terms for registered retailers",
  },
  {
    icon: "🚛",
    title: "Transport Covered",
    description: "We bear transportation costs for your orders",
  },
];

export function WholesaleTeaser() {
  return (
    <section className="bg-white py-20">
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
              For Retailers & Distributors
            </h3>

            <p className="mb-4 font-serif text-[15.5px] leading-relaxed text-cp-text-muted">
              {OFFERS.bulk1kg} on wholesale orders. Supply on monthly credit basis for registered businesses. Transportation costs borne by Colonel&apos;s Pickle.
            </p>
            <p className="mb-8 font-serif text-[15.5px] leading-relaxed text-cp-text-muted">
              {OFFERS.bulk5kg}. Dedicated support, competitive wholesale pricing, and consistent supply to grow your business.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/wholesale"
                className="rounded-lg bg-cp-crimson px-8 py-3.5 text-center font-sans text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-cp-crimson-dark hover:-translate-y-0.5"
              >
                Apply for Wholesale
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#25D366] px-8 py-3.5 text-center font-sans text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-[#20BA5A] hover:-translate-y-0.5"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* RIGHT — Benefit tiles */}
          <div className="grid gap-5">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-cp-border bg-cp-cream-muted p-6 transition-all duration-300 hover:border-cp-crimson hover:shadow-md"
              >
                <div className="mb-3 text-4xl">{benefit.icon}</div>
                <h4 className="mb-2 font-display text-lg font-bold text-cp-text">
                  {benefit.title}
                </h4>
                <p className="font-serif text-[14px] leading-relaxed text-cp-text-muted">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WholesaleTeaser;
