import type { Metadata } from "next";
import Image from "next/image";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { SectionHeader } from "@/components/common/SectionHeader";
import { BRAND, CONTACT_EMAIL } from "@/lib/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://colonelspickle.in';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#organization`,
  name: "Colonel's Pickle",
  alternateName: "Colonel's Pickle® by Ridhwika Agro Organics",
  description:
    'Authentic homemade pickles, gulkand and cold press oils — no preservatives, 24 whole spices, FSSAI certified, Jaipur.',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Plot A-207, Block A, Vardhman Nagar, Gali No. 24, Ajmer Road',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    postalCode: '302019',
    addressCountry: 'IN',
  },
  email: 'colonelspickle@proton.me',
  telephone: '+91-9717243306',
  priceRange: '₹250-₹1500',
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    name: 'FSSAI License',
    credentialCategory: 'Food Safety License',
    identifier: BRAND.fssai,
  },
  sameAs: [
    'https://instagram.com/colonels.pickle',
    'https://beacons.ai/colonelspickle',
  ],
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export const metadata: Metadata = {
  title: "Our Story — Born from a Mother's Kitchen",
  description:
    "The story behind Colonel's Pickle — a heartfelt initiative by Col Praveen Kumar Sharma's family. FSSAI certified, no preservatives, made in Jaipur.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "Our Story — Born from a Mother's Kitchen",
    description:
      'The story behind Colonel\'s Pickle — authentic homemade pickles made from Urmila Devi\'s time-tested recipes. FSSAI certified, no preservatives.',
    url: `${SITE_URL}/about`,
    type: 'website',
    siteName: "Colonel's Pickle",
    locale: 'en_IN',
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Colonel's Pickle — Our Story",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Our Story — Born from a Mother's Kitchen",
    description:
      "The story behind Colonel's Pickle — authentic homemade pickles from a mother's kitchen.",
    images: [`${SITE_URL}/logo.png`],
  },
};

const PROMISES = [
  { icon: "🌿", title: "No Preservatives", desc: "No artificial preservatives, flavours or colours — ever.", color: "#166534" },
  { icon: "🫙", title: "Kachi Ghani Oil", desc: "Cold-pressed wooden ghani mustard oil only.", color: "#92400E" },
  { icon: "💎", title: "Afghani Hing", desc: "Premium asafoetida sourced from Central Asia at ₹35,000/kg.", color: "#B45309" },
  { icon: "🧂", title: "Rock & Black Salt", desc: "No iodized table salt used in any product.", color: "#1E40AF" },
  { icon: "🌶️", title: "24 Whole Spices", desc: "Sun-dried, roasted and ground fresh at our facility.", color: "#B91C1C" },
  { icon: "⭐", title: "FSSAI Certified", desc: `Certified by Food Safety and Standards Authority of India (${BRAND.fssai}).`, color: "#166534" },
];

const CERTS = [
  { icon: "✅", name: "FSSAI", detail: "Food Safety and Standards Authority of India", sub: `License: ${BRAND.fssai}` },
  { icon: "🏛️", name: "Udhyam", detail: "Udyam Registration", sub: "Registered MSME enterprise" },
  { icon: "🤝", name: "BNI", detail: "BNI Member — Vishwakarma Chapter, Jaipur", sub: "Proud member of Business Network International" },
];

