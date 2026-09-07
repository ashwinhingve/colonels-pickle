import * as React from "react";

import { cn } from "@/lib/utils";

export interface KenBurnsProps {
  children: React.ReactNode;
  className?: string;
  /** Two variants so adjacent panels don't drift in lock-step. */
  variant?: "a" | "b";
}

/**
 * Wraps an image (or any fill content) in a slow zoom + drift "Ken Burns"
 * motion via a CSS keyframe. Pure presentational → safe in server components.
 * The clip lives on the wrapper (`overflow-hidden`); the inner element carries
 * the animation. Reduced-motion users get a static, gently-scaled image because
 * the global prefers-reduced-motion block zeroes the animation duration.
 */
export function KenBurns({ children, className, variant = "a" }: KenBurnsProps) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className={cn(
          "h-full w-full",
          variant === "b" ? "animate-kenburns-alt" : "animate-kenburns"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default KenBurns;
