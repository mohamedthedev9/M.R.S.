import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { WorkGrid } from "./WorkGrid";
import { HOME } from "@/lib/constants/content";

export function WorkSection() {
  return (
    <Section id="work" labelledBy="work-title">
      <SectionHeader id="work-title" index="10" eyebrow="Work" title={HOME.work.title} description={HOME.work.body} />
      <div className="mt-12"><WorkGrid /></div>
      <div className="mt-10"><Button href="/work" variant="secondary" chevron>Go to Selected Work</Button></div>
    </Section>
  );
}
