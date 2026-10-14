import { cn } from "@/lib/utils/cn";

export interface Step { title: string; body: string }

/** Numbers are correct here: this content really is a sequence. */
export function ProcessStep({ n, title, body, last = false }: { n: number; title: string; body: string; last?: boolean }) {
  return (
    <li className="relative flex gap-5 pb-10 last:pb-0 lg:block lg:pb-0 lg:pr-6">
      {/* connector: vertical on small screens, horizontal on lg */}
      {!last && <span aria-hidden="true" className="tl-line absolute left-[15px] top-9 h-[calc(100%-2.25rem)] w-px bg-line-strong lg:left-9 lg:top-[15px] lg:h-px lg:w-[calc(100%-2.25rem)]" />}
      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-strong bg-bg font-mono text-xs text-accent">{n}</span>
      <div className="lg:mt-5">
        <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
      </div>
    </li>
  );
}

export function Timeline({ steps, className }: { steps: readonly Step[]; className?: string }) {
  return (
    <ol className={cn("grid lg:grid-cols-[repeat(var(--steps),minmax(0,1fr))]", className)} style={{ ["--steps" as string]: steps.length }}>
      {steps.map((s, i) => <ProcessStep key={s.title} n={i + 1} title={s.title} body={s.body} last={i === steps.length - 1} />)}
    </ol>
  );
}

export { PROCESS_STEPS } from "@/lib/constants/content";
