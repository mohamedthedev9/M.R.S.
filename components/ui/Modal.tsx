"use client";
import { useEffect, useId, useRef } from "react";

/**
 * Built on the native <dialog>: the browser provides the focus trap, Escape to close,
 * inert background and focus return. `onClose` also fires for Escape, so state stays in sync.
 */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} aria-labelledby={titleId} onClose={onClose}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} // click on the backdrop
      className="m-auto w-[min(92vw,34rem)] rounded-xl border border-line-strong bg-surface-1 p-0 text-ink shadow-overlay backdrop:bg-bg/80 backdrop:backdrop-blur-sm">
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-6">
          <h2 id={titleId} className="font-display text-2xl font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-ink-2 hover:text-ink">
            <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l10 10M11 1 1 11" /></svg>
          </button>
        </div>
        <div className="mt-4 text-ink-2">{children}</div>
      </div>
    </dialog>
  );
}
