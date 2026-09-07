"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export interface AnimatedPriceProps {
  /** The numeric price. Formatted with the en-IN locale. */
  value: number;
  className?: string;
  /** Currency prefix; defaults to the rupee sign. */
  prefix?: string;
}

/**
 * A price that cross-fades vertically when the value changes (e.g. on variant
 * switch), instead of snapping. `mode="popLayout"` removes the exiting figure
 * from flow so siblings don't jump. Reduced-motion users see an instant swap.
 */
export function AnimatedPrice({ value, className = "", prefix = "₹" }: AnimatedPriceProps) {
  return (
    <span className={`relative inline-flex overflow-hidden ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: "60%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-60%" }}
          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="inline-block tabular-nums"
        >
          {prefix}
          {inr.format(value)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default AnimatedPrice;
