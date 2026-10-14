const { chromium } = require("playwright");
const URL = "file:///home/claude/smoke/browser/site.html";
const ROUTES = ["/", "/services", "/services/security", "/services/automation", "/services/web-development", "/services/vulnerability-checker", "/services/software-development", "/work", "/process", "/about", "/contact", "/privacy", "/terms", "/nope"];
// Runs inside the page: computes contrast for every visible text element
const audit = () => {
  const parse = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] }; };
  const over = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const root = parse(getComputedStyle(document.documentElement).backgroundColor) || { r: 7, g: 9, b: 12, a: 1 };
  const out = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const t = walker.currentNode; if (!t.textContent.trim()) continue; const el = t.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
    const cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden") continue;
    if (cs.webkitTextFillColor === "rgba(0, 0, 0, 0)") continue; // gradient text: measured by qa-bgcontrast.cjs against real pixels (and required to be large)
    const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
    if (el.closest("[hidden], [aria-hidden='true'], script, style, button:disabled, .sr-only")) continue;
    let op = 1, node = el, bgs = [];
    for (; node && node !== document.documentElement; node = node.parentElement) { const c = getComputedStyle(node); op *= parseFloat(c.opacity); const bg = parse(c.backgroundColor); if (bg && bg.a > 0) bgs.push(bg); if (bg && bg.a === 1) break; }
    let base = root; for (let i = bgs.length - 1; i >= 0; i--) base = over(bgs[i], base);
    const fg0 = parse(cs.color); const fg = over({ ...fg0, a: fg0.a * op }, base);
    const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700, large = size >= 24 || (size >= 18.66 && bold);
    const cr = ratio(fg, base), need = large ? 3 : 4.5;
    if (cr < need) out.push({ text: t.textContent.trim().slice(0, 36), cr: +cr.toFixed(2), need, size: Math.round(size), tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 60), fg: `rgb(${fg.r | 0},${fg.g | 0},${fg.b | 0})`, bg: `rgb(${base.r | 0},${base.g | 0},${base.b | 0})` });
  }
  return { count: seen.size, fails: out };
};
(async () => {
  const b = await chromium.launch(); const agg = new Map(); let checked = 0, states = 0;
  const record = (where, res) => { checked += res.count; states++; for (const f of res.fails) { const k = f.text + "|" + f.fg + "|" + f.bg; if (!agg.has(k)) agg.set(k, { ...f, where: [] }); agg.get(k).where.push(where); } };
  for (const [w, h, mobile] of [[1280, 900, false], [390, 844, true]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, ...(mobile ? { hasTouch: true, isMobile: true } : {}) }); const p = await ctx.newPage();
    for (const r of ROUTES) { await p.goto(URL + "#" + r); await p.reload(); await p.waitForSelector("h1"); await p.waitForTimeout(500); record(`${w}px ${r}`, await p.evaluate(audit)); }
    // interactive states
    await p.goto(URL + "#/services/vulnerability-checker"); await p.reload(); await p.waitForSelector("h1"); await p.getByRole("button", { name: /Run demo scan/ }).click(); await p.waitForSelector("text=Demo report", { timeout: 8000 }); record(`${w}px scanner results`, await p.evaluate(audit));
    await p.goto(URL + "#/services/automation"); await p.reload(); await p.waitForSelector("h1"); await p.getByRole("button", { name: "Run example" }).click(); await p.waitForTimeout(3800); record(`${w}px automation complete`, await p.evaluate(audit));
    await p.goto(URL + "#/contact"); await p.reload(); await p.waitForSelector("h1"); await p.getByRole("button", { name: "Send project details" }).click(); await p.waitForTimeout(200); record(`${w}px form errors`, await p.evaluate(audit));
    await p.fill('input[name="name"]', "T"); await p.fill('input[name="email"]', "a@b.co"); await p.fill('textarea[name="message"]', "A project description."); await p.getByRole("button", { name: "Send project details" }).click(); await p.waitForTimeout(200); record(`${w}px form success`, await p.evaluate(audit));
    if (!mobile) { await p.goto(URL + "#/"); await p.reload(); await p.waitForSelector("h1"); await p.locator('button[aria-controls="services-panel"]').click(); await p.waitForTimeout(300); record(`${w}px services panel open`, await p.evaluate(audit)); }
    else { await p.goto(URL + "#/"); await p.reload(); await p.waitForSelector("h1"); await p.locator('button[aria-controls="mobile-menu"]').tap(); await p.waitForTimeout(900); record(`${w}px mobile menu open`, await p.evaluate(audit)); }
    await ctx.close();
  }
  console.log(`contrast audit: ${checked} text elements across ${states} page states (1280px + 390px)`);
  const list = [...agg.values()].sort((a, b) => a.cr - b.cr);
  if (!list.length) console.log("ALL PASS: no text below WCAG AA (4.5:1, or 3:1 for large text)");
  for (const f of list) console.log(`FAIL ${f.cr}:1 (need ${f.need}) "${f.text}" ${f.size}px <${f.tag}> fg=${f.fg} on ${f.bg}  [${f.cls}]  x${f.where.length}: ${f.where.slice(0, 3).join(", ")}`);
  await b.close();
})();
