import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  const isLeft = align === "left";

  return (
    <div className={cn(isLeft ? "text-left" : "text-center", className)}>
      {eyebrow ? (
        <p className="mb-2 font-hindi text-xs font-bold uppercase tracking-widest text-cp-gold">
          {eyebrow}
        </p>
      ) : null}
      <div className={cn("relative inline-block", isLeft ? "" : "mx-auto")}>
        <h2
          className={cn(
            "sec-title-underline font-display text-3xl font-extrabold text-cp-text md:text-4xl uppercase tracking-wide relative",
            isLeft && "left"
          )}
        >
          {title}
        </h2>
        {/* ── Gold underline accent ── */}
        <div className={cn(
          "absolute -bottom-2 h-1 bg-gradient-to-r from-cp-gold to-transparent rounded-full",
          isLeft ? "left-0 w-32" : "left-1/2 -translate-x-1/2 w-48"
        )} />
      </div>
      {subtitle ? (
        <p
          className={cn(
            "mt-6 max-w-[500px] font-serif text-[15.5px] leading-relaxed text-cp-text-muted",
            !isLeft && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default SectionHeader;
