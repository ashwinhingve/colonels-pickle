import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { BRAND, CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Colonel's Pickle — phone, email, WhatsApp, or send an order inquiry. Pan India delivery from Jaipur.",
};

const fullAddress = `${BRAND.address.line1}, ${BRAND.address.line2}, ${BRAND.address.city}, ${BRAND.address.state} - ${BRAND.address.pin}`;

export default function ContactPage() {
  return (
    <section className="bg-cp-cream py-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2">
        {/* LEFT — info */}
        <div className="rounded-2xl border border-cp-border bg-white p-8">
          <p className="font-display text-2xl font-extrabold text-cp-crimson">
            {BRAND.name}
          </p>
          <p className="mt-1 font-sans text-xs font-bold uppercase tracking-widest text-cp-brown">
            By Ridhwika Agro Organics
          </p>

          <hr className="my-6 border-cp-border" />

          <div className="space-y-5 font-sans text-sm text-cp-text">
            <div className="flex gap-3">
              <span className="text-lg">📍</span>
              <p className="text-cp-text-muted">{fullAddress}</p>
            </div>

            <div className="flex gap-3">
              <span className="text-lg">📞</span>
              <div className="flex flex-col gap-1">
                {BRAND.phones.map((p) => (
                  <a
                    key={p}
                    href={`tel:+91${p}`}
                    className="text-base font-bold text-cp-text hover:text-cp-crimson"
                  >
                    +91 {p}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-lg">📧</span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-cp-text-muted hover:text-cp-crimson"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="flex gap-3">
              <span className="text-lg">📱</span>
              <a
                href={BRAND.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cp-text-muted hover:text-cp-crimson"
              >
                {BRAND.instagram.handle}
              </a>
            </div>

            <div className="flex gap-3">
              <span className="text-lg">🕐</span>
              <div className="text-cp-text-muted">
                <p>Mon–Sat: 9:00 AM – 7:00 PM</p>
                <p>Sunday: 10:00 AM – 5:00 PM</p>
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/919350406289"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 block rounded-lg bg-[#25D366] px-6 py-3.5 text-center font-sans text-sm font-bold uppercase tracking-wide text-white transition-transform hover:-translate-y-px"
          >
            Chat on WhatsApp →
          </a>

          <p className="mt-5 font-sans text-xs text-cp-text-light">
            FSSAI: {BRAND.fssai}
          </p>
        </div>

        {/* RIGHT — form */}
        <ContactForm />
      </div>
    </section>
  );
}
