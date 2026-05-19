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
      <RajasthaniPattern variant="medallion" opacity={0.06} color="#ffffff" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
        {/* LEFT */}
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 py-1.5 font-sans text-sm font-medium text-white backdrop-blur">
            🏅 Army Officer&apos;s Mother&apos;s Homemade Pickles
          </span>

          <h1 className="mt-6 font-hindi text-[2.75rem] font-bold leading-tight text-white sm:text-[3.8rem]">
            माँ का प्यार,
            <br />
            <span className="text-[#FCD34D]">घर का अचार</span>
          </h1>

          <p className="mt-3 font-display text-[1.2rem] italic text-white/80">
            Maa Ka Pyaar, Ghar Ka Achar
          </p>

          <p className="mt-5 max-w-xl font-serif text-[15.5px] leading-relaxed text-white/72">
            Hand-crafted in small batches with 24 sun-dried whole spices and
            cold-pressed mustard oil — exactly the way a mother makes it. Zero
            artificial preservatives, zero shortcuts, just a recipe passed down
            with love.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-gradient-to-br from-cp-saffron to-cp-saffron-bright px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-white transition-transform hover:-translate-y-px"
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

          <div className="mt-10 flex gap-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-extrabold text-[#FCD34D]">
                  {s.value}
                </div>
                <div className="mt-1 font-sans text-xs uppercase tracking-wide text-white/70">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — floating jar card */}
        <div className="relative flex justify-center">
          <div className="animate-float relative w-[280px] rounded-2xl bg-white/95 shadow-2xl">
            <div className="h-3 rounded-t-2xl bg-gradient-to-r from-cp-saffron to-cp-saffron-bright" />
            <div className="flex flex-col items-center px-6 py-8 text-center">
              <span className="text-[64px]">🫙</span>
              <p className="mt-4 font-display text-lg font-extrabold text-cp-crimson">
                Colonel&apos;s Pickle®
              </p>
              <p className="mt-1 font-sans text-xs font-bold uppercase tracking-widest text-cp-brown">
                Chhuhara Adrak
              </p>
              <p className="mt-1 font-display text-sm italic text-cp-text-muted">
                Ghar Ka Achar
              </p>
              <span className="mt-3 rounded-full bg-[rgba(22,101,52,0.88)] px-3 py-1 font-sans text-[10px] font-semibold text-white">
                No Preservatives ✓
              </span>
              <p className="mt-4 font-sans text-2xl font-extrabold text-cp-crimson">
                From ₹149
              </p>
              <p className="font-sans text-[11px] text-cp-text-muted">100g</p>
            </div>
          </div>

          <span className="absolute -right-2 top-6 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 font-sans text-xs font-semibold text-white backdrop-blur">
            🌿 100% Natural
          </span>
          <span className="absolute -left-2 bottom-8 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 font-sans text-xs font-semibold text-white backdrop-blur">
            FSSAI ✓ Certified
          </span>
        </div>
      </div>

      {/* Wave divider into cream */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 block h-[60px] w-full"
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
