"use client";

import { motion } from "framer-motion";

/**
 * Route-change transition. Next.js re-mounts `template.tsx` on every
 * navigation, so this gives each page a short, subtle enter (fade + tiny rise).
 * Kept intentionally brief (0.28s) and transform/opacity-only so it never
 * blocks perceived speed, causes layout shift, or fights scroll restoration —
 * and MotionConfig suppresses it under prefers-reduced-motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
