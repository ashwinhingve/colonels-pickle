"use client";

import Image from "next/image";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { SpiceScatter, CornerFlourish } from "@/components/illustrations";

const FACT_TILES = [
  { icon: "👩‍🍳", label: "Women Empowerment", sub: "Creating local employment" },
  { icon: "🛡️", label: "FSSAI Licensed", sub: "License: 12226026000060" },
  { icon: "🌿", label: "No Preservatives, No Vinegar", sub: "100% natural, always" },
  { icon: "📍", label: "Jaipur & Bahadurgarh", sub: "Our two family hubs" },
];

export function OurStory() {
  return (
    <section
      className="relative overflow-hidden py-20"
      style={{
        background: "linear-gradient(135deg, #2A2417 0%, #3A4A1F 100%)",
      }}
    >
      {/* Decorative elements */}
      <SpiceScatter
        aria-hidden
        className="pointer-events-none absolute left-8 top-12 h-16 w-16 opacity-10"
      />
      <CornerFlourish
        aria-hidden
        className="pointer-events-none absolute right-12 bottom-16 h-14 w-14 opacity-12"
      />

      <div className="absolute inset-y-0 right-0 w-1/2">
        <RajasthaniPattern variant="jali" opacity={0.05} color="#F5EBDA" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
        {/* LEFT — story card */}
        <div className="relative rounded-2xl bg-white/5 p-10">
          <span
            className="absolute left-0 top-0 h-12 w-12 rounded-tl-2xl border-l-2 border-t-2"
            style={{ borderColor: "#D4A017" }}
          />
          <span
            className="absolute bottom-0 right-0 h-12 w-12 rounded-br-2xl border-b-2 border-r-2"
            style={{ borderColor: "#C05621" }}
          />

          <div className="text-center">
            <Image
              src="/logo.png"
              width={100}
              height={100}
              className="mx-auto object-contain"
              alt="Colonel's Pickle"
            />
            <div className="mx-auto my-3 h-[2px] w-16 bg-cp-terracotta" />
            <p className="font-display text-[18px] font-bold text-cp-gold-light">
              An Indian Army Colonel
            </p>
            <p className="mt-1 font-hindi text-[12px] text-cp-beige/60">
              Battle Casualty · War-Wounded Soldier
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-white/15 bg-white/[0.06] p-6">
            <p className="font-serif text-lg italic leading-relaxed text-cp-beige/85">
              &ldquo;In every jar lives the courage of a soldier, the warmth of
              an Army home, and the irreplaceable touch of a mother&apos;s
              love.&rdquo;
            </p>
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <div className="text-center">
              <p className="font-display text-xl font-bold text-cp-gold-light">22+</p>
              <p className="font-hindi text-[10px] text-cp-beige/50">Products</p>
            </div>
            <div className="text-center">
              <p className="font-display text-xl font-bold text-cp-gold-light">Pan India</p>
              <p className="font-hindi text-[10px] text-cp-beige/50">Delivery</p>
            </div>
            <div className="text-center">
              <p className="font-display text-xl font-bold text-cp-gold-light">FSSAI</p>
              <p className="font-hindi text-[10px] text-cp-beige/50">Licensed</p>
            </div>
          </div>
        </div>

        {/* RIGHT — story text */}
        <div>
          <p className="font-hindi text-xs font-bold uppercase tracking-widest text-cp-terracotta">
            The Story Behind Every Jar
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-cp-beige md:text-4xl">
            Born from{" "}
            <span className="italic text-cp-gold-light">Valor</span>, Seasoned
            with <span className="italic text-cp-gold-light">Honour</span>
          </h2>

          <p className="mt-5 font-serif text-[15px] leading-relaxed text-cp-beige/75">
            After a high-risk ammunition-disposal operation in Assam left him a
            war-wounded soldier, an Indian Army Colonel spent three months
            recovering on bland hospital food — and understood a simple truth:
            true healing comes from the comforting, soul-nourishing flavours of
            home.
          </p>
          <p className="mt-4 font-serif text-[15px] leading-relaxed text-cp-beige/75">
            During the COVID lockdown, posted at a military cantonment, he and
            his mother Urmila Devi — a resilient officer&apos;s mother from
            Haryana — turned to their kitchen garden and time-tested family
            recipes, sun-drying and hand-grinding 24 whole spices into their
            signature &ldquo;Colonel Special&rdquo; masala. The jars they gifted
            across the cantonment tasted, to every homesick officer, exactly like
            home.
          </p>
          <p className="mt-4 font-serif text-[15px] leading-relaxed text-cp-beige/75">
            Named after the family&apos;s three daughters, Ridhwika Agro Organics
            now carries that recipe pan-India — empowering local women and
            staying 100% natural: no preservatives, no chemicals, no vinegar.
            Ever.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {FACT_TILES.map((tile) => (
              <div
                key={tile.label}
                className="flex items-start gap-3 rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3"
              >
                <span className="text-xl">{tile.icon}</span>
                <div>
                  <p className="font-sans text-sm font-semibold text-cp-beige/90">
                    {tile.label}
                  </p>
                  <p className="mt-0.5 font-sans text-xs text-cp-beige/60">
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
