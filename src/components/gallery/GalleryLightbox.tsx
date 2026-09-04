'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { fadeIn, scaleIn } from '@/components/shared/variants';

export interface LightboxMedia {
  type: 'image' | 'video';
  url: string;
  posterUrl?: string;
  title: string;
  caption?: string;
  altText?: string;
}

interface GalleryLightboxProps {
  items: LightboxMedia[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({ items, index, onClose, onNavigate }: GalleryLightboxProps) {
  const current = items[index];

  const goPrev = useCallback(
    () => onNavigate((index - 1 + items.length) % items.length),
    [index, items.length, onNavigate]
  );
  const goNext = useCallback(
    () => onNavigate((index + 1) % items.length),
    [index, items.length, onNavigate]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Let a focused <video>'s native seek/volume shortcuts work without
      // also navigating the lightbox out from under it.
      if ((e.target as HTMLElement | null)?.tagName === 'VIDEO') return;

      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, goPrev, goNext]);

  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={fadeIn}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 transition-colors hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="h-6 w-6 text-gray-700" />
        </button>

        {items.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 transition-colors hover:bg-white md:left-6"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 transition-colors hover:bg-white md:right-6"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </>
        )}

        <motion.div
          key={`media-${index}`}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={scaleIn}
          className="relative flex max-h-[85vh] w-full max-w-5xl flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {current.type === 'video' ? (
            <video
              src={current.url}
              poster={current.posterUrl}
              controls
              autoPlay
              className="max-h-[75vh] w-full rounded-lg bg-black"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="relative aspect-square w-full max-h-[75vh]">
              <Image
                src={current.url}
                alt={current.altText || current.title}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          )}

          {(current.title || current.caption) && (
            <div className="mt-4 max-w-2xl text-center text-cp-beige">
              {current.title && <p className="font-display text-lg font-semibold">{current.title}</p>}
              {current.caption && <p className="mt-1 font-serif text-sm text-cp-beige/80">{current.caption}</p>}
            </div>
          )}

          {items.length > 1 && (
            <p className="mt-2 font-sans text-xs text-cp-beige/60">
              {index + 1} / {items.length}
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default GalleryLightbox;
