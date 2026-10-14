import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Timeline, PROCESS_STEPS } from "@/components/ui/Process";
import { Button } from "@/components/ui/Button";
import { HOME } from "@/lib/constants/content";

export function ProcessSection() {
  return (
    <Section id="process" labelledBy="process-title">
      <SectionHeader id="process-title" index="09" eyebrow="Process" title={HOME.process.title} description={HOME.process.body} />
      <Timeline steps={PROCESS_STEPS} className="mt-14" />
      <div className="mt-12"><Button href="/process" variant="secondary" chevron>See the full process</Button></div>
    </Section>
  );
}
