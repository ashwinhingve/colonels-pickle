import * as React from "react";

import { cn } from "@/lib/utils";

// Local to this component only (not a sitewide @theme token) — a 4-tone digital
// army camo palette. Two tones reuse the site's existing olive hex values for
// continuity; the near-black shadow and khaki/tan are new, sourced to match an
// authentic pixelated military camo reference.
const CAMO_TONES = ["#2E3818", "#6B7F3A", "#1F1B12", "#A89A6E"];

export interface RajasthaniPatternProps {
  variant?: "jali" | "medallion" | "trellis" | "camo" | "blueprint";
  opacity?: number;
  color?: string;
  className?: string;
}

/**
 * Decorative Rajasthani lattice ("jali") or floral medallion overlay.
 * Absolutely positioned, non-interactive — drop inside a `relative` parent.
 */
export function RajasthaniPattern({
  variant = "jali",
  opacity = 0.07,
  color = "#ffffff",
  className,
}: RajasthaniPatternProps) {
  const reactId = React.useId();
  const patternId = `rajasthani-${variant}-${reactId.replace(/:/g, "")}`;

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={{ opacity }}
    >
      <defs>
        {variant === "jali" ? (
          <pattern id={patternId} width="36" height="36" patternUnits="userSpaceOnUse">
            <path
              d="M18 2 L34 18 L18 34 L2 18 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.8"
            />
            <circle cx="18" cy="18" r="7" fill="none" stroke={color} strokeWidth="0.5" />
          </pattern>
        ) : variant === "trellis" ? (
          <pattern id={patternId} width="28" height="28" patternUnits="userSpaceOnUse">
            {/* Diagonal lattice with a small floret at each crossing — reads well
                on light beige backgrounds where the jali is too heavy. */}
            <path d="M0 14 L14 0 M14 28 L28 14 M0 14 L14 28 M14 0 L28 14" fill="none" stroke={color} strokeWidth="0.6" />
            <circle cx="14" cy="14" r="1.6" fill={color} />
          </pattern>
        ) : variant === "camo" ? (
          // Pixel-block digital military camo — 4-tone, clustered arrangement.
          // Ignores the incoming `color` prop (a single hue can't read as camo);
          // uses the fixed CAMO_TONES palette instead. `opacity` still applies
          // via the outer <svg style> exactly as with every other variant.
          <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="4" height="4" fill={CAMO_TONES[0]} />
            <rect x="4" y="0" width="4" height="4" fill={CAMO_TONES[0]} />
            <rect x="0" y="4" width="4" height="4" fill={CAMO_TONES[0]} />

            <rect x="10" y="2" width="4" height="4" fill={CAMO_TONES[1]} />
            <rect x="14" y="2" width="4" height="4" fill={CAMO_TONES[1]} />
            <rect x="12" y="6" width="4" height="4" fill={CAMO_TONES[1]} />

            <rect x="28" y="1" width="4" height="4" fill={CAMO_TONES[2]} />
            <rect x="32" y="1" width="4" height="4" fill={CAMO_TONES[2]} />
            <rect x="30" y="5" width="4" height="4" fill={CAMO_TONES[2]} />

            <rect x="4" y="14" width="4" height="4" fill={CAMO_TONES[3]} />
            <rect x="8" y="16" width="4" height="4" fill={CAMO_TONES[3]} />
            <rect x="6" y="19" width="5" height="4" fill={CAMO_TONES[3]} />

            <rect x="18" y="14" width="4" height="4" fill={CAMO_TONES[0]} />
            <rect x="22" y="16" width="4" height="4" fill={CAMO_TONES[0]} />
            <rect x="20" y="20" width="4" height="4" fill={CAMO_TONES[0]} />

            <rect x="32" y="12" width="4" height="4" fill={CAMO_TONES[1]} />
            <rect x="36" y="14" width="4" height="4" fill={CAMO_TONES[1]} />
            <rect x="34" y="18" width="4" height="4" fill={CAMO_TONES[1]} />

            <rect x="2" y="26" width="4" height="4" fill={CAMO_TONES[2]} />
            <rect x="6" y="28" width="4" height="4" fill={CAMO_TONES[2]} />
            <rect x="4" y="31" width="4" height="5" fill={CAMO_TONES[2]} />

            <rect x="16" y="28" width="4" height="4" fill={CAMO_TONES[3]} />
            <rect x="20" y="30" width="4" height="4" fill={CAMO_TONES[3]} />
            <rect x="18" y="34" width="5" height="4" fill={CAMO_TONES[3]} />

            <rect x="30" y="32" width="4" height="4" fill={CAMO_TONES[0]} />
            <rect x="34" y="34" width="4" height="4" fill={CAMO_TONES[0]} />

            <rect x="36" y="26" width="4" height="4" fill={CAMO_TONES[1]} />
          </pattern>
        ) : variant === "blueprint" ? (
          // Tactical grid / HUD overlay — coordinate lines + corner reticle
          // brackets. Monochrome via the `color` prop (unlike camo), so it can
          // be tinted per-surface (gold on Hero, gunmetal on admin chrome).
          <pattern id={patternId} width="60" height="60" patternUnits="userSpaceOnUse">
            <line x1="0" y1="30" x2="60" y2="30" stroke={color} strokeWidth="0.5" />
            <line x1="30" y1="0" x2="30" y2="60" stroke={color} strokeWidth="0.5" />
            <path d="M 4 4 L 12 4 L 12 6 M 4 4 L 4 12 L 6 12" fill="none" stroke={color} strokeWidth="0.8" />
            <path d="M 56 4 L 48 4 L 48 6 M 56 4 L 56 12 L 54 12" fill="none" stroke={color} strokeWidth="0.8" />
            <path d="M 4 56 L 12 56 L 12 54 M 4 56 L 4 48 L 6 48" fill="none" stroke={color} strokeWidth="0.8" />
            <path d="M 56 56 L 48 56 L 48 54 M 56 56 L 56 48 L 54 48" fill="none" stroke={color} strokeWidth="0.8" />
            <circle cx="30" cy="30" r="1.2" fill={color} />
          </pattern>
        ) : (
          <pattern id={patternId} width="64" height="64" patternUnits="userSpaceOnUse">
            <circle cx="32" cy="32" r="10" fill="none" stroke={color} strokeWidth="0.7" />
            <circle cx="32" cy="32" r="3" fill={color} />
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * Math.PI) / 4;
              return (
                <circle
                  key={i}
                  cx={32 + Math.cos(angle) * 18}
                  cy={32 + Math.sin(angle) * 18}
                  r="4"
                  fill="none"
                  stroke={color}
                  strokeWidth="0.6"
                />
              );
            })}
            <circle cx="32" cy="32" r="26" fill="none" stroke={color} strokeWidth="0.4" />
          </pattern>
        )}
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

export default RajasthaniPattern;
