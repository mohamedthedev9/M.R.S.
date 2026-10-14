import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { CTABlock } from "@/components/ui/CTABlock";
import { HOME, PAGES, PROCESS } from "@/lib/constants/content";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Process", description: PAGES.process.body, path: "/process" });

export default function ProcessPage() {
  const c = HOME.finalCta;
  return (
    <>
      <PageHero title={PAGES.process.title} description={PAGES.process.body} />
      <Section bare labelledBy="steps-title">
        <h2 id="steps-title" className="sr-only">The six steps</h2>
        <ol className="divide-y divide-line border-y border-line">
          {PROCESS.map((p, i) => (
            <li key={p.title} className="grid gap-6 py-10 lg:grid-cols-[7rem_1fr_2fr] lg:gap-10">
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-3xl font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 max-w-xs text-ink-2">{p.body}</p>
              </div>
              <dl className="grid gap-5 text-sm sm:grid-cols-3">
                {([["What happens", p.happens], ["What you provide", p.youProvide], ["What you receive", p.youReceive]] as const).map(([k, v]) => (
                  <div key={k} className="border-t border-line-strong pt-3"><dt className="text-ink-muted">{k}</dt><dd className="mt-1.5 leading-relaxed text-ink">{v}</dd></div>
                ))}
              </dl>
            </li>
          ))}
        </ol>
      </Section>
      <CTABlock title={c.title} description={c.body} primary={c.primary} secondary={{ label: "Browse services", href: "/services" }} />
    </>
  );
}
