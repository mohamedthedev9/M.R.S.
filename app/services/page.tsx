import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { Chevrons } from "@/components/ui/Chevrons";
import { TechBadge } from "@/components/ui/Badges";
import { CTABlock } from "@/components/ui/CTABlock";
import { PAGES, HOME } from "@/lib/constants/content";
import { SERVICES } from "@/lib/constants/services";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Services", description: PAGES.services.body, path: "/services" });

export default function ServicesPage() {
  const c = HOME.finalCta;
  return (
    <>
      <PageHero title={PAGES.services.title} description={PAGES.services.body} />
      <Section bare labelledBy="svc-list">
        <h2 id="svc-list" className="sr-only">All services</h2>
        <ul className="divide-y divide-line border-y border-line">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Link href={s.href} className="group grid gap-4 py-8 transition-colors duration-base ease-out hover:bg-surface-1/60 sm:grid-cols-[3rem_1.2fr_1.4fr_auto] sm:items-center sm:gap-8 sm:px-4">
                <s.icon aria-hidden="true" strokeWidth={1.5} className="h-7 w-7 text-accent" />
                <div>
                  <h3 className="font-display text-3xl font-semibold text-ink">{s.name}</h3>
                  <p className="mt-1.5 text-ink-2">{s.short}</p>
                </div>
                <ul aria-label={`${s.name} capabilities`} className="flex flex-wrap gap-2">{s.capabilities.map((cap) => <li key={cap}><TechBadge>{cap}</TechBadge></li>)}</ul>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-ink">View <span className="sr-only">{s.name}</span><Chevrons className="h-3 w-3 text-accent transition-transform duration-base ease-out group-hover:translate-x-1" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <CTABlock title={c.title} description={c.body} primary={c.primary} secondary={c.secondary} />
    </>
  );
}
