import { cn } from "@/lib/utils/cn";
import { Chevrons } from "./Chevrons";
import { BrandText } from "./Brand";

/**
 * `index` is for sections that are genuinely a sequence (homepage story, process steps).
 * `eyebrow` is optional: use it only when it adds information, not above every heading.
 */
export function SectionHeader({ title, description, eyebrow, index, as: H = "h2", className, id }: {
  id?: string; title: string; description?: string; eyebrow?: string; index?: string; as?: "h1" | "h2" | "h3"; className?: string;
}) {
  return (
    <header className={cn("max-w-2xl", className)}>
      {(index || eyebrow) && (
        <p className="mb-4 flex items-center gap-3 font-mono text-xs text-ink-muted">
          {index && <span className="text-accent">{index}</span>}
          {index && eyebrow && <Chevrons className="h-2.5 w-2.5 text-ink-muted" />}
          {eyebrow && <span>{eyebrow}</span>}
        </p>
      )}
      <H id={id} className={cn("font-display font-semibold text-balance text-ink", H === "h1" ? "text-display-xl" : "text-display-lg")}><BrandText text={title} /></H>
      {description && <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-2">{description}</p>}
    </header>
  );
}