const fullAddress = `${BRAND.address.line1}, ${BRAND.address.line2}, ${BRAND.address.city}, ${BRAND.address.state} - ${BRAND.address.pin}`;

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }}
      />
      {/* 1. Hero */}
      <section
        className="relative flex min-h-[50vh] items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #7F1D1D 0%, #B91C1C 50%, #78350F 100%)",
        }}
      >
        <RajasthaniPattern variant="medallion" opacity={0.06} color="#ffffff" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center">
          <p className="font-hindi text-xs font-bold uppercase tracking-widest text-[#FCD34D]">
            The Story Behind Every Jar
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-white md:text-5xl">
            Born from a Mother&apos;s Kitchen
          </h1>
          <p className="mt-4 font-serif text-lg italic text-white/80">
            A heartfelt initiative by Col Praveen Kumar Sharma&apos;s family
          </p>
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 block h-[60px] w-full"
        >
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#FDF8F0" />
        </svg>
      </section>

      {/* 2. Story narrative */}
      <section className="bg-cp-cream py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <div
            className="relative rounded-2xl p-10"
            style={{ backgroundColor: "#1C1917" }}
          >
            <span
              className="absolute left-0 top-0 h-12 w-12 rounded-tl-2xl border-l-2 border-t-2"
              style={{ borderColor: "#D97706" }}
            />
            <span
              className="absolute bottom-0 right-0 h-12 w-12 rounded-br-2xl border-b-2 border-r-2"
              style={{ borderColor: "#B91C1C" }}
            />
            <div className="text-center">
              <Image
                src="/logo.png"
                width={100}
                height={100}
                className="object-contain mx-auto"
                alt="Colonel's Pickle"
              />
              <div className="w-16 h-[2px] bg-cp-crimson mx-auto my-3" />
              <p className="font-display font-bold text-[18px] text-[#FCD34D]">
                Col Praveen Kumar Sharma
              </p>
              <p className="mt-1 font-hindi text-[12px] text-white/60">
                Col, Indian Army · CPE ITARSI
              </p>
            </div>
            <div className="mt-6 rounded-xl border border-white/15 bg-white/8 p-6">
              <p className="font-serif text-lg italic leading-relaxed text-white/85">
                &ldquo;Quality is non-negotiable when you&apos;re feeding
                families. That&apos;s why we put the same love in every jar that
                Maa puts in every meal.&rdquo;
              </p>
            </div>
          </div>

          <div>
            <p className="font-hindi text-xs font-bold uppercase tracking-widest text-cp-crimson">
              Our Founder&apos;s Vision
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-cp-text md:text-4xl">
              Maa Ka Pyaar, Ghar Ka Achar
            </h2>
            <p className="mt-5 font-serif text-[15px] leading-relaxed text-cp-text-muted">
              Every jar of Colonel&apos;s Pickle carries the love of Urmila Devi
              Roshan Lal — an Army Officer&apos;s mother from Haryana. When Lt
              Col Praveen Kumar Sharma witnessed soldiers and people far from
              home missing the authentic taste of Ghar Ka Achar, he turned to
              his mother&apos;s time-tested recipes.
            </p>
            <p className="mt-4 font-serif text-[15px] leading-relaxed text-cp-text-muted">
              What started as a heartfelt gesture to feed homesick soldiers has
              grown into Ridhwika Agro Organics — a venture that creates
              employment for local women while delivering purity, tradition, and
              the irreplaceable taste of Maa Ka Pyaar in every jar.
            </p>
            <p className="mt-4 font-serif text-[15px] leading-relaxed text-cp-text-muted">
              Today Colonel&apos;s Pickle ships pan-India from Jaipur,
              Rajasthan. Every product is FSSAI certified, prepared without
              artificial preservatives, and made from the same premium
              ingredients used in their home kitchen — Afghani hing at
              ₹35,000/kg, wooden cold-press mustard oil, and 24 whole spices
              dried and ground fresh.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Our Promise */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            eyebrow="WHY CHOOSE COLONEL'S PICKLE"
            title="Our Promise to You"
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROMISES.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-cp-border bg-cp-cream p-6"
                style={{ borderBottom: `3px solid ${p.color}` }}
              >
                <span className="text-4xl">{p.icon}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-cp-text">
                  {p.title}
                </h3>
                <p className="mt-1 font-serif text-sm leading-relaxed text-cp-text-muted">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Certifications */}
      <section className="bg-cp-cream py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader
            eyebrow="CERTIFIED & REGISTERED"
            title="Trusted by Standards"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {CERTS.map((c) => (
              <div
                key={c.name}
                className="rounded-2xl border border-cp-border bg-white p-8 text-center"
              >
                <span className="text-4xl">{c.icon}</span>
                <h3 className="mt-3 font-display text-xl font-extrabold text-cp-crimson">
                  {c.name}
                </h3>
                <p className="mt-2 font-sans text-sm font-semibold text-cp-text">
                  {c.detail}
                </p>
                <p className="mt-1 font-serif text-sm text-cp-text-muted">
                  {c.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact CTA */}
      <section className="bg-cp-crimson py-16">
        <div className="mx-auto max-w-4xl px-4 text-center text-white">
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">
            Get in Touch
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 font-sans text-lg font-bold">
            {BRAND.phones.map((p) => (
              <a key={p} href={`tel:+91${p}`} className="hover:text-[#FCD34D]">
                +91 {p}
              </a>
            ))}
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-4 inline-block font-sans text-sm text-white/90 hover:text-[#FCD34D]"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="mx-auto mt-3 max-w-xl font-serif text-sm text-white/80">
            {fullAddress}
          </p>
          <a
            href="https://wa.me/919350406289"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-lg bg-[#25D366] px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-white transition-transform hover:-translate-y-px"
          >
            WhatsApp Us
          </a>
        </div>
      </section>
    </>
  );
}
