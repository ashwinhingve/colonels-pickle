"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProductAccordionProps {
  product: any;
}

export function ProductAccordion({ product }: ProductAccordionProps) {
  const [open, setOpen] = useState(0);

  const ingredients =
    (product?.specifications || []).find(
      (s: any) => s.key?.toLowerCase() === "ingredients"
    )?.value || product?.description;

  const items = [
    {
      title: "Description",
      body: <p className="font-serif leading-relaxed">{product?.description}</p>,
    },
    {
      title: "Ingredients",
      body: <p className="font-serif leading-relaxed">{ingredients}</p>,
    },
    {
      title: "Storage & Shelf Life",
      body: (
        <p className="font-serif leading-relaxed">
          Store in a cool, dry place. Do not use a wet spoon. Shake before
          serving. Best before 18 months from packaging.
        </p>
      ),
    },
    {
      title: "Certifications",
      body: (
        <ul className="list-inside list-disc space-y-1 font-serif">
          <li>FSSAI {BRAND.fssai}</li>
          <li>No Preservatives</li>
          <li>No Artificial Colours</li>
          <li>No Artificial Flavours</li>
          <li>Prepared in Kacchi Ghani Mustard Oil</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="divide-y divide-cp-border border-y border-cp-border">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left font-display text-base font-bold text-cp-text"
            >
              {item.title}
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-cp-text-muted transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen ? (
              <div className="pb-5 text-sm text-cp-text-muted">{item.body}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default ProductAccordion;
