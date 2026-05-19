import type { Metadata } from "next";
import Image from "next/image";
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
          <Image
            src="/logo.png"
            alt="Colonel's Pickle by Ridhwika Agro Organics"
            width={100}
            height={100}
            className="object-contain"
          />

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

      <div className="mx-auto mt-12 max-w-6xl px-4">
        <h2 className="mb-4 text-center font-display text-2xl font-extrabold text-cp-crimson md:text-3xl">
          Visit Us
        </h2>
        <div
          className="w-full overflow-hidden rounded-xl border border-cp-border"
          style={{ height: "400px" }}
        >
          <iframe
            title="Colonel's Pickle by Ridhwika Agro Organics location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.2240668159716!2d75.735727!3d26.896383099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5b37d033a3b%3A0x552b635ade1c64ea!2sColonel's%20Pickle%20by%20Ridhwika%20Agro%20Organics!5e0!3m2!1sen!2sin!4v1779167668683!5m2!1sen!2sin"
            className="h-full w-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
