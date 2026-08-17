"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  /** Vertical travel in px across the element's scroll through the viewport. */
  offset?: number;
  /** Direction the content drifts as you scroll down. */
  direction?: "up" | "down";
}

/**
 * Gentle scroll-linked parallax. Wraps content and translates it a small,
 * tasteful amount as it passes through the viewport — used for hero art and
 * section accents. Keep `offset` small (≤ 60) so it reads as depth, not motion.
 *
 * Reduced-motion users: framer-motion's MotionConfig suppresses the transform,
 * so the content simply sits static.
 */
export function Parallax({
  children,
  className = "",
  offset = 40,
  direction = "up",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const travel = direction === "up" ? offset : -offset;
  const y: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [travel, -travel]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

export default Parallax;
