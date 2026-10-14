import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { Service } from "@/lib/constants/services";
import { Chevrons } from "./Chevrons";
import { Badge } from "./Badges";

/** Flat panel by default. `glass` is for the navbar and one or two focal panels only. */
export function GlassCard({ glass = false, ticks = false, className, children }: {
  glass?: boolean; ticks?: boolean; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={cn(
      "rounded-lg border border-line",
      glass ? "bg-surface-1/70 backdrop-blur-glass shadow-overlay" : "bg-surface-1",
      "bg-gradient-to-b from-ink/[0.04] to-transparent bg-[length:100%_1px] bg-top bg-no-repeat", // top-edge highlight
      ticks && "ticks", className)}>
      {children}
    </div>
  );
}

/**
 * Hover/focus reveals the capability list (focus-within too, so keyboard users get it).
 * `size="feature"` is for the one lead service; the others use "compact": cards are not all identical.
 */
export function ServiceCard({ service, size = "compact" }: { service: Service; size?: "feature" | "compact" }) {
  const Icon = service.icon;
  return (
    <Link href={service.href} className={cn(
      "group relative flex h-full flex-col rounded-lg border border-line bg-surface-1 transition-[border-color,background-color,transform] duration-base ease-out",
      "hover:-translate-y-0.5 hover:border-accent/50 hover:bg-surface-2 focus-visible:border-accent/50",
      size === "feature" ? "p-8 sm:p-10" : "p-6")}>
      {/* system indicator: idle until the card is engaged */}
      <span aria-hidden="true" className="absolute right-5 top-5 h-1.5 w-1.5 rounded-full bg-line-strong transition-colors duration-base group-hover:bg-accent group-focus-visible:bg-accent" />
      <Icon aria-hidden="true" strokeWidth={1.5} className="h-6 w-6 text-accent transition-transform duration-base ease-out group-hover:scale-110" />
      <h3 className={cn("mt-6 font-display font-semibold text-ink", size === "feature" ? "text-display-md" : "text-2xl")}>{service.name}</h3>
      <p className="mt-2 text-ink-2">{service.short}</p>
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-slow ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
        <ul className="overflow-hidden">
          {service.capabilities.map((c) => (
            <li key={c} className="flex items-center gap-2 pt-2 font-mono text-xs text-ink-muted first:pt-5"><Chevrons className="h-2.5 w-2.5 text-accent" />{c}</li>
          ))}
        </ul>
      </div>
      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-ink">
        View service <Chevrons className="h-3 w-3 text-accent transition-transform duration-base ease-out group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

/**
 * Guardrail against invented statistics: a metric must either carry a real, supplied value
 * or be flagged `placeholder`, which renders a visible "Placeholder" badge.
 */
export function MetricCard({ label, value, note, placeholder = false }: { label: string; value: string; note?: string; placeholder?: boolean }) {
  return (
    <div className="rounded-lg border border-line bg-surface-1 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink-2">{label}</p>
        {placeholder && <Badge tone="placeholder">Placeholder</Badge>}
      </div>
      <p className="mt-3 font-display text-4xl font-semibold text-ink">{value}</p>
      {note && <p className="mt-2 text-xs text-ink-muted">{note}</p>}
    </div>
  );
}
