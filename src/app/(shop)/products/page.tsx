"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { cn } from "@/lib/utils";

interface ApiCategory {
  _id?: string;
  name: string;
  slug: string;
}

const SORT_OPTIONS = [
  { value: "featured", label: "Featured First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name A-Z" },
];

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-cp-border bg-white">
      <div className="h-[152px] animate-pulse bg-cp-cream-dark" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-cp-cream-dark" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-cp-cream-dark" />
        <div className="h-8 w-full animate-pulse rounded bg-cp-cream-dark" />
        <div className="flex justify-between">
          <div className="h-6 w-16 animate-pulse rounded bg-cp-cream-dark" />
          <div className="h-8 w-20 animate-pulse rounded bg-cp-cream-dark" />
        </div>
      </div>
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>(
    searchParams.get("category") || "all"
  );
  const [sort, setSort] = useState<string>("featured");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const params = new URLSearchParams({ sort, limit: "100" });
      if (category !== "all") params.set("category", category);
      try {
        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        if (active) setProducts(data.products || []);
      } catch {
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [category, sort]);

  return (
    <div className="bg-cp-cream py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="ALL PRODUCTS"
          title="The Complete Collection"
          subtitle="22 varieties of homemade pickles, masalas, and cold press oils — all without preservatives."
        />

        {/* Filter row */}
        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={cn(
                "rounded-full border px-4 py-1.5 font-sans text-sm font-semibold transition-colors",
                category === "all"
                  ? "border-cp-crimson bg-cp-crimson text-white"
                  : "border-cp-border bg-white text-cp-text hover:border-cp-crimson hover:text-cp-crimson"
              )}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCategory(c.slug)}
                className={cn(
                  "rounded-full border px-4 py-1.5 font-sans text-sm font-semibold transition-colors",
                  category === c.slug
                    ? "border-cp-crimson bg-cp-crimson text-white"
                    : "border-cp-border bg-white text-cp-text hover:border-cp-crimson hover:text-cp-crimson"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
            className="rounded-lg border border-cp-border bg-white px-4 py-2 font-sans text-sm text-cp-text focus:border-cp-crimson focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-4 font-sans text-sm text-cp-text-muted">
          {loading
            ? "Loading products…"
            : `Showing ${products.length} product${products.length === 1 ? "" : "s"}`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <span className="text-6xl">🫙</span>
            <p className="font-display text-xl font-bold text-cp-crimson">
              No products found
            </p>
            <p className="font-serif text-sm text-cp-text-muted">
              Try a different category or sort option.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cp-cream" />}>
      <ShopContent />
    </Suspense>
  );
}
