/**
 * Colonel's Pickle — generic angular accent divider ("Field Officer's Mess" identity layer).
 *
 * Deliberately abstract (three fading stacked chevrons) — NOT a reproduction of
 * any real rank insignia. Used as a small directional divider or corner accent.
 * Pure presentational SVG (no hooks → server-safe), same conventions as
 * ./index.tsx and ./scenes.tsx.
 */
import * as React from "react";

type SVGProps = React.SVGProps<SVGSVGElement> & { title?: string };

const base = (props: { title?: string }) => ({
  role: "img" as const,
  "aria-hidden": props.title ? undefined : true,
  focusable: false as const,
});

const CHEVRON_ROTATION: Record<string, number> = { right: 0, down: 90, left: 180, up: 270 };

export interface ChevronDividerProps extends SVGProps {
  direction?: "up" | "down" | "left" | "right";
  color?: string;
}

export function ChevronDivider({
  className,
  title,
  direction = "right",
  color = "currentColor",
  ...p
}: ChevronDividerProps) {
  return (
    <svg viewBox="0 0 40 24" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <g
        transform={`rotate(${CHEVRON_ROTATION[direction]} 20 12)`}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 4 L13 12 L3 20" opacity="0.9" />
        <path d="M14 4 L24 12 L14 20" opacity="0.6" />
        <path d="M25 4 L35 12 L25 20" opacity="0.35" />
      </g>
    </svg>
  );
}
