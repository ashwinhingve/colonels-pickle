/**
 * Colonel's Pickle — larger scene / empty-state / hero illustrations.
 *
 * Companion to ./index.tsx (which holds the small benefit icons + ingredient
 * motifs). Same rules: pure presentational SVG (no hooks → server-safe), coloured
 * from the "Olive Heritage" palette, `aria-hidden` unless a `title` is supplied.
 * Parents add motion (framer-motion / animate-* classes).
 *
 * Palette: olive #4B5D2A / #6B7F3A / #E8EBD9, terracotta #C05621 / #DD7230 / #FBE5D6,
 * gold #D4A017 / #E4B94B, brown #7C4A1E / #5F3717, beige #F5EBDA / #EADFC8, green #3F7A34.
 */
import * as React from "react";

type SVGProps = React.SVGProps<SVGSVGElement> & { title?: string };

const base = (props: { title?: string }) => ({
  role: "img" as const,
  "aria-hidden": props.title ? undefined : true,
  focusable: false as const,
});

/* ═══════════════════════════ Empty-state spot illustrations (200×200) ═══════════════════════════ */

export function EmptyCartIllustration({ className, title, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <circle cx="100" cy="100" r="86" fill="#E8EBD9" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#D3DAB8" strokeWidth="1.5" strokeDasharray="3 7" />
      {/* dashed "empty" jar floating above */}
      <g opacity="0.6">
        <rect x="86" y="40" width="28" height="9" rx="2.5" fill="none" stroke="#7C4A1E" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M87 51h26c1.6 0 3 1.3 3 3v20c0 3-2.4 5.4-5.4 5.4H89.4C86.4 79.4 84 77 84 74V54c0-1.7 1.3-3 3-3Z" fill="none" stroke="#7C4A1E" strokeWidth="2" strokeDasharray="5 5" />
      </g>
      {/* wicker basket */}
      <path d="M50 96h100l-10 52c-.7 3.6-3.9 6.2-7.6 6.2H67.6c-3.7 0-6.9-2.6-7.6-6.2L50 96Z" fill="#C68A50" />
      <path d="M50 96h100l-10 52c-.7 3.6-3.9 6.2-7.6 6.2H67.6c-3.7 0-6.9-2.6-7.6-6.2L50 96Z" fill="#7C4A1E" opacity="0.18" />
      <rect x="44" y="90" width="112" height="12" rx="6" fill="#7C4A1E" />
      {/* weave lines */}
      <g stroke="#8A5A2B" strokeWidth="2" opacity="0.5">
        <path d="M64 104l4 44M84 104l2.5 46M116 104l-2.5 46M136 104l-4 44" />
        <path d="M54 116h92M57 132h86M60 146h80" />
      </g>
      {/* handle */}
      <path d="M70 92c4-20 56-20 60 0" fill="none" stroke="#7C4A1E" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyWishlistIllustration({ className, title, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <circle cx="100" cy="100" r="86" fill="#FBE5D6" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#F0C9A8" strokeWidth="1.5" strokeDasharray="3 7" />
      {/* jar */}
      <rect x="74" y="58" width="52" height="14" rx="4" fill="#7C4A1E" />
      <path d="M76 74h48c2.2 0 4 1.8 4 4v54c0 5.5-4.5 10-10 10H82c-5.5 0-10-4.5-10-10V78c0-2.2 1.8-4 4-4Z" fill="#FFFFFF" />
      <path d="M76 74h48c2.2 0 4 1.8 4 4v54c0 5.5-4.5 10-10 10H82c-5.5 0-10-4.5-10-10V78c0-2.2 1.8-4 4-4Z" fill="none" stroke="#7C4A1E" strokeWidth="2.4" />
      {/* heart inside */}
      <path d="M100 128c-14-8-20-16-20-24 0-6 4.6-10 10-10 4 0 7.6 2.4 10 6 2.4-3.6 6-6 10-6 5.4 0 10 4 10 10 0 8-6 16-20 24Z" fill="#C05621" />
      <path d="M100 128c-14-8-20-16-20-24 0-6 4.6-10 10-10 4 0 7.6 2.4 10 6 0 0-6 3-6 12 0 7 3 12 6 16Z" fill="#9C4420" opacity="0.4" />
    </svg>
  );
}

export function EmptyOrdersIllustration({ className, title, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <circle cx="100" cy="100" r="86" fill="#E8EBD9" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#D3DAB8" strokeWidth="1.5" strokeDasharray="3 7" />
      {/* parcel box */}
      <path d="M100 62l44 22v40l-44 22-44-22V84l44-22Z" fill="#D8A76A" />
      <path d="M100 62l44 22-44 22-44-22 44-22Z" fill="#E4BE86" />
      <path d="M100 106v62l44-22V84l-44 22Z" fill="#B5824A" />
      <path d="M100 106v62L56 146V84l44 22Z" fill="#C68A50" />
      {/* tape */}
      <path d="M100 62l44 22-44 22-44-22 44-22Z" fill="none" stroke="#7C4A1E" strokeWidth="1.5" opacity="0.3" />
      <path d="M78 73l44 22M100 84v22" stroke="#7C4A1E" strokeWidth="2" opacity="0.35" />
      {/* label */}
      <rect x="86" y="120" width="28" height="20" rx="2" fill="#F5EBDA" transform="skewY(-6)" opacity="0.9" />
      <path d="M91 124h18M91 130h12" stroke="#4B5D2A" strokeWidth="1.6" strokeLinecap="round" transform="skewY(-6)" opacity="0.7" />
    </svg>
  );
}

export function NoResultsIllustration({ className, title, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <circle cx="100" cy="100" r="86" fill="#E8EBD9" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#D3DAB8" strokeWidth="1.5" strokeDasharray="3 7" />
      {/* magnifier lens */}
      <circle cx="90" cy="90" r="38" fill="#FBF4E7" />
      <circle cx="90" cy="90" r="38" fill="none" stroke="#4B5D2A" strokeWidth="5" />
      {/* empty jar inside the lens */}
      <rect x="80" y="72" width="20" height="6" rx="2" fill="#7C4A1E" />
      <path d="M81 78h18c1.2 0 2 .9 2 2v20c0 3-2.4 5.4-5.4 5.4H84.4C81.4 105.4 79 103 79 100V80c0-1.1.9-2 2-2Z" fill="none" stroke="#7C4A1E" strokeWidth="2" />
      <path d="M84 94h12" stroke="#C05621" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      {/* handle */}
      <path d="M118 118l22 22" stroke="#7C4A1E" strokeWidth="8" strokeLinecap="round" />
      {/* question sparkles */}
      <path d="M150 62c-2-2-2-5 .4-6.4 2-1.2 4.4-.2 5 2M156 66v.02" stroke="#D4A017" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function SpilledJarIllustration({ className, title, ...p }: SVGProps) {
  // 404 / error mascot — a tipped-over jar with pickle chunks spilling out.
  return (
    <svg viewBox="0 0 220 180" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      {/* shadow */}
      <ellipse cx="112" cy="150" rx="86" ry="12" fill="#4B5D2A" opacity="0.12" />
      {/* tipped jar (rotated) */}
      <g transform="rotate(-24 96 108)">
        <rect x="60" y="70" width="26" height="76" rx="4" fill="#7C4A1E" />
        <path d="M86 60h58c2.2 0 4 1.8 4 4v52c0 2.2-1.8 4-4 4H86V60Z" fill="#FFFFFF" opacity="0.9" />
        <path d="M86 60h58c2.2 0 4 1.8 4 4v52c0 2.2-1.8 4-4 4H86V60Z" fill="none" stroke="#7C4A1E" strokeWidth="2.6" />
        <rect x="94" y="98" width="46" height="12" rx="2.5" fill="#F5EBDA" />
        <path d="M100 104h34" stroke="#4B5D2A" strokeWidth="1.8" strokeLinecap="round" />
      </g>
      {/* spilled chunks */}
      <circle cx="130" cy="132" r="9" fill="#C0311F" />
      <circle cx="150" cy="142" r="7" fill="#D4A017" />
      <circle cx="168" cy="130" r="8" fill="#9DAE3B" />
      <circle cx="188" cy="140" r="5.5" fill="#C05621" />
      <circle cx="146" cy="126" r="5" fill="#7C4A1E" opacity="0.8" />
      {/* a little brine splash */}
      <path d="M120 120c8 4 18 6 30 5" fill="none" stroke="#D4A017" strokeWidth="2.4" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/* ═══════════════════════════ Trust / delivery ═══════════════════════════ */

export function DeliveryTruckIllustration({ className, title, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 96 64" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      {/* motion lines */}
      <path d="M2 24h12M0 34h9M4 44h10" stroke="#D4A017" strokeWidth="2.4" strokeLinecap="round" opacity="0.6" />
      {/* box body */}
      <rect x="18" y="16" width="42" height="30" rx="3" fill="#4B5D2A" />
      <rect x="18" y="16" width="42" height="30" rx="3" fill="#3A4A1F" opacity="0.001" />
      {/* jar on the side of the box */}
      <rect x="34" y="24" width="12" height="4" rx="1.5" fill="#F5EBDA" opacity="0.9" />
      <rect x="35" y="28" width="10" height="12" rx="2" fill="#F5EBDA" opacity="0.9" />
      <path d="M37 33h6" stroke="#C05621" strokeWidth="1.6" strokeLinecap="round" />
      {/* cab */}
      <path d="M60 24h14l10 10v12H60V24Z" fill="#C05621" />
      <path d="M63 27h9l6.5 6.5H63V27Z" fill="#FBE5D6" opacity="0.85" />
      {/* wheels */}
      <circle cx="33" cy="48" r="7" fill="#2A2417" />
      <circle cx="33" cy="48" r="2.6" fill="#9C9382" />
      <circle cx="72" cy="48" r="7" fill="#2A2417" />
      <circle cx="72" cy="48" r="2.6" fill="#9C9382" />
    </svg>
  );
}

export interface CertSealProps extends SVGProps {
  /** Short label rendered in the centre, e.g. "FSSAI". */
  label?: string;
}

export function CertSeal({ className, title, label = "FSSAI", ...p }: CertSealProps) {
  // A scalloped rosette "verified" seal. Text is drawn inside so it reads as a stamp.
  const points = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i * Math.PI) / 8;
    const r = i % 2 === 0 ? 54 : 47;
    return `${60 + Math.cos(angle) * r},${60 + Math.sin(angle) * r}`;
  });
  return (
    <svg viewBox="0 0 120 120" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <polygon points={points.join(" ")} fill="#4B5D2A" />
      <circle cx="60" cy="60" r="42" fill="none" stroke="#E4B94B" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="36" fill="#FBF4E7" />
      {/* checkmark */}
      <path d="M44 60l11 11 22-24" fill="none" stroke="#166534" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <text
        x="60"
        y="86"
        textAnchor="middle"
        fontFamily="'Mukta', system-ui, sans-serif"
        fontSize="12"
        fontWeight="700"
        fill="#4B5D2A"
      >
        {label}
      </text>
    </svg>
  );
}

/* ═══════════════════════════ Page-hero accents ═══════════════════════════ */

export function ContactIllustration({ className, title, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 200 160" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <ellipse cx="100" cy="140" rx="76" ry="10" fill="#4B5D2A" opacity="0.1" />
      {/* envelope */}
      <rect x="40" y="52" width="120" height="80" rx="8" fill="#F5EBDA" stroke="#7C4A1E" strokeWidth="2.5" />
      <path d="M40 60l60 44 60-44" fill="none" stroke="#7C4A1E" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M40 60l60 44 60-44V56a4 4 0 0 0-4-4H44a4 4 0 0 0-4 4v4Z" fill="#C05621" opacity="0.9" />
      {/* map pin popping out */}
      <path d="M100 18c-12 0-21 9-21 21 0 15 21 33 21 33s21-18 21-33c0-12-9-21-21-21Z" fill="#4B5D2A" />
      <circle cx="100" cy="39" r="8" fill="#F5EBDA" />
      {/* aroma-ish sparkle */}
      <path d="M150 30c-2-2-2-4 .3-5.2M158 40h.02" stroke="#D4A017" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  );
}

export function FAQIllustration({ className, title, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 200 160" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      {/* answer bubble */}
      <path d="M30 40h96c6.6 0 12 5.4 12 12v34c0 6.6-5.4 12-12 12H70l-18 16v-16H30c-6.6 0-12-5.4-12-12V52c0-6.6 5.4-12 12-12Z" fill="#4B5D2A" />
      <text x="52" y="82" fontFamily="'Playfair Display', Georgia, serif" fontSize="46" fontWeight="800" fill="#F5EBDA">?</text>
      {/* question bubble (small, terracotta) */}
      <path d="M130 92h44c5 0 9 4 9 9v22c0 5-4 9-9 9h-8l10 12-20-12h-26c-5 0-9-4-9-9v-22c0-5 4-9 9-9Z" fill="#C05621" />
      <circle cx="146" cy="112" r="2.6" fill="#F5EBDA" />
      <circle cx="156" cy="112" r="2.6" fill="#F5EBDA" />
      <circle cx="166" cy="112" r="2.6" fill="#F5EBDA" />
    </svg>
  );
}

export function WelcomeIllustration({ className, title, ...p }: SVGProps) {
  // Login / welcome — an open jar greeting you, steam rising.
  return (
    <svg viewBox="0 0 200 180" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <ellipse cx="100" cy="158" rx="70" ry="10" fill="#4B5D2A" opacity="0.1" />
      {/* steam / aroma */}
      <path d="M84 44c-6-7 0-13 4-18M100 40c-6-7 0-13 4-18M116 44c-6-7 0-13 4-18" fill="none" stroke="#C05621" strokeWidth="3" strokeLinecap="round" className="animate-wisp" opacity="0.55" />
      {/* open lid tilted */}
      <g transform="rotate(-16 70 58)">
        <rect x="52" y="50" width="44" height="12" rx="4" fill="#7C4A1E" />
      </g>
      {/* jar */}
      <path d="M64 70h72c3.3 0 6 2.7 6 6v70c0 8-6.5 14.5-14.5 14.5H72.5C64.5 160.5 58 154 58 146V76c0-3.3 2.7-6 6-6Z" fill="#FFFFFF" />
      <path d="M64 70h72c3.3 0 6 2.7 6 6v70c0 8-6.5 14.5-14.5 14.5H72.5C64.5 160.5 58 154 58 146V76c0-3.3 2.7-6 6-6Z" fill="none" stroke="#7C4A1E" strokeWidth="3" />
      {/* contents */}
      <path d="M60 108h80v38c0 8-6.5 14.5-14.5 14.5H74.5C66.5 160.5 60 154 60 146v-38Z" fill="#C05621" opacity="0.85" />
      <circle cx="82" cy="122" r="6" fill="#D4A017" />
      <circle cx="104" cy="130" r="7" fill="#9DAE3B" />
      <circle cx="124" cy="122" r="5.5" fill="#C0311F" />
      {/* label */}
      <rect x="74" y="118" width="52" height="20" rx="4" fill="#F5EBDA" opacity="0.55" />
      <path d="M84 128h32" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

export function WholesaleIllustration({ className, title, ...p }: SVGProps) {
  // Stacked crates of jars for the B2B page.
  return (
    <svg viewBox="0 0 200 160" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <ellipse cx="100" cy="148" rx="82" ry="10" fill="#4B5D2A" opacity="0.1" />
      {/* back crate */}
      <rect x="96" y="52" width="70" height="46" rx="4" fill="#8A5A2B" />
      <rect x="96" y="52" width="70" height="46" rx="4" fill="none" stroke="#5F3717" strokeWidth="2" />
      <path d="M96 68h70M96 82h70M114 52v46M140 52v46" stroke="#5F3717" strokeWidth="1.5" opacity="0.5" />
      {/* front crate */}
      <rect x="34" y="86" width="80" height="52" rx="4" fill="#C68A50" />
      <rect x="34" y="86" width="80" height="52" rx="4" fill="none" stroke="#5F3717" strokeWidth="2" />
      <path d="M34 104h80M34 120h80M60 86v52M88 86v52" stroke="#5F3717" strokeWidth="1.5" opacity="0.5" />
      {/* jars peeking from front crate */}
      {[46, 74, 92].map((x, i) => (
        <g key={i}>
          <rect x={x} y="70" width="16" height="5" rx="1.6" fill="#7C4A1E" />
          <rect x={x + 1} y="74" width="14" height="16" rx="2.5" fill="#F5EBDA" />
          <path d={`M${x + 4} 82h8`} stroke="#C05621" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

export function HearthIllustration({ className, title, ...p }: SVGProps) {
  // Story motif — a home cooking pot on a warm flame (Maa Ka Pyaar).
  return (
    <svg viewBox="0 0 200 160" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      {/* aroma */}
      <path d="M80 40c-6-8 0-14 4-19M100 36c-6-8 0-14 4-19M120 40c-6-8 0-14 4-19" fill="none" stroke="#C05621" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      {/* pot */}
      <path d="M52 58h96l-6 54c-1 9-8.6 15.6-17.6 15.6H75.6C66.6 127.6 59 121 58 112L52 58Z" fill="#4B5D2A" />
      <rect x="46" y="52" width="108" height="12" rx="6" fill="#3A4A1F" />
      <path d="M36 66c-6 0-10 6-6 11M164 66c6 0 10 6 6 11" fill="none" stroke="#3A4A1F" strokeWidth="5" strokeLinecap="round" />
      {/* flame */}
      <path d="M100 132c-10 0-17 7-17 16 0 8 7 12 17 12s17-4 17-12c0-9-7-16-17-16Z" fill="#DD7230" />
      <path d="M100 140c-5 0-9 4-9 9s4 7 9 7 9-3 9-7-4-9-9-9Z" fill="#E4B94B" />
    </svg>
  );
}

/* ═══════════════════════════ Decorative accents ═══════════════════════════ */

export function DogTagIllustration({ className, title, ...p }: SVGProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <g>
        <ellipse cx="32" cy="12" rx="8" ry="6" fill="#D4A017" opacity="0.9" />
        <circle cx="24" cy="8" r="2.4" fill="#E4B94B" opacity="0.7" />
        <circle cx="32" cy="5.5" r="2.2" fill="#E4B94B" opacity="0.7" />
        <circle cx="40" cy="8" r="2.4" fill="#E4B94B" opacity="0.7" />
        <line x1="24" y1="12" x2="24" y2="22" stroke="#C0974F" strokeWidth="1.8" opacity="0.6" />
        <line x1="40" y1="12" x2="40" y2="22" stroke="#C0974F" strokeWidth="1.8" opacity="0.6" />
      </g>
      <g>
        <rect x="18" y="22" width="28" height="34" rx="4" fill="#6B7F3A" stroke="#4B5D2A" strokeWidth="1.8" />
        <path d="M22 28h20M22 36h20M22 44h20" stroke="#4B5D2A" strokeWidth="1" opacity="0.4" />
        <rect x="26" y="52" width="12" height="3" rx="1.5" fill="#4B5D2A" opacity="0.3" />
        <path d="M32 52v2" stroke="#D4A017" strokeWidth="0.8" opacity="0.6" />
        <path d="M30 56l4-1 4 1" fill="none" stroke="#4B5D2A" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      </g>
      <ellipse cx="32" cy="57" rx="3" ry="2" fill="#4B5D2A" opacity="0.4" />
    </svg>
  );
}

export function CornerFlourish({ className, title, ...p }: SVGProps) {
  // Rajasthani-style corner motif. Place in a corner and rotate via className.
  return (
    <svg viewBox="0 0 80 80" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <path d="M4 4c22 0 40 18 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.8" />
      <path d="M4 14c16 0 30 14 30 30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.8" />
      <path d="M22 6c3 0 5 2 5 5M6 22c0 3 2 5 5 5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      <path d="M40 40c6-2 10-6 12-12" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
    </svg>
  );
}

export function SpiceScatter({ className, title, ...p }: SVGProps) {
  // A light scatter of seeds / spice specks for section backgrounds.
  return (
    <svg viewBox="0 0 120 60" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <g fill="currentColor">
        <ellipse cx="12" cy="18" rx="2.4" ry="1.5" transform="rotate(24 12 18)" />
        <ellipse cx="34" cy="40" rx="2.2" ry="1.3" transform="rotate(-18 34 40)" />
        <ellipse cx="58" cy="14" rx="2.6" ry="1.6" transform="rotate(40 58 14)" />
        <ellipse cx="76" cy="44" rx="2.1" ry="1.3" transform="rotate(-30 76 44)" />
        <ellipse cx="98" cy="22" rx="2.5" ry="1.5" transform="rotate(12 98 22)" />
        <ellipse cx="110" cy="46" rx="2" ry="1.2" transform="rotate(-8 110 46)" />
        <circle cx="24" cy="30" r="1.4" />
        <circle cx="66" cy="32" r="1.3" />
        <circle cx="88" cy="12" r="1.2" />
      </g>
    </svg>
  );
}

export function WebbingStitchAccent({ className, title, ...p }: SVGProps) {
  // Canvas webbing double-stitch border accent. Pair of dashed parallel lines with cross-stitches.
  return (
    <svg viewBox="0 0 200 14" className={className} {...base({ title })} {...p}>
      {title ? <title>{title}</title> : null}
      <g stroke="currentColor" strokeWidth="1" fill="none" opacity="0.65">
        <path d="M0 4 L200 4" strokeDasharray="6 5" />
        <path d="M0 10 L200 10" strokeDasharray="6 5" />
        <g strokeWidth="1.2" opacity="0.5">
          <line x1="20" y1="2" x2="20" y2="12" />
          <line x1="50" y1="2" x2="50" y2="12" />
          <line x1="80" y1="2" x2="80" y2="12" />
          <line x1="110" y1="2" x2="110" y2="12" />
          <line x1="140" y1="2" x2="140" y2="12" />
          <line x1="170" y1="2" x2="170" y2="12" />
        </g>
      </g>
    </svg>
  );
}
