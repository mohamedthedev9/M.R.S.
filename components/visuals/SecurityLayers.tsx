/** Protected system: concentric shield layers around a core. Layers draw in once, no loops. */
const SHIELD = "M100 8 L180 38 V102 C180 152 142 182 100 196 C58 182 20 152 20 102 V38 Z";

export function SecurityLayers({ className }: { className?: string }) {
  const layers = [
    { s: 1, label: "Perimeter", o: 0.45 },
    { s: 0.74, label: "Access", o: 0.55 },
    { s: 0.48, label: "Application", o: 0.8 },
  ];
  return (
    <figure className={className}>
      <svg viewBox="0 0 200 204" role="img" aria-labelledby="sec-t sec-d" className="mx-auto h-auto w-full max-w-sm">
        <title id="sec-t">Layered security diagram</title>
        <desc id="sec-d">Three nested shield layers (perimeter, access, application) protecting a core system.</desc>
        {layers.map((l, i) => (
          // Animation lives on the outer <g>, geometry on the inner <path>: a CSS animation's `transform`
          // would otherwise override the layer's own scale/translate and collapse all three layers together.
          <g key={l.label} style={{ transformOrigin: "100px 102px", animation: `mrs-layer-in .6s var(--ease-out) ${i * 0.18}s both` }}>
            <path d={SHIELD} transform={`translate(${100 - 100 * l.s} ${102 - 102 * l.s}) scale(${l.s})`} fill="rgb(var(--accent) / 0.04)"
              stroke={`rgb(var(--accent) / ${l.o})`} strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
          </g>
        ))}
        <circle cx="100" cy="102" r="7" fill="rgb(var(--accent))" />
        <circle cx="100" cy="102" r="14" fill="none" stroke="rgb(var(--accent) / 0.4)" />
      </svg>
      <figcaption className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 font-mono text-xs text-ink-muted">
        {layers.map((l) => <span key={l.label}>{l.label}</span>)}
      </figcaption>
    </figure>
  );
}
