# M.R.S. website: QA report (Phase 8)

Everything below is labelled **MEASURED** (run against the real components, a real Tailwind 3.4 compile of this project's
config, and a real browser engine), **STATIC** (source scan), or **NOT VERIFIED** (needs a real `next build`, real devices or tools
that were unavailable). Nothing here has been run through `tsc`, ESLint, `next build`, Lighthouse or axe-core: see section 8.

## 1. Functional QA: MEASURED

| Area | Result |
|---|---|
| Navigation, active state, sliding indicator | Passes for all 6 links, including Services (a nested positioned item that previously mis-measured) |
| Services menu | Opens by hover and by keyboard; Escape closes and returns focus; stays in the viewport |
| Mobile menu | Full-screen, focus trapped (25 Tab presses), Escape closes, scroll lock released, navigates and closes itself |
| All internal links | Every `href` on all 14 rendered pages resolves to a real route or an existing in-page anchor |
| CTAs | Hero, service, final CTA and footer links verified; `?service=` pre-selects the form |
| Service routes | 5 slugs generated statically; unknown slug returns `notFound()`; each page has all 9 template blocks |
| Accordions | Enter and Space toggle; `aria-expanded` correct |
| Animations | Hero map, automation sequence, scanner, timeline connectors; reduced-motion path tested |
| Contact UX / validation | Specific errors, focus to first invalid field, errors clear on typing, success state states nothing was sent |
| Loading states | Scanner stages; contact form uses a same-shape Suspense fallback (CLS 0) |
| Error states | Field errors; 404 page; route error boundary (`app/error.tsx`) and `app/global-error.tsx` added in QA |

## 2. Responsive QA: MEASURED

- **No horizontal overflow: 14 routes x 9 widths (320, 375, 390, 430, 768, 1024, 1280, 1440, 1920).**
- No truncated text and no graphic wider than the viewport at 320 and 390 (after a fix, see section 9).
- Touch targets: nothing under 24px (WCAG 2.5.8). Footer/contact links were 16px tall and were enlarged. Remaining controls between
  24 and 44px are listed by the audit as informational (footer link rows are 32px tall).
- Sticky navigation: in-page anchors land below the 64px header; focused controls are never hidden behind it; the header returns on
  upward scroll and when a keyboard user tabs into it.

## 3. Accessibility QA: MEASURED (own checks, not axe)

- **Contrast: 5,480 text elements across 38 page states (all routes, scanner results, form errors/success, open menus, at 1280 and
  390px): all at or above WCAG AA** (4.5:1; 3:1 for large text). Two failures were found and fixed (dimmed zero-count severities).
- **Non-text contrast:** form-field and secondary-button boundaries were 1.9:1; a `--control` token (3.2 to 3.6:1 on every
  surface) now meets WCAG 1.4.11.
- **Keyboard:** on every route at desktop and mobile widths: skip link is the first stop and moves focus to `<main>`; every visible
  control is reachable; no focus lands on hidden elements; no keyboard traps; every focused control shows a visible indicator.
- Semantics: one `h1` per page, no heading-level skips, all `aria-labelledby/controls/describedby` targets exist, unique ids, labelled
  landmarks (`nav`s are distinct), every form field has a label, every link/button has an accessible name, `lang="en"`.
- Severity is never conveyed by colour alone (shape + text label).
- Reduced motion: pointer effect not attached, timeline drawing off, other animation near-instant; function preserved.

## 4. Performance QA

- MEASURED: client-side app JavaScript is **14.9 KB gzipped** (45.6 KB raw), excluding React/Next/Lucide. 11 of 58 components ship JS;
  the other 47 are server-only.
- MEASURED: layout shift (CLS) is **0** on every route at 1280 and 390px in the harness.
- MEASURED: pointer effect costs under 50 ms for 600 events (rAF-throttled, one listener, no loop).
- MEASURED: no infinite animations except status dots *while a demo is running*. Two large static blurred glows (hero map, CTA).
- Images: wordmark 30 KB, eagle 11 KB, `icon.png` compressed 95 KB to 16 KB, social card 99 KB (not page weight). `sizes` hints set
  on the logo so Next serves small variants.
