import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";

const FACT_TILES = [
  { icon: "👩‍🍳", label: "Women Empowerment", sub: "Creating local employment" },
  { icon: "🏅", label: "FSSAI Certified", sub: "License: 12223026002188" },
  { icon: "🌿", label: "Zero Chemicals", sub: "No preservatives or artificial colours" },
  { icon: "📍", label: "Jaipur, Rajasthan", sub: "Ajmer Road, Vardhman Nagar" },
];

export function OurStory() {
  return (
    <section
      className="relative overflow-hidden py-20"
      style={{
        background: "linear-gradient(135deg, #1C1917 0%, #292524 100%)",
      }}
    >
      <div className="absolute inset-y-0 right-0 w-1/2">
        <RajasthaniPattern variant="jali" opacity={0.04} color="#ffffff" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
        {/* LEFT — story card */}
        <div className="relative rounded-2xl bg-white/5 p-10">
          <span
            className="absolute left-0 top-0 h-12 w-12 rounded-tl-2xl border-l-2 border-t-2"
            style={{ borderColor: "#D97706" }}
          />
          <span
            className="absolute bottom-0 right-0 h-12 w-12 rounded-br-2xl border-b-2 border-r-2"
            style={{ borderColor: "#B91C1C" }}
          />

          <span className="text-[72px]">🎖️</span>
          <p className="mt-4 font-display text-2xl font-bold text-[#FCD34D]">
            Lt Col Praveen Kumar Sharma
          </p>
          <p className="mt-1 font-sans text-sm text-white/70">
            Lt Col, Indian Army · CPE ITARSI
          </p>

          <div className="mt-6 rounded-xl border border-white/15 bg-white/8 p-6">
            <p className="font-serif text-lg italic leading-relaxed text-white/85">
              &ldquo;Quality is non-negotiable when you&apos;re feeding
              families.&rdquo;
            </p>
          </div>
        </div>

        {/* RIGHT — story text */}
        <div>
          <p className="font-hindi text-xs font-bold uppercase tracking-widest text-cp-saffron">
            The Story Behind Every Jar
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-white md:text-4xl">
            Born from a{" "}
            <span className="italic text-[#FCD34D]">Mother&apos;s Kitchen</span>
          </h2>

          <p className="mt-5 font-serif text-[15px] leading-relaxed text-white/72">
            It began with Urmila Devi&apos;s kitchen — where every jar of achar
            was made the slow way, with sun-dried spices and cold-pressed
            mustard oil. Her son, Lt Col Praveen Kumar Sharma, watched soldiers
            far from home miss exactly this taste: the comfort of ghar ka achar.
          </p>
          <p className="mt-4 font-serif text-[15px] leading-relaxed text-white/72">
            Colonel&apos;s Pickle was built to carry that recipe to every home
            in India — while employing local women and refusing every chemical
            shortcut. No preservatives. No compromises. Just a mother&apos;s
            love in every jar.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {FACT_TILES.map((tile) => (
              <div
                key={tile.label}
                className="flex items-start gap-3 rounded-xl border border-white/12 bg-white/8 px-4 py-3"
              >
                <span className="text-xl">{tile.icon}</span>
                <div>
                  <p className="font-sans text-sm font-semibold text-white/90">
                    {tile.label}
                  </p>
                  <p className="mt-0.5 font-sans text-xs text-white/60">
                    {tile.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurStory;
