import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { BrandGlyph } from "./BrandGlyph";

/**
 * Official artwork only. Do not recolor, outline, stretch or add glow.
 * Clear space = cap-height of the "M" on all sides (apply via parent padding).
 * Provisional minimums: wordmark >= 96px wide, eagle >= 24px wide.
 * Source is raster (555px wide): keep the wordmark <= ~280px wide until a vector exists.
 */
export function Logo({ variant = "wordmark", className, priority = false }: {
  variant?: "wordmark" | "eagle" | "mark"; className?: string; priority?: boolean;
}) {
  if (variant === "eagle") return <BrandGlyph part="eagle" title="M.R.S." className={className} />;
  if (variant === "mark") return <BrandGlyph part="mark" title="M.R.S." className={className} />;
  return (
    <Image src="/brand/mrs-wordmark-white.png" alt="M.R.S." width={555} height={131} priority={priority} sizes="140px"
      className={cn("h-7 w-auto", className)} />
  );
}
