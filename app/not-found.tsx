import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Flower, Sparkle, Star } from "@/components/visuals/Ornaments";
import { BrandGlyph } from "@/components/layout/BrandGlyph";
import { PAGES } from "@/lib/constants/content";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** Shapes bleed off the corners, as on the owner's canvases. Decorative only. */
export default function NotFound() {
  const n = PAGES.notFound;
  return (
    <section aria-labelledby="page-title" className="relative isolate min-h-[88vh] overflow-hidden pb-24 pt-40">
      <Star className="-bottom-28 -left-20 -z-10 h-72 w-72 rotate-[14deg] sm:h-96 sm:w-96" />
      <Flower className="-right-20 top-28 -z-10 h-56 w-56 sm:h-72 sm:w-72" />
      <Sparkle className="bottom-24 left-[46%] -z-10 h-10 w-10 sm:h-14 sm:w-14" />
      <Container>
        <SectionHeader id="page-title" as="h1" title={n.title} description={n.body} />
        <div className="mt-10"><Button href={n.cta.href} size="lg" chevron>{n.cta.label}</Button></div>
      </Container>
      <BrandGlyph part="mark" className="absolute bottom-8 right-6 -z-10 h-9 text-ink sm:right-10 sm:h-12" />
    </section>
  );
}
