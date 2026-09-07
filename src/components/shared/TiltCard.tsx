"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees at the corners. Keep small for a premium feel. */
  max?: number;
  /** Subtle scale on hover. */
  scale?: number;
}

/**
 * Gentle pointer-based 3D tilt for feature/category cards. The card leans
 * toward the cursor; leaving resets it with a soft spring. Touch devices simply
 * get the hover scale (no tilt), and reduced-motion users get neither — the
 * springs are transforms suppressed by MotionConfig. Use sparingly on hero
 * cards; not for dense grids.
 */
export function TiltCard({
  children,
  className,
  max = 6,
  scale = 1.02,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 220, damping: 20 });
  const sy = useSpring(py, { stiffness: 220, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);

  function handleMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }

  function reset() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      whileHover={{ scale }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default TiltCard;
