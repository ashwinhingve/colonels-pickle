import Link from "next/link";
import Image from "next/image";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { Parallax } from "@/components/shared/Parallax";
import { TapScale } from "@/components/shared/TapScale";
import { CountUpStat } from "@/components/shared/CountUpStat";
import type { HeroPoolItem } from "@/components/home/StaggeredHeroPanels";
import { HeroJarVisual } from "@/components/home/HeroJarVisual";
import { connectDB } from "@/lib/mongodb";
import GalleryMedia from "@/models/GalleryMedia";
import {
  NoPreservativeIcon,
  NoChemicalIcon,
  NoVinegarIcon,
  ChilliIllustration,
  HingIllustration,
  LemonIllustration,
  DogTagIllustration,
  CornerFlourish,
} from "@/components/illustrations";

// Static fallback so the homepage hero never breaks before any admin has
// flagged gallery media as "Show in Hero" (e.g. right after first deploy).
const FALLBACK_HERO_POOL: HeroPoolItem[] = [
  {
    type: "image",
    url: "/hero/hero-poster.jpg",
    altText: "Stuffed red chilli achar arranged in a spiral — Colonel's Pickle",
  },
  {
    type: "image",
    url: "/hero/collage-b.jpg",
    altText: "Hand-mixing whole spices and chillies in a steel thali",
  },
  {
    type: "image",
    url: "/hero/collage-c.jpg",
    altText: "Masala-coated mango pieces — homemade achar in the making",
  },
  {
    type: "image",
    url: "/hero/collage-d.jpg",
    altText: "Fresh green mangoes soaking — raw ingredients",
  },
];

async function getHeroPool(): Promise<HeroPoolItem[]> {
  try {
    await connectDB();
    const items = await GalleryMedia.find({ isActive: true, showInHero: true })
      .sort({ heroOrder: 1 })
      .select("type url posterUrl title altText")
      .lean();

    if (!items.length) return FALLBACK_HERO_POOL;

    return items.map((item: any) => ({
      type: item.type,
      url: item.url,
      posterUrl: item.posterUrl,
      title: item.title,
      altText: item.altText,
    }));
  } catch {
    return FALLBACK_HERO_POOL;
  }
}

// The framed mother+Colonel photo shown inside the hero arch. Admins flag one
// image with "Use as Hero portrait" in the Gallery admin. Until then this returns
// null and the arch shows the illustrated figures fallback.
async function getHeroPortrait(): Promise<{ url: string; alt?: string } | null> {
  try {
    await connectDB();
    const item = await GalleryMedia.findOne({
      isActive: true,
      showAsHeroPortrait: true,
      type: "image",
    })
      .sort({ heroOrder: 1, order: 1 })
      .select("url title altText")
      .lean();

    if (!item) return null;
    const doc = item as any;
    return { url: doc.url, alt: doc.altText || doc.title };
  } catch {
    return null;
  }
}

const STATS = [
  { end: 15, suffix: "+", label: "Pickle Varieties" },
  { end: 100, suffix: "%", label: "Natural" },
  { end: 0, suffix: "", label: "Preservatives" },
];

const BENEFITS = [
  { Icon: NoPreservativeIcon, label: "Zero Artificial Preservatives" },
  { Icon: NoChemicalIcon, label: "Zero Chemicals" },
  { Icon: NoVinegarIcon, label: "No Vinegar" },
];

