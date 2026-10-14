import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceCard } from "@/components/ui/Cards";
import { HOME } from "@/lib/constants/content";
import { SERVICES } from "@/lib/constants/services";

/** One lead card plus four compact ones: deliberately not five identical boxes. */
export function CapabilitiesSection() {
  const c = HOME.capabilities;
  return (
    <Section id={c.id} labelledBy="capabilities-title">
      <SectionHeader id="capabilities-title" index="02" eyebrow="Capabilities" title={c.title} description={c.body} />
      <div className="mt-12 grid gap-4 lg:grid-cols-[1.35fr_1fr_1fr]">
        <div className="lg:row-span-2 [&>a]:h-full"><ServiceCard service={SERVICES[0]} size="feature" /></div>
        {SERVICES.slice(1).map((s) => <ServiceCard key={s.slug} service={s} />)}
      </div>
    </Section>
  );
}
