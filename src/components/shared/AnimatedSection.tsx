"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

/**
 * Reveal-on-scroll primitives.
 *
 * These deliberately FAIL OPEN: the scroll reveal is a progressive enhancement, but a
 * short fallback timer always flips content to visible even if the in-view observer never
 * fires. Without this, content can get permanently stuck at `opacity:0` — which happened on
 * deeply-nested sections and in off-screen full-page captures. Content visibility must never
 * depend solely on an IntersectionObserver callback.
 */

const REVEAL_FALLBACK_MS = 900

function useReveal(once: boolean, amount = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, amount })
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setFallback(true), REVEAL_FALLBACK_MS)
    return () => clearTimeout(t)
  }, [])

  return { ref, show: inView || fallback }
}

export interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  duration?: number;
  once?: boolean;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.6,
  once = true,
}) => {
  const { ref, show } = useReveal(once)

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] as any,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = "",
  staggerDelay = 0.1,
  once = true,
}) => {
  const { ref, show } = useReveal(once)

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      variants={container}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as any,
      },
    },
  }

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}