- Fonts: `next/font` self-hosting with `display: swap`; Newsreader loads as one variable file (weights list removed).
- Dependencies: 4 runtime (`next`, `react`, `react-dom`, `lucide-react`).
- Known inefficiency: client components import the whole `content.ts` (about 13.8 KB raw, a few KB gzipped). Splitting it into
  smaller modules is a future optimisation.
- **NOT VERIFIED:** Lighthouse / Core Web Vitals on a real build (LCP, INP, TBT), real font payload, Vercel image optimisation.

## 5. SEO QA: MEASURED (against server-rendered output and the metadata objects)

Title and description on every page (title unique; description 20 to 200 chars); canonical equals the page path (and is *not* set in
the root layout); Open Graph complete per page (a page's `openGraph` replaces the layout's); Twitter card; favicon + apple icon +
1200x630 social card with alt text; sitemap lists all 13 public routes as absolute URLs, no invented dates; robots allows crawling
and references the sitemap; 404 is `noindex`; JSON-LD parses and contains only owner-supplied facts (name, legal name, URL, profiles).
**NOT VERIFIED:** how Google/Facebook/WhatsApp render the cards (use their debuggers after deploy).

## 6. Security-minded frontend QA

- STATIC (`npm run security:scan`): 0 high, 0 medium. No `innerHTML`/`eval`/`javascript:`; the only `dangerouslySetInnerHTML` is the
  JSON-LD block, which escapes `<`. No network calls from frontend code. No secrets. One env var, `NEXT_PUBLIC_SITE_URL` (public).
  All external links carry `rel="noopener noreferrer"`. The scanner was proven against deliberately bad code (it flagged all 13
  planted flaws).
- MEASURED: user-controlled text (scanner input, form fields) renders as text; a hostile `<img onerror>` string stayed inert.
- MEASURED: the demo scanner makes **zero network requests**.
- Headers emitted by `next.config.ts` (verified by calling it): nosniff, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy,
  HSTS, and a partial CSP (`frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`).
- **Not done on purpose:** a full `script-src`/`style-src` CSP needs per-request nonces with Next and must be tested on a real build.
- Form handling: no submission code exists. When you add one, keep keys server-side (server action / route handler).
- **NOT VERIFIED:** `npm audit` (no registry access), dependency licences.

## 7. The final quality question: "Could another agency's logo be swapped in and nothing else change?"

Tested, not guessed: I rendered the homepage with a generic logo and compared. **Before QA the answer was mostly yes**: apart
from the nav logo and the centre icon the page was identical. The identity lived in the logo and little else.

Changes made because of that: (1) every hero spoke now carries the logo's own `>>` pointing **toward the eagle**, mirroring the logo
composition; (2) the "Observe, then act" section gives the eagle to *Observe* and the chevrons to *Execute*; (3) section markers use
the chevron. What still carries identity: the serif display type echoing the wordmark, the chevron motif, the five-node map and the
observe-then-act model. **Still true:** a dark graphite + blue palette is common, and the logo is a small raster. Biggest remaining levers: a vector logo
(allows large, confident use), real project work, and the owner's own voice ("I"/"we", real stories).

## 8. NOT VERIFIED: needs a real environment

`tsc --noEmit`, `eslint`, `next build` (prerendering, bundle sizes, route manifest), Lighthouse, axe-core, `npm audit`, screen readers
(VoiceOver/NVDA/TalkBack), real touch devices and Safari/Firefox rendering, the scroll-linked timeline animation (new CSS), HSTS
and header behaviour on the live host. See `DEPLOYMENT.md` for the exact commands.

## 9. Fixed during QA

1. Zero-count severities were dimmed with `opacity` (2.2:1). Now muted colour (6.1:1).
2. Input and secondary-button boundaries were 1.9:1. New 3:1 control token.
3. Scanner stage labels were truncated at 320px ("Analyz…"). Resized, no ellipsis.
4. Footer/contact links were 16px tall. Now 32px hit areas. Logo link and filter chips enlarged.
5. Contact page "Loading form…" fallback caused a layout swap. Fallback is now the form itself.
6. Added route error boundary and `global-error` (no error details shown to visitors).
7. Added `Content-Security-Policy` directives that cannot break hydration; security scanner fixed after it falsely passed on a comment.
8. Newsreader no longer requests three static weights; icon compressed; logo `sizes` set.
9. Brand: chevron-toward-eagle spokes, eagle/chevron process symbols, chevron section markers.

