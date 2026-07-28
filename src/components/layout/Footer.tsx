import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";
import { BRAND, CONTACT_EMAIL } from "@/lib/constants";

const PRODUCT_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/products?category=achaar", label: "Achaar Collection" },
  { href: "/products?category=masala", label: "Achaar Masale" },
  { href: "/products?category=organic", label: "Gulkand & Preserves" },
  { href: "/wholesale", label: "Wholesale Orders" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/wholesale", label: "Wholesale Orders" },
];

export function Footer() {
  const { address } = BRAND;

  return (
    <footer className="w-full font-sans text-white/70">
      {/* Crimson accent bar */}
      <div className="bg-cp-crimson h-1 w-full" />
      <div className="bg-cp-text">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo.png"
                alt="Colonel's Pickle by Ridhwika Agro Organics"
                width={90}
                height={90}
                className="object-contain"
              />
            </Link>
            <p className="font-display mt-1 text-xl font-bold" style={{ color: "#FCD34D" }}>
              Colonel&apos;s Pickle&reg;
            </p>
            <p className="font-hindi mt-1 text-sm text-white/60">
              माँ का प्यार, घर का अचार
            </p>
            <p className="mt-3 font-serif text-sm leading-relaxed text-white/60">
              Authentic homemade pickles, cold-press oils &amp; natural products
              with no artificial preservatives.
            </p>
            {/* Social links */}
            <div className="mt-4 flex gap-3">
              <a
                href="https://instagram.com/colonels.pickle"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white transition-colors hover:text-cp-saffron"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://wa.me/919350406289"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-white transition-colors hover:text-cp-saffron"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
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
        <div className="font-hindi mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-white/35 md:flex-row">
          <p>
            &copy; 2025 Colonel&apos;s Pickle&reg; by Ridhwika Agro Organics. All rights reserved.
          </p>
          <p>FSSAI: 12223026002188</p>
          <p>Crafted with a mother&apos;s love &middot; Pan India Delivery</p>
        </div>
      </div>
      </div>
    </footer>
  );
}
