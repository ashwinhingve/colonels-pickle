'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from '@/components/shared/variants';

export interface HeroPoolItem {
  type: 'image' | 'video';
  url: string;
  posterUrl?: string;
  title?: string;
  altText?: string;
}

interface PanelConfig {
  className: string;
  floatDelayClass: string;
  rotateClass: string;
  sizes: string;
}

// Card A (primary, largest), B (top-left), C (bottom-left), D (bottom-right accent) —
// matches the original static collage's positions/sizes exactly.
const PANEL_CONFIG: PanelConfig[] = [
  {
    className:
      'absolute right-[20px] top-[40px] z-[3] h-[300px] w-[260px] overflow-hidden rounded-2xl border-[3px] border-cp-beige/30 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-[0_28px_72px_rgba(0,0,0,0.45)]',
    floatDelayClass: 'animate-float',
    rotateClass: 'rotate-[2deg]',
    sizes: '260px',
  },
  {
    className:
      'absolute left-[20px] top-0 z-[2] h-[200px] w-[180px] overflow-hidden rounded-2xl border-[3px] border-cp-beige/30 shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition-[transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-[0_22px_52px_rgba(0,0,0,0.36)]',
    floatDelayClass: 'animate-float animation-delay-500',
    rotateClass: '-rotate-[3deg]',
    sizes: '180px',
  },
  {
    className:
      'absolute bottom-[60px] left-0 z-[2] h-[180px] w-[200px] overflow-hidden rounded-2xl border-[3px] border-cp-beige/30 shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition-[transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-[0_22px_52px_rgba(0,0,0,0.36)]',
    floatDelayClass: 'animate-float animation-delay-1000',
    rotateClass: 'rotate-[1.5deg]',
    sizes: '200px',
  },
  {
    className:
      'absolute bottom-[20px] right-[60px] z-[1] h-[160px] w-[150px] overflow-hidden rounded-2xl border-[3px] border-cp-beige/30 shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition-[transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-[0_18px_42px_rgba(0,0,0,0.32)]',
    floatDelayClass: 'animate-float animation-delay-1500',
    rotateClass: '-rotate-[2deg]',
    sizes: '150px',
  },
];

const PANEL_COUNT = 4;
const ROTATE_INTERVAL_MS = 4000;
const STAGGER_MS = 1000;

export function StaggeredHeroPanels({ pool }: { pool: HeroPoolItem[] }) {
  const [indices, setIndices] = useState<number[]>(() =>
    Array.from({ length: PANEL_COUNT }, (_, i) => i % pool.length)
  );
  const poolRef = useRef(pool);
  poolRef.current = pool;

  useEffect(() => {
    if (pool.length <= 1) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    for (let panel = 0; panel < PANEL_COUNT; panel++) {
      const advance = () => {
        setIndices((prev) => {
          const next = [...prev];
          next[panel] = (next[panel] + 1) % poolRef.current.length;
          return next;
        });
      };

      const timeout = setTimeout(() => {
        advance();
        intervals.push(setInterval(advance, ROTATE_INTERVAL_MS));
      }, panel * STAGGER_MS);

      timeouts.push(timeout);
    }

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [pool.length]);

  return (
    <div className="relative hidden h-[500px] lg:block">
      {/* warm glow behind collage */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(212,160,23,0.18) 0%, transparent 70%)',
        }}
      />

      {PANEL_CONFIG.map((config, panel) => {
        const item = pool[indices[panel] % pool.length];
        if (!item) return null;

        return (
          <div key={panel} className={`${config.floatDelayClass} ${config.className}`}>
            <div className={`relative h-full w-full ${config.rotateClass}`}>
              <AnimatePresence>
                <motion.div
                  key={`${panel}-${indices[panel]}`}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="absolute inset-0"
                >
                  {item.type === 'video' ? (
                    <video
                      src={item.url}
                      poster={item.posterUrl}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.url}
                      alt={item.altText || item.title || "Colonel's Pickle"}
                      fill
                      sizes={config.sizes}
                      className="object-cover"
                      priority={panel === 0}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        );
      })}

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
  );
}

export default StaggeredHeroPanels;
