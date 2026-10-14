"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Chevrons } from "@/components/ui/Chevrons";
import { NAV, NAV_CTA } from "@/lib/constants/content";
import { SERVICES } from "@/lib/constants/services";
import { cn } from "@/lib/utils/cn";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Full-height overlay. Closed = `invisible`, so nothing inside is tabbable or readable by screen readers. */
export function MobileMenu({ open, onClose, isActive }: { open: boolean; onClose: () => void; isActive: (href: string) => boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  // Keep the latest onClose without re-running the effect (a re-run would steal focus back to the first link).
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; });

  useEffect(() => {
    if (!open) return;
    const root = ref.current!;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden"; // scroll lock
    root.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeRef.current(); return; }
      if (e.key !== "Tab") return;
      // Trap focus between the menu's controls and the header's toggle button.
      const items = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const toggle = document.querySelector<HTMLElement>('[aria-controls="mobile-menu"]');
      const ring = toggle ? [toggle, ...items] : items;
      const i = ring.indexOf(document.activeElement as HTMLElement);
      e.preventDefault();
      ring[(i + (e.shiftKey ? -1 : 1) + ring.length) % ring.length].focus();
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.style.overflow = prevOverflow; };
  }, [open]);

  const delay = (i: number) => ({ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" });
  const item = cn("transition-[opacity,transform] duration-slow ease-out", open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0");

  return (
    <div id="mobile-menu" ref={ref} role="dialog" aria-modal="true" aria-label="Menu"
      // Opening: visibility flips instantly (only opacity transitions), so the focus() call below never hits a still-hidden element.
      // Closing: visibility transitions too, which delays `hidden` until the fade-out has finished.
      className={cn("fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bg pt-[var(--nav-height)] duration-base ease-out lg:hidden",
        open ? "visible opacity-100 transition-opacity" : "invisible opacity-0 transition-[opacity,visibility]")}>
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <nav aria-label="Mobile" className="relative flex-1 px-5 py-6 sm:px-8">
        <ul className="divide-y divide-line border-y border-line">
          {NAV.filter((n) => n.href !== "/services").map((n, i) => (
            <li key={n.href} className={item} style={delay(i)}>
              <Link href={n.href} aria-current={isActive(n.href) ? "page" : undefined}
                className={cn("flex min-h-14 items-center justify-between font-display text-3xl font-semibold", isActive(n.href) ? "text-ink" : "text-ink-2")}>
                {n.label}{isActive(n.href) && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />}
              </Link>
            </li>
          ))}
        </ul>
        <p className={cn("mt-8 text-sm text-ink-muted", item)} style={delay(5)}>Services</p>
        <ul className="mt-2">
          {SERVICES.map((s, i) => (
            <li key={s.slug} className={item} style={delay(6 + i)}>
              <Link href={s.href} className="flex min-h-12 items-center gap-3 py-2 text-ink">
                <s.icon aria-hidden="true" strokeWidth={1.5} className="h-5 w-5 text-accent" />{s.name}
              </Link>
            </li>
          ))}
          <li className={item} style={delay(6 + SERVICES.length)}>
            <Link href="/services" aria-current={isActive("/services") && !SERVICES.some((s) => isActive(s.href)) ? "page" : undefined}
              className="flex min-h-12 items-center gap-2 py-2 text-ink-2">All services <Chevrons className="h-3 w-3 text-accent" /></Link>
          </li>
        </ul>
      </nav>
      <div className="sticky bottom-0 border-t border-line bg-bg px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
        <Button href={NAV_CTA.href} size="lg" chevron className="w-full">{NAV_CTA.label}</Button>
      </div>
    </div>
  );
}
