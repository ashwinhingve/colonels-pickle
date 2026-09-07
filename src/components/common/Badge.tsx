import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-sans whitespace-nowrap leading-tight",
  {
    variants: {
      variant: {
        "no-preservatives":
          "bg-[rgba(22,101,52,0.88)] text-white text-[9.5px] font-semibold tracking-[0.01em] px-[9px] py-[3px] border border-cp-gold-light",
        "product-badge":
          "bg-cp-crimson text-white text-[10px] font-bold px-[10px] py-[3px] border-2 border-cp-gold uppercase",
        certification:
          "border-2 border-cp-gold text-cp-text-muted text-xs font-medium px-3 py-1 bg-cp-cream",
        "tactical-badge":
          "bg-cp-gold text-cp-olive text-[10px] font-bold px-[10px] py-[3px] uppercase border-1.5 border-cp-gold-light rounded-full",
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
