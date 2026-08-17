import type { Metadata } from "next";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { SectionHeader } from "@/components/common/SectionHeader";
import { WholesaleForm } from "@/components/wholesale/WholesaleForm";
import { OFFERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Wholesale & Retailer Program",
  description:
    "Partner with Colonel's Pickle — 20% wholesale discount, monthly credit, free transportation, and bulk order discounts. Apply now.",
};

const BENEFITS = [
  { icon: "💰", title: "20% Discount on MRP", desc: "Flat 20% off MRP on all wholesale orders." },
  { icon: "📅", title: "Monthly Credit Basis", desc: "Stock now, pay later — flexible monthly credit." },
  { icon: "🚚", title: "Free Transportation", desc: "Delivery cost borne entirely by us." },
  { icon: "📦", title: "Bulk Order Discounts", desc: `${OFFERS.bulk1kg}; ${OFFERS.bulk5kg}.` },
  { icon: "🚚", title: "Free Delivery", desc: OFFERS.freeDelivery },
];

export default function WholesalePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden py-20"
        style={{
          background: "linear-gradient(135deg, #1C1917 0%, #292524 100%)",
        }}
      >
        <RajasthaniPattern variant="jali" opacity={0.05} color="#ffffff" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <p className="font-hindi text-xs font-bold uppercase tracking-widest text-cp-saffron">
            Retailer Program
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-white md:text-5xl">
            Partner With Colonel&apos;s Pickle
          </h1>
          <p className="mt-4 font-serif text-lg text-white/75">
            Stock authentic, preservative-free homemade pickles and masalas —
            with margins, credit, and delivery support built for retailers.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-cp-cream py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            eyebrow="WHY PARTNER WITH US"
            title="Wholesale Benefits"
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-cp-border bg-white p-6"
              >
                <span className="text-4xl">{b.icon}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-cp-text">
                  {b.title}
                </h3>
                <p className="mt-1 font-serif text-sm leading-relaxed text-cp-text-muted">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4">
          <SectionHeader
            eyebrow="BECOME A PARTNER"
            title="Wholesale Application"
            subtitle="Fill in your details and our team will reach out within 2 working days."
          />
          <div className="mt-10">
            <WholesaleForm />
          </div>
        </div>
      </section>
    </>
  );
}
