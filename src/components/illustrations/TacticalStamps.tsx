/**
 * Colonel's Pickle — ink-stamp seal motif ("Field Officer's Mess" identity layer).
 *
 * Net-new decorative component, distinct from `CertSeal` (which stays put and
 * keeps rendering the legally-scoped FSSAI/Udyam/Trademark/GST registrations).
 * `InkStampRound` is for non-legal contexts only — product badges, generic USP
 * rows, promise cards — anywhere that has no existing trust-badge treatment.
 *
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

export interface InkStampRoundProps extends SVGProps {
  /** Short uppercase label rendered in the centre, e.g. "VERIFIED". */
  label?: string;
  /** Stamp ink colour — defaults to gunmetal (matches the `cp-gunmetal` token). */
  color?: string;
  /** Rotation in degrees, for a hand-stamped (not printed) feel. */
  rotate?: number;
}

export function InkStampRound({
  className,
  title,
  label = "VERIFIED",
  color = "#3D4550",
  rotate = -5,
  ...p
}: InkStampRoundProps) {
  // A worn ink-stamp seal — double ring with a broken outer edge (dasharray
  // gaps simulate uneven ink pressure) and a centred label set in the tactical
  // accent font. Slight rotation reads as hand-stamped rather than a logo.
  return (
    <svg viewBox="0 0 120 120" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <g transform={`rotate(${rotate} 60 60)`}>
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray="14 3 6 4 10 5 8 3"
          strokeLinecap="round"
          opacity="0.85"
        />
        <circle cx="60" cy="60" r="42" fill="none" stroke={color} strokeWidth="1.4" opacity="0.55" />
        <text
          x="60"
          y="65"
          textAnchor="middle"
          fontFamily="'Oswald', 'Mukta', system-ui, sans-serif"
          fontSize="13"
          fontWeight="600"
          letterSpacing="0.5"
          fill={color}
          opacity="0.9"
        >
          {label}
        </text>
      </g>
    </svg>
  );
}
