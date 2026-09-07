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
        <p className="mb-2 font-hindi text-xs font-bold uppercase tracking-widest text-cp-crimson">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "sec-title-underline font-display text-3xl font-extrabold text-cp-text md:text-4xl",
          isLeft && "left"
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-4 max-w-[500px] font-serif text-[15.5px] leading-relaxed text-cp-text-muted",
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
