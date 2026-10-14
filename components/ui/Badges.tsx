import { cn } from "@/lib/utils/cn";
import { Spinner } from "./Loaders";

export function Badge({ tone = "neutral", children, className }: {
  tone?: "neutral" | "accent" | "placeholder"; children: React.ReactNode; className?: string;
}) {
  const tones = {
    neutral: "border-line-strong text-ink-2",
    accent: "border-accent/40 bg-accent/10 text-accent-hover",
    placeholder: "border-dashed border-warning/50 text-warning", // marks content the owner must supply
  } as const;
  return <span className={cn("inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium", tones[tone], className)}>{children}</span>;
}

export function TechBadge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-sm border border-line bg-surface-1 px-2.5 py-1 font-mono text-xs text-ink-2">{children}</span>;
}

export type StatusTone = "ready" | "active" | "complete" | "warning" | "danger" | "demo";
const dot: Record<StatusTone, string> = {
  ready: "bg-ink-muted", active: "bg-accent", complete: "bg-success", warning: "bg-warning", danger: "bg-danger", demo: "bg-warning",
};

/** Status is always conveyed by the text label, never by color alone. */
export function StatusPill({ tone, children, pulse = false, busy = false }: { tone: StatusTone; children: React.ReactNode; pulse?: boolean; busy?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-sm border border-line bg-surface-1 px-2.5 py-1 font-mono text-xs text-ink-2">
      {busy ? <Spinner className="h-3 w-3" /> : <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", dot[tone], pulse && "animate-[mrs-pulse_1.6s_ease-in-out_infinite]")} />}
      {children}
    </span>
  );
}
