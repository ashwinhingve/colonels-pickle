import * as React from "react";

import { cn } from "@/lib/utils";

export interface RajasthaniPatternProps {
  variant?: "jali" | "medallion" | "trellis";
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
