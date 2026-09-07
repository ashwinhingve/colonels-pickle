"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, Trash2 } from "lucide-react";

import { useCartStore, cartItemKey } from "@/store/useCartStore";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import { EmptyCartIllustration } from "@/components/illustrations";
import { AnimatedPrice } from "@/components/shared/AnimatedPrice";
import { getProductTheme } from "@/lib/productTheme";

/** First usable image URL from a cart item's images array, or null. */
function firstImageUrl(images: (string | { url: string })[] | undefined): string | null {
  const first = Array.isArray(images) ? images[0] : null;
  if (!first) return null;
  return typeof first === "string" ? first : first?.url || null;
}

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const subtotal = useCartStore((s) => s.getTotalPrice());

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 z-[59] bg-black/40"
          />
          <motion.aside
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            aria-label="Shopping cart"
            className="fixed right-0 top-0 z-[60] flex h-screen w-[380px] max-w-full flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cp-border px-5 py-4">
              <h2 className="font-display text-lg font-extrabold text-cp-text">
                Your Cart
                <span className="ml-2 font-sans text-sm font-medium text-cp-text-muted">
                  ({items.length})
                </span>
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full text-cp-text-muted transition-colors hover:bg-cp-cream hover:text-cp-crimson"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="w-32 h-32">
                  <EmptyCartIllustration />
                </div>
                <p className="font-display text-base font-bold text-cp-text">
                  Your cart is empty
                </p>
                <p className="font-serif text-sm text-cp-text-muted">
                  Add some homemade goodness to get started.
                </p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="mt-2 rounded-lg bg-cp-crimson px-5 py-2.5 font-sans text-sm font-bold text-white transition-all duration-200 hover:bg-cp-crimson-dark hover:shadow-md"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => {
                    const key = cartItemKey(
                      item.product.id,
                      item.product.variantId
                    );
                    const theme = getProductTheme(item.product.slug);
                    const lineTotal = item.product.price * item.quantity;
                    const imgUrl = firstImageUrl(item.product.images);
                    return (
                      <motion.div
                        key={key}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-3 border-b border-cp-border py-4 last:border-0"
                      >
                      <span
                        className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg text-xl"
                        style={{ backgroundColor: theme.themeColor }}
                      >
                        {imgUrl ? (
                          <Image
                            src={imgUrl}
                            alt={item.product.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-white">{theme.icon}</span>
                        )}
                      </span>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-display text-sm font-bold leading-tight text-cp-text">
                            {item.product.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeItem(key)}
                            aria-label={`Remove ${item.product.name}`}
                            className="text-cp-text-light transition-colors hover:text-cp-crimson"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {item.product.variantId && (
                          <p className="font-sans text-xs text-cp-text-muted">
                            {item.product.variantId}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                updateQuantity(key, item.quantity - 1)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-cp-border text-cp-text transition-all hover:border-cp-crimson hover:text-cp-crimson active:scale-90"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center font-sans text-sm font-bold text-cp-text">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                updateQuantity(key, item.quantity + 1)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-cp-border text-cp-text transition-all hover:border-cp-crimson hover:text-cp-crimson active:scale-90"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="font-sans text-sm font-extrabold text-cp-crimson">
                            <AnimatedPrice value={lineTotal} />
                          </span>
                        </div>
                      </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-cp-border px-5 py-4">
                {/* Free-delivery progress */}
                <div className="mb-3">
                  {remaining > 0 ? (
                    <p className="mb-1.5 text-center font-sans text-xs font-medium text-cp-brown-dark">
                      Add{" "}
                      <span className="font-bold text-cp-terracotta">
                        ₹{remaining.toLocaleString("en-IN")}
                      </span>{" "}
                      more for free delivery
                    </p>
                  ) : (
                    <p className="mb-1.5 text-center font-sans text-xs font-bold text-cp-green">
                      🎉 You&apos;ve unlocked free delivery!
                    </p>
                  )}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-cp-cream-dark">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cp-olive to-cp-gold transition-[width] duration-500 ease-out"
                      style={{
                        width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-sans text-sm text-cp-text-muted">
                    Subtotal
                  </span>
                  <span className="font-sans text-lg font-extrabold text-cp-text">
                    <AnimatedPrice value={subtotal} />
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-sheen group block rounded-lg bg-gradient-to-br from-cp-saffron to-cp-saffron-bright px-5 py-3 text-center font-sans text-sm font-bold uppercase tracking-wide text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    Proceed to Checkout
                    <span
                      className="transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-2 w-full rounded-lg border-2 border-cp-crimson px-5 py-2.5 font-sans text-sm font-bold text-cp-crimson transition-colors hover:bg-cp-crimson hover:text-white"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
