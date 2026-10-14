import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badges";
import { GlassCard } from "@/components/ui/Cards";
import { FeatureList } from "@/components/ui/FeatureList";
import { Accordion } from "@/components/ui/Accordion";
import { Timeline } from "@/components/ui/Process";
import { CTABlock } from "@/components/ui/CTABlock";
import { SecurityLayers } from "@/components/visuals/SecurityLayers";
import { AutomationFlow } from "@/components/visuals/AutomationFlow";
import { WebShowcase } from "@/components/visuals/WebShowcase";
import { VulnDemo } from "@/components/visuals/VulnDemo";
import { SoftwareLifecycle } from "@/components/visuals/SoftwareLifecycle";
import { ScopeAuthorization } from "@/components/security/ScopeAuthorization";
import { ReportPreview } from "@/components/security/ReportPreview";
import { SeverityLegend } from "@/components/security/SeverityLegend";
import { TrustPrinciples } from "@/components/security/TrustPrinciples";
import { SERVICE_PAGES } from "@/lib/constants/content";
import type { Service, ServiceSlug } from "@/lib/constants/services";

/** The visual demonstration for each service (block 4 of the Phase 2 template). */
function Demo({ slug }: { slug: ServiceSlug }) {
  switch (slug) {
    case "security": return <GlassCard ticks className="mx-auto max-w-xl p-6 sm:p-10"><SecurityLayers /></GlassCard>;
    case "automation": return <AutomationFlow />;
    case "web-development": return <WebShowcase className="mx-auto max-w-3xl" />;
    case "vulnerability-checker": return <VulnDemo />;
    case "software-development": return <SoftwareLifecycle />;
  }
}

/** Service-specific blocks that go after the demonstration. Kept in one place so each page's emphasis is explicit. */
function Extras({ slug }: { slug: ServiceSlug }) {
  const extra = SERVICE_PAGES[slug].extra;
  switch (slug) {
    case "security":
      return (<>
        <Section><ScopeAuthorization /></Section>
        <Section><ReportPreview /></Section>
        <Section><SeverityLegend /></Section>
        <Section><TrustPrinciples /></Section>
      </>);
    case "vulnerability-checker":
      return (<>
        <Section><ScopeAuthorization /></Section>
        <Section><SeverityLegend /></Section>
      </>);
    default:
      return extra ? (
        <Section labelledBy="extra-title">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <SectionHeader id="extra-title" title={extra.title} />
            <FeatureList items={extra.items} />
          </div>
        </Section>
      ) : null;
  }
}

export function ServicePageView({ service }: { service: Service }) {
  const page = SERVICE_PAGES[service.slug];
  const Icon = service.icon;
  const contactHref = `/contact?service=${service.slug}`;

  return (
    <>
      {/* 1 · Focused hero */}
      <section aria-labelledby="service-title" className="relative isolate overflow-hidden pb-16 pt-32 sm:pt-40">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-70" />
        <Container className="grid items-end gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <nav aria-label="Breadcrumb" className="mb-6 font-mono text-xs text-ink-muted">
              <ol className="flex items-center gap-2">
                <li><Link href="/services" className="hover:text-ink">Services</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-ink-2">{service.name}</li>
              </ol>
            </nav>
            <h1 id="service-title" className="font-display text-display-xl font-semibold text-balance">{page.hero.title}</h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-2 sm:text-xl">{page.hero.body}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={contactHref} size="lg" chevron>{page.cta.label}</Button>
              <Button href="/process" size="lg" variant="secondary">See the process</Button>
            </div>
          </div>
          <GlassCard ticks className="p-7">
            <Icon aria-hidden="true" strokeWidth={1.5} className="h-7 w-7 text-accent" />
            <h2 className="mt-5 font-display text-xl font-semibold">In scope</h2>
            <div className="mt-4"><FeatureList items={service.capabilities} /></div>
          </GlassCard>
        </Container>
      </section>

      {/* 2 · Problem */}
      <Section labelledBy="problem-title">
        <div className="grid gap-8 lg:grid-cols-[1fr_2.2fr] lg:gap-16">
          <h2 id="problem-title" className="font-mono text-sm font-normal text-ink-muted">The problem</h2>
          <p className="font-display text-display-md font-medium text-ink text-balance">{page.problem}</p>
        </div>
      </Section>

      {/* 3 · Capability breakdown */}
      <Section labelledBy="caps-title">
        <SectionHeader id="caps-title" title="What's included" />
        <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {page.capabilities.map((c) => (
            <div key={c.name} className="border-t border-line-strong pt-4">
              <dt className="font-display text-xl font-semibold text-ink">{c.name}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink-2">{c.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* 4 · Visual demonstration */}
      <Section labelledBy="demo-title">
        <SectionHeader id="demo-title" title="See how it works" description={page.demoCaption} />
        <div className="mt-12"><Demo slug={service.slug} /></div>
      </Section>

      <Extras slug={service.slug} />

      {/* 5 · Process */}
      <Section labelledBy="proc-title">
        <SectionHeader id="proc-title" title={`How ${service.name.toLowerCase()} work runs`} />
        <Timeline steps={page.process.map((p) => ({ title: p.title, body: p.text }))} className="mt-14" />
      </Section>

      {/* 6 · Example outcomes (illustrations, never presented as client results) */}
      <Section labelledBy="out-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <SectionHeader id="out-title" title="Example outcomes" />
            <p className="mt-4"><Badge>Concept</Badge></p>
            <p className="mt-3 max-w-xs text-sm text-ink-muted">Illustrations of what this work can achieve, not results from past clients.</p>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {page.outcomes.map((o) => <li key={o} className="py-5 font-display text-2xl text-ink">{o}</li>)}
          </ul>
        </div>
      </Section>

      {/* 7 · Technical details */}
      <Section labelledBy="tech-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionHeader id="tech-title" title="Technical details" />
          <FeatureList items={page.technical} />
        </div>
      </Section>

      {/* 8 · FAQ */}
      <Section labelledBy="faq-title">
        <div className="mx-auto max-w-3xl">
          <SectionHeader id="faq-title" title="Questions" className="mb-10" />
          <Accordion items={page.faq} />
        </div>
      </Section>

      {/* 9 · CTA */}
      <CTABlock title={page.cta.title} primary={{ label: page.cta.label, href: contactHref }} secondary={{ label: "See all services", href: "/services" }} />
    </>
  );
}