## 10. Content completion and legal pages (added after the QA pass)

- **Missing information filled** from facts the owner supplied: founder (Mohamed Reda, also known as MohamedTheDev; also leads MTD, founded 2022), technology list
  (HTML, CSS, JavaScript, Python, Next.js, Tailwind CSS), the open-source project mtdOS (2026) as the first Selected Work item, and an About page.
- **Open questions settled as stated policy or by removing the claim**, never by inventing terms: timelines, ownership, handover, support, report format and
  data handling now point to "the written agreement" / the Privacy Policy; iOS is described honestly (Android + web apps, which work on iPhone browsers).
- **Deliberately NOT used** from the Wikipedia-draft screenshot: the "Claude 101 Certification" (a course credential would read as a security credential), the
  "Plug" brand-ambassador role (a third-party relationship), and the "1.6+ million views" figure (an unverifiable metric). A draft Wikipedia page is also not
  independent verification, so it was treated as owner-supplied, not as proof.
- **Privacy Policy and Terms of Use** added (`/privacy`, `/terms`), plus `content/LEGAL.md`. MEASURED (`legal-claims.cjs`, 11 checks): a full session of
  14 pages, a form submission with personal details and both demos produced **0 network requests, 0 cookies, 0 storage entries**, and the rendered HTML
  contains no third-party script, style, font, image, frame or form post.
- The launch gate now also catches a marker written without a colon (one such line had slipped through), and the audit's old in-page-anchor assertion was
  always true; it now checks real ids (proven against a deliberately broken link).
- **NOT verified:** that the legal text is sufficient for your jurisdiction. It is a template, not legal advice.

## 11. Design import from the owner's brand files (measured)

Applied from the supplied images: pure-black monochrome palette; the **solid** `>>` + eagle as a vector mark (used for the hub, spokes, loader, 404,
OG card; the chevron motif everywhere is now at the logo's exact geometry); the vortex placed so its **dark eye sits behind the eagle hub** (and the CTA
heading), as on the owner's Signature card; the measured magenta-to-cyan gradient on the "M.R.S." token in headings; CSS/SVG rebuilds of the two loader
GIFs; the signature on About and the contact thank-you; and bleeding shapes on the 404 and thank-you card. Provenance and licence flags: `public/brand/README.md`.

- **Contrast over the vortex: MEASURED against real pixels**, not assumed. `qa-bgcontrast.cjs` hides all text, photographs the page, and takes the 98th-percentile
  luminance behind each text's exact glyph box: **2,741 text elements, 14 routes, 1280 and 390px: all pass** (lowest on the homepage 5.32:1). It was proven to
  fail when the vortex is made 5x brighter (hero labels drop to 1.2-1.9:1). The older solid-colour audit still passes 5,482 elements (it skips gradient text, which
  the pixel audit checks and requires to be >= 24px).
- Everything else re-run on the final code: 281 page-audit checks, 45 + 44 + 18 + 20 + 11 browser checks, 182 keyboard/responsive/CLS checks, 126 overflow cases,
  security scan clean.
- Cost: images a visitor downloads about 100 KB (swirl 38, wordmark 31, signature 20); client JS 16.0 KB gzipped (+1.1); the inline brand sprite adds about
  10 KB of HTML per page (the eagle path, defined once per page).
- **Bugs found and fixed while importing:** the glyph component's default size classes silently overrode the sizes callers passed (every small chevron rendered 28px
  tall; Tailwind resolves conflicts by stylesheet order, not intent); the hero's oversized backdrop needed clipping to avoid sideways scroll; ornaments collided with
  the fixed navigation and left a gap at the flower's centre.
- **Decisions and limits:** the traced mark is faithful but is a trace, not the designer's vector. The serif wordmark was NOT traced (it did not survive). The
  decorative stickers in the owner's canvases were NOT reused (cropped fragments of template artwork, licence unknown). The two "kit" posts list unreleased project names
  (AntiSpy-System, SphinxOS, DeepThink V2, a censored one): treated as typography/colour reference only and deliberately not published.
- **NOT verified:** real-device/GPU rendering of the vortex and mask on low-end phones; the owner's rights to the vortex image.
