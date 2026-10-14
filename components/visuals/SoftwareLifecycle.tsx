import { Chevrons } from "@/components/ui/Chevrons";

const STAGES = ["Idea", "Architecture", "Build", "Test", "Release", "Improve"] as const;

/** Lifecycle loop plus a device outline. Static: structure only, no claims. */
export function SoftwareLifecycle({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-3" aria-label="Software lifecycle">
        {STAGES.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span className="rounded-sm border border-line-strong bg-surface-1 px-3 py-1.5 text-sm text-ink">{s}</span>
            {i < STAGES.length - 1 && <Chevrons className="h-3 w-3 text-accent" />}
          </li>
        ))}
      </ol>
      <p className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
        <span aria-hidden="true" className="inline-block h-px w-8 bg-accent" /> Improve feeds back into the next idea.
      </p>
      <div role="img" aria-label="Outline of a mobile app screen" className="mt-8 w-44 rounded-[1.75rem] border border-line-strong bg-surface-1 p-2.5 shadow-overlay">
        <div className="space-y-3 rounded-[1.25rem] bg-bg p-4" aria-hidden="true">
          <i className="mx-auto block h-1 w-10 rounded-full bg-line-strong" />
          <i className="block h-3 w-2/3 rounded-sm bg-ink/70" />
          <i className="block h-20 rounded-md bg-gradient-to-br from-accent/30 to-transparent" />
          {[0, 1, 2].map((n) => <i key={n} className="block h-7 rounded-md border border-line bg-surface-1" />)}
          <i className="block h-8 rounded-md bg-accent" />
        </div>
      </div>
    </div>
  );
}
