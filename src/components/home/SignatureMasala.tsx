"use client";

import { SectionHeader } from "@/components/common/SectionHeader";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { SpiceBowlIllustration, SpiceScatter } from "@/components/illustrations";

/**
 * Signature homepage moment — the "Colonel Special" masala. A central emblem
 * with the hand-ground spice bowl, flanked by a wrap of the whole spices that
 * cascade in and lift on hover. Wording deliberately mirrors the Our Story
 * section ("22 to 24 whole spices") — do not turn this into a bare "24" claim.
 */
const SPICES: { en: string; hi: string }[] = [
  { en: "Mustard", hi: "राई" },
  { en: "Fenugreek", hi: "मेथी" },
  { en: "Fennel", hi: "सौंफ" },
  { en: "Nigella", hi: "कलौंजी" },
  { en: "Cumin", hi: "जीरा" },
  { en: "Coriander", hi: "धनिया" },
  { en: "Turmeric", hi: "हल्दी" },
  { en: "Red Chilli", hi: "लाल मिर्च" },
  { en: "Asafoetida", hi: "हींग" },
  { en: "Carom", hi: "अजवाइन" },
  { en: "Black Pepper", hi: "काली मिर्च" },
  { en: "Clove", hi: "लौंग" },
  { en: "Cinnamon", hi: "दालचीनी" },
  { en: "Cardamom", hi: "इलायची" },
  { en: "Bay Leaf", hi: "तेज पत्ता" },
  { en: "Star Anise", hi: "चक्र फूल" },
  { en: "Dry Mango", hi: "अमचूर" },
  { en: "Rock Salt", hi: "सेंधा नमक" },
  { en: "Black Salt", hi: "काला नमक" },
  { en: "Mace", hi: "जावित्री" },
];

export function SignatureMasala() {
  return (
    <section className="relative overflow-hidden bg-cp-cream-muted py-14 md:py-20">
      <SpiceScatter
        aria-hidden
        className="pointer-events-none absolute right-6 top-10 h-16 w-16 opacity-[0.08]"
      />
      <SpiceScatter
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-6 h-14 w-14 rotate-45 opacity-[0.07]"
      />

      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="THE SECRET BLEND"
          title="The Colonel Special Masala"
          subtitle="A blend of 22 to 24 whole spices — sun-dried, roasted and hand-ground to the family's own recipe. This is the soul of every jar."
        />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,340px)_1fr]">
          {/* Emblem */}
          <AnimatedSection direction="up">
            <div className="relative mx-auto flex max-w-[340px] flex-col items-center rounded-3xl bg-gradient-to-br from-cp-olive to-cp-olive-deep p-8 text-center shadow-xl">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-cp-cream/95 ring-4 ring-cp-gold/50">
                <SpiceBowlIllustration className="h-16 w-16" aria-hidden />
              </div>
              <p className="mt-5 font-hindi text-[11px] font-bold uppercase tracking-[0.25em] text-cp-gold-light">
                Colonel Special
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold text-cp-beige">
                22–24 Whole Spices
              </p>
              <p className="mt-3 font-serif text-sm italic leading-relaxed text-cp-beige/75">
                No two blends alike — ground fresh in small batches, never
                store-bought powder.
              </p>
            </div>
          </AnimatedSection>

          {/* Spice chips */}
          <StaggerContainer
            staggerDelay={0.04}
            className="flex flex-wrap justify-center gap-2.5 lg:justify-start"
          >
            {SPICES.map((s) => (
              <StaggerItem key={s.en}>
                <span className="group inline-flex cursor-default items-center gap-2 rounded-full border border-cp-border bg-white px-4 py-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cp-terracotta/50 hover:shadow-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-cp-terracotta transition-transform duration-300 group-hover:scale-150" />
                  <span className="font-sans text-sm font-semibold text-cp-text">
                    {s.en}
                  </span>
                  <span className="font-hindi text-xs text-cp-text-muted">
                    {s.hi}
                  </span>
                </span>
              </StaggerItem>
            ))}
            <StaggerItem>
              <span className="inline-flex items-center rounded-full bg-cp-olive px-4 py-2 font-sans text-sm font-bold text-cp-beige shadow-sm">
                & more…
              </span>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

export default SignatureMasala;
