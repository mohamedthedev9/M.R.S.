import { SITE } from "@/lib/constants/content";

const a = "inline-block py-1.5 text-ink underline decoration-line-strong underline-offset-4 transition-colors duration-fast hover:decoration-accent";

/** Contact details the owner supplied. External profiles open in a new tab with rel=noopener. */
export function ContactChannels() {
  const s = SITE.social;
  const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
  return (
    <dl className="space-y-6">
      <div><dt className="text-sm text-ink-muted">Email</dt><dd className="mt-1"><a className={a} href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></dd></div>
      <div><dt className="text-sm text-ink-muted">WhatsApp</dt><dd className="mt-1"><a className={a} href={s.whatsapp.href} {...ext}>{s.whatsapp.label}<span className="sr-only"> (opens in a new tab)</span></a></dd></div>
      <div><dt className="text-sm text-ink-muted">Social</dt>
        <dd className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
          <a className={a} href={s.facebook.href} {...ext}>Facebook<span className="sr-only"> (opens in a new tab)</span></a>
          <a className={a} href={s.tiktok.href} {...ext}>TikTok {s.tiktok.label}<span className="sr-only"> (opens in a new tab)</span></a>
        </dd></div>
      <div><dt className="text-sm text-ink-muted">Location</dt><dd className="mt-1 text-ink-2">{SITE.location}</dd></div>
    </dl>
  );
}
