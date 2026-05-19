import Link from "next/link";
import Image from "next/image";
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
        {/* LEFT — unchanged content */}
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 py-1.5 font-sans text-sm font-medium text-white backdrop-blur">
            🏅 Born in an Army Officer&apos;s Mother&apos;s Kitchen
          </span>

          <h1 className="mt-6 font-hindi text-[2.85rem] font-bold leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-[4rem]">
            माँ का प्यार,
            <br />
            <span className="text-[#FCD34D]">घर का अचार</span>
          </h1>

          <p className="mt-3 font-display text-[1.2rem] italic text-white/80">
            Maa Ka Pyaar, Ghar Ka Achar
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

          <div className="mt-10 flex gap-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-4xl font-black text-[#FCD34D]">
                  {s.value}
                </div>
                <div className="font-hindi text-xs text-white/60 uppercase tracking-widest mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — floating artisan collage (real brand photos, self-hosted) */}
        <div className="relative hidden h-[500px] lg:block">
          {/* crimson glow behind collage */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(185,28,28,0.2) 0%, transparent 70%)",
            }}
          />

          {/* Card A — primary, largest */}
          <div className="animate-float absolute right-[20px] top-[40px] z-[3] h-[300px] w-[260px] rotate-[2deg] overflow-hidden rounded-2xl border-[3px] border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-[transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-[0_28px_72px_rgba(0,0,0,0.42)]">
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
          <div className="animate-float animation-delay-500 absolute left-[20px] top-0 z-[2] h-[200px] w-[180px] -rotate-[3deg] overflow-hidden rounded-2xl border-[3px] border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition-[transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-[0_22px_52px_rgba(0,0,0,0.34)]">
            <Image
              src="/hero/collage-b.jpg"
              alt="Hand-mixing whole spices and chillies in a steel thali"
              fill
              sizes="180px"
              className="object-cover"
            />
          </div>

          {/* Card C — bottom-left, medium */}
          <div className="animate-float animation-delay-1000 absolute bottom-[60px] left-0 z-[2] h-[180px] w-[200px] rotate-[1.5deg] overflow-hidden rounded-2xl border-[3px] border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition-[transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-[0_22px_52px_rgba(0,0,0,0.34)]">
            <Image
              src="/hero/collage-c.jpg"
              alt="Masala-coated mango pieces — homemade achar in the making"
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>

          {/* Card D — bottom-right, small accent */}
          <div className="animate-float animation-delay-1500 absolute bottom-[20px] right-[60px] z-[1] h-[160px] w-[150px] -rotate-[2deg] overflow-hidden rounded-2xl border-[3px] border-white/20 shadow-[0_12px_30px_rgba(0,0,0,0.2)] transition-[transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-[0_18px_42px_rgba(0,0,0,0.3)]">
            <Image
              src="/hero/collage-d.jpg"
              alt="Fresh green mangoes soaking — raw ingredients"
              fill
              sizes="150px"
              className="object-cover"
            />
          </div>

          {/* Floating badges on the collage */}
          <span className="absolute right-[-12px] top-[-12px] z-10 rounded-full bg-white px-3 py-1.5 font-hindi text-xs font-bold text-cp-green shadow-lg">
            🌿 100% Natural
          </span>
          <span className="absolute bottom-[40px] left-[-12px] z-10 rounded-full bg-white px-3 py-1.5 font-hindi text-xs font-bold text-cp-crimson shadow-lg">
            FSSAI ✓
          </span>
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
