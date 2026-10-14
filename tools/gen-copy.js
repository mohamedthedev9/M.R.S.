// Regenerates content/COPY.md from lib/constants/content.ts. Run: node tools/gen-copy.js (needs `typescript`).
const ts = require("typescript"), fs = require("fs");
const load = (f) => { const r = ts.transpileModule(fs.readFileSync(f, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }); const m = { exports: {} }; new Function("module", "exports", "require", r.outputText)(m, m.exports, () => ({})); return m.exports; };
const C = load("lib/constants/content.ts");
const lab = (k) => k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
const out = [];
const strong = new Set(["title", "name", "stage", "label", "question"]);
function walk(v, d) {
  if (Array.isArray(v)) { v.forEach((x) => out.push("- " + (x && typeof x === "object" ? Object.entries(x).map(([a, b]) => typeof b === "object" ? `${a}: ${JSON.stringify(b)}` : strong.has(a) ? `**${b}**` : b).join(" — ") : x))); out.push(""); return; }
  if (v && typeof v === "object") { for (const [k, x] of Object.entries(v)) { if (typeof x === "string" || typeof x === "number") out.push(`**${lab(k)}:** ${x}  `); else { out.push("", "#".repeat(Math.min(d, 5)) + " " + (v === C.SERVICE_PAGES ? k : lab(k))); walk(x, d + 1); } } out.push(""); return; }
  out.push(String(v));
}
for (const k of ["SITE", "HOME", "SERVICE_PAGES", "PAGES", "PROCESS", "FOOTER", "SEVERITY_LEVELS", "DEMO", "SECURITY_UX"]) { out.push("", "## " + k); walk(C[k], 3); }
const found = [...new Set([...JSON.stringify(C).matchAll(/\[(PLACEHOLDER|CONFIRM WITH OWNER)[^\]]*\]/g)].map((x) => x[0].replace(/\\"/g, '"')))];
const ph = found.filter((x) => x.startsWith("[PLACEHOLDER")), cf = found.filter((x) => x.startsWith("[CONFIRM"));
const head = ["# M.R.S. site copy, review draft", "", "Generated from `lib/constants/content.ts` (the source of truth). Edit the TS file, not this document.", "",
  "A bracketed PLACEHOLDER = a fact only the owner can supply. A bracketed CONFIRM WITH OWNER = written as design copy and must be true before launch.", "",
  "## Needed from the owner", "", `**${ph.length} unique placeholders** and **${cf.length} statements to confirm.**`, "", "### Placeholders", ...ph.map((x) => "- " + x), "", "### Confirm before launch", ...cf.map((x) => "- " + x)];
fs.writeFileSync("content/COPY.md", head.concat(out).join("\n"));
console.log(`placeholders: ${ph.length}, confirms: ${cf.length}`);

// ---- legal pages as readable markdown (for lawyer review) ----
const L = load("lib/constants/legal.ts"), email = C.SITE.contactEmail;
const fill = (t) => t.replace(/\{\{email\}\}/g, email).replace(/\{\{privacy\}\}/g, "Privacy Policy").replace(/\{\{terms\}\}/g, "Terms of Use");
const md = [];
for (const d of [L.PRIVACY, L.TERMS]) {
  md.push(`# ${d.title}`, "", `Last updated: ${L.LEGAL_UPDATED}`, "", `**${d.summary.title}**`, ...d.summary.points.map((p) => "- " + p), "");
  d.sections.forEach((s, i) => { md.push(`## ${i + 1}. ${s.title}`, ""); (s.paragraphs || []).forEach((p) => md.push(fill(p), "")); (s.bullets || []).forEach((b) => md.push("- " + fill(b))); if (s.bullets) md.push(""); (s.after || []).forEach((p) => md.push(fill(p), "")); });
  md.push("---", "");
}
fs.writeFileSync("content/LEGAL.md", "<!-- Generated from lib/constants/legal.ts. Edit the TS file. Template, not legal advice: have a lawyer review. -->\n\n" + md.join("\n"));
console.log("legal pages written to content/LEGAL.md");
