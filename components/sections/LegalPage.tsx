import { Fragment } from "react";
import Link from "next/link";
import { PageHero } from "./PageHero";
import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/constants/content";
import { LEGAL_UPDATED, type LegalDoc } from "@/lib/constants/legal";

const link = "text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent";

/** Turns {{email}} / {{privacy}} / {{terms}} tokens into links. Everything else is plain text (React escapes it). */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{\{(?:email|privacy|terms)\}\})/).map((part, i) => {
        if (part === "{{email}}") return <a key={i} className={link} href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>;
        if (part === "{{privacy}}") return <Link key={i} className={link} href="/privacy">Privacy Policy</Link>;
        if (part === "{{terms}}") return <Link key={i} className={link} href="/terms">Terms of Use</Link>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHero title={doc.title} description={`Last updated: ${LEGAL_UPDATED}`} />
      <Section bare labelledBy="legal-summary">
        <div className="grid gap-12 lg:grid-cols-[1fr_2.2fr] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 font-mono text-xs text-ink-muted">On this page</p>
            <ol className="space-y-0.5 text-sm">
              {doc.sections.map((s, i) => (
                <li key={s.id}><a href={`#${s.id}`} className="inline-block py-1.5 text-ink-2 transition-colors duration-fast hover:text-ink"><span className="mr-2 font-mono text-xs text-ink-muted">{String(i + 1).padStart(2, "0")}</span>{s.title}</a></li>
              ))}
            </ol>
          </nav>
          <div className="max-w-prose">
            <aside aria-labelledby="legal-summary" className="rounded-lg border border-line-control bg-surface-1 p-6">
              <h2 id="legal-summary" className="font-display text-2xl font-semibold">{doc.summary.title}</h2>
              <ul className="mt-4 space-y-2 text-ink-2">
                {doc.summary.points.map((p) => <li key={p} className="flex gap-3"><span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" /><span>{p}</span></li>)}
              </ul>
            </aside>
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-24 border-t border-line pt-8 mt-10 first-of-type:mt-12">
                <h2 id={`${s.id}-h`} className="font-display text-2xl font-semibold text-ink"><span className="mr-3 font-mono text-sm font-normal text-ink-muted">{String(i + 1).padStart(2, "0")}</span>{s.title}</h2>
                {s.paragraphs?.map((p) => <p key={p} className="mt-4 leading-relaxed text-ink-2"><Rich text={p} /></p>)}
                {s.bullets && <ul className="mt-4 space-y-2.5 text-ink-2">{s.bullets.map((b) => <li key={b} className="flex gap-3 leading-relaxed"><span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" /><span><Rich text={b} /></span></li>)}</ul>}
                {s.after?.map((p) => <p key={p} className="mt-4 leading-relaxed text-ink-2"><Rich text={p} /></p>)}
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
