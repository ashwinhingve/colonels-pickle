'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Loader2 } from 'lucide-react';
import { GalleryLightbox, type LightboxMedia } from '@/components/gallery/GalleryLightbox';
import { staggerContainer, staggerItem } from '@/components/shared/variants';

interface GalleryItem extends LightboxMedia {
  _id: string;
  width?: number;
  height?: number;
  category: string;
}

type TypeFilter = 'all' | 'image' | 'video';

const LIMIT = 24;

export function GalleryClient() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [category, setCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Guards against out-of-order responses: if the filters change (or a new
  // page request starts) while an older request is still in flight, the
  // older response is ignored instead of clobbering newer state.
  const requestIdRef = useRef(0);

  const fetchPage = useCallback(
    async (pageNum: number, replace: boolean) => {
      const requestId = ++requestIdRef.current;
      try {
        const params = new URLSearchParams({ page: String(pageNum), limit: String(LIMIT) });
        if (typeFilter !== 'all') params.set('type', typeFilter);
        if (category !== 'all') params.set('category', category);

        const res = await fetch(`/api/gallery?${params.toString()}`);
        const data = await res.json();

        if (requestIdRef.current !== requestId) return; // superseded by a newer request

        setItems((prev) => (replace ? data.items : [...prev, ...data.items]));
        setHasMore(Boolean(data.hasMore));
        if (data.categories) setCategories(data.categories);
        setPage(pageNum);
      } finally {
        if (replace && requestIdRef.current === requestId) setLoading(false);
      }
    },
    [typeFilter, category]
  );

  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await fetchPage(page + 1, false);
    setLoadingMore(false);
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {(['all', 'image', 'video'] as TypeFilter[]).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-full px-4 py-1.5 font-sans text-sm font-semibold transition-colors ${
              typeFilter === t
                ? 'bg-cp-crimson text-white'
                : 'bg-white text-cp-text-secondary ring-1 ring-cp-border hover:ring-cp-crimson/50'
            }`}
          >
            {t === 'all' ? 'All' : t === 'image' ? 'Photos' : 'Videos'}
          </button>
        ))}
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory((prev) => (prev === c ? 'all' : c))}
            className={`rounded-full px-4 py-1.5 font-sans text-sm font-semibold transition-colors ${
              category === c
                ? 'bg-cp-saffron text-white'
                : 'bg-white text-cp-text-secondary ring-1 ring-cp-border hover:ring-cp-saffron/50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-cp-crimson" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-24 text-center font-serif text-cp-text-secondary">
          No media to show here yet — check back soon.
        </p>
      ) : (
        <>
          {/* CSS multi-column (not grid-cols) is deliberate here: the spec asks
              for a masonry layout, which needs items to flow into variable-height
              columns rather than the uniform rows a CSS grid would force. */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '100px' }}
            variants={staggerContainer(0.04)}
            className="columns-2 gap-3 md:columns-3 lg:columns-4"
          >
            {items.map((item, i) => (
              <motion.button
                key={item._id}
                variants={staggerItem}
                onClick={() => setLightboxIndex(i)}
                className="group relative mb-3 block w-full overflow-hidden rounded-xl bg-cp-cream-dark shadow-sm transition-shadow hover:shadow-lg"
                style={{ breakInside: 'avoid' }}
              >
                <div className="relative aspect-[4/5] w-full">
                  {item.type === 'video' && !item.posterUrl ? (
                    <div className="flex h-full w-full items-center justify-center bg-cp-brown-dark" />
                  ) : (
                    <Image
                      src={item.type === 'video' ? (item.posterUrl as string) : item.url}
                      alt={item.altText || item.title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading={i < 6 ? 'eager' : 'lazy'}
                      priority={i < 3}
                    />
                  )}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                        <Play className="ml-0.5 h-5 w-5 text-cp-crimson" />
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="truncate font-sans text-sm font-semibold text-white">{item.title}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="rounded-lg border border-cp-crimson px-6 py-2.5 font-sans text-sm font-bold uppercase tracking-wide text-cp-crimson transition-colors hover:bg-cp-crimson hover:text-white disabled:opacity-50"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}

      {lightboxIndex !== null && (
        <GalleryLightbox
          items={items}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}

export default GalleryClient;
