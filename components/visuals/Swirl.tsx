import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/**
 * The owner's light-streak vortex as a quiet backdrop. The image is cropped so the vortex's DARK EYE is at the exact centre:
 * place the eye behind the thing that matters (the hub, a headline), exactly like the owner's "Signature" card places the logo.
 * Decorative: empty alt, aria-hidden, never receives pointer events. Static (no animation loop).
 * A radial mask fades it out before any edge, so it can bleed beyond its box without a visible border.
 */
export function Swirl({ className, priority = false }: { className?: string; priority?: boolean }) {
  const mask = "radial-gradient(closest-side, #000 38%, transparent 100%)";
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute", className)} style={{ maskImage: mask, WebkitMaskImage: mask }}>
      <Image src="/images/swirl.webp" alt="" fill sizes="(min-width: 1024px) 60vw, 120vw" priority={priority} className="select-none object-cover" />
    </div>
  );
}
