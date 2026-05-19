"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useSyncExternalStore } from "react";
import { useSession, signOut } from "next-auth/react";
import { Navigation } from "./Navigation";
import { MobileMenu } from "./MobileMenu";
import { useCartStore } from "@/store/useCartStore";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  User,
  ShoppingCart,
  Menu,
  LogOut,
  LayoutDashboard,
  Package,
} from "lucide-react";

const emptySubscribe = () => () => {};

/** False during SSR / first paint, true once hydrated — no setState-in-effect. */
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-cp-cream transition-shadow duration-300",
        scrolled && "shadow-md backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto flex h-[70px] items-center justify-between px-4">
        {/* Logo / wordmark */}
        <Link
          href="/"
          className="flex flex-col items-start leading-none"
          aria-label={`${BRAND.name} — Home`}
        >
          <Image
            src="/logo.png"
            alt="Colonel's Pickle by Ridhwika Agro Organics"
            width={56}
            height={56}
            className="object-contain"
            priority
          />
          <span className="mt-1 font-hindi text-[9px] font-bold uppercase tracking-widest text-cp-brown">
            {BRAND.tagline}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex lg:items-center" aria-label="Main navigation">
          <Navigation />
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* User account */}
          {mounted && status === "authenticated" && session?.user ? (
            <div className="user-menu-container relative">
              <button
                type="button"
                aria-label="User account"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-cp-text transition-colors hover:bg-cp-cream-dark hover:text-cp-crimson"
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
                  <User className="h-5 w-5" />
                )}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-lg border border-cp-border bg-white shadow-xl">
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
              className="flex h-10 w-10 items-center justify-center rounded-full text-cp-text transition-colors hover:bg-cp-cream-dark hover:text-cp-crimson"
            >
              <User className="h-5 w-5" />
            </Link>
          )}

          {mounted && status === "authenticated" && (
            <Link
              href="/orders"
              aria-label="My Orders"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-cp-text transition-colors hover:bg-cp-cream-dark hover:text-cp-crimson sm:flex"
            >
              <Package className="h-5 w-5" />
            </Link>
          )}

          {/* Cart — opens drawer */}
          <button
            type="button"
            onClick={openCart}
            aria-label={`Shopping cart${
              mounted && totalItems > 0 ? ` with ${totalItems} items` : ""
            }`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-cp-text transition-colors hover:bg-cp-cream-dark hover:text-cp-crimson"
          >
            <ShoppingCart className="h-5 w-5" />
            {mounted && totalItems > 0 && (
              <span
                key={totalItems}
                className="absolute -right-1 -top-1 flex h-5 w-5 animate-cart-bounce items-center justify-center rounded-full bg-cp-crimson text-[11px] font-extrabold text-white"
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* Order Now CTA */}
          <Link
            href="/products"
            className="hidden rounded-lg bg-gradient-to-br from-cp-saffron to-cp-saffron-bright px-5 py-2.5 font-sans text-sm font-bold uppercase tracking-wide text-white transition-transform hover:-translate-y-px md:inline-block"
          >
            Order Now
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-cp-text transition-colors hover:bg-cp-cream-dark hover:text-cp-crimson lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
