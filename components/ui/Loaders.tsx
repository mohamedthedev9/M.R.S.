import { cn } from "@/lib/utils/cn";

/**
 * Spinner: 12 spokes, one fading tail, stepped rotation: the owner's loading-58.gif (12 frames x 120ms, 30 degrees clockwise).
 * It only loops while something is actually loading. Under prefers-reduced-motion it stops (see globals.css).
 */
export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 100 100" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} className={cn("h-5 w-5 text-ink", className)}>
      <g className="origin-center animate-[mrs-spin_1.44s_steps(12)_infinite]" style={{ transformOrigin: "50px 50px" }}>
        {Array.from({ length: 12 }, (_, k) => (
          <rect key={k} x="45" y="6" width="10" height="26" rx="5" fill="currentColor" opacity={Math.max(0.14, 1 - k * 0.075)} transform={`rotate(${-k * 30} 50 50)`} />
        ))}
      </g>
    </svg>
  );
}

/**
 * LoadingBar: the owner's Loading.gif pill. Outlined capsule; the fill starts as a dot and decelerates toward the end
 * (fast first, slow last), like the original curve. Indeterminate: never claims a real percentage.
 */
export function LoadingBar({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <div role="progressbar" aria-busy="true" aria-label={label} className={cn("h-6 w-64 max-w-full rounded-full border-2 border-ink p-[3px]", className)}>
      <div className="h-full w-[4%] min-w-[1rem] animate-[mrs-fill_5s_cubic-bezier(0.1,0.7,0.2,1)_forwards] rounded-full bg-ink" />
    </div>
  );
}
