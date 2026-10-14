import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeatureList } from "@/components/ui/FeatureList";
import { Button } from "@/components/ui/Button";
import { SoftwareLifecycle } from "@/components/visuals/SoftwareLifecycle";
import { HOME } from "@/lib/constants/content";

export function SoftwareSection() {
  const s = HOME.software;
  return (
    <Section id="software" labelledBy="software-title">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeader id="software-title" index="08" eyebrow="Software development" title={s.title} description={s.body} />
          <div className="mt-8"><FeatureList items={s.kinds} /></div>
          <div className="mt-10"><Button href={s.cta.href} variant="secondary" chevron>{s.cta.label}</Button></div>
        </div>
        <SoftwareLifecycle />
      </div>
    </Section>
  );
}
