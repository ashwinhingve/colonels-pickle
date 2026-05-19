import Link from "next/link";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";

const STATS = [
  { value: "15+", label: "Pickle Varieties" },
  { value: "100%", label: "Natural" },
  { value: "0", label: "Preservatives" },
];

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-[88vh] items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #7F1D1D 0%, #B91C1C 50%, #78350F 100%)",
      }}
    >
      {/* Full-bleed background video — poster paints instantly, video fades in.
          If video is blocked/stalls the poster stays; if both fail, the
          section gradient above shows. Muted + playsInline ⇒ mobile autoplay. */}
      <video
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero/hero-poster.jpg"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/hero/hero-making.mp4" type="video/mp4" />
      </video>

      {/* Legibility scrim */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/55 to-cp-crimson/35" />

      {/* Faint brand texture over the scrim */}
      <div className="absolute inset-0 z-[1]">
        <RajasthaniPattern variant="medallion" opacity={0.05} color="#ffffff" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24">
        <div className="animate-fade-up max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 py-1.5 font-sans text-sm font-medium text-white backdrop-blur">
            🏅 Army Officer&apos;s Mother&apos;s Homemade Pickles
          </span>

          <h1 className="mt-6 font-hindi text-[2.85rem] font-bold leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-[4rem]">
            माँ का प्यार,
            <br />
            <span className="text-[#FCD34D]">घर का अचार</span>
          </h1>

          <p className="mt-3 font-display text-[1.2rem] italic text-white/80">
            Maa Ka Pyaar, Ghar Ka Achar
          </p>

          <p className="mt-5 font-display text-[1.45rem] font-semibold italic leading-snug text-[#FCD34D] drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] sm:text-[1.7rem]">
            You don&apos;t buy product, you buy experience.
          </p>

          <p className="mt-5 max-w-xl font-serif text-[15.5px] leading-relaxed text-white/80">
            Hand-crafted in small batches with 24 sun-dried whole spices and
            cold-pressed mustard oil — exactly the way a mother makes it. Zero
            artificial preservatives, zero shortcuts, just a recipe passed down
            with love.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-gradient-to-br from-cp-saffron to-cp-saffron-bright px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-transform hover:-translate-y-px"
            >
              Shop Now →
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-white/38 bg-white/12 px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Our Story
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-extrabold text-[#FCD34D] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  {s.value}
                </div>
                <div className="mt-1 font-sans text-xs uppercase tracking-wide text-white/75">
                  {s.label}
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1.5 font-sans text-xs font-semibold text-white backdrop-blur">
                🌿 100% Natural
              </span>
              <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1.5 font-sans text-xs font-semibold text-white backdrop-blur">
                FSSAI ✓ Certified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider into cream */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 z-[2] block h-[60px] w-full"
      >
        <path
          d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
          fill="#FDF8F0"
        />
      </svg>
    </section>
  );
}

export default HeroSection;
