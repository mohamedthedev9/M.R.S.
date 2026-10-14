import { SEVERITY_LEVELS, SEVERITY_SCALE_NOTE, SECURITY_UX } from "@/lib/constants/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SeverityBadge } from "./Severity";

export function SeverityLegend({ as = "h2" }: { as?: "h2" | "h3" }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
      <SectionHeader title={SECURITY_UX.severity.title} description={SECURITY_UX.severity.body} as={as} />
      <div>
        <dl className="divide-y divide-line border-y border-line">
          {SEVERITY_LEVELS.map((l) => (
            <div key={l.id} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt><SeverityBadge severity={l.id} /></dt>
              <dd className="text-ink-2">{l.meaning}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-ink-muted">{SEVERITY_SCALE_NOTE}</p>
      </div>
    </div>
  );
}
