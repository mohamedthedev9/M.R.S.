# Deployment guide (Vercel)

## 0. Before the first deploy: run the checks I could not run

```bash
npm install                      # creates package-lock.json: commit it
npm run typecheck                # tsc --noEmit
npm run lint                     # eslint .  (Next 16 removed `next lint`)
npm run security:scan            # static scan (also runs in CI)
npm run audit:deps               # npm audit --omit=dev --audit-level=high
npm run build && npm run start   # production build on http://localhost:3000
```

Then, against the running production build:

```bash
npx lighthouse http://localhost:3000 --view                 # mobile (default)
npx lighthouse http://localhost:3000/services/security --preset=desktop --view
npx @axe-core/cli http://localhost:3000 http://localhost:3000/services/security http://localhost:3000/contact
```

Targets to aim for (goals, not results I can promise): Accessibility 100, SEO 100, Best Practices 95+, Performance 90+ on mobile.
Fix anything real they report; ask me to help interpret it. Also test with VoiceOver/NVDA on the menu, scanner and form.

## 1. Environment variables

| Name | Where | Required | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | all environments | **Yes in production** | Public origin, no trailing slash, e.g. `https://your-domain.com`. Used for canonical URLs, sitemap, robots and social cards. Public by design; never put secrets in `NEXT_PUBLIC_*`. |

No other variables exist. When you add a contact backend, its keys must be **server-only** (no `NEXT_PUBLIC_` prefix), used in a server
action or route handler, and added in Vercel's project settings (never committed).

## 2. Deploy

1. Push to GitHub (`.gitignore` already excludes `.env*.local`, `.next`, `node_modules`).
2. Vercel: **Add New Project**, import the repo. Framework preset **Next.js** is detected; leave build and output settings default.
3. Add `NEXT_PUBLIC_SITE_URL` for Production (and Preview if you want correct preview links).
4. Deploy. Preview deployments only *warn* about unresolved placeholders.
5. **Production is blocked by design** while any `[PLACEHOLDER]` / `[CONFIRM WITH OWNER]` text remains
   (`tools/check-placeholders.js`, strict when `VERCEL_ENV=production`). Resolve every item in `lib/constants/content.ts`
   (see `COPY.md`), or the production build fails. Do not use `ALLOW_PLACEHOLDERS=1` for a real launch.
6. Add your domain (Settings, Domains); set the apex/`www` redirect you prefer. HTTPS is automatic; HSTS is sent by `next.config.ts`.

## 3. Before you announce it

- [x] Placeholders and unconfirmed claims: all resolved in the copy (`node tools/check-placeholders.js` reports clear). Re-read the **commitments the site now makes** (section 5) and make sure you will keep them.
- [ ] **Have a lawyer in your jurisdiction review `/privacy` and `/terms`** (`content/LEGAL.md` is the readable copy). They are plain-language templates written to match what the site actually does. Governing law is set to Egypt; change it in `lib/constants/legal.ts` if that is wrong.
- [ ] On the LIVE site, open DevTools: **Network** (no third-party requests) and **Application > Cookies/Storage** (empty). The Privacy Policy promises exactly this.
- [ ] Click the **mtdOS** "View project" link on `/work` (taken from your screenshot; I could not verify it is live).
- [ ] Contact form wired to a real backend, **or** the demo-state wording left as is (it says nothing is sent).
- [ ] The brand mark is now a **trace** of your solid logo (`public/brand/README.md`). If your designer has the original vector, drop it in (keep ids `mrs-p-chev` / `mrs-p-eagle`). Wordmark still the original PNG.
- [ ] **Confirm you hold the commercial rights to the vortex image** (`public/images/swirl.webp`; the original file name suggests it was AI-generated).
- [ ] Keep the unreleased kit/project names from your social posts OFF the site until you choose to announce them.
- [ ] Domain email considered instead of a Gmail address (credibility with larger clients).
- [ ] Submit `https://your-domain.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- [ ] Check social cards: Facebook Sharing Debugger, WhatsApp link preview, LinkedIn Post Inspector, X card validator.
- [ ] Confirm canonical, titles and descriptions per page in "View source".
- [ ] Verify response headers on the live host (`curl -I https://your-domain.com`).

## 4. After launch

Rollback: Vercel keeps previous deployments; promote an earlier one for an instant rollback. If you add analytics, update the privacy
policy first and prefer a cookieless tool. Re-run the section 0 checks on every dependency upgrade (the repo's CI does the first five).

## 5. Commitments the website now makes on your behalf

These sentences are on the live site, so they must be true of how you actually work:

- Paid work is done under a **written agreement or accepted proposal** that sets scope, price, timeline, ownership of deliverables, handover and support (process, FAQs, Terms).
- **Security work** is only done on systems the client owns or has authorized in writing, within an agreed scope (scope page, Terms, Privacy).
- **Findings, reports and access details are confidential**, shared only with the client, and access details are deleted when the work ends (Privacy).
- You **reply to enquiries** and respond to data-rights requests at the contact email within a reasonable time (Privacy).

## 6. Keep the Privacy Policy true

`lib/constants/legal.ts` says the site uses **no cookies, analytics, advertising, tracking, browser storage or third-party scripts, and that the contact form sends nothing**.
`tests/sandbox/legal-claims.cjs` checks all of that against the real site. If you add ANY of the following, **update the policy first** (and the date),
then re-run the check: analytics, a working contact form or email integration, a newsletter, a chat widget, embedded videos/maps/fonts from other hosts, cookies.
