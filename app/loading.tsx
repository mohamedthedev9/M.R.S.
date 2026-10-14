import { BrandGlyph } from "@/components/layout/BrandGlyph";
import { LoadingBar } from "@/components/ui/Loaders";

/** Shown while a route segment loads (Next.js loading UI). Quiet: the brand mark and the pill bar. */
export default function Loading() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-6 pt-24">
      <div className="flex flex-col items-center gap-8">
        <BrandGlyph part="mark" className="h-10 text-ink" />
        <LoadingBar />
        <span className="sr-only" role="status">Loading</span>
      </div>
    </div>
  );
}
