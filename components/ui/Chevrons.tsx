import { BrandGlyph } from "@/components/layout/BrandGlyph";

/** The `>>` motif, now at the logo's own geometry (traced from the solid mark) instead of a thin approximation. */
export function Chevrons({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return <BrandGlyph part="chevrons" className={className} />;
}
