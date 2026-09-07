/**
 * Colonel's Pickle — dual-hub map motifs ("Field Officer's Mess" identity layer).
 *
 * Ties the compass/map visual language to the real Jaipur + Bahadurgarh dual
 * operational hubs. City/state labels only — deliberately NO coordinates or
 * street-level detail beyond what's already verified in `BRAND.address`
 * (never invent facts on a site the client has been precise about).
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

export interface MapPinProps extends SVGProps {
  color?: string;
}

export function MapPin({ className, title, color = "#C05621", ...p }: MapPinProps) {
  return (
    <svg viewBox="0 0 40 52" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <path
        d="M20 2C10.6 2 3 9.6 3 19c0 13 17 31 17 31s17-18 17-31C37 9.6 29.4 2 20 2Z"
        fill={color}
      />
      <circle cx="20" cy="19" r="7.5" fill="#F5EBDA" />
    </svg>
  );
}

export interface DualHubCompassProps extends SVGProps {
  showLabels?: boolean;
}

export function DualHubCompass({ className, title, showLabels = true, ...p }: DualHubCompassProps) {
  // Compass rose + two hub markers connected by a dashed route — an
  // "inspired only" cartographic motif, not a literal survey map.
  return (
    <svg viewBox="0 0 320 240" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}

      {/* compass rose */}
      <g transform="translate(160 62)">
        <circle r="46" fill="none" stroke="#A89A6E" strokeWidth="1.4" opacity="0.6" />
        <circle r="34" fill="none" stroke="#4B5D2A" strokeWidth="1" opacity="0.5" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI) / 4;
          const long = i % 2 === 0;
          const r1 = long ? 46 : 40;
          const r2 = 34;
          return (
            <line
              key={i}
              x1={Math.cos(angle) * r2}
              y1={Math.sin(angle) * r2}
              x2={Math.cos(angle) * r1}
              y2={Math.sin(angle) * r1}
              stroke="#C05621"
              strokeWidth={long ? 1.6 : 1}
              opacity={long ? 0.8 : 0.5}
            />
          );
        })}
        <path d="M0 -30 L7 0 L0 30 L-7 0 Z" fill="#4B5D2A" opacity="0.85" />
        <circle r="4" fill="#D4A017" />
      </g>

      {/* dashed route between hubs */}
      <path
        d="M70 190 Q160 150 250 190"
        fill="none"
        stroke="#A89A6E"
        strokeWidth="1.6"
        strokeDasharray="5 5"
        opacity="0.7"
      />

      {/* Jaipur pin */}
      <g transform="translate(70 168)">
        <path d="M0 0C-6 -8 -6 -18 0 -24C6 -18 6 -8 0 0Z" fill="#C05621" />
        <circle cy="-16" r="4" fill="#F5EBDA" />
      </g>
      {/* Bahadurgarh pin */}
      <g transform="translate(250 168)">
        <path d="M0 0C-6 -8 -6 -18 0 -24C6 -18 6 -8 0 0Z" fill="#4B5D2A" />
        <circle cy="-16" r="4" fill="#F5EBDA" />
      </g>

      {showLabels ? (
        <>
          <text
            x="70"
            y="212"
            textAnchor="middle"
            fontFamily="'Oswald', 'Mukta', system-ui, sans-serif"
            fontSize="11"
            fontWeight="600"
            letterSpacing="0.5"
            fill="#2A2417"
          >
            JAIPUR
          </text>
          <text x="70" y="226" textAnchor="middle" fontFamily="'Lora', Georgia, serif" fontSize="9" fill="#6B6455">
            Rajasthan
          </text>
          <text
            x="250"
            y="212"
            textAnchor="middle"
            fontFamily="'Oswald', 'Mukta', system-ui, sans-serif"
            fontSize="11"
            fontWeight="600"
            letterSpacing="0.5"
            fill="#2A2417"
          >
            BAHADURGARH
          </text>
          <text x="250" y="226" textAnchor="middle" fontFamily="'Lora', Georgia, serif" fontSize="9" fill="#6B6455">
            Haryana
          </text>
        </>
      ) : null}
    </svg>
  );
}
