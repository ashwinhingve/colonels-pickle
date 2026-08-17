"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";
import { ProductGridSkeleton } from "@/components/shared/Skeleton";
import { NoResultsIllustration } from "@/components/illustrations";
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
                "rounded-full border px-4 py-1.5 font-sans text-sm font-semibold transition-all duration-200 hover:shadow-sm",
                category === "all"
                  ? "border-cp-crimson bg-cp-crimson text-white shadow-md"
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
                  "rounded-full border px-4 py-1.5 font-sans text-sm font-semibold transition-all duration-200 hover:shadow-sm",
                  category === c.slug
                    ? "border-cp-crimson bg-cp-crimson text-white shadow-md"
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
            className="rounded-lg border border-cp-border bg-white px-4 py-2 font-sans text-sm text-cp-text transition-all duration-200 focus:border-cp-crimson focus:outline-none focus:shadow-md"
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
          <ProductGridSkeleton count={8} />
        ) : products.length === 0 ? (
          <AnimatedSection direction="up" className="mt-16">
            <div className="flex flex-col items-center gap-6 text-center py-12">
              <div className="w-40 h-40">
                <NoResultsIllustration />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-cp-crimson mb-2">
                  No pickles found
                </p>
                <p className="font-serif text-base text-cp-text-muted mb-6">
                  Try a different category or sort option.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCategory("all");
                    setSort("featured");
                  }}
                  className="inline-block rounded-lg bg-cp-crimson px-6 py-2.5 font-sans text-sm font-bold text-white transition-all duration-200 hover:bg-cp-crimson-dark hover:shadow-md"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedSection direction="up" className="mt-6">
            <StaggerContainer>
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => (
                  <StaggerItem key={p._id}>
                    <ProductCard product={p} />
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </AnimatedSection>
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
