import { Chevrons } from "./Chevrons";

export function FeatureList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-3 text-ink-2">
          <Chevrons className="mt-1.5 h-3 w-3 shrink-0 text-accent" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
