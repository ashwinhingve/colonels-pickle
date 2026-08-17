"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./Navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOBILE_ITEMS = [...NAV_ITEMS, { href: "/orders", label: "My Orders" }];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-black/40 lg:hidden"
          />
          <motion.nav
            aria-label="Mobile navigation"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-[56] flex h-screen w-[80vw] max-w-[320px] flex-col gap-1.5 bg-cp-cream px-6 py-8 shadow-2xl lg:hidden"
          >
        <span className="mb-4 font-display text-xl font-extrabold text-cp-crimson">
          Menu
        </span>
        {MOBILE_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "rounded-md px-3 py-2 font-hindi text-base font-medium transition-colors",
                isActive
                  ? "bg-cp-crimson-light text-cp-crimson"
                  : "text-cp-text hover:bg-cp-cream-dark"
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/products"
          onClick={onClose}
          className="mt-5 rounded-lg bg-gradient-to-br from-cp-saffron to-cp-saffron-bright px-5 py-3 text-center font-sans text-sm font-bold uppercase tracking-wide text-white"
        >
          Order Now
        </Link>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
