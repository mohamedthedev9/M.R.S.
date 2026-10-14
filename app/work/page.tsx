import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { Section } from "@/components/ui/Section";
import { CTABlock } from "@/components/ui/CTABlock";
import { HOME, PAGES } from "@/lib/constants/content";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Selected work", description: PAGES.work.body, path: "/work" });

export default function WorkPage() {
  const c = HOME.finalCta;
  return (
    <>
      <PageHero title={PAGES.work.title} description={PAGES.work.body} />
      <Section bare labelledBy="work-grid"><h2 id="work-grid" className="sr-only">Projects and concepts</h2><WorkGrid /></Section>
      <CTABlock title={c.title} description={c.body} primary={c.primary} secondary={c.secondary} />
    </>
  );
}
