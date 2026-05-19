import Link from "next/link";
import Image from "next/image";
import { Instagram, MessageCircle, MapPin, Mail, Phone } from "lucide-react";
import { BRAND, CONTACT_EMAIL } from "@/lib/constants";

const PRODUCT_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/products?category=achaar", label: "Achaar Collection" },
  { href: "/products?category=cold-press-oils", label: "Cold Press Oils" },
  { href: "/products?category=gulkand", label: "Gulkand & Preserves" },
  { href: "/wholesale", label: "Wholesale Orders" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/shipping-policy", label: "Shipping Policy" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { address } = BRAND;

  return (
    <footer className="w-full bg-cp-text font-sans text-white/70">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo.png"
                alt="Colonel's Pickle by Ridhwika Agro Organics"
                width={80}
                height={80}
                className="object-contain"
              />
            </Link>
            <p className="mt-3 font-serif text-sm leading-relaxed text-white/60">
              {BRAND.taglineHindi} — {BRAND.tagline}. Authentic homemade pickles,
              cold-press oils & natural products with no artificial
              preservatives.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href={BRAND.social.beacons}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us online"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-cp-crimson"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/91${BRAND.phones[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-cp-crimson"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-4 font-display text-base font-bold text-white">
              Our Products
            </h3>
            <ul className="space-y-2 text-sm">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-cp-saffron-muted"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-display text-base font-bold text-white">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-cp-saffron-muted"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-display text-base font-bold text-white">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cp-saffron-muted" />
                <span>
                  {address.line1}, {address.line2}, {address.city},{" "}
                  {address.state} {address.pin}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-cp-saffron-muted" />
                <span>
                  {BRAND.phones.map((p, i) => (
                    <a
                      key={p}
                      href={`tel:+91${p}`}
                      className="transition-colors hover:text-cp-saffron-muted"
                    >
                      +91 {p}
                      {i < BRAND.phones.length - 1 ? ", " : ""}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-cp-saffron-muted" />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition-colors hover:text-cp-saffron-muted"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-8">
          {BRAND.certifications.map((cert) => (
            <span
              key={cert}
              className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/70"
            >
              {cert} Certified
            </span>
          ))}
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/70">
            FSSAI No: {BRAND.fssai}
          </span>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row">
          <p>
            © {currentYear} {BRAND.nameFull}. All rights reserved.
          </p>
          <p>Crafted with a mother&apos;s love · Pan India Delivery</p>
        </div>
      </div>
    </footer>
  );
}
