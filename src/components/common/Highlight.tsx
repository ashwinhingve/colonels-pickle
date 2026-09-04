import * as React from "react";

import { cn } from "@/lib/utils";

export interface HighlightProps {
  /** "light" for beige/white sections (default), "dark" for the olive hero/quote panels. */
  tone?: "light" | "dark";
  className?: string;
  children: React.ReactNode;
}

/**
 * Inline emphasis for key brand/story terms in prose (names, figures, taglines).
 * Keeps highlight styling consistent instead of ad-hoc spans scattered per page.
 */
export function Highlight({ tone = "light", className, children }: HighlightProps) {
  return (
    <span
      className={cn(
        "font-semibold",
        tone === "dark" ? "text-cp-gold-light" : "text-cp-terracotta-deep",
        className
      )}
    >
      {children}
    </span>
  );
}

export default Highlight;
