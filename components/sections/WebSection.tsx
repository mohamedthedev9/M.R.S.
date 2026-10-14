import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { WebShowcase } from "@/components/visuals/WebShowcase";
import { HOME } from "@/lib/constants/content";

export function WebSection() {
  const w = HOME.web;
  return (
    <Section id="web" labelledBy="web-title">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <WebShowcase className="order-2 lg:order-1" />
        <div className="order-1 lg:order-2">
          <SectionHeader id="web-title" index="06" eyebrow="Web development" title={w.title} description={w.body} />
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {w.kinds.map((k) => (
              <div key={k.name} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="font-medium text-ink">{k.name}</dt><dd className="text-ink-2">{k.text}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10"><Button href={w.cta.href} variant="secondary" chevron>{w.cta.label}</Button></div>
        </div>
      </div>
    </Section>
  );
}
