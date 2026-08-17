"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

export interface HoverLiftProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  /** Upward lift on hover, px. */
  lift?: number;
  /** Optional subtle scale on hover. */
  scale?: number;
}

/**
 * Refined hover-lift wrapper for cards. A gentle rise + soft spring —
 * the premium, non-gimmicky micro-interaction used sitewide on clickable cards.
 */
export function HoverLift({
  children,
  lift = 6,
  scale = 1,
  className,
  ...rest
}: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{ y: -lift, scale }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export default HoverLift;
