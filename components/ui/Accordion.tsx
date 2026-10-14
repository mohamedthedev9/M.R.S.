"use client";
import { useId, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Chevrons } from "./Chevrons";

export interface AccordionItem { id: string; question: string; answer: React.ReactNode }

export function Accordion({ items, defaultOpenId }: { items: readonly AccordionItem[]; defaultOpenId?: string }) {
  const [open, setOpen] = useState<string | null>(defaultOpenId ?? null);
  const base = useId();
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it) => {
        const isOpen = open === it.id;
        const panel = `${base}-${it.id}`;
        return (
          <div key={it.id}>
            <h3>
              <button type="button" aria-expanded={isOpen} aria-controls={panel} onClick={() => setOpen(isOpen ? null : it.id)}
                className="flex min-h-14 w-full items-center justify-between gap-6 py-4 text-left text-ink transition-colors duration-fast hover:text-accent-hover">
                <span className="text-base font-medium">{it.question}</span>
                <Chevrons className={cn("h-3.5 w-3.5 shrink-0 text-accent transition-transform duration-base ease-out", isOpen && "rotate-90")} />
              </button>
            </h3>
            <div id={panel} role="region" hidden={!isOpen}
              className="pb-5 pr-10 text-ink-2 leading-relaxed">{it.answer}</div>
          </div>
        );
      })}
    </div>
  );
}
