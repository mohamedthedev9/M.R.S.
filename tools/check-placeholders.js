#!/usr/bin/env node
/**
 * Launch gate. Fails (exit 1) while any owner-supplied placeholder or unconfirmed claim is still in the copy.
 *   node tools/check-placeholders.js          -> report, exit 1 if any remain
 *   node tools/check-placeholders.js --warn   -> report only (local/preview builds), BUT strict when VERCEL_ENV=production or LAUNCH_STRICT=1
 *   ALLOW_PLACEHOLDERS=1                      -> explicit override (do not use for a real launch)
 * Wire into package.json (Phase 7):  "prebuild": "node tools/check-placeholders.js" on production deploys.
 */
const fs = require("fs"), path = require("path");
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git", "tests", "tools", "content", "README.md"].includes(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else if (/\.(ts|tsx|mdx|json)$/.test(e.name)) files.push(p);
  }
})(process.cwd());
const re = /\[(PLACEHOLDER|CONFIRM WITH OWNER)[^\]]*\]/g;
const hits = [];
for (const f of files) {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((l, i) => { if (l.trim().startsWith("*") || l.trim().startsWith("//")) return; for (const m of l.matchAll(re)) hits.push({ f: path.relative(process.cwd(), f), line: i + 1, tag: m[1], text: m[0] }); });
}
const ph = hits.filter((h) => h.tag === "PLACEHOLDER"), cf = hits.filter((h) => h.tag !== "PLACEHOLDER");
console.log(`\nLaunch gate: ${ph.length} placeholders (facts to supply), ${cf.length} claims to confirm.\n`);
for (const h of hits) console.log(`  ${h.f}:${h.line}  ${h.text.slice(0, 110)}`);
const strict = process.env.VERCEL_ENV === "production" || process.env.LAUNCH_STRICT === "1" || !process.argv.includes("--warn");
if (hits.length && strict && process.env.ALLOW_PLACEHOLDERS !== "1") { console.log("\nBLOCKED: resolve every item above before deploying to production.\n"); process.exit(1); }
console.log(hits.length ? "\n(warn mode: not blocking)\n" : "\nClear to launch (copy-wise).\n");
