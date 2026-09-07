"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/common/Badge";
import { useCartStore } from "@/store/useCartStore";
import { WishlistButton } from "@/components/account/WishlistButton";
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
    variantId: current.name,
    price: current.price,
    originalPrice: current.originalPrice,
  });

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
          return (
            <button
              key={v.name}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(i)}
              className={cn(
                "rounded-lg border-[1.5px] px-4 py-2 font-sans text-sm font-semibold transition-colors",
                active
                  ? "border-cp-crimson bg-cp-crimson text-white"
                  : "border-cp-border bg-white text-cp-text hover:border-cp-crimson hover:text-cp-crimson"
              )}
            >
              {v.name} — ₹{Number(v.price).toLocaleString("en-IN")}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <span className="font-sans text-[28px] font-extrabold text-cp-crimson">
          ₹{Number(current.price).toLocaleString("en-IN")}
        </span>
        <span className="ml-2 font-sans text-sm text-cp-text-muted">
          per {current.name}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full rounded-lg bg-cp-crimson px-6 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-cp-crimson-dark"
        >
          Add to Cart
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="w-full rounded-lg bg-gradient-to-br from-cp-saffron to-cp-saffron-bright px-6 py-3.5 font-sans text-sm font-bold uppercase tracking-wide text-white transition-transform hover:-translate-y-px"
        >
          Buy Now
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
