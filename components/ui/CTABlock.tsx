import { Button } from "./Button";
import { Container } from "./Container";
import { Swirl } from "@/components/visuals/Swirl";

export function CTABlock({ title, description, primary, secondary }: {
  title: string; description?: string; primary: { label: string; href: string }; secondary?: { label: string; href: string };
}) {
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden border-y border-line py-[var(--space-section)]">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <Swirl className="left-1/2 top-1/2 -z-10 aspect-square w-[min(150vw,64rem)] -translate-x-1/2 -translate-y-1/2 opacity-[0.45]" />
      <Container>
        <h2 id="cta-title" className="max-w-3xl font-display text-display-lg font-semibold text-balance">{title}</h2>
        {description && <p className="mt-5 max-w-prose text-lg text-ink-2">{description}</p>}
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={primary.href} size="lg" chevron>{primary.label}</Button>
          {secondary && <Button href={secondary.href} size="lg" variant="secondary">{secondary.label}</Button>}
        </div>
      </Container>
    </section>
  );
}
