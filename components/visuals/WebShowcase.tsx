/** Browser frame with a generic concept layout. Shapes only: no fake content or metrics. */
export function WebShowcase({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <div role="img" aria-label="Concept layout of a responsive website inside a browser window" className="overflow-hidden rounded-xl border border-line-strong bg-surface-1 shadow-overlay">
        <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-4 py-3">
          <span className="flex gap-1.5" aria-hidden="true">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-line-strong" />)}</span>
          <span className="mx-auto rounded-sm bg-bg px-3 py-1 font-mono text-[11px] text-ink-muted">your-domain.example</span>
        </div>
        <div className="space-y-5 p-5 sm:p-7" aria-hidden="true">
          <div className="flex items-center justify-between"><span className="h-3 w-16 rounded-sm bg-ink/70" /><span className="flex gap-3"><i className="h-2 w-8 rounded-sm bg-line-strong" /><i className="h-2 w-8 rounded-sm bg-line-strong" /><i className="h-5 w-14 rounded-sm bg-accent" /></span></div>
          <div className="grid gap-5 sm:grid-cols-5">
            <div className="space-y-3 sm:col-span-3"><i className="block h-5 w-11/12 rounded-sm bg-ink/80" /><i className="block h-5 w-8/12 rounded-sm bg-ink/80" /><i className="mt-4 block h-2 w-full rounded-sm bg-line-strong" /><i className="block h-2 w-10/12 rounded-sm bg-line-strong" /><i className="mt-3 block h-8 w-28 rounded-md bg-accent" /></div>
            <div className="rounded-lg border border-line bg-bg p-3 sm:col-span-2"><i className="block h-16 rounded-sm bg-gradient-to-br from-accent/30 to-transparent" /><i className="mt-3 block h-2 w-2/3 rounded-sm bg-line-strong" /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">{[0, 1, 2].map((i) => <div key={i} className="rounded-md border border-line bg-bg p-3"><i className="block h-2 w-1/2 rounded-sm bg-accent/60" /><i className="mt-2 block h-2 w-full rounded-sm bg-line-strong" /></div>)}</div>
        </div>
      </div>
      <figcaption className="mt-3 text-xs text-ink-muted">Concept layout. Real projects appear under Selected Work once supplied.</figcaption>
    </figure>
  );
}
