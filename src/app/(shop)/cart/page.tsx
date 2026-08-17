"use client"

import React, { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useCartStore, cartItemKey } from "@/store/useCartStore"
import type { AppliedDiscount } from "@/store/useCartStore"
import { FREE_DELIVERY_THRESHOLD, STANDARD_SHIPPING_COST } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection"
import { EmptyCartIllustration, DeliveryTruckIllustration } from "@/components/illustrations"
import {
  Trash2, Plus, Minus, ArrowRight, Package,
  Tag, X, CheckCircle, Loader2, Gift,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function CartPage() {
  const { data: session } = useSession()
  const {
    items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart,
    discount, setDiscount, clearDiscount, getDiscountAmount,
  } = useCartStore()

  const [couponInput, setCouponInput] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState("")
  const [autoChecking, setAutoChecking] = useState(false)
  const checkedRef = useRef(false)

  const totalPrice = getTotalPrice()
  const totalItems = getTotalItems()
  const shipping = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_SHIPPING_COST
  const discountAmt = getDiscountAmount()
  // Prices are GST-inclusive (MRP) — no separate tax added
  const finalTotal = Math.max(0, totalPrice + shipping - discountAmt)

  // ── Auto-check for applicable discounts on mount ─────────────
  useEffect(() => {
    if (checkedRef.current || items.length === 0) return
    checkedRef.current = true

    async function checkAuto() {
      setAutoChecking(true)
      try {
        const res = await fetch("/api/discount/check")
        const data = await res.json()
        if (!res.ok || !data.discounts?.length) return

        // Pick the best auto discount (highest computed amount)
        const best = data.discounts.reduce((prev: any, cur: any) => {
          const amt = (d: any) =>
            d.discountType === "fixed"
              ? d.discountValue
              : (totalPrice * d.discountValue) / 100
          return amt(cur) > amt(prev) ? cur : prev
        }, data.discounts[0])

        // Only auto-apply if no discount already set, or if this one is better
        const currentAmt = discountAmt
        const newAmt =
          best.discountType === "fixed"
            ? best.discountValue
            : (totalPrice * best.discountValue) / 100

        if (!discount || newAmt > currentAmt) {
          setDiscount(best as AppliedDiscount)
        }
      } catch {
        // Silently fail auto-check
      } finally {
        setAutoChecking(false)
      }
    }
    checkAuto()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length])

  // ── Validate coupon code ──────────────────────────────────────
  async function handleApplyCoupon() {
    if (!couponInput.trim()) return
    if (!session) {
      setCouponError("Please log in to apply a coupon")
      return
    }
    setCouponLoading(true)
    setCouponError("")
    try {
      const res = await fetch("/api/discount/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), subtotal: totalPrice }),
      })
      const data = await res.json()
      if (!res.ok) {
        setCouponError(data.error || "Invalid coupon")
        return
      }
      setDiscount(data.discount as AppliedDiscount)
      setCouponInput("")
    } catch {
      setCouponError("Failed to validate coupon. Try again.")
    } finally {
      setCouponLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cp-cream py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection direction="up">
            <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-2xl shadow-lg">
              <div className="w-48 h-48 mx-auto mb-6">
                <EmptyCartIllustration />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-3 text-cp-text">Your Cart is Empty</h1>
              <p className="font-serif text-lg text-cp-text-muted mb-8">
                Looks like you haven&apos;t added any of our homemade goodness yet. Let&apos;s fix that!
              </p>
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-cp-crimson hover:bg-cp-crimson-dark text-white px-10 py-6 text-lg shadow-lg hover:shadow-xl"
                >
                  Browse Pickles
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-white to-red-50 py-12 md:py-16 border-b">
        <div className="container mx-auto px-4">
          <AnimatedSection direction="up" className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Shopping
              <span className="block bg-gradient-to-r from-amber-600 to-red-700 bg-clip-text text-transparent">
                Cart
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              You have {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <AnimatedSection direction="left">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Cart Items</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>

                <StaggerContainer className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <StaggerItem key={cartItemKey(item.product.id, item.product.variantId)}>
                        <motion.div
                          layout
                          initial={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20, x: 100 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow"
                        >
                        {/* Product Image */}
                        <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                          {(() => {
                            const img = item.product.images?.[0]
                            const imgUrl = typeof img === "string" ? img : img?.url
                            return imgUrl ? (
                              <Image
                                src={imgUrl}
                                alt={item.product.name}
                                width={128}
                                height={128}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                                <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              </div>
                            )
                          })()}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800 mb-1">{item.product.name}</h3>
                              <p className="text-sm text-gray-600">{item.product.category}</p>
                            </div>
                            <button
                              onClick={() => removeItem(cartItemKey(item.product.id, item.product.variantId))}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                              <div className="flex items-center gap-2 bg-white rounded-lg border-2 border-gray-200">
                                <button
                                  onClick={() => updateQuantity(cartItemKey(item.product.id, item.product.variantId), item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-bold text-gray-800">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(cartItemKey(item.product.id, item.product.variantId), item.quantity + 1)}
                                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-sm text-gray-600 mb-1">₹{item.product.price} × {item.quantity}</div>
                              <div className="text-xl font-bold text-amber-600">
                                ₹{(item.product.price * item.quantity).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </AnimatePresence>
                </StaggerContainer>
              </div>

              {/* ── Discounts Section ──────────────────────────────── */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-amber-600" />
                  Discounts &amp; Coupons
                </h2>

                {/* Auto-applied discount banner */}
                {discount && (discount.type === "first_order" || discount.type === "auto") && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-xl mb-4">
                    <Gift className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-green-800">{discount.name}</p>
                      {discount.type === "first_order" && (
                        <p className="text-xs text-green-600 mt-0.5">Auto-applied — your first order bonus</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-bold text-green-700">
                        -{discount.discountType === "fixed"
                          ? `₹${discount.discountValue}`
                          : `${discount.discountValue}%`}
                      </span>
                      <button
                        onClick={clearDiscount}
                        className="p-1 text-green-500 hover:text-green-700 rounded"
                        title="Remove discount"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Applied coupon code */}
                {discount && discount.type === "coupon" && (
                  <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-amber-800">
                        Coupon <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">{discount.code}</span> applied
                      </p>
                      <p className="text-xs text-amber-600 mt-0.5">{discount.name}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-bold text-amber-700">
                        -{discount.discountType === "fixed"
                          ? `₹${discount.discountValue}`
                          : `${discount.discountValue}%`}
                      </span>
                      <button
                        onClick={clearDiscount}
                        className="p-1 text-amber-500 hover:text-amber-700 rounded"
                        title="Remove coupon"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Auto-check spinner */}
                {autoChecking && !discount && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking for available offers…
                  </div>
                )}

                {/* Coupon input — hide if a coupon is already applied */}
                {discount?.type !== "coupon" && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError("") }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-mono uppercase focus:outline-none focus:border-amber-400 transition-colors"
                      disabled={couponLoading}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="bg-gradient-to-r from-amber-600 to-red-700 hover:from-amber-700 hover:to-red-800 text-white px-5 rounded-xl"
                    >
                      {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                )}
                {couponError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> {couponError}
                  </p>
                )}
              </div>

              {/* Continue Shopping */}
              <Link href="/products">
                <Button variant="outline" className="w-full border-2 border-amber-600 text-amber-700 hover:bg-amber-50">
                  Continue Shopping
                </Button>
              </Link>
            </AnimatedSection>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <AnimatedSection direction="right">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="font-semibold text-green-600">FREE</span>
                    ) : (
                      <span className="font-semibold">₹{shipping}</span>
                    )}
                  </div>

                  {discountAmt > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="font-medium flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        {discount?.type === "first_order" ? "First Order Discount" : discount?.name || "Discount"}
                      </span>
                      <span className="font-bold">-₹{discountAmt.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t-2 border-gray-200 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <div className="text-right">
                      {discountAmt > 0 && (
                        <p className="text-xs text-gray-400 line-through">
                          ₹{(totalPrice + shipping).toLocaleString()}
                        </p>
                      )}
                      <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-700 bg-clip-text text-transparent">
                        ₹{finalTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Savings badge */}
                {discountAmt > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-700">
                      You&apos;re saving ₹{discountAmt.toFixed(2)} on this order!
                    </p>
                  </div>
                )}

                {/* Free Shipping Banner with Progress Bar */}
                {shipping > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-cp-saffron-light border-2 border-cp-saffron rounded-lg p-4 mb-6"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-5 h-5 text-cp-saffron flex-shrink-0 mt-0.5">
                        <DeliveryTruckIllustration />
                      </div>
                      <div className="text-sm flex-1">
                        <p className="font-semibold text-cp-brown-dark">
                          Add ₹{(FREE_DELIVERY_THRESHOLD - totalPrice).toLocaleString()} more for FREE shipping!
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-cp-saffron">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cp-saffron to-cp-saffron-bright"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((totalPrice / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-xs text-cp-brown mt-2">
                      {Math.round((totalPrice / FREE_DELIVERY_THRESHOLD) * 100)}% of ₹{FREE_DELIVERY_THRESHOLD.toLocaleString()} threshold
                    </p>
                  </motion.div>
                )}

                <Link href="/checkout">
                  <Button className="w-full bg-gradient-to-r from-cp-olive to-cp-terracotta hover:from-cp-olive-dark hover:to-cp-terracotta-deep text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl mb-4">
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <div className="space-y-3 text-sm text-gray-600">
                  {[
                    "Secure checkout",
                    "Easy returns within 7 days",
                    "100% authentic products",
                  ].map((text) => (
                    <div key={text} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  )
}
