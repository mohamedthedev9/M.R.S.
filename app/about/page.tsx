import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { ContactChannels } from "@/components/sections/ContactChannels";
import { Section } from "@/components/ui/Section";
import { CTABlock } from "@/components/ui/CTABlock";
import { HOME, PAGES, SITE } from "@/lib/constants/content";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "About", description: `${SITE.name} (${SITE.legalName}) was founded by ${SITE.founder}. Websites, software, automation and defensive security.`, path: "/about" });

export default function AboutPage() {
  const a = PAGES.about, c = HOME.finalCta;
  return (
    <>
      <PageHero title={a.title} description={a.body} />
      <Section bare labelledBy="about-body">
        <h2 id="about-body" className="sr-only">About M.R.S.</h2>
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div className="divide-y divide-line border-y border-line">
            {a.sections.map((s) => (
              <div key={s.title} className="grid gap-3 py-8 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <h3 className="font-display text-2xl font-semibold text-ink">{s.title}</h3>
                <p className="max-w-prose text-ink-2">{s.text}</p>
              </div>
            ))}
          </div>
          <aside aria-labelledby="about-contact"><h3 id="about-contact" className="mb-6 font-display text-2xl font-semibold">Get in touch</h3><ContactChannels />
            <Image src="/brand/mrs-signature.png" alt="M.R.S. signature" width={594} height={234} className="mt-12 h-auto w-44 opacity-90" />
          </aside>
        </div>
      </Section>
      <CTABlock title={c.title} description={c.body} primary={c.primary} secondary={c.secondary} />
    </>
  );
}
