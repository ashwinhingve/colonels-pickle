import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import { BRAND, CONTACT_EMAIL, PUBLIC_REGISTRATIONS } from "@/lib/constants";
import {
  SpiceScatter,
  ChilliIllustration,
  CertSeal,
  DeliveryTruckIllustration,
} from "@/components/illustrations";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { HoverLift } from "@/components/shared/HoverLift";
import { TapScale } from "@/components/shared/TapScale";

const PRODUCT_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/products?category=achaar", label: "Achaar Collection" },
  { href: "/products?category=masala", label: "Achaar Masale" },
  { href: "/products?category=oils", label: "Cold Press Oils" },
  { href: "/products?category=organic", label: "Organic & More" },
  { href: "/wholesale", label: "Wholesale Orders" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/wholesale", label: "Wholesale Orders" },
];

const CERT_SEAL_LABEL: Record<string, string> = {
  fssai: "FSSAI",
  trademark: "TM ®",
};

export function Footer() {
  const { address } = BRAND;

  return (
    <footer className="relative w-full font-sans text-white/70">
      {/* Decorative accents */}
      <SpiceScatter
        aria-hidden
        className="pointer-events-none absolute right-8 top-12 h-12 w-12 opacity-10"
      />
      <ChilliIllustration
        aria-hidden
        className="pointer-events-none absolute bottom-16 left-6 hidden h-16 w-16 -rotate-12 opacity-[0.08] md:block"
      />

      {/* Crimson accent bar */}
      <div className="bg-cp-crimson h-1 w-full" />
      <div className="bg-cp-charcoal relative overflow-hidden">
        <RajasthaniPattern variant="blueprint" opacity={0.05} color="#D4A017" />

        <div className="container relative mx-auto px-4 py-16">
          <StaggerContainer
            staggerDelay={0.12}
            className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]"
          >
            {/* Brand */}
            <StaggerItem className="lg:border-r lg:border-white/10 lg:pr-8">
              <Link
                href="/"
                className="inline-flex h-[90px] w-[90px] items-center justify-center overflow-hidden rounded-full border border-cp-gold/40 bg-white shadow-sm transition-transform duration-300 hover:scale-105"
              >
                <Image
                  src="/images/brand/ridhwika-crest.png"
                  alt="Colonel's Pickle crest — Ridhwika Agro Organics"
                  width={90}
                  height={90}
                  className="h-[92%] w-[92%] object-contain"
                />
              </Link>
              {/* Registered trademark wordmark (image), separate from the crest logo */}
              <Image
                src="/images/brand/colonels-pickle-wordmark.png"
                alt="Colonel's Pickle® — homemade Indian pickles"
                width={691}
                height={382}
                className="mt-4 h-auto w-[188px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
              />
              <p className="font-hindi mt-1 text-sm text-white/60">
                माँ का प्यार, घर का अचार
              </p>
              <p className="mt-3 max-w-xs font-serif text-sm leading-relaxed text-white/60">
                Authentic homemade pickles, cold-press oils &amp; natural
                products with no artificial preservatives — crafted the way
                Maa always made them.
              </p>

              {/* WhatsApp CTA */}
              <TapScale asChild className="mt-5 block w-fit">
                <a
                  href="https://wa.me/919350406289"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cp-terracotta to-cp-gold px-5 py-2.5 font-sans text-sm font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </TapScale>

              {/* Social links */}
              <div className="mt-5 flex gap-3">
                <TapScale asChild>
                  <a
                    href="https://instagram.com/colonels.pickle"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-colors duration-200 hover:border-cp-saffron/50 hover:text-cp-saffron"
                  >
                    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </TapScale>
                <TapScale asChild>
                  <a
                    href="https://wa.me/919350406289"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-colors duration-200 hover:border-cp-saffron/50 hover:text-cp-saffron"
                  >
                    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                </TapScale>
              </div>
            </StaggerItem>

            {/* Products */}
            <StaggerItem>
              <h3 className="font-display relative mb-4 inline-block text-base font-bold text-white">
                Our Products
                <span className="absolute -bottom-1.5 left-0 h-[2px] w-8 bg-gradient-to-r from-cp-gold to-transparent" />
              </h3>
              <ul className="space-y-2.5 text-sm">
                {PRODUCT_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1 hover:text-cp-saffron-muted"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </StaggerItem>

            {/* Company */}
            <StaggerItem>
              <h3 className="font-display relative mb-4 inline-block text-base font-bold text-white">
                Company
                <span className="absolute -bottom-1.5 left-0 h-[2px] w-8 bg-gradient-to-r from-cp-gold to-transparent" />
              </h3>
              <ul className="space-y-2.5 text-sm">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1 hover:text-cp-saffron-muted"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </StaggerItem>

            {/* Contact */}
            <StaggerItem>
              <h3 className="font-display relative mb-4 inline-block text-base font-bold text-white">
                Get in Touch
                <span className="absolute -bottom-1.5 left-0 h-[2px] w-8 bg-gradient-to-r from-cp-gold to-transparent" />
              </h3>
              <ul className="space-y-3.5 text-sm">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                    <MapPin className="h-3.5 w-3.5 text-cp-saffron-muted" />
                  </span>
                  <span className="pt-1">
                    {[address.line1, address.line2, address.city]
                      .filter(Boolean)
                      .join(", ")}
                    , {address.state} {address.pin}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                    <Phone className="h-3.5 w-3.5 text-cp-saffron-muted" />
                  </span>
                  <span>
                    {BRAND.phones.map((p, i) => (
                      <a
                        key={p}
                        href={`tel:+91${p}`}
                        className="transition-all duration-200 hover:text-cp-saffron-muted hover:underline"
                      >
                        +91 {p}
                        {i < BRAND.phones.length - 1 ? ", " : ""}
                      </a>
                    ))}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                    <Mail className="h-3.5 w-3.5 text-cp-saffron-muted" />
                  </span>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="transition-all duration-200 hover:text-cp-saffron-muted hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
              </ul>
            </StaggerItem>
          </StaggerContainer>

          {/* Verified & Registered */}
          <AnimatedSection direction="up" duration={0.55}>
            <div className="mt-12 border-t border-white/10 pt-8">
              <p className="mb-4 font-sans text-xs font-bold uppercase tracking-widest text-cp-saffron-muted">
                Verified &amp; Registered · Govt. of India
              </p>
              <div className="grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
                {PUBLIC_REGISTRATIONS.map((r) => (
                  <HoverLift key={r.key} lift={3}>
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 transition-colors duration-200 hover:border-cp-gold/30 hover:bg-white/[0.06]">
                      <CertSeal
                        label={CERT_SEAL_LABEL[r.key] ?? r.label}
                        className="h-11 w-11 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white/85">
                          {r.label}
                        </div>
                        <p className="mt-0.5 break-all font-mono text-[11px] text-white/55">
                          {r.number}
                        </p>
                      </div>
                    </div>
                  </HoverLift>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Bottom bar */}
          <div className="font-hindi mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/35 md:flex-row">
            <p>
              &copy; 2026 Colonel&apos;s Pickle&reg; by Ridhwika Agro
              Organics. All rights reserved.
            </p>
            <p>FSSAI: {BRAND.fssai}</p>
            <p className="flex items-center gap-1.5">
              <DeliveryTruckIllustration className="h-4 w-4 text-white/35" aria-hidden />
              Crafted with a mother&apos;s love &middot; Pan India Delivery
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
