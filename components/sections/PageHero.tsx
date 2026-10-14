import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Header band for inner pages. Exactly one <h1> per page lives here (or in the service hero). */
export function PageHero({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <section aria-labelledby="page-title" className="relative isolate overflow-hidden pb-16 pt-32 sm:pt-40">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-70" />
      <Container className={children ? "grid items-end gap-10 lg:grid-cols-[1.3fr_1fr]" : undefined}>
        <SectionHeader id="page-title" as="h1" title={title} description={description} />
        {children}
      </Container>
    </section>
  );
}
