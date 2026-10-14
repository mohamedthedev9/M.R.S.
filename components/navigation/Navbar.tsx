"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Chevrons } from "@/components/ui/Chevrons";
import { MobileMenu } from "./MobileMenu";
import { NAV, NAV_CTA } from "@/lib/constants/content";
import { SERVICES } from "@/lib/constants/services";
import { useScrollState } from "@/lib/hooks/useScrollState";
import { cn } from "@/lib/utils/cn";

export function Navbar() {
  const pathname = usePathname();
  const { scrolled, hidden } = useScrollState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [bar, setBar] = useState<{ x: number; w: number } | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const svcToggle = useRef<HTMLButtonElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  const isActive = useCallback((href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/")), [pathname]);
  const target = hover ?? NAV.find((n) => isActive(n.href))?.href ?? null;

  // Close everything on navigation.
  useEffect(() => { setMenuOpen(false); setSvcOpen(false); }, [pathname]);

  // Sliding indicator: measure the active/hovered link.
  useEffect(() => {
    const ul = listRef.current;
    if (!ul) return;
    const measure = () => {
      const el = target ? ul.querySelector<HTMLElement>(`[data-href="${target}"]`) : null;
      // Measure against the list itself. offsetLeft would be relative to the Services <li> (a positioned wrapper), not the <ul>.
      const u = ul.getBoundingClientRect(), r = el?.getBoundingClientRect();
      setBar(el && r ? { x: r.left - u.left, w: r.width } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ul);
    return () => ro.disconnect();
  }, [target]);

  // Escape closes the Services panel and returns focus to its toggle.
  useEffect(() => {
    if (!svcOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setSvcOpen(false); svcToggle.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [svcOpen]);

  const openSoon = () => { clearTimeout(timer.current); timer.current = window.setTimeout(() => setSvcOpen(true), 80); };
  const closeSoon = () => { clearTimeout(timer.current); timer.current = window.setTimeout(() => setSvcOpen(false), 150); };
  const hide = hidden && !menuOpen && !svcOpen && !focusInside;

  return (
    <>
      <header
        onFocus={(e) => setFocusInside(e.target.matches(":focus-visible"))} // keyboard focus only; a mouse click must not pin the header
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocusInside(false); }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-[var(--nav-height)] border-b transition-[transform,background-color,border-color] duration-slow ease-out",
          scrolled || menuOpen ? "border-line bg-bg/70 backdrop-blur-glass" : "border-transparent bg-transparent",
          menuOpen && "bg-bg",
          hide && "-translate-y-full",
        )}
      >
        <div className="mx-auto flex h-full max-w-site items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" aria-label="M.R.S. home" className="shrink-0 py-2"><Logo className="h-6 sm:h-7" priority /></Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul ref={listRef} className="relative flex items-center gap-1" onPointerLeave={() => setHover(null)}>
              {NAV.map((item) => {
                const active = isActive(item.href);
                const isServices = item.href === "/services";
                const link = (
                  <Link href={item.href} data-href={item.href} aria-current={active ? "page" : undefined}
                    onPointerEnter={() => setHover(item.href)} onFocus={() => setHover(item.href)} onBlur={() => setHover(null)}
                    className={cn("relative block px-3.5 py-2 text-sm transition-colors duration-fast", active ? "text-ink" : "text-ink-2 hover:text-ink")}>
                    {item.label}
                  </Link>
                );
                if (!isServices) return <li key={item.href}>{link}</li>;
                return (
                  <li key={item.href} className="relative flex items-center" onPointerEnter={(e) => e.pointerType === "mouse" && openSoon()} onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
                    onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setSvcOpen(false); }}>
                    {link}
                    <button ref={svcToggle} type="button" aria-expanded={svcOpen} aria-controls="services-panel" aria-label="Show services"
                      onClick={() => setSvcOpen((v) => !v)}
                      className="-ml-2 flex h-9 w-7 items-center justify-center text-ink-2 hover:text-ink">
                      <Chevrons className={cn("h-3 w-3 transition-transform duration-base ease-out", svcOpen ? "-rotate-90" : "rotate-90")} />
                    </button>
                    <div id="services-panel" hidden={!svcOpen}
                      className="absolute left-1/2 top-full w-[34rem] -translate-x-1/2 pt-3">
                      <div className="rounded-lg border border-line bg-surface-1/90 p-2 shadow-overlay backdrop-blur-glass">
                        <ul className="grid grid-cols-2 gap-1">
                          {SERVICES.map((s) => (
                            <li key={s.slug}>
                              <Link href={s.href} className="group flex gap-3 rounded-md p-3 transition-colors duration-fast hover:bg-surface-2">
                                <s.icon aria-hidden="true" strokeWidth={1.5} className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                                <span><span className="block text-sm font-medium text-ink">{s.name}</span><span className="block text-xs text-ink-muted">{s.short}</span></span>
                              </Link>
                            </li>
                          ))}
                          <li><Link href="/services" className="flex h-full items-center gap-2 rounded-md p-3 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink">All services <Chevrons className="h-3 w-3 text-accent" /></Link></li>
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
              {/* one indicator that slides between items */}
              <span aria-hidden="true" className="pointer-events-none absolute -bottom-px left-0 h-px bg-accent transition-[transform,width,opacity] duration-slow ease-out"
                style={{ width: bar?.w ?? 0, transform: `translateX(${bar?.x ?? 0}px)`, opacity: bar ? 1 : 0 }} />
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Button href={NAV_CTA.href} chevron className="hidden sm:inline-flex">{NAV_CTA.label}</Button>
            <button ref={menuBtn} type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="relative flex h-11 w-11 items-center justify-center rounded-md border border-line-control text-ink lg:hidden">
              <span aria-hidden="true" className={cn("absolute h-px w-5 bg-current transition-transform duration-base ease-out", menuOpen ? "rotate-45" : "-translate-y-1.5")} />
              <span aria-hidden="true" className={cn("absolute h-px w-5 bg-current transition-opacity duration-fast", menuOpen && "opacity-0")} />
              <span aria-hidden="true" className={cn("absolute h-px w-5 bg-current transition-transform duration-base ease-out", menuOpen ? "-rotate-45" : "translate-y-1.5")} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => { setMenuOpen(false); menuBtn.current?.focus(); }} isActive={isActive} />
    </>
  );
}
