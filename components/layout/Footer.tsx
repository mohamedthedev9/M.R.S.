import Link from "next/link";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Container";
import { FOOTER, NAV, SITE } from "@/lib/constants/content";
import { SERVICES } from "@/lib/constants/services";

const col = "space-y-0.5 text-sm";
const link = "inline-block py-1.5 text-ink-2 transition-colors duration-fast hover:text-ink";

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo className="h-7" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-2">{FOOTER.line}</p>
        </div>
        <nav aria-label="Footer: pages"><h2 className="mb-4 text-sm font-medium text-ink">Pages</h2>
          <ul className={col}>{NAV.map((n) => <li key={n.href}><Link className={link} href={n.href}>{n.label}</Link></li>)}</ul></nav>
        <nav aria-label="Footer: services"><h2 className="mb-4 text-sm font-medium text-ink">Services</h2>
          <ul className={col}>{SERVICES.map((s) => <li key={s.slug}><Link className={link} href={s.href}>{s.name}</Link></li>)}</ul></nav>
        <div><h2 className="mb-4 text-sm font-medium text-ink">Contact</h2>
          <ul className={col}>
            <li><a className={link} href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></li>
            {FOOTER.links.map((l) => (
              <li key={l.href}><a className={link} href={l.href} target="_blank" rel="noopener noreferrer">{l.name}<span className="sr-only"> (opens in a new tab)</span></a></li>
            ))}
            <li className="py-1.5 text-ink-muted">{SITE.location}</li>
          </ul></div>
      </Container>
      <Container className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-6 text-xs text-ink-muted">
        <p>{FOOTER.legal}</p>
        <nav aria-label="Legal" className="flex gap-6"><Link href="/privacy" className="inline-block py-2 hover:text-ink">Privacy</Link><Link href="/terms" className="inline-block py-2 hover:text-ink">Terms</Link></nav>
      </Container>
    </footer>
  );
}
