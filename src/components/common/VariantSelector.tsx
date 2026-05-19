"use client";

import { cn } from "@/lib/utils";

export interface VariantOption {
  label: string;
  priceLabel?: string;
}

export interface VariantSelectorProps {
  variants: VariantOption[];
  selectedIndex: number;
  onChange: (index: number) => void;
  className?: string;
}

export function VariantSelector({
  variants,
  selectedIndex,
  onChange,
  className,
}: VariantSelectorProps) {
  return (
    <div className={cn("flex flex-wrap gap-[5px]", className)}>
      {variants.map((variant, index) => {
        const active = index === selectedIndex;
        return (
          <button
            key={variant.label}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(index)}
            className={cn(
              "rounded-[5px] border-[1.5px] px-[10px] py-[3px] font-sans text-xs font-semibold transition-colors",
              active
                ? "border-cp-crimson bg-cp-crimson text-white"
                : "border-cp-border bg-white text-[#57534E] hover:border-cp-crimson hover:text-cp-crimson"
            )}
          >
            {variant.label}
            {variant.priceLabel ? (
              <span className="ml-1 opacity-80">· {variant.priceLabel}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export default VariantSelector;
