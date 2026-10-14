"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/layout/Logo";
import { Swirl } from "./Swirl";
import { HOME } from "@/lib/constants/content";
import { SERVICES } from "@/lib/constants/services";

/** Node centres as % of a square canvas, in SERVICES order: security, automation, web, vulnerability, software. */
const POS = [[50, 9], [84, 36], [72, 79], [28, 79], [16, 36]] as const;

/**
 * Pointer interaction is "proximity", not movement: each node brightens as the cursor nears it.
 * Nodes never move, so the connector lines always stay attached. Only the faint background drifts (<= 8px).
 * One rAF-throttled listener, no loop. Skipped entirely for touch and reduced-motion users.
 */
export function HeroSystemMap() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(hover: none)").matches) return;
    const parts = [...el.querySelectorAll<HTMLElement | SVGElement>("[data-i]")];
    let raf = 0, cx = 0, cy = 0;
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const nx = ((cx - r.left) / r.width) * 100, ny = ((cy - r.top) / r.height) * 100;
      el.style.setProperty("--px", String(Math.max(-1, Math.min(1, (nx - 50) / 50))));
      el.style.setProperty("--py", String(Math.max(-1, Math.min(1, (ny - 50) / 50))));
      parts.forEach((p) => {
        const [x, y] = POS[Number((p as HTMLElement).dataset.i)];
        const d = Math.hypot(((nx - x) * r.width) / 100, ((ny - y) * r.height) / 100);
        p.style.setProperty("--p", Math.max(0, 1 - d / (r.width * 0.42)).toFixed(3));
      });
    };
    const move = (e: PointerEvent) => { cx = e.clientX; cy = e.clientY; if (!raf) raf = requestAnimationFrame(paint); };
    const leave = () => { parts.forEach((p) => p.style.setProperty("--p", "0")); el.style.setProperty("--px", "0"); el.style.setProperty("--py", "0"); };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="mx-auto w-full max-w-[34rem]">
    <div ref={root} className="relative aspect-square w-full">
      {/* The vortex's eye is centred on the hub, so the eagle sits in the calm centre of the storm. */}
      <Swirl className="-inset-[38%] opacity-[0.62]" />

      {/* Background drifts slightly with the pointer. The outer wrapper clips it, so the drift can never cause horizontal scroll. */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-slow ease-out"
          style={{ transform: "translate(calc(var(--px, 0) * -8px), calc(var(--py, 0) * -8px))" }}>
          <div className="bg-grid absolute inset-0" />
        </div>
      </div>

      <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 h-full w-full">
        {POS.map(([x, y], i) => (
          <path key={i} data-i={i} d={`M50 50 L${x} ${y}`} pathLength={1} fill="none" stroke="rgb(var(--accent))" strokeWidth="0.3"
            style={{ strokeDasharray: 1, strokeDashoffset: 1, strokeOpacity: "calc(0.22 + var(--p, 0) * 0.7)",
              animation: `mrs-draw 900ms var(--ease-out) ${300 + i * 120}ms forwards` }} />
        ))}
        {/* The logo reads ">> eagle": the chevrons lead INTO the eagle. Same here: each spoke carries a >> pointing at the centre. */}
        {POS.map(([x, y], i) => {
          const dx = x - 50, dy = y - 50, mx = 50 + dx * 0.55, my = 50 + dy * 0.55, deg = (Math.atan2(-dy, -dx) * 180) / Math.PI;
          return (
            <g key={`c${i}`} data-i={i} transform={`translate(${mx.toFixed(2)} ${my.toFixed(2)}) rotate(${deg.toFixed(1)})`} style={{ opacity: "calc(0.4 + var(--p, 0) * 0.6)" }}>
              <svg x="-2.4" y="-1.7" width="4.8" height="3.4" viewBox="0 20 183.7 127" fill="rgb(var(--accent))"><use href="#mrs-p-chev" /></svg>
            </g>
          );
        })}
        <circle cx="50" cy="50" r="13" fill="none" stroke="rgb(var(--accent))" strokeOpacity="0.25" strokeWidth="0.3" />
      </svg>

      <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-bg sm:h-24 sm:w-24">
        <Logo variant="eagle" className="h-9 text-ink sm:h-11" />
      </div>

      <ul className="m-0 list-none p-0">
        {SERVICES.map((s, i) => (
          <li key={s.slug} data-i={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${POS[i][0]}%`, top: `${POS[i][1]}%` }}>
            <Link href={s.href} className="group flex w-20 flex-col items-center gap-1.5 text-center sm:w-24">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border bg-bg transition-[border-color,background-color] duration-base ease-out group-hover:bg-surface-2 group-focus-visible:bg-surface-2"
                style={{ borderColor: "rgb(var(--accent) / calc(0.3 + var(--p, 0) * 0.7))" }}>
                <s.icon aria-hidden="true" strokeWidth={1.5} className="h-5 w-5 text-accent transition-transform duration-base ease-out group-hover:scale-110" />
              </span>
              <span className="text-xs leading-tight text-ink-2 transition-colors duration-fast group-hover:text-ink sm:text-sm">{HOME.hero.nodes[i]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
    <p className="mt-6 text-center font-mono text-xs text-ink-muted">Select a node to open the service.</p>
    </div>
  );
}
