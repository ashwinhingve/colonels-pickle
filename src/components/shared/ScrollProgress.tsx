"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A thin olive→gold→terracotta reading-progress bar fixed to the very top of
 * the viewport. Grows from the left as the page scrolls. Sits above the sticky
 * header so it reads as a "fill" over the header's static gradient hairline.
 * Mounted once in the root layout.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[70] h-[3px] w-full origin-left bg-gradient-to-r from-cp-olive via-cp-gold to-cp-terracotta"
      aria-hidden="true"
    />
  );
}

export default ScrollProgress;
