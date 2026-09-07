"use client"

import React, { useEffect, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"

export interface CountUpStatProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  /** "light" (default) for cream/white panels; "dark" for olive-gradient panels. */
  tone?: "light" | "dark";
  /** Locale-format the number with thousands separators. Off for small counts. */
  format?: boolean;
}

/**
 * Animated count-up stat, on the Olive Heritage palette. The figure eases from
 * 0 → `end` the first time it scrolls into view; the whole tile fades/scales in.
 * `tone="dark"` swaps the label colour for use on the dark olive panels
 * (Hero, Our Story). Reduced-motion users still get the final value — the
 * observer fires and the number is set; the framer entrance is suppressed by
 * MotionConfig.
 */
export const CountUpStat: React.FC<CountUpStatProps> = ({
  end,
  duration = 1.8,
  suffix = "",
  prefix = "",
  label,
  icon,
  className = "",
  tone = "light",
  format = false,
}) => {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })
  // Guard against the animation never running (e.g. reduced motion / no rAF):
  // ensure the final value is always shown.
  const settled = useRef(false)

  useEffect(() => {
    if (!inView) return
    let startTime: number
    let animationFrame: number

    const step = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * end))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      } else {
        setCount(end)
        settled.current = true
      }
    }

    animationFrame = requestAnimationFrame(step)
    // Fail-safe: force the final value shortly after the expected duration.
    const t = setTimeout(() => {
      if (!settled.current) setCount(end)
    }, duration * 1000 + 400)

    return () => {
      cancelAnimationFrame(animationFrame)
      clearTimeout(t)
    }
  }, [inView, end, duration])

  const display = format ? count.toLocaleString("en-IN") : String(count)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 12 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 12 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`text-center ${className}`}
    >
      {icon && (
        <div
          className={`mb-3 flex justify-center ${
            tone === "dark" ? "text-cp-gold-light" : "text-cp-terracotta"
          }`}
        >
          {icon}
        </div>
      )}
      <div className="font-display text-4xl font-extrabold tracking-tight text-gradient-gold md:text-5xl">
        {prefix}
        {display}
        {suffix}
      </div>
      <div
        className={`mt-1.5 font-hindi text-xs font-semibold uppercase tracking-[0.15em] md:text-sm ${
          tone === "dark" ? "text-cp-beige/70" : "text-cp-text-muted"
        }`}
      >
        {label}
      </div>
    </motion.div>
  )
}

export default CountUpStat
