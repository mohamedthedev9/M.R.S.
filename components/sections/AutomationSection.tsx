import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { TechBadge } from "@/components/ui/Badges";
import { AutomationFlow } from "@/components/visuals/AutomationFlow";
import { HOME } from "@/lib/constants/content";

/** Full-width layout (the others are split) to vary the page rhythm. */
export function AutomationSection() {
  const a = HOME.automation;
  return (
    <Section id="automation" labelledBy="automation-title">
      <SectionHeader id="automation-title" index="05" eyebrow="Automation" title={a.title} description={a.body} />
      {/* Before -> after as a progression of emphasis (rule weight and colour), deliberately not another row of boxes. */}
      <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-0">
        {a.transform.map((t, i) => (
          <li key={t.stage} className={`border-l-2 pl-5 md:pr-8 ${["border-line-strong", "border-accent/50", "border-accent"][i]}`}>
            <p className={`font-display text-2xl font-semibold ${i === 0 ? "text-ink-muted" : "text-ink"}`}>{t.stage}</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-2">{t.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10"><AutomationFlow /></div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
        <ul aria-label="Examples of what can be automated" className="flex flex-wrap gap-2">{a.examples.map((e) => <li key={e}><TechBadge>{e}</TechBadge></li>)}</ul>
        <Button href={a.cta.href} variant="secondary" chevron>{a.cta.label}</Button>
      </div>
    </Section>
  );
}
