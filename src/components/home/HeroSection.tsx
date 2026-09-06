import Link from "next/link";
import Image from "next/image";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { Parallax } from "@/components/shared/Parallax";
import { TapScale } from "@/components/shared/TapScale";
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
  TacticalCrosshair,
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
  { value: "15+", label: "Pickle Varieties" },
  { value: "100%", label: "Natural" },
  { value: "0", label: "Preservatives" },
];

const BENEFITS = [
  { Icon: NoPreservativeIcon, label: "Zero Artificial Preservatives", insignia: "⚔️" },
  { Icon: NoChemicalIcon, label: "Zero Chemicals", insignia: "🛡️" },
  { Icon: NoVinegarIcon, label: "No Vinegar", insignia: "★" },
];

export async function HeroSection() {
  const heroPool = await getHeroPool();

  return (
    <section
      className="relative flex min-h-[90vh] items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #2E3818 0%, #4B5D2A 40%, #3A4A1F 70%, #1C1F22 100%)",
      }}
    >
      {/* ── Tactical pattern layers ── */}
      <RajasthaniPattern variant="camo" opacity={0.15} color="#F5EBDA" />
      <RajasthaniPattern variant="blueprint" opacity={0.12} color="#E4B94B" />

      {/* ── Tactical crosshair reticle ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <TacticalCrosshair
          className="absolute"
          size={400}
          opacity={0.08}
          color="#E4B94B"
          aria-hidden="true"
        />
      </div>

      {/* ── Tactical corner brackets ── */}
      <CornerFlourish
        aria-hidden
        className="pointer-events-none absolute left-4 top-4 hidden h-24 w-24 text-cp-gold-light opacity-30 md:block"
      />
      <CornerFlourish
        aria-hidden
        className="pointer-events-none absolute bottom-4 right-4 hidden h-24 w-24 rotate-180 text-cp-gold-light opacity-30 md:block"
      />

      {/* ── Ambient floating icons ── */}
      <ChilliIllustration
        aria-hidden
        className="animate-float pointer-events-none absolute left-[4%] top-[18%] hidden h-16 w-16 opacity-25 md:block"
      />
      <HingIllustration
        aria-hidden
        className="animate-float animation-delay-1000 pointer-events-none absolute bottom-[14%] left-[10%] hidden h-16 w-16 opacity-25 lg:block"
      />
      <LemonIllustration
        aria-hidden
        className="animate-float animation-delay-500 pointer-events-none absolute right-[3%] top-[10%] hidden h-14 w-14 opacity-20 lg:block"
      />

      {/* ── Floating insignia accents ── */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-[8%] top-[25%] hidden h-12 w-12 opacity-20 md:block text-cp-gold-light text-xl"
      >
        ★
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-[5%] bottom-[20%] hidden h-12 w-12 opacity-20 lg:block text-cp-gold-light text-xl"
      >
        ⚔️
      </span>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
        {/* ── LEFT: Tactical messaging ── */}
        <div className="animate-fade-up">
          {/* ── Logo emblem with dual-ring insignia ── */}
          <div className="mb-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <p className="font-hindi text-xs font-bold uppercase tracking-[0.2em] text-cp-gold-light mb-3">
              Colonel&apos;s Command
            </p>

            <div className="relative flex-shrink-0 mb-4">
              {/* Outer gold ring */}
              <span
                className="absolute inset-0 -m-1 rounded-full border-4 border-cp-gold-light"
                aria-hidden="true"
              />
              {/* Inner terracotta ring */}
              <span
                className="absolute inset-0 m-2 rounded-full border-2 border-cp-terracotta"
                aria-hidden="true"
              />
              {/* Corner insignia brackets */}
              <span className="absolute -top-3 -left-3 h-3 w-3 border-t-2 border-l-2 border-cp-gold-light opacity-60" />
              <span className="absolute -top-3 -right-3 h-3 w-3 border-t-2 border-r-2 border-cp-gold-light opacity-60" />
              <span className="absolute -bottom-3 -left-3 h-3 w-3 border-b-2 border-l-2 border-cp-gold-light opacity-60" />
              <span className="absolute -bottom-3 -right-3 h-3 w-3 border-b-2 border-r-2 border-cp-gold-light opacity-60" />

              <Image
                src="/images/brand/colonels-pickle-logo-plain.jpeg"
                alt="Colonel's Pickle emblem"
                width={88}
                height={88}
                className="h-16 w-16 rounded-full border-4 border-cp-gold-light object-cover shadow-[0_4px_20px_rgba(0,0,0,0.35)] sm:h-[88px] sm:w-[88px]"
                priority
              />
            </div>
          </div>

          {/* ── Desktop brand text ── */}
          <div className="hidden lg:flex lg:items-center lg:gap-4 mb-6">
            <span
              className="h-12 w-px bg-cp-beige/25"
              aria-hidden="true"
            />
            <div>
              <p className="font-display text-xl font-extrabold tracking-tight text-cp-beige">
                Colonel&apos;s Pickle
              </p>
              <p className="mt-0.5 font-hindi text-[11px] tracking-[0.2em] text-cp-gold-light">
                MAA KA PYAAR, GHAR KA ACHAR
              </p>
            </div>
          </div>

          {/* ── DogTag tactical chip ── */}
          <span className="inline-flex items-center gap-2 rounded-md border-2 border-cp-gold bg-white/10 px-4 py-2 font-sans text-sm font-bold text-cp-beige backdrop-blur">
            <span aria-hidden className="text-cp-gold">⚔️</span>
            BATTLE-TESTED FAMILY RECIPE
          </span>

          {/* ── Main headline ── */}
          <h1 className="mt-6 font-hindi text-[2.85rem] font-bold leading-tight text-cp-beige drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-[4rem]">
            माँ का प्यार,
            <br />
            <span className="text-cp-gold-light">घर का अचार</span>
          </h1>

          <p className="mt-3 font-display text-[1.2rem] italic text-cp-beige/80">
            Maa Ka Pyaar, Ghar Ka Achar
          </p>

          {/* ── Soldier's Promise copy ── */}
          <p className="mt-5 max-w-xl font-serif text-[16px] font-bold leading-relaxed text-cp-beige/90">
            <span className="text-cp-gold-light font-black uppercase">SOLDIER&apos;S PROMISE:</span> No Vinegar. No Artificial Preservatives. Just Battle-Tested Tradition.
          </p>

          {/* ── Benefit chips ── */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            {BENEFITS.map(({ Icon, label, insignia }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border-2 border-cp-gold bg-white/15 py-2.5 pl-3 pr-4 font-sans text-[13px] font-bold text-cp-beige backdrop-blur transition-all hover:bg-white/25 hover:border-cp-gold-light"
              >
                <span aria-hidden className="text-cp-gold-light text-lg">
                  {insignia}
                </span>
                {label}
              </span>
            ))}
          </div>

          {/* ── CTA buttons ── */}
          <div className="mt-8 flex flex-wrap gap-4">
            <TapScale asChild>
              <Link
                href="/products"
                className="relative rounded-lg bg-gradient-to-br from-cp-terracotta to-cp-gold px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-[0.08em] text-white shadow-lg transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(212,160,23,0.5)]"
              >
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-cp-gold-light rounded-l-lg" />
                PLACE ORDER ⚔️
              </Link>
            </TapScale>
            <TapScale asChild>
              <Link
                href="/about"
                className="rounded-lg border-2 border-cp-beige/50 bg-white/10 px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-[0.08em] text-cp-beige backdrop-blur transition-all hover:bg-white/25 hover:border-cp-gold"
              >
                KNOW THE COLONEL
              </Link>
            </TapScale>
          </div>

          {/* ── Stats with insignia ── */}
          <div className="mt-10 flex gap-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <span className="text-cp-gold-light text-lg" aria-hidden>
                  ★
                </span>
                <div className="font-display text-4xl font-black text-cp-gold-light">
                  {s.value}
                </div>
                <div className="mt-1 font-hindi text-xs uppercase tracking-widest text-cp-beige/60">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Floating collage ── */}
        <Parallax offset={30} direction="up">
          <StaggeredHeroPanels pool={heroPool} />
        </Parallax>
      </div>

      {/* ── Wave divider ── */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 z-[2] block h-[60px] w-full"
      >
        <defs>
          <linearGradient id="wave-gradient-hero" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5EBDA" stopOpacity="1" />
            <stop offset="100%" stopColor="#F5EBDA" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="url(#wave-gradient-hero)" />
      </svg>
    </section>
  );
}

export default HeroSection;
