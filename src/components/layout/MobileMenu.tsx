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
            className="fixed right-0 top-0 z-[56] flex h-screen w-[80vw] max-w-[320px] flex-col bg-cp-cream px-6 py-8 shadow-2xl lg:hidden"
          >
        <span className="mb-4 font-display text-xl font-extrabold text-cp-crimson">
          Menu
        </span>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
          }}
          className="flex flex-col gap-1.5"
        >
          {MOBILE_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <motion.div
                key={item.href}
                variants={{
                  hidden: { opacity: 0, x: 24 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 font-hindi text-base font-medium transition-colors",
                    isActive
                      ? "bg-cp-crimson-light text-cp-crimson"
                      : "text-cp-text hover:bg-cp-cream-dark"
                  )}
                >
                  {isActive && (
                    <span className="mr-2 h-4 w-1 rounded-full bg-cp-crimson" aria-hidden="true" />
                  )}
                  {item.label}
                </Link>
              </motion.div>
            );
          })}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 24 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <Link
              href="/products"
              onClick={onClose}
              className="btn-sheen mt-5 block rounded-lg bg-gradient-to-br from-cp-saffron to-cp-saffron-bright px-5 py-3 text-center font-sans text-sm font-bold uppercase tracking-wide text-white shadow-md"
            >
              Order Now
            </Link>
          </motion.div>
        </motion.div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
