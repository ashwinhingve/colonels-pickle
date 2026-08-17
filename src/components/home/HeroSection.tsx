import Link from "next/link";
import Image from "next/image";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import {
  NoPreservativeIcon,
  NoChemicalIcon,
  NoVinegarIcon,
  ChilliIllustration,
  HingIllustration,
  LemonIllustration,
} from "@/components/illustrations";

const STATS = [
  { value: "15+", label: "Pickle Varieties" },
  { value: "100%", label: "Natural" },
  { value: "0", label: "Preservatives" },
];

const BENEFITS = [
  { Icon: NoPreservativeIcon, label: "Zero Artificial Preservatives" },
  { Icon: NoChemicalIcon, label: "Zero Chemicals" },
  { Icon: NoVinegarIcon, label: "No Vinegar" },
];

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-[90vh] items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #3A4A1F 0%, #4B5D2A 55%, #2E3818 100%)",
      }}
    >
      <RajasthaniPattern variant="medallion" opacity={0.05} color="#F5EBDA" />

      {/* Ambient floating illustration accents */}
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

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
        {/* LEFT — messaging */}
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-cp-gold/40 bg-white/10 px-4 py-1.5 font-sans text-sm font-medium text-cp-beige backdrop-blur">
            🎖️ Made with pride by the mother of an Indian Army Colonel
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
            <Link
              href="/products"
              className="rounded-lg bg-gradient-to-br from-cp-terracotta to-cp-gold px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-transform hover:-translate-y-px"
            >
              Shop Now →
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-cp-beige/40 bg-white/10 px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-cp-beige backdrop-blur transition-colors hover:bg-white/20"
            >
              Our Story
            </Link>
          </div>

          <div className="mt-10 flex gap-10">
            {STATS.map((s) => (
              <div key={s.label}>
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

        {/* RIGHT — floating artisan collage (real brand photos, self-hosted) */}
        <div className="relative hidden h-[500px] lg:block">
          {/* warm glow behind collage */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(212,160,23,0.18) 0%, transparent 70%)",
            }}
          />

          {/* Card A — primary, largest */}
          <div className="animate-float absolute right-[20px] top-[40px] z-[3] h-[300px] w-[260px] rotate-[2deg] overflow-hidden rounded-2xl border-[3px] border-cp-beige/30 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-[0_28px_72px_rgba(0,0,0,0.45)]">
            <Image
              src="/hero/hero-poster.jpg"
              alt="Stuffed red chilli achar arranged in a spiral — Colonel's Pickle"
              fill
              sizes="260px"
              className="object-cover"
              priority
            />
          </div>

          {/* Card B — top-left, medium */}
          <div className="animate-float animation-delay-500 absolute left-[20px] top-0 z-[2] h-[200px] w-[180px] -rotate-[3deg] overflow-hidden rounded-2xl border-[3px] border-cp-beige/30 shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition-[transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-[0_22px_52px_rgba(0,0,0,0.36)]">
            <Image
              src="/hero/collage-b.jpg"
              alt="Hand-mixing whole spices and chillies in a steel thali"
              fill
              sizes="180px"
              className="object-cover"
            />
          </div>

          {/* Card C — bottom-left, medium */}
          <div className="animate-float animation-delay-1000 absolute bottom-[60px] left-0 z-[2] h-[180px] w-[200px] rotate-[1.5deg] overflow-hidden rounded-2xl border-[3px] border-cp-beige/30 shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition-[transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-[0_22px_52px_rgba(0,0,0,0.36)]">
            <Image
              src="/hero/collage-c.jpg"
              alt="Masala-coated mango pieces — homemade achar in the making"
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>

          {/* Card D — bottom-right, small accent */}
          <div className="animate-float animation-delay-1500 absolute bottom-[20px] right-[60px] z-[1] h-[160px] w-[150px] -rotate-[2deg] overflow-hidden rounded-2xl border-[3px] border-cp-beige/30 shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition-[transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-[0_18px_42px_rgba(0,0,0,0.32)]">
            <Image
              src="/hero/collage-d.jpg"
              alt="Fresh green mangoes soaking — raw ingredients"
              fill
              sizes="150px"
              className="object-cover"
            />
          </div>

          {/* Floating badges on the collage */}
          <span className="absolute right-[-12px] top-[-12px] z-10 rounded-full bg-cp-beige px-3 py-1.5 font-hindi text-xs font-bold text-cp-olive shadow-lg">
            🌿 100% Natural
          </span>
          <span className="absolute right-[30%] top-[46%] z-10 rounded-full bg-cp-terracotta px-3 py-1.5 font-hindi text-xs font-bold text-white shadow-lg">
            No Vinegar ✓
          </span>
          <span className="absolute bottom-[40px] left-[-12px] z-10 rounded-full bg-cp-beige px-3 py-1.5 font-hindi text-xs font-bold text-cp-terracotta shadow-lg">
            FSSAI ✓
          </span>
        </div>
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
