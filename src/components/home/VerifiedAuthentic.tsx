"use client";

import { PUBLIC_REGISTRATIONS } from "@/lib/constants";
import { ShieldCheckIcon } from "@/components/illustrations";
import { StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";
import { HoverLift } from "@/components/shared/HoverLift";

export function VerifiedAuthentic() {
  return (
    <section className="relative overflow-hidden bg-white py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-cp-olive-light px-4 py-1.5 font-sans text-xs font-bold uppercase tracking-widest text-cp-olive border-2 border-cp-olive/30">
            <ShieldCheckIcon className="h-4 w-4" />
            REGIMENTAL CERTIFICATIONS
          </span>
          <h2 className="sec-title-underline font-display text-3xl font-extrabold text-cp-text md:text-4xl">
            Verified &amp; Registered
          </h2>
          <p className="mt-2 max-w-2xl font-serif text-[15px] leading-relaxed text-cp-text-muted">
            Colonel&apos;s Pickle is a fully licensed and registered food business under Ridhwika Agro Organics. Every claim we make is backed by official Government of India registration.
          </p>
        </div>

        <p className="mt-6 text-center font-sans text-xs font-bold uppercase tracking-widest text-cp-gold">
          ⚔️ Officially Licensed by Government of India
        </p>

        <StaggerContainer staggerDelay={0.1}>
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
            {PUBLIC_REGISTRATIONS.map((r) => (
              <StaggerItem key={r.key}>
                <HoverLift lift={4}>
                  <div className="group flex h-full flex-col rounded-2xl border-2 border-cp-gold/40 bg-cp-cream p-6 shadow-sm transition-all duration-300 hover:border-cp-gold/80 hover:shadow-md relative overflow-hidden">
                    {/* ── Gold left accent bar ── */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cp-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* ── Insignia seal ── */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-cp-gold text-xl z-10">⚔️</div>
                    
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm ring-1 ring-cp-border-dark mt-2">
                      {r.icon}
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-cp-olive uppercase">
                      {r.label}
                    </h3>
                    <p className="mt-1 font-sans text-[11px] uppercase tracking-wide text-cp-text-muted">
                      {r.fullName}
                    </p>
                    <p className="mt-3 select-all break-all font-mono text-[13px] font-bold text-cp-gold">
                      {r.number}
                    </p>
                    <p className="mt-1 font-serif text-xs leading-relaxed text-cp-text-muted">
                      {r.detail}
                    </p>
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        <p className="mt-8 text-center font-sans text-xs text-cp-text-light">
          ⚔️ Regimental Credentials — Full documentation available on request · Manufactured by Ridhwika Agro Organics, Jaipur, Rajasthan
        </p>
      </div>
    </section>
  );
}

export default VerifiedAuthentic;
