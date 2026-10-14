#!/usr/bin/env node
/**
 * Static security review of the frontend source. Fast, dependency-free, safe to run in CI:  npm run security:scan
 * It looks for patterns that commonly cause trouble. It is NOT a substitute for `npm audit` or a penetration test.
 * Exit code 1 when any HIGH finding exists.
 */
const fs = require("fs"), path = require("path");
const ROOT = process.cwd(), SRC_DIRS = ["app", "components", "lib"];
const files = [];
(function walk(d) { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.(ts|tsx|js|jsx|mjs|css)$/.test(e.name)) files.push(p); } })(ROOT);
const src = files.filter((f) => SRC_DIRS.some((d) => path.relative(ROOT, f).startsWith(d + path.sep)));
const read = (f) => fs.readFileSync(f, "utf8");
const rel = (f) => path.relative(ROOT, f);
const findings = []; const add = (sev, rule, f, line, text) => findings.push({ sev, rule, where: `${rel(f)}:${line}`, text: text.trim().slice(0, 90) });

const RULES = [
  ["HIGH", "HTML injection sink", /\.(innerHTML|outerHTML)\s*=|insertAdjacentHTML\s*\(|document\.write\s*\(/],
  ["HIGH", "dynamic code execution", /\beval\s*\(|new Function\s*\(|setTimeout\s*\(\s*["'`]|setInterval\s*\(\s*["'`]/],
  ["HIGH", "javascript: URL", /javascript:/i],
  ["HIGH", "possible hard-coded secret", /(api[_-]?key|secret|token|passwd|password|authorization)\s*[:=]\s*["'`][A-Za-z0-9_\-./+=]{12,}["'`]/i],
  ["HIGH", "known secret format", /AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY|sk-[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9]{30,}|xox[abprs]-[A-Za-z0-9-]{10,}|eyJ[A-Za-z0-9_-]{15,}\.eyJ/],
  ["MED", "network call from frontend code", /\bfetch\s*\(|XMLHttpRequest|axios|navigator\.sendBeacon|new WebSocket\s*\(/],
  ["MED", "insecure http:// URL", /["'`]http:\/\/(?!localhost|127\.0\.0\.1)/],
  ["INFO", "browser storage / cookies", /\b(localStorage|sessionStorage|indexedDB)\b|document\.cookie/],
];
for (const f of src) read(f).split("\n").forEach((line, i) => {
  const t = line.trim(); if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) return;
  for (const [sev, rule, re] of RULES) if (re.test(line)) add(sev, rule, f, i + 1, line);
});

// dangerouslySetInnerHTML: allowed only for JSON-LD that escapes "<"
for (const f of src) { const s = read(f); [...s.matchAll(/dangerouslySetInnerHTML/g)].forEach((m) => { const line = s.slice(0, m.index).split("\n").length; const ctx = s.slice(Math.max(0, m.index - 220), m.index + 220);
  if (/application\/ld\+json/.test(ctx) && /replace\(\s*\/<\/g\s*,\s*["']\\\\u003c["']\s*\)/.test(ctx)) add("INFO", "dangerouslySetInnerHTML (JSON-LD, '<' escaped: acceptable)", f, line, "JSON-LD block");
  else add("HIGH", "dangerouslySetInnerHTML", f, line, ctx.split("\n").find((l) => l.includes("dangerouslySetInnerHTML")) || ""); }); }

// target=_blank must carry rel=noopener (anchors in TSX, however formatted)
for (const f of src) { const s = read(f); for (const m of s.matchAll(/<a\b[^>]*>/gs)) if (/target=["']_blank["']|target:\s*["']_blank["']/.test(m[0]) && !/noopener/.test(m[0])) add("HIGH", "target=_blank without rel=noopener", f, s.slice(0, m.index).split("\n").length, m[0]); }
for (const f of src) { const s = read(f); if (/target:\s*["']_blank["']/.test(s) && !/noopener/.test(s)) add("HIGH", "target=_blank object without rel=noopener", f, 1, "check spread props"); }

// environment variables: list every use; only NEXT_PUBLIC_* may appear in client components
const envUse = new Map();
for (const f of src) { const s = read(f); const client = /^\s*["']use client["']/m.test(s); for (const m of s.matchAll(/process\.env\.([A-Z0-9_]+)/g)) { (envUse.get(m[1]) || envUse.set(m[1], []).get(m[1])).push(rel(f)); if (client && !m[1].startsWith("NEXT_PUBLIC_")) add("HIGH", "server-only env var read in a client component", f, 1, m[0]); } }
const bad = [...envUse.keys()].filter((k) => !k.startsWith("NEXT_PUBLIC_") && k !== "NODE_ENV");
bad.forEach((k) => add("MED", "non-public env var used (server-only: confirm it never reaches the client)", path.join(ROOT, envUse.get(k)[0]), 1, k));

// repository hygiene
const envFiles = fs.readdirSync(ROOT).filter((n) => /^\.env/.test(n) && n !== ".env.example");
envFiles.forEach((n) => add("HIGH", ".env file present in project root (must not be committed)", path.join(ROOT, n), 1, n));
const gi = fs.existsSync(".gitignore") ? read(".gitignore") : "";
if (!/\.env\*?\.local|\.env/.test(gi)) add("HIGH", ".gitignore does not exclude .env files", path.join(ROOT, ".gitignore"), 1, "");
const ex = fs.existsSync(".env.example") ? read(".env.example") : "";
ex.split("\n").filter((l) => /=/.test(l) && !l.trim().startsWith("#")).forEach((l) => { const [k, v] = l.split("="); if (!/^NEXT_PUBLIC_/.test(k) && v.trim()) add("HIGH", ".env.example contains a non-public value", path.join(ROOT, ".env.example"), 1, k); });
const pkg = JSON.parse(read("package.json")); const lifecycle = Object.keys(pkg.scripts || {}).filter((k) => /^(pre|post)?install$|^prepare$/.test(k));
lifecycle.forEach((k) => add("MED", "install-time script (supply-chain surface)", path.join(ROOT, "package.json"), 1, k));

// response headers configured?
let headerNote = "next.config.ts not found";
if (fs.existsSync("next.config.ts")) { const c = read("next.config.ts"); const need = ["X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy", "Strict-Transport-Security", "Content-Security-Policy"]; const missing = need.filter((h) => !new RegExp(`key:\\s*["']${h}["']`).test(c)); headerNote = missing.length ? "missing: " + missing.join(", ") : "all present"; if (missing.length) add("MED", "security headers missing in next.config.ts", path.join(ROOT, "next.config.ts"), 1, missing.join(", ")); }

const order = { HIGH: 0, MED: 1, INFO: 2 }; findings.sort((a, b) => order[a.sev] - order[b.sev]);
const count = (s) => findings.filter((f) => f.sev === s).length;
console.log(`\nSecurity scan: ${src.length} source files, ${Object.keys(pkg.dependencies || {}).length} runtime dependencies (${Object.keys(pkg.dependencies || {}).join(", ")})`);
console.log(`env vars read: ${[...envUse.keys()].join(", ") || "none"}  |  response headers: ${headerNote}`);
console.log(`HIGH: ${count("HIGH")}   MED: ${count("MED")}   INFO: ${count("INFO")}\n`);
for (const f of findings) console.log(`  [${f.sev}] ${f.rule}\n        ${f.where}  ${f.text}`);
process.exit(count("HIGH") ? 1 : 0);
