/**
 * Colonel's Pickle — hand-authored inline SVG illustrations & benefit icons.
 *
 * All are pure presentational components (no hooks → safe as server components).
 * They colour themselves from the "Olive Heritage" palette so they stay on-brand
 * in every section; parents add motion (framer-motion / animate-float) as needed.
 *
 * Palette used: olive #4B5D2A, terracotta #C05621, gold #D4A017, brown #7C4A1E,
 * green #3F7A34, cream #F5EBDA.
 */
import * as React from "react";

type SVGProps = React.SVGProps<SVGSVGElement> & { title?: string };

const base = (props: SVGProps) => ({
  role: "img" as const,
  "aria-hidden": props.title ? undefined : true,
  focusable: false as const,
});

/* ───────────────────────── Benefit / UI icons (24×24, stroke) ───────────────────────── */

export function LeafIcon({ className, title, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <path
        d="M4 20C4 11 10 5 20 4c1 10-4 16-13 16.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 18C11 13 14 10 19 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export function NoPreservativeIcon({ className, title, ...p }: SVGProps) {
  // A shield (protected) with a leaf inside — "naturally preserved, no additives".
  return (
    <svg viewBox="0 0 24 24" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <path
        d="M12 2.5l7 2.6v5.4c0 4.6-3 8.2-7 9.6-4-1.4-7-5-7-9.6V5.1l7-2.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 14.5c0-3.4 2.2-5.5 6-5.9-.3 3.8-2.5 5.9-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NoChemicalIcon({ className, title, ...p }: SVGProps) {
  // A crossed-out lab flask — "no chemicals".
  return (
    <svg viewBox="0 0 24 24" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <path
        d="M10 3h4M10.5 3v5.2L5.8 17c-.7 1.3.2 2.9 1.7 2.9h9c1.5 0 2.4-1.6 1.7-2.9L13.5 8.2V3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 14h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      <path d="M4 20L20 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function NoVinegarIcon({ className, title, ...p }: SVGProps) {
  // A crossed-out bottle — "no vinegar".
  return (
    <svg viewBox="0 0 24 24" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <path
        d="M10 2.5h4M11 2.5v3.2M13 2.5v3.2M9 8.4C9 7 10 5.7 11 5.7h2c1 0 2 1.3 2 2.7v10.1c0 1-.8 1.8-1.8 1.8H10.8C9.8 20.3 9 19.5 9 18.5V8.4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 20.5L20 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldCheckIcon({ className, title, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <path
        d="M12 2.5l7 2.6v5.4c0 4.6-3 8.2-7 9.6-4-1.4-7-5-7-9.6V5.1l7-2.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8.6 12.2l2.4 2.4 4.4-4.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ───────────────────────── Ingredient illustrations (64×64, filled) ───────────────────────── */

export function ChilliIllustration({ className, title, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <path
        d="M39 10c1.6-2.7 4.3-4.4 7.3-4-1.7 1.2-2.5 2.9-2.3 4.9"
        fill="none"
        stroke="#3F7A34"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M41 12c7 3 11 11 9 20-2 12-13 22-27 24-2.4.3-4-2.3-2.2-4 .9-.8 2.2-.9 3.6-1.3 9.6-2.6 16.8-9.8 18.4-19.6.7-4.4-.2-8.9-2.4-12.6-1.9 1.9-4.6 2.6-7.2 1.7 2.4-4.2 5.6-7.4 9.4-8.3Z"
        fill="#C0311F"
      />
      <path
        d="M41 12c7 3 11 11 9 20-1.6 9.6-9.5 18.2-20.6 22 8.3-4.6 14-12.4 15.5-21 .8-4.8-.2-9.6-2.9-13.4Z"
        fill="#9C2318"
        opacity="0.55"
      />
      <path d="M31 22c2.6 1.4 4.3 3.9 4.7 7" fill="none" stroke="#F3C9B0" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function LemonIllustration({ className, title, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <ellipse cx="32" cy="34" rx="21" ry="18" fill="#E3B417" transform="rotate(-18 32 34)" />
      <ellipse cx="32" cy="34" rx="21" ry="18" fill="#C99612" opacity="0.45" transform="rotate(-18 32 34)" />
      <path d="M14 26c4-3 9-3 13 0" fill="none" stroke="#F6DE7A" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
      <path
        d="M45 14c4-2.5 8-2 11 1-4 .5-6.5 2.6-7.5 6.3-2.6-2.8-4.3-4.7-3.5-7.3Z"
        fill="#3F7A34"
      />
      <path d="M48 17c1.6 1.4 2.4 3.1 2.6 5.2" fill="none" stroke="#2E5D26" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function MangoIllustration({ className, title, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <path d="M33 8c1.5-1.6 3.6-2.3 6-2-.4 2-.3 3.7.4 5.4" fill="none" stroke="#6E4A1F" strokeWidth="2.6" strokeLinecap="round" />
      <path
        d="M34 12c11-2 22 6 22 18 0 14-11 24-24 24-9 0-16-6-16-14 0-13 8-26 18-28Z"
        fill="#9DAE3B"
      />
      <path
        d="M34 12c11-2 22 6 22 18 0 11-7 19.5-17 22.8 6.6-4.3 11-11.8 11-20.8 0-8.4-6-15.4-14-16.8-.7-.1-1.4-.2-2-.2Z"
        fill="#C7A81E"
        opacity="0.55"
      />
      <path d="M24 26c-2.6 4.6-3.7 9.5-3.3 14.6" fill="none" stroke="#C6D07A" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function MustardOilIllustration({ className, title, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      {/* mustard flowers */}
      <circle cx="15" cy="14" r="3" fill="#E3B417" />
      <circle cx="21" cy="10" r="2.4" fill="#D4A017" />
      <path d="M17 16c-1 2.4-1 4.8 0 7" stroke="#3F7A34" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* bottle */}
      <path d="M27 12h10v5l3 3v3h-16v-3l3-3v-5Z" fill="#7C4A1E" />
      <path
        d="M24 26h16c1.7 0 3 1.3 3 3v20c0 1.7-1.3 3-3 3H24c-1.7 0-3-1.3-3-3V29c0-1.7 1.3-3 3-3Z"
        fill="#C68A20"
      />
      <path d="M24 26h16c1.7 0 3 1.3 3 3v6H21v-6c0-1.7 1.3-3 3-3Z" fill="#E3B417" />
      <rect x="25" y="38" width="14" height="10" rx="2" fill="#F5EBDA" opacity="0.85" />
      <path d="M28 41h8M28 44h6" stroke="#7C4A1E" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function HingIllustration({ className, title, ...p }: SVGProps) {
  // Asafoetida (hing) — a rocky resin lump over a mountain origin, aroma rising.
  return (
    <svg viewBox="0 0 64 64" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      {/* origin mountains */}
      <path d="M6 44l12-16 8 10 9-13 11 15 12-9v20H6z" fill="#4B5D2A" opacity="0.18" />
      {/* aroma */}
      <path d="M28 20c-2-3 0-5 2-7M34 18c-2-3 0-5 2-7M40 20c-2-3 0-5 2-7" fill="none" stroke="#C05621" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
      {/* resin lumps */}
      <path
        d="M22 44c-4-1-6-5-4-9 1-3 4-4 5-7 2-4 8-5 11-2 2-2 6-1 7 2 3 0 5 3 4 6 2 2 1 6-2 7-2 4-9 6-14 5-4 0-8-.5-11-2Z"
        fill="#C99B3E"
      />
      <path d="M22 44c-4-1-6-5-4-9 .8-2.3 2.7-3.5 4-5.3-1.2 3-1.5 6.3-.5 9.5.6 1.9 1.6 3.5 2.9 4.8-.8 0-1.6 0-2.4 0Z" fill="#8C6521" opacity="0.5" />
      <circle cx="31" cy="34" r="2.2" fill="#7C4A1E" opacity="0.7" />
      <circle cx="38" cy="38" r="1.6" fill="#7C4A1E" opacity="0.6" />
    </svg>
  );
}

export function SpiceBowlIllustration({ className, title, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      {/* aroma */}
      <path d="M24 16c-2-3 0-5 2-7M32 13c-2-3 0-5 2-7M40 16c-2-3 0-5 2-7" fill="none" stroke="#C05621" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
      {/* mounds of spice */}
      <path d="M14 34c3-6 8-6 11 0Z" fill="#C05621" />
      <path d="M26 34c3-7 9-7 12 0Z" fill="#D4A017" />
      <path d="M38 34c3-6 8-6 11 0Z" fill="#7C4A1E" />
      {/* bowl */}
      <path d="M10 33h44c-1.5 10-10 17-22 17S11.5 43 10 33Z" fill="#8A5A2B" />
      <path d="M10 33h44c-.4 2.6-1.4 5-2.8 7H12.8C11.4 38 10.4 35.6 10 33Z" fill="#6E4520" />
      <ellipse cx="32" cy="33" rx="22" ry="4" fill="#A06A34" />
    </svg>
  );
}

export function PickleJarIllustration({ className, title, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      {/* lid */}
      <rect x="20" y="8" width="24" height="8" rx="2.5" fill="#7C4A1E" />
      <rect x="22" y="14" width="20" height="4" rx="1.5" fill="#5F3717" />
      {/* jar body */}
      <path d="M20 18h24c1.7 0 3 1.3 3 3v29c0 3.3-2.7 6-6 6H23c-3.3 0-6-2.7-6-6V21c0-1.7 1.3-3 3-3Z" fill="#C05621" opacity="0.16" />
      <path d="M20 18h24c1.7 0 3 1.3 3 3v29c0 3.3-2.7 6-6 6H23c-3.3 0-6-2.7-6-6V21c0-1.7 1.3-3 3-3Z" fill="none" stroke="#7C4A1E" strokeWidth="2" />
      {/* achar chunks */}
      <circle cx="27" cy="30" r="3.4" fill="#C0311F" />
      <circle cx="37" cy="33" r="3" fill="#D4A017" />
      <circle cx="31" cy="39" r="3.2" fill="#9DAE3B" />
      <circle cx="39" cy="43" r="2.6" fill="#C0311F" />
      <circle cx="26" cy="45" r="2.8" fill="#7C4A1E" />
      {/* label */}
      <rect x="22" y="48" width="20" height="6" rx="2" fill="#F5EBDA" opacity="0.9" />
      <path d="M25 51h14" stroke="#4B5D2A" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function MountainOriginIllustration({ className, title, ...p }: SVGProps) {
  // Small "origin" motif for the Hing band cards.
  return (
    <svg viewBox="0 0 64 64" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <circle cx="46" cy="18" r="7" fill="#E4B94B" opacity="0.85" />
      <path d="M6 50l14-22 9 12 8-14 12 18 9-8v14H6z" fill="#4B5D2A" />
      <path d="M20 28l5 7 3-5M37 26l4 6" fill="none" stroke="#F5EBDA" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}
