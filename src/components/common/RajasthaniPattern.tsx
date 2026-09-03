import * as React from "react";

import { cn } from "@/lib/utils";

export interface RajasthaniPatternProps {
  variant?: "jali" | "medallion" | "trellis" | "camo";
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
          <pattern id={patternId} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M8 12 Q14 8 20 10 Q22 6 28 8 Q30 12 26 18 Q20 20 14 18 Q10 22 8 16 Z" fill={color} opacity="0.7" />
            <path d="M28 26 Q32 22 38 24 Q40 28 36 32 Q32 34 28 32 Z" fill={color} opacity="0.5" />
            <path d="M10 32 Q16 30 22 34 Q20 38 14 38 Q8 36 10 32 Z" fill={color} opacity="0.6" />
            <path d="M32 6 Q36 8 34 14 Q30 16 28 12 Z" fill={color} opacity="0.55" />
            <path d="M42 36 Q46 38 44 44 Q40 46 38 42 Z" fill={color} opacity="0.5" />
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
