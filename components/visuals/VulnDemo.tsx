"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { DEMO, SEVERITY_LEVELS, SEVERITY_ORDER, type Severity } from "@/lib/constants/content";
import { Button } from "@/components/ui/Button";
import { Chevrons } from "@/components/ui/Chevrons";
import { StatusPill } from "@/components/ui/Badges";
import { Spinner } from "@/components/ui/Loaders";
import { SeverityBadge, SEVERITY_STYLE } from "@/components/security/Severity";
import { cn } from "@/lib/utils/cn";

type Phase = "ready" | "scanning" | "analyzing" | "complete";
const PHASES: readonly Phase[] = ["ready", "scanning", "analyzing", "complete"];
const rank = (s: Severity) => SEVERITY_ORDER.indexOf(s);

/**
 * SAFETY: this component has NO network code. Nothing the visitor types leaves the page, and every
 * finding comes from DEMO (synthetic data). The report records the text that was typed *at run time*
 * and says outright that it was not contacted.
 */
export function VulnDemo() {
  const uid = useId();
  const [asset, setAsset] = useState<string>(DEMO.defaultAsset);
  const [scanned, setScanned] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<Phase>("ready");
  const [checksDone, setChecksDone] = useState(0);
  const [stamp, setStamp] = useState("");
  const [filter, setFilter] = useState<Severity | "all">("all");
  const [open, setOpen] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const findings = useMemo(() => [...DEMO.findings].sort((a, b) => rank(a.severity) - rank(b.severity) || a.id.localeCompare(b.id)), []);
  const counts = useMemo(() => SEVERITY_ORDER.map((s) => ({ s, n: findings.filter((f) => f.severity === s).length })), [findings]);
  const highest = counts.find((c) => c.n > 0)?.s ?? "info";
  const visible = filter === "all" ? findings : findings.filter((f) => f.severity === filter);
  const running = phase === "scanning" || phase === "analyzing";

  function run() {
    const value = asset.trim();
    if (!value) { setError(DEMO.inputError); input.current?.focus(); return; }
    setError("");
    timers.current.forEach(clearTimeout);
    const k = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.2 : 1;
    const step = 450 * k;
    setScanned(value); setPhase("scanning"); setChecksDone(0); setFilter("all"); setOpen(findings[0].id);
    const t: number[] = DEMO.checks.map((_, i) => window.setTimeout(() => setChecksDone(i + 1), (i + 1) * step));
    const analyzeAt = (DEMO.checks.length + 1) * step;
    t.push(window.setTimeout(() => setPhase("analyzing"), analyzeAt));
    t.push(window.setTimeout(() => { setStamp(new Date().toISOString()); setPhase("complete"); }, analyzeAt + 1200 * k));
    timers.current = t;
  }

  const live =
    phase === "scanning" ? `Scanning. ${checksDone} of ${DEMO.checks.length} checks done.`
    : phase === "analyzing" ? "Analyzing."
    : phase === "complete" ? `Demo complete. ${findings.length} sample findings.` : "";

  return (
    <div className="rounded-xl border border-line bg-surface-1">
      {/* Persistent, unmissable demo label */}
      <p role="note" className="rounded-t-xl border-b border-warning/30 bg-warning/[0.07] px-5 py-2.5 text-sm text-warning">{DEMO.banner}</p>

      <div className="p-5 sm:p-8">
        <div className="flex flex-wrap items-start gap-3">
          <div className="min-w-0 flex-1 basis-64">
            <label htmlFor={`${uid}-asset`} className="mb-2 block text-sm text-ink-2">{DEMO.inputLabel}</label>
            <input ref={input} id={`${uid}-asset`} value={asset} maxLength={64} spellCheck={false} autoComplete="off"
              onChange={(e) => { setAsset(e.target.value); if (error) setError(""); }}
              aria-invalid={error ? true : undefined} aria-describedby={`${uid}-note${error ? ` ${uid}-err` : ""}`}
              className={cn("min-h-11 w-full rounded-sm border bg-bg px-3 font-mono text-sm text-ink placeholder:text-ink-muted focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_rgb(var(--accent)/0.2)] focus-visible:outline-none",
                error ? "border-danger" : "border-line-control")} />
          </div>
          <Button onClick={run} disabled={running} className="mt-[1.85rem]">{phase === "complete" ? "Run demo again" : "Run demo scan"}</Button>
        </div>
        {error && <p id={`${uid}-err`} className="mt-2 text-sm text-danger">{error}</p>}
        <p id={`${uid}-note`} className="mt-2 text-xs text-ink-muted">{DEMO.inputNote}</p>
        <p className="sr-only" aria-live="polite">{live}</p>

        {/* Stage tracker: text labels, current step announced via aria-current */}
        <ol aria-label="Demo progress" className="mt-8 grid grid-cols-4 gap-1.5 border-t border-line pt-6 sm:gap-2">
          {PHASES.map((p, i) => {
            const cur = PHASES.indexOf(phase);
            const state = i < cur || phase === "complete" && i === cur ? "done" : i === cur ? "current" : "todo";
            return (
              <li key={p} aria-current={state === "current" ? "step" : undefined} className="min-w-0">
                <span aria-hidden="true" className={cn("block h-0.5 w-full transition-colors duration-slow", state === "todo" ? "bg-line-strong" : "bg-accent", state === "current" && "animate-[mrs-pulse_1.6s_ease-in-out_infinite]")} />
                <span className={cn("mt-2 block text-[11px] sm:text-sm", state === "todo" ? "text-ink-muted" : "text-ink")}>
                  {DEMO.stages[i].label}<span className="sr-only">{state === "done" ? " (done)" : state === "current" ? " (current)" : ""}</span>
                </span>
              </li>
            );
          })}
        </ol>

        {phase === "ready" && <p className="mt-6 text-ink-2">Run the demo to see what a report looks like. The findings are samples.</p>}

        {phase === "scanning" && (
          <ul className="mt-6 space-y-2">
            {DEMO.checks.map((c, i) => (
              <li key={c} className="flex items-center justify-between gap-4 border-b border-line py-2 text-sm last:border-0">
                <span className={i < checksDone ? "text-ink" : "text-ink-2"}>{c}</span>
                <span className="flex items-center gap-2 font-mono text-xs text-ink-muted">{i === checksDone && <Spinner className="h-3.5 w-3.5" />}{i < checksDone ? "Done" : i === checksDone ? "Running" : "Queued"}</span>
              </li>
            ))}
          </ul>
        )}

        {phase === "analyzing" && <p className="mt-6 flex items-center gap-3 text-ink-2"><Spinner className="h-4 w-4" />{DEMO.analyzingText}</p>}

        {phase === "complete" && (
          <div className="mt-8 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-2xl font-semibold">Demo report</h3>
              <StatusPill tone="demo">Sample data</StatusPill>
            </div>
            <dl className="grid gap-x-8 gap-y-3 font-mono text-xs text-ink-muted sm:grid-cols-[auto_1fr]">
              <dt>Scope</dt><dd className="break-all text-ink-2">{scanned} (demo, not contacted)</dd>
              <dt>Generated</dt><dd className="text-ink-2">{stamp}</dd>
            </dl>

            {/* Risk overview */}
            <section aria-labelledby={`${uid}-risk`}>
              <h4 id={`${uid}-risk`} className="text-sm font-medium text-ink">Risk overview</h4>
              <dl className="mt-3 grid divide-y divide-line border-y border-line sm:grid-cols-4 sm:divide-x sm:divide-y-0">
                <div className="py-4 sm:px-5 sm:first:pl-0"><dt className="text-xs text-ink-muted">Highest severity</dt><dd className="mt-1.5"><SeverityBadge severity={highest} /></dd></div>
                <div className="py-4 sm:px-5"><dt className="text-xs text-ink-muted">Findings</dt><dd className="mt-1.5 font-display text-2xl font-semibold">{findings.length}</dd></div>
                <div className="py-4 sm:px-5"><dt className="text-xs text-ink-muted">Components affected</dt><dd className="mt-1.5 font-display text-2xl font-semibold">{new Set(findings.map((f) => f.component)).size}</dd></div>
                <div className="py-4 sm:px-5"><dt className="text-xs text-ink-muted">Fix first</dt><dd className="mt-1.5 font-mono text-sm text-ink">{findings.slice(0, 2).map((f) => f.id).join(", ")}</dd></div>
              </dl>
              <div className="mt-5" aria-hidden="true">
                <div className="flex h-2 gap-px overflow-hidden rounded-sm bg-bg">
                  {counts.filter((c) => c.n).map((c) => <span key={c.s} className={SEVERITY_STYLE[c.s].bar} style={{ width: `${(c.n / findings.length) * 100}%` }} />)}
                </div>
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5">
                {counts.map((c) => <li key={c.s} className="flex items-center gap-2 text-sm"><SeverityBadge severity={c.s} muted={!c.n} /><span className={cn("font-mono text-xs", c.n ? "text-ink-2" : "text-ink-muted")}>{c.n}</span></li>)}
              </ul>
            </section>

            {/* Findings */}
            <section aria-labelledby={`${uid}-find`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 id={`${uid}-find`} className="text-sm font-medium text-ink">Findings <span className="font-normal text-ink-muted">({visible.length} of {findings.length})</span></h4>
                <div role="group" aria-label="Filter findings by severity" className="flex flex-wrap gap-1.5">
                  {(["all", ...SEVERITY_ORDER] as const).map((f) => {
                    const n = f === "all" ? findings.length : counts.find((c) => c.s === f)!.n;
                    const label = f === "all" ? "All" : SEVERITY_LEVELS.find((l) => l.id === f)!.label;
                    return (
                      <button key={f} type="button" aria-pressed={filter === f} disabled={n === 0} onClick={() => setFilter(f)}
                        className={cn("min-h-11 rounded-sm border px-3 text-xs sm:min-h-9 transition-colors duration-fast disabled:opacity-40",
                          filter === f ? "border-accent bg-accent/10 text-ink" : "border-line-control text-ink-2 hover:border-ink-muted hover:text-ink")}>
                        {label} <span className="font-mono text-ink-muted">{n}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {visible.map((f) => {
                  const isOpen = open === f.id;
                  return (
                    <li key={f.id}>
                      <h5>
                        <button type="button" aria-expanded={isOpen} aria-controls={`${uid}-${f.id}`} onClick={() => setOpen(isOpen ? null : f.id)}
                          className="flex min-h-14 w-full flex-wrap items-center gap-x-5 gap-y-1 py-3 text-left transition-colors duration-fast hover:bg-surface-2/60">
                          <span className="font-mono text-xs text-ink-2 sm:w-20">{f.id}</span>
                          <SeverityBadge severity={f.severity} className="sm:w-32" />
                          <span className="min-w-0 flex-1 basis-40 text-sm text-ink">{f.component}</span>
                          <Chevrons className={cn("h-3 w-3 shrink-0 text-accent transition-transform duration-base ease-out", isOpen && "rotate-90")} />
                        </button>
                      </h5>
                      <div id={`${uid}-${f.id}`} hidden={!isOpen} className="pb-5">
                        <dl className="grid gap-4 text-sm sm:grid-cols-[8rem_1fr] sm:gap-x-6">
                          <dt className="text-ink-muted">Description</dt><dd className="text-ink">{f.description}</dd>
                          <dt className="text-ink-muted">Evidence</dt><dd className="text-ink-2">{f.evidence}</dd>
                          <dt className="text-ink-muted">Recommended fix</dt><dd className="text-ink">{f.fix}</dd>
                        </dl>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <p className="border-l-2 border-warning/60 pl-4 text-sm text-ink-2">{DEMO.completeNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}
