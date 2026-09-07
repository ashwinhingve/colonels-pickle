import type { Metadata } from "next";
import Image from "next/image";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";
import { Parallax } from "@/components/shared/Parallax";
import { CertificationBadge } from "@/components/shared/CertificationBadge";
import { HoverLift } from "@/components/shared/HoverLift";
import {
  HearthIllustration,
  HingIllustration,
  WebbingStitchAccent,
  TacticalCrosshair,
} from "@/components/illustrations";
import { BRAND, CONTACT_EMAIL, PUBLIC_REGISTRATIONS } from "@/lib/constants";
import { Highlight } from "@/components/common/Highlight";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://colonelspickle.in';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#organization`,
  name: "Colonel's Pickle",
  alternateName: "Colonel's Pickle® by Ridhwika Agro Organics",
  description:
    'Authentic homemade pickles, gulkand and cold press oils — no preservatives, 22 to 24 whole spices, FSSAI certified, Jaipur.',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'B-6/374, Vaishali Nagar',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    postalCode: '302020',
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
    "The story behind Colonel's Pickle — a heartfelt initiative by the family of an Indian Army Colonel. FSSAI licensed, no preservatives, no vinegar, made in Jaipur.",
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
  { icon: "🌿", title: "No Preservatives", desc: "No vinegar. No artificial preservatives. No artificial colours, flavours or other artificial ingredients — ever.", color: "#166534" },
  { icon: "🫙", title: "Kachi Ghani Oil", desc: "Cold-pressed wooden ghani mustard oil only.", color: "#7C4A1E" },
  { icon: "💎", title: "Afghani Hing", desc: "Premium asafoetida sourced from Central Asia at ₹30,000/kg.", color: "#9C4420" },
  { icon: "🧂", title: "Rock & Black Salt", desc: "No iodized table salt used in any product.", color: "#6B7F3A" },
  { icon: "🌶️", title: "22–24 Whole Spices", desc: "Sun-dried, roasted and ground fresh at our facility.", color: "#C05621" },
  { icon: "🛡️", title: "FSSAI Licensed", desc: `Licensed by the Food Safety and Standards Authority of India (${BRAND.fssai}).`, color: "#4B5D2A" },
  { icon: "🍃", title: "100% Natural", desc: "Every ingredient hand-selected — no synthetic additives, no shortcuts.", color: "#8FA87E" },
];

