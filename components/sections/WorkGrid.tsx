import { Badge } from "@/components/ui/Badges";
import { Chevrons } from "@/components/ui/Chevrons";
import { HOME } from "@/lib/constants/content";
import { cn } from "@/lib/utils/cn";

type Item = { kind: string; title: string; meta: string; text: string; href?: string; badge?: string };

function WorkItem({ item }: { item: Item }) {
  const project = item.kind === "project";
  return (
    <article className={cn("flex flex-col rounded-lg border bg-surface-1", project ? "border-accent/40 p-8 sm:p-10" : "border-line p-6")}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs text-ink-muted">{item.meta}</p>
        <Badge tone={project ? "accent" : "neutral"}>{item.badge ?? "Concept"}</Badge>
      </div>
      <h3 className={cn("font-display font-semibold text-ink", project ? "mt-6 text-display-md" : "mt-5 text-2xl")}>{item.title}</h3>
      <p className={cn("mt-2 text-ink-2", project && "max-w-prose text-lg")}>{item.text}</p>
      {item.href && (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className="group mt-8 inline-flex w-fit items-center gap-2 py-1 text-sm font-medium text-ink">
          View project<span className="sr-only"> (opens in a new tab)</span>
          <Chevrons className="h-3 w-3 text-accent transition-transform duration-base ease-out group-hover:translate-x-1" />
        </a>
      )}
    </article>
  );
}

/** Real projects first, then clearly labelled concepts. Concepts are never presented as client work. */
export function WorkGrid() {
  const w = HOME.work;
  return (
    <>
      <div className="grid gap-4">{w.projects.map((p) => <WorkItem key={p.title} item={p} />)}</div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">{w.concepts.map((c) => <WorkItem key={c.title} item={c} />)}</div>
      <p className="mt-5 text-sm text-ink-muted">{w.conceptNote}</p>
    </>
  );
}
