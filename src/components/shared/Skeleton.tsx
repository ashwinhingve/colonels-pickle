import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Shimmer skeleton primitive. CSS-animated (see `.skeleton-shimmer` in
 * globals.css) so it costs nothing on the JS thread. Compose these to build
 * loading placeholders that match the final layout's shape.
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("skeleton-shimmer rounded-md bg-cp-border/50", className)}
      {...props}
    />
  );
}

/** Product-card shaped skeleton, matching the ProductCard footprint. */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border border-cp-border bg-white",
        className
      )}
    >
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-2.5 px-4 pb-[18px] pt-[15px]">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-8 w-full rounded-lg" />
        <div className="mt-auto flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/** A grid of product-card skeletons for listing pages. */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default Skeleton;
