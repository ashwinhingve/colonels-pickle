import * as React from "react";

import { cn } from "@/lib/utils";

export interface SectionDividerProps {
  /** Shape of the divider edge. */
  variant?: "wave" | "curve" | "tilt" | "scallop";
  /** Fill colour of the shape (usually the NEXT section's background). */
  color?: string;
  /** Flip vertically — use when placing at the top of a section. */
  flip?: boolean;
  className?: string;
  /** Divider height in px. */
  height?: number;
}

/**
 * Reusable SVG section divider — the branded way to transition between the
 * site's alternating cream / white / dark bands. Pure presentational SVG, safe
 * as a server component. Set `color` to the colour of the section it points
 * INTO so the shape reads as that section bleeding upward.
 */
export function SectionDivider({
  variant = "wave",
  color = "#F5EBDA",
  flip = false,
  className,
  height = 64,
}: SectionDividerProps) {
  const paths: Record<NonNullable<SectionDividerProps["variant"]>, string> = {
    wave: "M0,40 C240,90 480,-10 720,30 C960,70 1200,20 1440,50 L1440,120 L0,120 Z",
    curve: "M0,60 C480,120 960,120 1440,60 L1440,120 L0,120 Z",
    tilt: "M0,120 L1440,20 L1440,120 Z",
    scallop:
      "M0,60 Q90,110 180,60 T360,60 T540,60 T720,60 T900,60 T1080,60 T1260,60 T1440,60 L1440,120 L0,120 Z",
  };

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none w-full overflow-hidden leading-[0]", className)}
      style={{ transform: flip ? "rotate(180deg)" : undefined }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height }}
      >
        <path d={paths[variant]} fill={color} />
      </svg>
    </div>
  );
}

export default SectionDivider;
