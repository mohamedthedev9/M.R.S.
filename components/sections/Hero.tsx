import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SplitHeadline } from "@/components/ui/SplitHeadline";
import { HeroSystemMap } from "@/components/visuals/HeroSystemMap";
import { HOME } from "@/lib/constants/content";

export function Hero() {
  const h = HOME.hero;
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pb-20 pt-32 sm:pt-40 lg:pb-28">
      <Container className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
        <div>
          <p className="mb-5 font-mono text-xs text-ink-muted">{h.meta}</p>
          <h1 id="hero-title" className="font-display text-display-xl font-semibold text-ink"><SplitHeadline text={h.title} /></h1>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-2 sm:text-xl">{h.body}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={h.primaryCta.href} size="lg" chevron>{h.primaryCta.label}</Button>
            <Button href={h.secondaryCta.href} size="lg" variant="secondary">{h.secondaryCta.label}</Button>
          </div>
        </div>
        <HeroSystemMap />
      </Container>
    </section>
  );
}
