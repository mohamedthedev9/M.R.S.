# M.R.S. website (Mohamed Reda Services)

Next.js 16 (App Router) · TypeScript · Tailwind CSS 3.4 · Lucide · no animation library (CSS + small hooks).

## Run it

```bash
npm install
cp .env.example .env.local     # set NEXT_PUBLIC_SITE_URL for real deployments
npm run dev                    # http://localhost:3000
npm run typecheck && npm run lint && npm run build
```

Requires Node 20.9+. **Not yet run end to end:** this project was assembled in a sandbox with no npm access, so the
first `npm install && npm run build` is the real acceptance test. Expect to fix small type or lint issues on first run
(see "Verification" below for exactly what was and was not checked).

## Where things live

```
app/                 routes (/, /services, /services/[slug], /work, /process, /about, /contact, /privacy), sitemap, robots, icons, OG image
components/
  layout/            SiteShell (skip link, nav, <main>, footer), Footer, Logo
  navigation/        Navbar (client), MobileMenu (client)
  sections/          homepage + page sections (server components)
  services/          ServicePageView: the 9-block service template
  security/          scope, severity, report preview, trust principles
  visuals/           HeroSystemMap, SecurityLayers, AutomationFlow, WebShowcase, VulnDemo, SoftwareLifecycle
  ui/                Button, Cards, Badges, Accordion, Modal, ContactForm, Section, SectionHeader, ...
lib/constants/       services.ts (service data, ONE place) and content.ts (ALL site copy and demo data)
styles/tokens.css    design tokens (colour, radius, motion). tailwind.config.ts maps them to utilities.
tools/               check-placeholders.js (launch gate), gen-copy.js (review document)
tests/               sandbox-era tests (see tests/README.md)
```

Client components are limited to what must be interactive: Navbar, MobileMenu, HeroSystemMap, ContactForm(+FromUrl),
Accordion, Modal, AutomationFlow, VulnDemo, plus `useScrollState`. Everything else renders on the server.

## Editing content

All copy is in `lib/constants/content.ts`; services are in `lib/constants/services.ts`. Components never hardcode copy.
Unknown facts are marked `[PLACEHOLDER: ...]` (a fact only the owner has) or `[CONFIRM WITH OWNER: ...]` (a claim that must be
true before launch). `npm run copy:review` regenerates `content/COPY.md` for non-developers to read.

**Launch gate:** `node tools/check-placeholders.js` lists every unresolved marker. `npm run build` runs it in warn mode, but it
is **strict (fails the build) when `VERCEL_ENV=production`** or `LAUNCH_STRICT=1`, so the site cannot reach production with
placeholder text in it. (`ALLOW_PLACEHOLDERS=1` overrides; do not use it for a real launch.)

## Brand and imagery

Pure-black monochrome, the traced vector `>>` + eagle, the vortex (eye behind the hub), a measured magenta-to-cyan gradient for the "M.R.S." token, and your loaders rebuilt in CSS/SVG.
Every asset's origin and any licence caveat: `public/brand/README.md`. If you add text over an image, run the pixel-level contrast audit (`tests/sandbox/qa-bgcontrast.cjs`).

## Legal pages

`/privacy` and `/terms` render from `lib/constants/legal.ts` (readable copy: `content/LEGAL.md`). They are templates matched to what the site does today, not legal advice:
have a lawyer review them, and update them BEFORE adding analytics, cookies or a working contact form (see `DEPLOYMENT.md` section 6).

## Contact form

The form validates and shows a clear **demo success state** ("Submissions are not sent yet"). Nothing is transmitted.
To go live, add an email/API service and call it at the `INTEGRATION POINT` comment in `components/ui/ContactForm.tsx`
(a server action or route handler). Never put API keys in client code; use server-only environment variables.
Until then visitors are pointed to WhatsApp and email.

## QA and deployment

See `QA_REPORT.md` (what was measured vs not verified) and `DEPLOYMENT.md` (exact pre-flight commands, env vars, Vercel steps, launch checklist).
Useful scripts: `npm run verify` (typecheck + lint + security scan + build), `npm run security:scan`, `npm run audit:deps`.

## Deploy (Vercel)

1. Push the repo, import it in Vercel (framework: Next.js, defaults are correct).
2. Set `NEXT_PUBLIC_SITE_URL` to the production origin (no trailing slash).
3. Resolve every item in `node tools/check-placeholders.js`, or production builds will fail by design.
4. Add the domain; HTTPS and HSTS are handled by the platform and `next.config.ts` headers.

## Verification status (be honest about this)

Checked in the sandbox, against the real components and a real Tailwind 3.4 compile of this config:
every route server-renders; 262 structural/a11y/SEO assertions over the rendered HTML; a clickable harness covering
navigation, mobile menu, contact flow and 404; zero horizontal overflow on 13 routes at 9 widths (320 to 1920);
behaviour tests for focus traps, forms, keyboard, reduced motion and "the demo scanner makes no network requests".

**Not checked:** `next build` / `tsc` (no npm access), ESLint (`eslint.config.mjs` follows the Next 16 template but is unrun),
real-device touch, screen readers, the scroll-linked timeline animation (newer CSS), and Lighthouse/Core Web Vitals.
Package versions were chosen from current release information, not from an installed lockfile.

## Known limitations

- Logo is a raster PNG (small). Keep it small until a vector original is supplied (`public/brand/`).
- No strict Content-Security-Policy yet (needs per-request nonces with Next; see below). Other security headers are set.
- Vulnerability checker is a demonstration with synthetic data only. It has no network code by design.
- Tailwind is on v3.4; Tailwind v4 is a separate migration.
- English only. Adding Arabic would need locale routing and RTL styles.

## Future improvements

Real contact backend; vector logo; real project case studies; nonce-based CSP; analytics only with a privacy policy in place;
Playwright + CI against `next build`; self-hosted Arabic/RTL support if wanted.
