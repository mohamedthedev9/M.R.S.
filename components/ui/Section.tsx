import { Container } from "./Container";
import { cn } from "@/lib/utils/cn";

/** A page band: top rule, generous rhythm, and a labelled region when `labelledBy` is given. */
export function Section({ id, labelledBy, className, children, bare = false }: {
  id?: string; labelledBy?: string; className?: string; children: React.ReactNode; bare?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(bare ? "pb-[var(--space-section)] pt-10 sm:pt-12" : "border-t border-line py-[var(--space-section)]", className)}>
      <Container>{children}</Container>
    </section>
  );
}
