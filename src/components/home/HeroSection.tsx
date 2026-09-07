import Link from "next/link";
import Image from "next/image";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { Parallax } from "@/components/shared/Parallax";
import { TapScale } from "@/components/shared/TapScale";
import { CountUpStat } from "@/components/shared/CountUpStat";
import { StaggeredHeroPanels, type HeroPoolItem } from "@/components/home/StaggeredHeroPanels";
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
  const heroPool = await getHeroPool();

  return (
    <section
      className="relative flex min-h-[90vh] items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #3A4A1F 0%, #4B5D2A 55%, #2E3818 100%)",
      }}
    >
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
            <div className="relative flex-shrink-0">
              <span
                className="absolute inset-0 -m-[3px] rounded-full border border-cp-gold/60"
                aria-hidden="true"
              />
              <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-cp-gold bg-white shadow-[0_4px_20px_rgba(0,0,0,0.35)] sm:h-[88px] sm:w-[88px]">
                <Image
                  src="/logo.png"
                  alt="Colonel's Pickle emblem"
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
              <p className="font-display text-xl font-extrabold tracking-tight text-cp-beige">
                Colonel&apos;s Pickle
              </p>
              <p className="mt-0.5 font-hindi text-[11px] tracking-[0.2em] text-cp-gold-light">
                MAA KA PYAAR, GHAR KA ACHAR
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-cp-gold/40 bg-white/10 px-4 py-1.5 font-sans text-sm font-medium text-cp-beige backdrop-blur">
            <DogTagIllustration className="h-4 w-4 flex-shrink-0" aria-hidden />
            Made with pride by the mother of an Indian Army Colonel
          </span>

          <h1 className="mt-6 font-hindi text-[2.85rem] font-bold leading-tight text-cp-beige drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-[4rem]">
            माँ का प्यार,
            <br />
            <span className="text-cp-gold-light">घर का अचार</span>
          </h1>

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

        {/* RIGHT — floating artisan collage, CMS-driven from the Gallery's Hero Pool */}
        <Parallax offset={30} direction="up">
          <StaggeredHeroPanels pool={heroPool} />
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
  );
}

export default HeroSection;
