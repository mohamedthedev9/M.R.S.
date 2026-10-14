"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { StatusPill } from "@/components/ui/Badges";
import { Button } from "@/components/ui/Button";

const STEPS = [
  { name: "Trigger", text: "A file lands in a watched folder." },
  { name: "Logic", text: "Check the format, validate the fields, rename." },
  { name: "Action", text: "Compile the weekly report." },
  { name: "Result", text: "Report delivered and the run logged." },
] as const;

/** Illustrative example workflow. Runs entirely in the browser; nothing is executed or sent. */
export function AutomationFlow() {
  const [active, setActive] = useState(-1); // -1 idle
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function run() {
    timers.current.forEach(clearTimeout);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setActive(STEPS.length - 1); return; } // keep function, drop the movement
    setActive(0);
    STEPS.forEach((_, i) => { if (i > 0) timers.current.push(window.setTimeout(() => setActive(i), i * 900)); });
  }
  const done = active === STEPS.length - 1;

  return (
    <div className="rounded-xl border border-line bg-surface-1 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusPill tone={active < 0 ? "ready" : done ? "complete" : "active"} busy={active >= 0 && !done}>
          {active < 0 ? "Ready" : done ? "Complete" : `Running: ${STEPS[active].name}`}
        </StatusPill>
        <span className="text-xs text-ink-muted">Example workflow, for illustration</span>
      </div>
      <ol className="mt-8 grid gap-4 md:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.name} aria-current={active === i ? "step" : undefined}
            className={cn("relative rounded-lg border p-4 transition-colors duration-base ease-out",
              i <= active ? "border-accent/60 bg-accent/[0.06]" : "border-line bg-bg")}>
            <p className={cn("font-mono text-xs", i <= active ? "text-accent" : "text-ink-muted")}>{s.name}</p>
            <p className="mt-2 text-sm text-ink-2">{s.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex items-center gap-4">
        <Button variant="secondary" onClick={run}>{active < 0 ? "Run example" : "Run again"}</Button>
        <p className="sr-only" aria-live="polite">{active >= 0 ? `Step ${active + 1} of 4: ${STEPS[active].name}` : ""}</p>
      </div>
    </div>
  );
}
