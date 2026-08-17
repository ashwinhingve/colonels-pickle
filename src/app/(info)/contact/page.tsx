import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/contact/ContactForm";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";
import { HoverLift } from "@/components/shared/HoverLift";
import { ContactIllustration } from "@/components/illustrations";
import { BRAND, CONTACT_EMAIL } from "@/lib/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://colonelspickle.in';

export const metadata: Metadata = {
  title: "Contact Us | Colonel's Pickle",
  description:
    "Get in touch with Colonel's Pickle — phone, email, WhatsApp, or send an order inquiry. Pan India delivery from Jaipur.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact Us | Colonel's Pickle",
    description:
      "Reach out to Colonel's Pickle via phone, email, WhatsApp, or visit us in Jaipur. We'd love to hear from you!",
    url: `${SITE_URL}/contact`,
    type: 'website',
    siteName: "Colonel's Pickle",
    locale: 'en_IN',
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Colonel's Pickle — Contact Us",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Contact Us | Colonel's Pickle",
    description:
      "Get in touch with Colonel's Pickle via phone, email, or WhatsApp. We're here to help!",
    images: [`${SITE_URL}/logo.png`],
  },
};

const fullAddress = `${BRAND.address.line1}, ${BRAND.address.line2}, ${BRAND.address.city}, ${BRAND.address.state} - ${BRAND.address.pin}`;

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cp-olive-dark via-cp-olive to-cp-olive-light py-16 md:py-20 text-white relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4">
          <AnimatedSection direction="up" duration={0.65} className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <p className="font-hindi text-sm font-bold uppercase tracking-widest text-cp-gold-light mb-3">
                Let&apos;s Connect
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
                Get in Touch
              </h1>
              <p className="font-serif text-lg text-white/90 max-w-lg">
                Have questions about our pickles, ingredients, or orders? We&apos;re here to help — reach out anytime.
              </p>
            </div>
            <div className="flex-1 flex justify-center md:justify-end">
              <ContactIllustration className="w-48 h-48 md:w-56 md:h-56 text-white/80" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-cp-cream py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2">
          {/* LEFT — info */}
          <AnimatedSection direction="left" duration={0.65}>
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
          </AnimatedSection>

          {/* RIGHT — form */}
          <AnimatedSection direction="right" duration={0.65}>
            <ContactForm />
          </AnimatedSection>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <AnimatedSection direction="up" duration={0.65}>
            <h2 className="mb-4 text-center font-display text-2xl font-extrabold text-cp-olive md:text-3xl">
              Visit Us
            </h2>
            <div
              className="w-full overflow-hidden rounded-xl border border-cp-border shadow-sm hover:shadow-md transition-shadow duration-300"
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
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
