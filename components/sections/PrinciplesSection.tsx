import { Section } from "@/components/ui/Section";
import { TrustPrinciples } from "@/components/security/TrustPrinciples";
import { TechBadge } from "@/components/ui/Badges";
import { HOME } from "@/lib/constants/content";

export function PrinciplesSection() {
  const p = HOME.principles;
  return (
    <Section id="principles" labelledBy="principles-title">
      <TrustPrinciples id="principles-title" title={p.title} description={p.body} />
      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
        <p className="text-sm text-ink-muted">{p.techStackLabel}</p>
        <ul className="flex flex-wrap gap-2">{p.techStack.map((t) => <li key={t}><TechBadge>{t}</TechBadge></li>)}</ul>
      </div>
    </Section>
  );
}
