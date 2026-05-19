import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-sans whitespace-nowrap leading-tight",
  {
    variants: {
      variant: {
        "no-preservatives":
          "bg-[rgba(22,101,52,0.88)] text-white text-[9.5px] font-semibold tracking-[0.01em] px-[9px] py-[3px]",
        "product-badge":
          "bg-cp-crimson text-white text-[10px] font-bold px-[10px] py-[3px]",
        certification:
          "border border-cp-border text-cp-text-muted text-xs font-medium px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "no-preservatives",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Brand badge. `product-badge` accepts a `style={{ backgroundColor }}`
 * override for the per-product accent colour from the product theme map.
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    >
      {children}
    </span>
  )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
export default Badge;
