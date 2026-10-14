import { SECURITY_UX } from "@/lib/constants/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badges";

/** A document outline, deliberately shaped like a page. Labeled as a sample structure, never as a real report. */
export function ReportPreview({ as = "h2" }: { as?: "h2" | "h3" }) {
  const r = SECURITY_UX.report;
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <div>
        <SectionHeader title={r.title} description={r.body} as={as} />
        <p className="mt-6 text-sm text-ink-muted">{r.caption}</p>
      </div>
      <figure aria-label="Sample report structure" className="ticks rounded-lg border border-line-strong bg-surface-1 p-6 shadow-overlay sm:p-8">
        <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
          <p className="font-display text-lg font-semibold">Security review: report</p>
          <Badge tone="placeholder">Sample structure</Badge>
        </div>
        <ol className="mt-2 divide-y divide-line">
          {r.sections.map((s, i) => (
            <li key={s.name} className="grid grid-cols-[2rem_1fr] gap-x-3 py-4">
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-medium text-ink">{s.name}</p>
                <p className="mt-1 text-sm text-ink-2">{s.text}</p>
                {/* skeleton lines: structure only, no content that could be mistaken for findings */}
                <div aria-hidden="true" className="mt-3 space-y-1.5"><i className="block h-1.5 w-11/12 rounded-sm bg-line" /><i className="block h-1.5 w-7/12 rounded-sm bg-line" /></div>
              </div>
            </li>
          ))}
        </ol>
      </figure>
    </div>
  );
}
