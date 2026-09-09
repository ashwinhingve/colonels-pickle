'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { PickleJarIllustration, HeritageEmblemIllustration } from '@/components/illustrations';
import { EASE } from '@/components/shared/variants';
import type { HeroPoolItem } from '@/components/home/StaggeredHeroPanels';

const CHIP_ROTATION_INTERVAL_MS = 5000;
const CHIP_STAGGER_MS = 2500;

interface HeroJarVisualProps {
  pool: HeroPoolItem[];
  /** Admin-designated framed photo (mother + Colonel) shown inside the arch.
   *  When absent, the arch shows the illustrated figures fallback. */
  portraitUrl?: string;
  portraitAlt?: string;
}

export function HeroJarVisual({ pool, portraitUrl, portraitAlt }: HeroJarVisualProps) {
  const [chipIndices, setChipIndices] = useState<number[]>(() => [0, Math.min(1, pool.length - 1)]);
  const poolLengthRef = useRef(pool.length);

  useEffect(() => {
    poolLengthRef.current = pool.length;
  }, [pool.length]);

  useEffect(() => {
    if (pool.length <= 1) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    // Chip 0 (top-left)
    const advance0 = () => {
      setChipIndices((prev) => {
        const nextIdx = (prev[0] + 1) % poolLengthRef.current;
        return [nextIdx, prev[1]];
      });
    };

    // Chip 1 (bottom-right)
    const advance1 = () => {
      setChipIndices((prev) => {
        const nextIdx = (prev[1] + 1) % poolLengthRef.current;
        return [prev[0], nextIdx];
      });
    };

    // Stagger the two chips
    const timeout0 = setTimeout(() => {
      advance0();
      intervals.push(setInterval(advance0, CHIP_ROTATION_INTERVAL_MS));
    }, 0);

    const timeout1 = setTimeout(() => {
      advance1();
      intervals.push(setInterval(advance1, CHIP_ROTATION_INTERVAL_MS));
    }, CHIP_STAGGER_MS);

    timeouts.push(timeout0, timeout1);

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [pool.length]);

  const chip0Item = pool[chipIndices[0] % pool.length];
  const chip1Item = pool[chipIndices[1] % pool.length];

  return (
    <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none">
      {/* Warm radial glow behind everything */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212,160,23,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative flex h-[460px] w-full flex-col items-center justify-center sm:h-[500px]">
        {/* CHIP 0: top-left */}
        <AnimatePresence mode="wait">
          {chip0Item && (
            <motion.div
              key={`chip0-${chipIndices[0]}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute left-2 top-6 z-20 h-16 w-16 overflow-hidden rounded-full border-2 border-cp-gold/60 shadow-[0_8px_24px_rgba(0,0,0,0.3)] sm:left-6 sm:h-20 sm:w-20"
            >
              {chip0Item.type === 'video' ? (
                <video
                  src={chip0Item.url}
                  poster={chip0Item.posterUrl}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="h-full w-full animate-kenburns object-cover"
                />
              ) : (
                <Image
                  src={chip0Item.url}
                  alt={chip0Item.altText || chip0Item.title || "Colonel's Pickle"}
                  fill
                  sizes="80px"
                  className="animate-kenburns object-cover"
                  priority
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CHIP 1: bottom-right */}
        <AnimatePresence mode="wait">
          {chip1Item && (
            <motion.div
              key={`chip1-${chipIndices[1]}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute bottom-10 right-2 z-20 h-20 w-20 overflow-hidden rounded-full border-2 border-cp-gold/60 shadow-[0_8px_24px_rgba(0,0,0,0.3)] sm:right-6 sm:h-24 sm:w-24"
            >
              {chip1Item.type === 'video' ? (
                <video
                  src={chip1Item.url}
                  poster={chip1Item.posterUrl}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="h-full w-full animate-kenburns-alt object-cover"
                />
              ) : (
                <Image
                  src={chip1Item.url}
                  alt={chip1Item.altText || chip1Item.title || "Colonel's Pickle"}
                  fill
                  sizes="96px"
                  className="animate-kenburns-alt object-cover"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CENTER COMPOSITION: Heritage Emblem stacked above the Pickle Jar */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Heritage Emblem + tagline overlay */}
          <div className="relative">
            <HeritageEmblemIllustration
              imageUrl={portraitUrl}
              title={portraitAlt}
              className="h-[230px] w-[260px] text-cp-olive sm:h-[260px] sm:w-[300px] lg:h-[290px] lg:w-[330px]"
            />
            {/* Tagline overlay on the emblem's blank middle band (upper-third).
                Over a real photo it turns white with a shadow for legibility. */}
            <p
              className={`absolute left-1/2 top-[38%] w-[80%] -translate-x-1/2 -translate-y-1/2 text-center font-hindi text-base font-bold leading-tight sm:text-lg lg:text-xl ${
                portraitUrl
                  ? 'text-cp-beige [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]'
                  : 'text-cp-olive'
              }`}
            >
              माँ का प्यार,
              <br />
              घर का अचार
            </p>
          </div>

          {/* Pickle Jar — tucked just under the arch base so only the lid overlaps */}
          <div className="-mt-12 sm:-mt-14 lg:-mt-16">
            <PickleJarIllustration
              className="h-[170px] w-[170px] drop-shadow-[0_16px_24px_rgba(0,0,0,0.35)] sm:h-[200px] sm:w-[200px] lg:h-[230px] lg:w-[230px]"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroJarVisual;
