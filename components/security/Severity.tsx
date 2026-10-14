import { cn } from "@/lib/utils/cn";
import { SEVERITY_LEVELS, type Severity } from "@/lib/constants/content";

/** Colour is never the only signal: every severity also has its own shape and a text label. */
export const SEVERITY_STYLE: Record<Severity, { text: string; bar: string }> = {
  critical: { text: "text-danger", bar: "bg-danger" },
  high: { text: "text-warning", bar: "bg-warning" },
  medium: { text: "text-accent-hover", bar: "bg-accent" },
  low: { text: "text-ink-2", bar: "bg-ink-2" },
  info: { text: "text-ink-muted", bar: "bg-ink-muted" },
};
const label = (s: Severity) => SEVERITY_LEVELS.find((l) => l.id === s)!.label;

function Glyph({ severity }: { severity: Severity }) {
  const common = { viewBox: "0 0 10 10", className: "h-2.5 w-2.5", "aria-hidden": true } as const;
  switch (severity) {
    case "critical": return <svg {...common}><path d="M5 0 10 5 5 10 0 5Z" fill="currentColor" /></svg>;           // diamond, filled
    case "high": return <svg {...common}><path d="M5 0.5 9.5 9.5H0.5Z" fill="currentColor" /></svg>;              // triangle, filled
    case "medium": return <svg {...common}><rect x="1" y="1" width="8" height="8" fill="currentColor" /></svg>;  // square, filled
    case "low": return <svg {...common}><circle cx="5" cy="5" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>; // circle, outline
    default: return <svg {...common}><path d="M1 5h8" stroke="currentColor" strokeWidth="1.6" /></svg>;        // dash
  }
}

export function SeverityBadge({ severity, className, muted = false }: { severity: Severity; className?: string; muted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", muted ? "text-ink-muted" : SEVERITY_STYLE[severity].text, className)}>
      <Glyph severity={severity} />{label(severity)}
    </span>
  );
}
