import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeatureList } from "@/components/ui/FeatureList";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Cards";
import { SecurityLayers } from "@/components/visuals/SecurityLayers";
import { HOME } from "@/lib/constants/content";

export function SecuritySection() {
  const s = HOME.security;
  return (
    <Section id="security" labelledBy="security-title">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <SectionHeader id="security-title" index="04" eyebrow="Security" title={s.title} description={s.body} />
          <div className="mt-8"><FeatureList items={s.points} /></div>
          <div className="mt-10"><Button href={s.cta.href} variant="secondary" chevron>{s.cta.label}</Button></div>
        </div>
        <GlassCard ticks className="min-w-0 p-6 sm:p-10"><SecurityLayers /></GlassCard>
      </div>
    </Section>
  );
}
