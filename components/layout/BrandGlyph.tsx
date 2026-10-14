import { VB_CHEV, VB_EAGLE, VB_MARK } from "@/lib/brand-paths";

/**
 * Vector parts of the official mark. Colour is `currentColor` (keep it white / off-white: never recolour the logo).
 * Needs <BrandSprite/> on the page (SiteShell renders it).
 *   part="mark"     chevrons + eagle lockup
 *   part="eagle"    eagle only (compact: favicon-size, hub node)
 *   part="chevrons" the >> motif at the logo's exact geometry
 */
export function BrandGlyph({ part = "mark", className, title }: { part?: "mark" | "eagle" | "chevrons"; className?: string; title?: string }) {
  const vb = part === "eagle" ? VB_EAGLE : part === "chevrons" ? VB_CHEV : VB_MARK;
  return (
    <svg viewBox={vb} fill="currentColor" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} className={className ?? "h-7"}>
      {(part === "mark" || part === "chevrons") && <use href="#mrs-p-chev" />}
      {(part === "mark" || part === "eagle") && <use href="#mrs-p-eagle" />}
    </svg>
  );
}
