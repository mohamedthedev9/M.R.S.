import { HOME, SECURITY_UX } from "@/lib/constants/content";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Principles as a two-column definition list with a lead column: deliberately not a grid of identical cards. */
export function TrustPrinciples({ as = "h2", title = SECURITY_UX.trust.title, description = SECURITY_UX.trust.body, id }: { as?: "h2" | "h3"; title?: string; description?: string; id?: string }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
      <SectionHeader id={id} title={title} description={description} as={as} />
      <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {HOME.principles.items.map((p) => (
          <div key={p.name} className="border-t border-line-strong pt-4">
            <dt className="font-display text-xl font-semibold text-ink">{p.name}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-ink-2">{p.text}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
