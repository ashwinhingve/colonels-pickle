"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/common/Badge";
import { RajasthaniPattern } from "@/components/common/RajasthaniPattern";
import { VariantSelector } from "@/components/common/VariantSelector";
import { useCartStore } from "@/store/useCartStore";
import { getProductTheme } from "@/lib/productTheme";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: any;
  /** Optional override; defaults to the cart store's addItem. */
  addToCart?: (product: any) => void;
  /** Retained for backward compatibility with existing call sites. */
  showSaleBadge?: boolean;
}

interface CardVariant {
  label: string;
  price: number;
  originalPrice?: number;
}

/** Parse a weight/volume label (e.g. "500g", "1kg", "250ml", "1L") into a base quantity. */
function parseUnitQty(label: string): { qty: number; unit: "g" | "ml" } | null {
  if (!label) return null;
  const m = String(label).trim().match(/([\d.]+)\s*(kg|g|ml|ltr|litre|l)\b/i);
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (!isFinite(n) || n <= 0) return null;
  const u = m[2].toLowerCase();
  if (u === "kg") return { qty: n * 1000, unit: "g" };
  if (u === "g") return { qty: n, unit: "g" };
  if (u === "ml") return { qty: n, unit: "ml" };
  return { qty: n * 1000, unit: "ml" }; // l / ltr / litre
}

export function ProductCard({ product, addToCart }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const theme = getProductTheme(product?.slug);

  const primaryImg =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images[0]
      : null;

  const variants: CardVariant[] = useMemo(() => {
    const active = Array.isArray(product?.variants)
      ? product.variants.filter((v: any) => v?.isActive !== false)
      : [];
    if (active.length > 0) {
      return active.map((v: any) => ({
        label: v.name,
        price: v.price,
        originalPrice: v.originalPrice,
      }));
    }
    const weight = product?.weight
      ? `${product.weight}${product.weightUnit || "g"}`
      : "1 pack";
    return [
      {
        label: weight,
        price: product?.price ?? 0,
        originalPrice: product?.originalPrice,
      },
    ];
  }, [product]);

  const safeIndex = Math.min(selectedVariant, variants.length - 1);
  const current = variants[safeIndex];

  // Value framing: per-100 unit price + which variant is cheapest per unit.
  const unitInfo = useMemo(() => {
    const p = parseUnitQty(current?.label);
    if (!p || !current?.price) return null;
    const per100 = (Number(current.price) / p.qty) * 100;
    return `≈ ₹${Math.round(per100).toLocaleString("en-IN")} / 100${p.unit}`;
  }, [current]);

  const bestValueIndex = useMemo(() => {
    let best = -1;
    let bestPer = Infinity;
    variants.forEach((v, i) => {
      const p = parseUnitQty(v.label);
      if (!p || !v.price) return;
      const per = Number(v.price) / p.qty;
      if (per < bestPer - 1e-9) {
        bestPer = per;
        best = i;
      }
    });
    return best;
  }, [variants]);

  const isBestValue = variants.length > 1 && safeIndex === bestValueIndex;

  const badgeLabel: string | undefined =
    theme.badge ||
    (product?.isBestseller
      ? "Bestseller"
      : product?.isTrending
        ? "Trending"
        : product?.isFeatured
          ? "Featured"
          : undefined);

  const handleAdd = () => {
    const payload = {
      ...product,
      variantId: current.label,
      price: current.price,
      originalPrice: current.originalPrice,
    };
    if (addToCart) {
      addToCart(payload);
    } else {
      addItem(payload, 1);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const href = `/products/${product?.slug ?? ""}`;
  const subtitle = product?.shortDescription || product?.subtitle || "";

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-cp-border bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(0,0,0,0.13)]">
      <Link href={href} className="block" aria-label={product?.name}>
        <div
          className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${theme.themeColor}, ${theme.themeColor}CC)`,
          }}
        >
          <RajasthaniPattern variant="jali" opacity={0.07} color="#ffffff" />

          {badgeLabel ? (
            <Badge
              variant="product-badge"
              className="absolute left-[10px] top-[10px] z-[2]"
              style={{ backgroundColor: theme.badgeColor || "#4B5D2A" }}
            >
              {badgeLabel}
            </Badge>
          ) : null}

          {primaryImg ? (
            <>
              <Image
                src={primaryImg.url}
                alt={`${product?.name ?? "Product"} - Colonel's Pickle`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-x-0 bottom-0 z-[1] h-16 bg-gradient-to-t from-black/40 to-transparent" />
            </>
          ) : (
            <span
              className="relative z-[1] select-none text-[58px]"
              style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.22))" }}
            >
              {theme.icon}
            </span>
          )}

          {isBestValue ? (
            <span className="absolute right-[10px] top-[10px] z-[2] rounded-full bg-cp-gold px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wide text-cp-text shadow-md">
              ★ Best Value
            </span>
          ) : null}

          <Badge
            variant="no-preservatives"
            className="absolute bottom-[9px] right-[9px] z-[2]"
          >
            No Preservatives ✓
          </Badge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-4 pb-[18px] pt-[15px]">
        <Link href={href}>
          <h3 className="mb-[3px] line-clamp-2 font-display text-[15.5px] font-bold leading-tight text-cp-text transition-colors group-hover:text-cp-crimson">
            {product?.name}
          </h3>
        </Link>

        {(theme.nameHindi || subtitle) && (
          <p className="mb-[9px] font-sans text-[11.5px] text-cp-text-muted">
            {[theme.nameHindi, subtitle].filter(Boolean).join(" · ")}
          </p>
        )}

        {subtitle ? (
          <p className="mb-[14px] line-clamp-3 flex-1 font-serif text-[12.5px] leading-[1.65] text-[#57534E]">
            {product?.description || subtitle}
          </p>
        ) : (
          <div className="mb-[14px] flex-1" />
        )}

        <div className="mb-[7px] font-sans text-[10px] font-bold uppercase tracking-[0.07em] text-cp-text-muted">
          Select Size
        </div>
        <VariantSelector
          variants={variants.map((v) => ({ label: v.label }))}
          selectedIndex={safeIndex}
          onChange={setSelectedVariant}
          className="mb-[15px]"
        />

        <div className="mt-auto flex items-center justify-between">
          <div>
            <div className="font-sans text-[22px] font-extrabold leading-none text-cp-crimson">
              ₹{Number(current.price).toLocaleString("en-IN")}
            </div>
            <div className="mt-px font-sans text-[10.5px] text-cp-text-muted">
              for {current.label}
              {unitInfo ? (
                <span className="text-cp-text-light"> · {unitInfo}</span>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              "whitespace-nowrap rounded-lg border-2 px-[17px] py-[9px] font-sans text-[13px] font-bold leading-none text-white transition-[background-color,border-color,transform]",
              added
                ? "border-cp-green bg-cp-green"
                : "border-cp-crimson bg-cp-crimson hover:-translate-y-px hover:border-cp-crimson-dark hover:bg-cp-crimson-dark"
            )}
          >
            {added ? "✓ Added" : "+ Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
