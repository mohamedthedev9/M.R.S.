import { cn } from "@/lib/utils/cn";
import { BrandGlyph } from "@/components/layout/BrandGlyph";

/**
 * The owner's canvases use bold solid white shapes that BLEED off the corners. This rebuilds that language from
 * (a) the logo's own geometry and (b) a few plain geometric shapes drawn here. Nothing is lifted from template artwork.
 * Decorative only (aria-hidden). Use sparingly: personality moments (404, thank-you), never inside service content.
 */
type P = { className?: string };
const base = "pointer-events-none absolute select-none fill-current text-ink";

export function Star({ className }: P) {
  // five-pointed star, slightly irregular like the originals
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={cn(base, className)}>
      <path d="M50 3 L62.5 36.5 L98 38.5 L70 60.5 L79.5 95 L50 75 L20.5 95 L30 60.5 L2 38.5 L37.5 36.5 Z" />
    </svg>
  );
}
export function Sparkle({ className }: P) {
  // four-pointed concave star
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={cn(base, className)}>
      <path d="M50 0 C53 34 66 47 100 50 C66 53 53 66 50 100 C47 66 34 53 0 50 C34 47 47 34 50 0 Z" />
    </svg>
  );
}
export function Flower({ className }: P) {
  // six rounded petals around a centre
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={cn(base, className)}>
      {[0, 60, 120, 180, 240, 300].map((r) => <ellipse key={r} cx="50" cy="24" rx="13" ry="22" transform={`rotate(${r} 50 50)`} />)}
      <circle cx="50" cy="50" r="15" />
    </svg>
  );
}
export function BleedChevrons({ className }: P) {
  return <BrandGlyph part="chevrons" className={cn(base, "h-auto", className)} />;
}
