# Tests

Written and run in a sandbox **without** npm access (no Next.js), so they use small stand-ins for `next/link`, `next/image`,
`next/navigation` and `next/font`, plus the Tailwind 3.4 CLI compiling this project's real config. In that environment all of
them passed, repeatedly (625 assertions, plus the pixel-level contrast audit below: 24 component renders, 281 page-audit checks, 45 + 44 + 18 + 20 browser checks, 182 keyboard/responsive/CLS checks and 11 privacy-claim checks;
the overflow matrix is 117 route/width cases inside one assertion; plus a measured contrast audit of 5,480 text elements).

They are **reference material, not wired into this project**: paths such as `/home/claude/...` are sandbox-specific.
Port them to run against `next dev` / `next build` with Playwright in CI.

- `ssr-smoke.test.tsx`: server-renders each component, asserts structure.
- `sandbox/page-audit.cjs`: for every route: one h1, heading order, unique ids, resolving aria references, link targets,
  alt text, form labels, landmarks, metadata, canonical, sitemap, robots.
- `sandbox/phase5-behavior.cjs`: `run.cjs`: nav, menu focus trap, forms, modal, pointer effect, reduced motion.
- `sandbox/p6-test.cjs`: demo scanner and security components (includes "no network requests during a scan").
- `sandbox/site-test.cjs`: click-through flows + overflow across 13 routes x 9 widths (320 to 1920).
- `sandbox/qa-behavior.cjs`: keyboard traversal on every route, focus visibility, touch targets, truncation, CLS, pointer cost.
- `sandbox/qa-contrast.cjs`: measured WCAG contrast of every text element across page states.
- `sandbox/legal-claims.cjs`: checks every factual claim in the Privacy Policy (no cookies, storage, third-party loads, or network requests) against the real site.
- `sandbox/harness/`: hash-router stand-in used to render the whole site in a browser.

Launch gate: `node tools/check-placeholders.js` (see the main README).

- `sandbox/qa-bgcontrast.cjs`: contrast measured against the REAL rendered pixels behind every text element (vortex included): hides text, screenshots, p98 luminance per glyph box. Run separately (about 2.5 min): `node qa-bgcontrast.cjs`. Set `NEG=1` to brighten the vortex and prove it fails.