export async function HeroSection() {
  const [heroPool, heroPortrait] = await Promise.all([
    getHeroPool(),
    getHeroPortrait(),
  ]);

  return (
    <>
      {/* Single crawlable H1 for SEO — the desktop banner bakes its headline into
          the image, so the semantic H1 lives here (visually hidden, one per page). */}
      <h1 className="sr-only">
        Colonel&apos;s Pickle (Kernel Pickle) — Buy Homemade Indian Pickles
        Online · No Preservatives, No Vinegar
      </h1>

      {/* ── DESKTOP / TABLET: the client's designed hero banner ── */}
      <section
        aria-label="Colonel's Pickle — homemade Indian achaar"
        className="relative hidden w-full bg-cp-beige md:block"
      >
        <Link
          href="/products"
          aria-label="Shop Colonel's Pickle achaars"
          className="group relative flex h-[calc(100svh-81px)] w-full items-center justify-center overflow-hidden"
        >
          {/* Immersive backdrop: the same banner blown up, blurred and dimmed,
              fills the full viewport height so any side letterboxing reads as a
              soft extension of the artwork instead of flat empty margin. */}
          <Image
            src="/hero/hero-banner-1.jpg"
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="scale-125 object-cover blur-2xl brightness-[0.92] saturate-[1.15]"
          />
          <span
            className="pointer-events-none absolute inset-0 bg-cp-beige/25"
            aria-hidden="true"
          />
          {/* Sharp banner, maximised within the band with no crop and no scroll
              (object-contain picks whichever of width/height is limiting). */}
          <Image
            src="/hero/hero-banner-1.jpg"
            alt="Colonel's Pickle homemade Indian achaar — maa ka pyaar, ghar ka achar. No vinegar, no artificial preservatives, natural ingredients, loved by families."
            width={1671}
            height={941}
            priority
            sizes="100vw"
            className="relative z-10 h-full w-full object-contain drop-shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-out group-hover:scale-[1.01]"
          />
        </Link>
      </section>

      {/* ── MOBILE: responsive live hero (keeps text crisp on phones) ── */}
      <section
        className="relative flex min-h-[88vh] items-center overflow-hidden md:hidden"
        style={{
          background:
            "linear-gradient(135deg, #3A4A1F 0%, #4B5D2A 52%, #232B14 100%)",
        }}
      >
      {/* ── Layered premium background ── */}
      {/* Warm gold key-light glow, upper-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] -top-[15%] h-[70vh] w-[70vh] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,160,23,0.28) 0%, rgba(212,160,23,0.10) 40%, transparent 70%)",
        }}
      />
      {/* Cool terracotta counter-glow, lower-left, for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[20%] -left-[12%] h-[60vh] w-[60vh] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(192,86,33,0.20) 0%, transparent 68%)",
        }}
      />
      {/* Edge vignette to focus the centre and add richness */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(20,26,10,0.55) 100%)",
        }}
      />
      {/* Fine film grain for a matte, premium finish (self-contained SVG noise) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "160px 160px",
        }}
      />

      {/* One subtle field texture — warm, not heavy combat */}
      <RajasthaniPattern variant="camo" opacity={0.05} color="#F5EBDA" />

      {/* Elegant gold corner flourishes — a refined nod to the Army heritage */}
      <CornerFlourish
        aria-hidden
        className="pointer-events-none absolute left-4 top-4 hidden h-16 w-16 text-cp-gold opacity-25 md:block"
      />
      <CornerFlourish
        aria-hidden
        className="pointer-events-none absolute bottom-4 right-4 hidden h-16 w-16 rotate-180 text-cp-gold opacity-25 md:block"
      />

      {/* Ambient floating illustration accents — parallax-drifted for depth */}
      <Parallax
        offset={55}
        direction="up"
        className="pointer-events-none absolute left-[4%] top-[18%] hidden md:block"
      >
        <ChilliIllustration aria-hidden className="animate-float h-16 w-16 opacity-40" />
      </Parallax>
      <Parallax
        offset={40}
        direction="down"
        className="pointer-events-none absolute bottom-[14%] left-[10%] hidden lg:block"
      >
        <HingIllustration
          aria-hidden
          className="animate-float animation-delay-1000 h-16 w-16 opacity-40"
        />
      </Parallax>
      <Parallax
        offset={65}
        direction="up"
        className="pointer-events-none absolute right-[3%] top-[10%] hidden lg:block"
      >
        <LemonIllustration
          aria-hidden
          className="animate-float animation-delay-500 h-14 w-14 opacity-35"
        />
      </Parallax>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
        {/* LEFT — messaging */}
        <div className="animate-fade-up">
          <div className="mb-6 flex items-center gap-4">
            <div className="brandmark-glow animate-soft-pulse relative flex-shrink-0">
              <span
                className="absolute inset-0 -m-[3px] rounded-full border border-cp-gold/60"
                aria-hidden="true"
              />
              <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-cp-gold bg-white shadow-[0_4px_20px_rgba(0,0,0,0.35)] sm:h-[88px] sm:w-[88px]">
                <Image
                  src="/images/brand/ridhwika-crest.png"
                  alt="Colonel's Pickle crest — Ridhwika Agro Organics"
                  width={88}
                  height={88}
                  className="h-[92%] w-[92%] object-contain"
                  priority
                />
              </span>
            </div>
            <span
              className="hidden h-12 w-px bg-cp-beige/25 sm:block"
              aria-hidden="true"
            />
            <div className="hidden sm:block">
              {/* Registered trademark wordmark on a light plaque so the red
                  lettering stays legible against the dark olive hero. */}
              <span className="inline-flex w-fit items-center rounded-lg bg-cp-cream-muted/95 px-3 py-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.35)] ring-1 ring-black/10">
                <Image
                  src="/images/brand/colonels-pickle-wordmark.png"
                  alt="Colonel's Pickle® — homemade Indian pickles"
                  width={662}
                  height={358}
                  className="h-[38px] w-auto"
                  priority
                />
              </span>
              <p className="mt-1.5 font-hindi text-[11px] tracking-[0.2em] text-cp-gold-light">
                MAA KA PYAAR, GHAR KA ACHAR
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-cp-gold/40 bg-white/10 px-4 py-1.5 font-sans text-sm font-medium text-cp-beige backdrop-blur">
            <DogTagIllustration className="h-4 w-4 flex-shrink-0" aria-hidden />
            Made with pride by the mother of an Indian Army Colonel
          </span>

          <p className="mt-6 font-hindi text-[2.85rem] font-bold leading-tight text-cp-beige drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-[4rem]">
            माँ का प्यार,
            <br />
            <span className="text-cp-gold-light">घर का अचार</span>
          </p>

          <p className="mt-3 font-display text-[1.2rem] italic text-cp-beige/80">
            Maa Ka Pyaar, Ghar Ka Achar
          </p>

          <p className="mt-5 max-w-xl font-serif text-[16px] font-medium leading-relaxed text-cp-beige/90">
            No Vinegar. No Artificial Preservatives. Just Authentic, Traditional
            Flavours.
          </p>

          {/* Benefit chips — the hero's focal promise */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            {BENEFITS.map(({ Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-cp-beige/20 bg-white/10 py-2 pl-3 pr-4 font-sans text-[13px] font-semibold text-cp-beige backdrop-blur transition-colors hover:bg-white/20"
              >
                <Icon className="h-[18px] w-[18px] text-cp-gold-light" />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <TapScale asChild>
              <Link
                href="/products"
                className="btn-sheen group inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-cp-terracotta to-cp-gold px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(192,86,33,0.65)]"
              >
                <span>Shop Now</span>
                <span
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </TapScale>
            <TapScale asChild>
              <Link
                href="/about"
                className="rounded-lg border border-cp-beige/40 bg-white/10 px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-cp-beige backdrop-blur transition-all duration-300 hover:border-cp-gold/60 hover:bg-white/20"
              >
                Our Story
              </Link>
            </TapScale>
          </div>

          <div className="mt-10 flex gap-6 sm:gap-12">
            {STATS.map((s) => (
              <CountUpStat
                key={s.label}
                end={s.end}
                suffix={s.suffix}
                label={s.label}
                tone="dark"
              />
            ))}
          </div>
        </div>

        {/* RIGHT — hero jar visual with floating photo chips and heritage emblem */}
        <Parallax offset={30} direction="up">
          <HeroJarVisual
            pool={heroPool}
            portraitUrl={heroPortrait?.url}
            portraitAlt={heroPortrait?.alt}
          />
        </Parallax>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="absolute bottom-[74px] left-1/2 z-[3] hidden -translate-x-1/2 flex-col items-center gap-1.5 md:flex"
      >
        <span className="font-tactical text-[10px] uppercase tracking-[0.35em] text-cp-beige/55">
          Scroll
        </span>
        <span className="flex h-8 w-5 items-start justify-center rounded-full border border-cp-beige/40 p-1">
          <span className="animate-bounce-slow h-1.5 w-1.5 rounded-full bg-cp-gold-light" />
        </span>
      </div>

      {/* Wave divider into beige */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 z-[2] block h-[60px] w-full"
      >
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F5EBDA" />
      </svg>
      </section>
    </>
  );
}

export default HeroSection;