const fullAddress = `${BRAND.address.line1}, ${BRAND.address.line2}, ${BRAND.address.city}, ${BRAND.address.state} - ${BRAND.address.pin}`;
const [taglineHindiLine1, taglineHindiLine2] = BRAND.taglineHindi.split(', ');

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }}
      />

      {/* ════════════════════════════════════════════════════════════════
          1. REGIMENTAL CHRONICLE HERO
          ════════════════════════════════════════════════════════════════ */}
      <Parallax>
        <section
          className="relative flex min-h-[50vh] items-center justify-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #2E3818 0%, #4B5D2A 55%, #2E3818 100%)",
          }}
        >
          <RajasthaniPattern variant="camo" opacity={0.12} color="#F5EBDA" />
          <RajasthaniPattern variant="blueprint" opacity={0.10} color="#E4B94B" />

          {/* ── Tactical crosshair ── */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <TacticalCrosshair
              className="absolute"
              size={300}
              opacity={0.06}
              color="#E4B94B"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center">
            <AnimatedSection direction="up" duration={0.65}>
              <p className="font-hindi text-xs font-bold uppercase tracking-widest text-cp-gold-light">
                ⚔️ Regimental Chronicle
              </p>
              <h1 className="mt-6 font-hindi text-[2rem] font-bold leading-tight text-cp-beige drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-3xl border-b-4 border-cp-gold-light pb-4 inline-block">
                {taglineHindiLine1},
                <br />
                <span className="text-cp-gold-light">{taglineHindiLine2}</span>
              </h1>
              <p className="mt-3 font-display text-lg italic text-cp-beige/80">
                Born from the Cantonment · Forged in Service
              </p>
              <p className="mt-1 font-serif text-base text-cp-beige/75">
                A Decorated Family's Military Legacy — An <Highlight tone="dark">Indian Army Colonel</Highlight>, his Battle Casualty Recovery, and a Mother's Healing Recipe
              </p>
            </AnimatedSection>
          </div>
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 block h-[60px] w-full"
          >
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F5EBDA" />
          </svg>
        </section>
      </Parallax>

      {/* ════════════════════════════════════════════════════════════════
          2. STORY NARRATIVE
          ════════════════════════════════════════════════════════════════ */}
      <section className="bg-cp-cream py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <AnimatedSection direction="left" duration={0.65}>
            <div
              className="relative rounded-2xl p-10 border-4 border-cp-gold-light"
              style={{ backgroundColor: "#2A2417" }}
            >
              {/* ── Intensified corner brackets ── */}
              <span
                className="absolute left-0 top-0 h-4 w-4 rounded-tl-2xl border-l-4 border-t-4"
                style={{ borderColor: "#E4B94B" }}
              />
              <span
                className="absolute bottom-0 right-0 h-4 w-4 rounded-br-2xl border-b-4 border-r-4"
                style={{ borderColor: "#DD7230" }}
              />
              {/* ── Insignia seal ── */}
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-cp-gold-light text-2xl">⚔️</span>

              <div className="text-center">
                <Image
                  src="/images/brand/colonels-pickle-logo-plain.jpeg"
                  width={100}
                  height={100}
                  className="mx-auto rounded-full object-cover border-2 border-cp-gold-light"
                  alt="Colonel's Pickle"
                />
                <div className="mx-auto my-3 h-[2px] w-16 bg-cp-terracotta" />
                <p className="font-display text-[18px] font-bold text-cp-gold-light uppercase">
                  An Indian Army Colonel
                </p>
                <p className="mt-1 font-hindi text-[12px] text-cp-beige/60 uppercase">
                  Battle Casualty · War-Wounded Soldier
                </p>
              </div>
              <div className="mt-6 rounded-xl border-2 border-white/20 bg-white/[0.08] p-6">
                <p className="font-serif text-lg italic leading-relaxed text-cp-beige/85 font-bold">
                  <span className="text-cp-gold-light">Colonel's Command:</span> &ldquo;In every jar of Colonel&apos;s Pickle lives the courage of
                  a soldier, the warmth of an Army home, and the irreplaceable
                  touch of a mother&apos;s love.&rdquo;
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" duration={0.65}>
            <div>
              <p className="font-hindi text-xs font-bold uppercase tracking-widest text-cp-terracotta">
                ⚔️ Born from Valor, Seasoned with Honour
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-cp-text md:text-4xl uppercase tracking-wide">
                A Legacy of Service &amp; Flavour
              </h2>
              <p className="mt-5 font-serif text-[15px] leading-relaxed text-cp-text-muted">
                Service to the nation runs deep in the roots of{" "}
                <Highlight>Ridhwika Agro Organics</Highlight>. The family&apos;s
                proud military legacy was built by the father, a retired Indian
                Army Officer — and today three family members continue to wear
                the uniform: an <Highlight>Indian Army Colonel</Highlight>, his
                wife (a serving Army Officer), and his younger brother (also a
                serving Army Officer).
              </p>
              <p className="mt-4 font-serif text-[15px] leading-relaxed text-cp-text-muted">
                During a high-risk ammunition-disposal operation in Assam, the
                Colonel was severely injured, becoming a Battle Casualty and
                War-Wounded Soldier. Through a gruelling three-month hospital
                recovery on bland food, he realised a profound truth: true healing
                doesn&apos;t come from medicine alone — it comes from the
                comforting, soul-nourishing flavours of home.
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* ── Continuation sections ── */}
        <div className="mx-auto mt-14 max-w-3xl space-y-10 px-4">
          <AnimatedSection direction="up" duration={0.65}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="font-display text-2xl font-bold text-cp-olive uppercase">
                  🛡️ The COVID Lockdown &amp; the Birth of &ldquo;Colonel Special&rdquo;
                </h3>
                <p className="mt-3 font-serif text-[15px] leading-relaxed text-cp-text-muted">
                  Years later, posted at a military cantonment during the COVID-19
                  lockdown, the Colonel and his mother — <Highlight>Urmila Devi</Highlight>,
                  a resilient officer&apos;s mother from Haryana — found comfort in
                  their Army bungalow&apos;s kitchen garden. Surrounded by fresh,
                  sun-ripened green chillies, mother and son began experimenting with
                  time-tested family recipes, hand-selecting, sun-drying and freshly
                  grinding a proprietary mix of{" "}
                  <Highlight>22 to 24 whole spices</Highlight> — crafting what would
                  become their signature &ldquo;<Highlight>Colonel Special</Highlight>&rdquo;
                  masala. The jars they gifted across the cantonment tasted, to every
                  homesick officer and neighbour, exactly like home.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <HearthIllustration className="w-32 h-32 text-cp-terracotta opacity-80" />
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="up" duration={0.65} delay={0.2}>
            <h3 className="font-display text-2xl font-bold text-cp-olive uppercase">
              ★ A Legacy Named &ldquo;Ridhwika&rdquo;
            </h3>
            <p className="mt-3 font-serif text-[15px] leading-relaxed text-cp-text-muted">
              What began as a gesture of warmth soon called for a name — one that
              reflected family, unity and hope. <Highlight>Ridhwika Agro Organics</Highlight>{" "}
              is named after the three daughters of this patriotic family, a
              synthesis of their names lovingly chosen by the Colonel himself.
            </p>
          </AnimatedSection>

          <AnimatedSection direction="up" duration={0.65} delay={0.4}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="font-display text-2xl font-bold text-cp-olive uppercase">
                  ⚔️ Uncompromising Quality &amp; Authentic Heritage
                </h3>
                <p className="mt-3 font-serif text-[15px] leading-relaxed text-cp-text-muted">
                  Operating from dual hubs in Jaipur, Rajasthan and Bahadurgarh,
                  Haryana, Colonel&apos;s Pickle ships pan-India while empowering
                  local women through meaningful employment. Every FSSAI-licensed jar
                  stays true to its military roots — crafted from{" "}
                  <Highlight>100% natural</Highlight> ingredients using authentic,
                  traditional Bhartiya recipes: no artificial preservatives, no
                  chemicals, and no vinegar. Pure Afghani, Tajikistani and Uzbeki hing
                  valued at <Highlight>₹30,000/kg</Highlight>, wooden cold-pressed{" "}
                  <span className="font-hindi">kachi ghani</span> mustard oil, and the
                  secret &ldquo;<Highlight>Colonel Special</Highlight>&rdquo; blend of{" "}
                  <Highlight>22 to 24 whole spices</Highlight>. From a hospital bed in Assam
                  to kitchens across India — pure tradition, unmatched heritage, and
                  the heartwarming taste of <Highlight>Maa Ka Pyaar</Highlight> in
                  every <Highlight>Colonel&apos;s Pickle</Highlight> jar,{" "}
                  <Highlight>blended with a mother's love</Highlight>.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <HingIllustration className="w-32 h-32 text-cp-terracotta opacity-80" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          3. OUR PROMISE - SOLDIER'S CREED
          ════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white py-20">
        <RajasthaniPattern variant="camo" opacity={0.04} color="#6B7F3A" />
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <AnimatedSection direction="up" duration={0.65}>
            <SectionHeader
              eyebrow="⚔️ SOLDIER'S CREED"
              title="Our Promise to You"
            />
          </AnimatedSection>
          <div className="mx-auto mt-8 flex justify-center">
            <WebbingStitchAccent className="h-3 w-96 text-cp-terracotta opacity-60" />
          </div>
          <StaggerContainer staggerDelay={0.15} className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROMISES.map((p) => (
              <StaggerItem key={p.title}>
                <HoverLift lift={4}>
                  <div
                    className="rounded-2xl border-4 border-cp-border bg-cp-cream p-6 transition-all duration-300 relative overflow-hidden"
                    style={{ borderBottom: `4px solid ${p.color}` }}
                  >
                    {/* ── Gold left-side accent bar ── */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cp-gold-light to-cp-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* ── Corner insignias ── */}
                    <span className="absolute top-2 left-2 text-cp-gold/30 text-xs">★</span>
                    <span className="absolute bottom-2 right-2 text-cp-gold/30 text-xs">⚔️</span>

                    <span className="text-4xl">{p.icon}</span>
                    <h3 className="mt-3 font-display text-lg font-bold text-cp-text uppercase">
                      {p.title}
                    </h3>
                    <p className="mt-1 font-serif text-sm leading-relaxed text-cp-text-muted">
                      {p.desc}
                    </p>
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          4. CERTIFICATIONS & REGISTRATIONS
          ════════════════════════════════════════════════════════════════ */}
      <section className="bg-cp-cream py-20">
        <div className="mx-auto max-w-6xl px-4">
          <AnimatedSection direction="up" duration={0.65}>
            <SectionHeader
              eyebrow="⚔️ REGIMENTAL CERTIFICATIONS"
              title="Trust You Can Verify"
              subtitle="Colonel's Pickle operates under Ridhwika Agro Organics — fully licensed and registered with the Government of India."
            />
            <p className="mt-6 text-center font-sans text-xs font-bold uppercase tracking-widest text-cp-gold">
              🛡️ Officially Licensed by Government of India
            </p>
          </AnimatedSection>
          <StaggerContainer staggerDelay={0.12} className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
            {PUBLIC_REGISTRATIONS.map((r) => (
              <StaggerItem key={r.key}>
                <HoverLift lift={3}>
                  <CertificationBadge
                    certification={{
                      name: r.label,
                      description: r.fullName,
                    }}
                    className="h-full"
                  />
                  <div className="mt-2 text-center">
                    <p className="select-all break-all font-mono text-[13px] font-semibold text-cp-gold">
                      {r.number}
                    </p>
                    <p className="mt-1 font-serif text-xs text-cp-text-muted">
                      {r.detail}
                    </p>
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <AnimatedSection direction="up" duration={0.65} delay={0.3}>
            <p className="mt-8 text-center font-sans text-xs text-cp-text-light">
              ⚔️ Regimental Credentials — Full documentation available on request. Full company &amp;
              registration details (incl. Udyam &amp; GST) are on our{" "}
              <a
                href="/terms-and-conditions"
                className="font-semibold text-cp-terracotta underline-offset-2 hover:underline"
              >
                Terms &amp; Conditions
              </a>{" "}
              page.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          5. CONTACT CTA
          ════════════════════════════════════════════════════════════════ */}
      <section className="bg-cp-olive py-16">
        <div className="mx-auto max-w-4xl px-4 text-center text-white">
          <AnimatedSection direction="up" duration={0.65}>
            <h2 className="font-display text-3xl font-extrabold md:text-4xl uppercase">
              ⚔️ Reach the Colonel
            </h2>
            <p className="mt-2 font-hindi text-xs font-bold uppercase tracking-widest text-cp-gold-light">
              Regimental Headquarters
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 font-sans text-lg font-bold">
              {BRAND.phones.map((p) => (
                <a key={p} href={`tel:+91${p}`} className="hover:text-cp-gold-light transition-colors">
                  📞 +91 {p}
                </a>
              ))}
            </div>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 inline-block font-sans text-sm text-white/90 hover:text-cp-gold-light transition-colors"
            >
              ✉️ {CONTACT_EMAIL}
            </a>
            <p className="mx-auto mt-3 max-w-xl font-serif text-sm text-white/80">
              📍 {fullAddress}
            </p>
            <a
              href="https://wa.me/919350406289"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-lg bg-[#25D366] px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-white transition-all hover:-translate-y-px hover:shadow-lg hover:bg-[#20BA5A]"
            >
              ⚔️ WhatsApp Us
            </a>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
