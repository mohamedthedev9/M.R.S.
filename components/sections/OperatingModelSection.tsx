import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Chevrons } from "@/components/ui/Chevrons";
import { Logo } from "@/components/layout/Logo";
import { HOME } from "@/lib/constants/content";

export function OperatingModelSection() {
  const m = HOME.operatingModel;
  return (
    <Section id={m.id} labelledBy="model-title">
      <SectionHeader id="model-title" index="03" eyebrow="How it works" title={m.title} description={m.body} />
      <ol className="mt-12 grid gap-0 border-t border-line-strong sm:grid-cols-2 lg:grid-cols-4">
        {m.steps.map((s, i) => (
          <li key={s.name} className="relative border-b border-line py-7 sm:pr-8 lg:border-b-0 lg:pt-8">
            {/* The brand's two symbols carry the idea: the eagle observes, the chevrons execute. Fixed height keeps the columns aligned. */}
            <div aria-hidden="true" className="mb-4 flex h-6 items-center">
              {s.name === "Observe" && <Logo variant="eagle" className="h-5" />}
              {s.name === "Execute" && <Chevrons className="h-4 w-5 text-accent" />}
            </div>
            <p className="flex items-center gap-2 font-mono text-xs text-accent">
              {String(i + 1).padStart(2, "0")}{i < m.steps.length - 1 && <Chevrons className="h-2.5 w-2.5 text-ink-muted" />}
            </p>
            <h3 className="mt-3 font-display text-3xl font-semibold text-ink">{s.name}</h3>
            <p className="mt-3 max-w-xs text-ink-2">{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
