"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useSyncExternalStore } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MobileMenu } from "./MobileMenu";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  Menu,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { TapScale } from "@/components/shared/TapScale";

const emptySubscribe = () => () => {};

/** False during SSR / first paint, true once hydrated — no setState-in-effect. */
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/gallery", label: "Gallery" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const mounted = useHydrated();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const openCart = useCartStore((state) => state.openCart);
  const { data: session, status } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Premium gradient hairline — brass rank-bar feel */}
      <div className="h-[3px] w-full bg-gradient-to-r from-cp-gunmetal via-cp-gold to-cp-gunmetal" />

      <div
        className={cn(
          "w-full border-b transition-[background-color,box-shadow,border-color,height] duration-300",
          scrolled
            ? "border-cp-border/70 bg-cp-cream/85 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md"
            : "border-transparent bg-cp-cream"
        )}
      >
        <div
          className={cn(
            "container mx-auto grid grid-cols-[1fr_auto_1fr] items-center px-4 transition-[height] duration-300",
            scrolled ? "h-[64px]" : "h-[78px]"
          )}
        >
          {/* ── LEFT: Menu trigger (mobile) / Nav (desktop) ── */}
          <div className="flex items-center justify-self-start">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-cp-text transition-all duration-200 hover:scale-105 hover:bg-cp-crimson/[0.07] hover:text-cp-crimson lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <Menu
                className={cn(
                  "h-6 w-6 transition-transform duration-300",
                  isMobileMenuOpen && "rotate-90"
                )}
              />
            </button>

            <nav
              className="hidden lg:flex lg:items-center"
              aria-label="Main navigation"
            >
              <ul className="flex items-center gap-1">
                {NAV_ITEMS.map((item, index) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <li
                      key={item.href}
                      className="animate-fade-up opacity-0"
                      style={{ animationDelay: `${index * 70 + 120}ms` }}
                    >
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "group relative block rounded-full px-4 py-2 font-hindi text-[14px] font-semibold transition-all duration-200",
                          isActive
                            ? "text-cp-crimson"
                            : "text-cp-text hover:-translate-y-px hover:text-cp-crimson"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute inset-0 rounded-full bg-cp-crimson/[0.07] transition-opacity duration-200",
                            isActive
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          )}
                          aria-hidden="true"
                        />
                        <span className="relative z-10">{item.label}</span>
                        <span
                          className={cn(
                            "absolute -bottom-0.5 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-cp-crimson transition-all duration-300",
                            isActive
                              ? "w-6 opacity-100"
                              : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100"
                          )}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* ── CENTER: Logo + brand text ── */}
          <Link
            href="/"
            className="group flex items-center justify-self-center gap-2.5 leading-none"
            aria-label="Colonel's Pickle — Home"
          >
            <span
              className={cn(
                "hidden shrink-0 items-center justify-center overflow-hidden rounded-full border border-cp-gold/50 bg-white shadow-sm transition-transform duration-300 group-hover:scale-105 lg:flex",
                scrolled ? "h-[46px] w-[46px]" : "h-[58px] w-[58px]"
              )}
            >
              <Image
                src="/images/brand/ridhwika-crest.png"
                alt="Colonel's Pickle crest — Ridhwika Agro Organics"
                width={72}
                height={72}
                className="h-[92%] w-[92%] object-contain"
                priority
              />
            </span>
            <span className="flex items-center gap-2 lg:hidden">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cp-gold/50 bg-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/brand/ridhwika-crest.png"
                  alt="Colonel's Pickle crest — Ridhwika Agro Organics"
                  width={48}
                  height={48}
                  className="h-[92%] w-[92%] object-contain"
                  priority
                />
              </span>
              {/* Compact wordmark for phones with room; crest-only below 380px */}
              <Image
                src="/images/brand/colonels-pickle-wordmark.png"
                alt="Colonel's Pickle® — homemade Indian pickles"
                width={662}
                height={358}
                className="hidden h-[24px] w-auto min-[380px]:block"
                priority
              />
            </span>

            <span className="hidden flex-col leading-tight lg:flex">
              {/* Registered trademark wordmark (image), shown separately from the crest logo */}
              <Image
                src="/images/brand/colonels-pickle-wordmark.png"
                alt="Colonel's Pickle® — homemade Indian pickles"
                width={662}
                height={358}
                className={cn(
                  "w-auto transition-[height] duration-300",
                  scrolled ? "h-[34px]" : "h-[38px]"
                )}
                priority
              />
              {/* Tagline as one balanced line: a short gold tick + the words,
                  tightly tied to the wordmark above (replaces the stray stitch). */}
              <span className="mt-1 flex items-center gap-2">
                <span
                  className="h-px w-4 shrink-0 bg-gradient-to-r from-transparent to-cp-gold/70"
                  aria-hidden="true"
                />
                <span className="font-hindi text-[10px] font-semibold tracking-[0.18em] text-cp-olive-dark">
                  MAA KA PYAAR, GHAR KA ACHAR
                </span>
              </span>
            </span>
          </Link>

          {/* ── RIGHT: Actions ── */}
          <div className="flex items-center justify-self-end gap-3">
            {/* User account */}
            {mounted && status === "authenticated" && session?.user ? (
              <div className="user-menu-container relative">
                <button
                  type="button"
                  aria-label="User account"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-cp-text transition-all duration-200 hover:scale-105 hover:bg-cp-crimson/[0.07] hover:text-cp-crimson"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  )}
                </button>

                {showUserMenu && (
                  <div className="animate-fade-up absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-cp-border bg-white shadow-xl">
                    <div className="border-b border-cp-border bg-cp-cream px-4 py-3">
                      <p className="truncate font-sans text-sm font-semibold text-cp-text">
                        {session.user.name || "User"}
                      </p>
                      <p className="truncate font-sans text-xs text-cp-text-muted">
                        {session.user.email}
                      </p>
                      <span
                        className={cn(
                          "mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold",
                          session.user.role === "admin"
                            ? "bg-cp-crimson-light text-cp-crimson"
                            : "bg-cp-green-light text-cp-green"
                        )}
                      >
                        {session.user.role === "admin" ? "Admin" : "Customer"}
                      </span>
                    </div>
                    <div className="py-2">
                      {session.user.role === "admin" && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-3 px-4 py-2 font-sans text-sm text-cp-text transition-colors hover:bg-cp-cream"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-4 py-2 font-sans text-sm text-cp-text transition-colors hover:bg-cp-cream"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 font-sans text-sm text-cp-crimson transition-colors hover:bg-cp-crimson-light"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                aria-label="User account"
                className="flex h-10 w-10 items-center justify-center rounded-full text-cp-text transition-all duration-200 hover:scale-105 hover:bg-cp-crimson/[0.07] hover:text-cp-crimson"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </Link>
            )}

            {/* Cart — opens drawer */}
            <button
              type="button"
              onClick={openCart}
              aria-label={`Shopping cart${
                mounted && totalItems > 0 ? ` with ${totalItems} items` : ""
              }`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-cp-text transition-all duration-200 hover:scale-105 hover:bg-cp-crimson/[0.07] hover:text-cp-crimson"
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cp-crimson text-[11px] font-extrabold text-white shadow-md ring-2 ring-cp-cream"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* ORDER NOW CTA — animated sheen */}
            <TapScale asChild>
              <Link
                href="/products"
                className="group relative hidden overflow-hidden rounded-lg bg-gradient-to-br from-cp-saffron to-cp-saffron-bright px-5 py-2.5 font-sans text-sm font-bold uppercase tracking-wide text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-6px_rgba(217,119,6,0.6),0_0_0_3px_rgba(185,28,28,0.18)] md:inline-flex md:items-center md:gap-1.5"
              >
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  aria-hidden="true"
                />
                <span className="relative">Order Now</span>
                <span
                  className="relative transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </TapScale>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
