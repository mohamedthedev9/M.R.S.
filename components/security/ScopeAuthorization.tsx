import { SECURITY_UX } from "@/lib/constants/content";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Four numbered steps (a real sequence). A rule line down the left reads as a checklist, not a card grid. */
/** `as` is the section heading level (default h2); step headings are one level below. */
export function ScopeAuthorization({ as = "h2" }: { as?: "h2" | "h3" }) {
  const s = SECURITY_UX.scope;
  const Step = as === "h2" ? "h3" : "h4";
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
      <SectionHeader title={s.title} description={s.body} as={as} />
      <ol className="space-y-0 border-l border-line-strong">
        {s.steps.map((st, i) => (
          <li key={st.name} className="relative pb-8 pl-8 last:pb-0">
            <span aria-hidden="true" className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border border-accent bg-bg" />
            <p className="font-mono text-xs text-ink-muted">Step {i + 1}</p>
            <Step className="mt-1 font-display text-xl font-semibold text-ink">{st.name}</Step>
            <p className="mt-1.5 max-w-prose text-ink-2">{st.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
