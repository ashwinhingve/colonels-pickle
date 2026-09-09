"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/common/Badge";
import { useCartStore } from "@/store/useCartStore";
import { WishlistButton } from "@/components/account/WishlistButton";
import { AnimatedPrice } from "@/components/shared/AnimatedPrice";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ProductTheme } from "@/lib/productTheme";

interface ProductPurchaseProps {
  product: any;
  theme: ProductTheme;
}

export function ProductPurchase({ product, theme }: ProductPurchaseProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const variants: any[] = Array.isArray(product?.variants)
    ? product.variants.filter((v: any) => v?.isActive !== false)
    : [];
  const fallback = [{ name: "1 pack", price: product?.price ?? 0 }];
  const list = variants.length > 0 ? variants : fallback;

  const [selected, setSelected] = useState(0);
  const current = list[Math.min(selected, list.length - 1)];

  const buildPayload = () => ({
    ...product,
    variantId: current.id,
    price: current.price,
    originalPrice: current.originalPrice,
  });

  const soldOut = (current?.stock ?? product?.stock ?? 0) <= 0;

  const handleAddToCart = () => {
    addItem(buildPayload(), 1);
    openCart();
  };

  const handleBuyNow = () => {
    addItem(buildPayload(), 1);
    router.push("/checkout");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {theme.badge ? (
          <Badge
            variant="product-badge"
            style={{ backgroundColor: theme.badgeColor || "#4B5D2A" }}
          >
            {theme.badge}
          </Badge>
        ) : null}
        <Badge variant="no-preservatives">No Preservatives ✓</Badge>
      </div>

      <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-cp-text md:text-[36px]">
        {product?.name}
      </h1>
      {theme.nameHindi ? (
        <p className="mt-1 font-sans text-lg font-semibold text-cp-text-muted">
          {theme.nameHindi}
        </p>
      ) : null}
      {product?.shortDescription ? (
        <p className="mt-1 font-serif text-base italic text-cp-text-muted">
          {product.shortDescription}
        </p>
      ) : null}

      <hr className="my-6 border-cp-border" />

      {/* Variant selector */}
      <p className="mb-2 font-sans text-[11px] font-bold uppercase tracking-widest text-cp-crimson">
        Select Size
      </p>
      <div className="flex flex-wrap gap-2">
        {list.map((v, i) => {
          const active = i === Math.min(selected, list.length - 1);
          const variantOos = (v?.stock ?? 0) <= 0;
          return (
            <button
              key={v.name}
              type="button"
              disabled={variantOos}
              aria-pressed={active && !variantOos}
              onClick={() => !variantOos && setSelected(i)}
              className={cn(
                "rounded-lg border-[1.5px] px-4 py-2 font-sans text-sm font-semibold transition-all active:scale-95",
                variantOos
                  ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
                  : active
                    ? "border-cp-crimson bg-cp-crimson text-white shadow-sm"
                    : "border-cp-border bg-white text-cp-text hover:border-cp-crimson hover:text-cp-crimson"
              )}
            >
              {v.name} — ₹{Number(v.price).toLocaleString("en-IN")}
              {variantOos && " (OOS)"}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-sans text-[28px] font-extrabold text-cp-crimson">
          <AnimatedPrice value={Number(current.price)} />
        </span>
        <span className="font-sans text-sm text-cp-text-muted">
          per {current.name}
        </span>
      </div>

      {soldOut && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-center font-sans text-sm font-semibold text-red-700">
          Out of Stock
        </div>
      )}

      <div className="mt-6 space-y-3">
        <button
          type="button"
          disabled={soldOut}
          onClick={handleAddToCart}
          className={cn(
            "btn-sheen w-full rounded-lg px-6 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-white transition-all active:scale-[0.98]",
            soldOut
              ? "cursor-not-allowed bg-gray-400"
              : "bg-cp-crimson hover:bg-cp-crimson-dark"
          )}
        >
          Add to Cart
        </button>
        <button
          type="button"
          disabled={soldOut}
          onClick={handleBuyNow}
          className={cn(
            "btn-sheen group w-full rounded-lg px-6 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-white shadow-md transition-all active:scale-[0.98]",
            soldOut
              ? "cursor-not-allowed bg-gray-400"
              : "bg-gradient-to-br from-cp-saffron to-cp-saffron-bright hover:-translate-y-0.5 hover:shadow-lg"
          )}
        >
          <span className="inline-flex items-center justify-center gap-2">
            Buy Now
            <span
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </span>
        </button>
        {product?._id ? (
          <WishlistButton
            productId={product._id}
            variant="button"
            showLabel
            className="w-full justify-center py-3.5 text-sm font-bold uppercase tracking-wide"
            ariaLabel="Save to wishlist"
          />
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-sans text-xs text-cp-text-muted">
        <span>No Preservatives ✓</span>
        <span>FSSAI: {BRAND.fssai}</span>
        <span>Pan India Delivery</span>
      </div>
    </div>
  );
}

export default ProductPurchase;
