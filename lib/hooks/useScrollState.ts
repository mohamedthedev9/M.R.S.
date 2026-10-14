"use client";
import { useEffect, useState } from "react";

/** scrolled: past `threshold` px. hidden: scrolling down past 120px (returns on any upward scroll). rAF-throttled, passive. */
export function useScrollState(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > threshold);
      const delta = y - last;
      if (Math.abs(delta) > 8) { setHidden(delta > 0 && y > 120); last = y; }
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return { scrolled, hidden };
}
