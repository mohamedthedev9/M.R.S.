import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { OperatingModelSection } from "@/components/sections/OperatingModelSection";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { AutomationSection } from "@/components/sections/AutomationSection";
import { WebSection } from "@/components/sections/WebSection";
import { VulnerabilitySection } from "@/components/sections/VulnerabilitySection";
import { SoftwareSection } from "@/components/sections/SoftwareSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { PrinciplesSection } from "@/components/sections/PrinciplesSection";
import { CTABlock } from "@/components/ui/CTABlock";
import { HOME, SITE } from "@/lib/constants/content";

export const metadata: Metadata = {
  title: { absolute: SITE.metaTitle },
  alternates: { canonical: "/" },
};

/** The homepage is a story: what it is, what it solves, how it works, the five services, proof, how to start. */
export default function HomePage() {
  const c = HOME.finalCta;
  return (
    <>
      <Hero />
      <CapabilitiesSection />
      <OperatingModelSection />
      <SecuritySection />
      <AutomationSection />
      <WebSection />
      <VulnerabilitySection />
      <SoftwareSection />
      <ProcessSection />
      <WorkSection />
      <PrinciplesSection />
      <CTABlock title={c.title} description={c.body} primary={c.primary} secondary={c.secondary} />
    </>
  );
}
