// Contrast measured against the REAL pixels behind each text element (handles images like the vortex, not just solid colours).
// Method: record every text element's box + colour, hide all text, screenshot, then take the 98th-percentile luminance in each box.
const { chromium } = require("playwright"); const sharp = require("sharp");
const URL = "file:///home/claude/smoke/browser/site.html";
const ROUTES = ["/", "/services", "/services/security", "/services/automation", "/services/web-development", "/services/vulnerability-checker", "/services/software-development", "/work", "/process", "/about", "/contact", "/privacy", "/terms", "/does-not-exist"];
const collect = () => {
  const parse = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]]; };
  const root = getComputedStyle(document.documentElement);
  const stops = [0, 1, 2, 3, 4].map((i) => root.getPropertyValue("--brand-" + i).trim());
  const out = []; const seen = new Set(); const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) { const t = w.currentNode; if (!t.textContent.trim()) continue; const el = t.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
    const cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden") continue;
    const rg = document.createRange(); rg.selectNodeContents(t); const r = rg.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
    let clipped = false; for (let n = el.parentElement; n && n !== document.documentElement; n = n.parentElement) { const c = getComputedStyle(n); if (c.overflowX !== "visible" || c.overflowY !== "visible") { const a = n.getBoundingClientRect(); const ox = Math.min(r.right, a.right) - Math.max(r.left, a.left), oy = Math.min(r.bottom, a.bottom) - Math.max(r.top, a.top); if (ox < 2 || oy < 2) { clipped = true; break; } } }
    if (clipped) continue;
    if (el.closest("[hidden], [aria-hidden='true'], script, style, button:disabled, .sr-only, #mobile-menu")) continue;
    let op = 1; for (let n = el; n && n !== document.documentElement; n = n.parentElement) op *= parseFloat(getComputedStyle(n).opacity);
    const grad = cs.webkitTextFillColor === "rgba(0, 0, 0, 0)" && /text/.test(cs.webkitBackgroundClip || cs.backgroundClip);
    const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700;
    out.push({ x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height, c: parse(cs.color), op, grad, large: size >= 24 || (size >= 18.66 && bold), size: Math.round(size), text: t.textContent.trim().slice(0, 34), tag: el.tagName.toLowerCase() }); }
  return { items: out, stops };
};
const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
(async () => {
  const b = await chromium.launch(); let total = 0; const fails = new Map(); let worstImg = { cr: 99 };
  for (const [w, h, mobile] of [[1280, 900, false], [390, 844, true]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, ...(mobile ? { hasTouch: true, isMobile: true } : {}) }); const p = await ctx.newPage();
    for (const r of ROUTES) {
      await p.goto(URL + "#" + r); await p.reload(); await p.waitForSelector("h1"); await p.waitForTimeout(700);
      await p.addStyleTag({ content: "header.fixed{position:absolute!important}" });
      if (process.env.NEG) await p.addStyleTag({ content: "img[alt=\"\"]{filter:brightness(5) contrast(1.4)!important}" }); // NEGATIVE TEST: make the vortex far too bright
      const docH = await p.evaluate(() => document.documentElement.scrollHeight); await p.setViewportSize({ width: w, height: Math.min(docH, 16000) }); await p.waitForTimeout(500);
      const { items, stops } = await p.evaluate(collect);
      await p.addStyleTag({ content: "*,*::before,*::after{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important} .text-brand{background-image:none!important} *{text-decoration:none!important}" });
      const file = `/tmp/bg-${w}-${r.replace(/\W/g, "_")}.png`; await p.screenshot({ path: file, fullPage: false });
      const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true }); const ch = info.channels;
      for (const it of items) {
        const ix = Math.min(2, it.w * 0.1), iy = Math.min(2, it.h * 0.1); const x0 = Math.max(0, Math.floor(it.x + ix)), y0 = Math.max(0, Math.floor(it.y + iy)), x1 = Math.min(info.width, Math.ceil(it.x + it.w - ix)), y1 = Math.min(info.height, Math.ceil(it.y + it.h - iy)); if (x1 <= x0 || y1 <= y0) continue;
        const ls = []; const step = Math.max(1, Math.floor(Math.sqrt(((x1 - x0) * (y1 - y0)) / 600)));
        for (let y = y0; y < y1; y += step) for (let x = x0; x < x1; x += step) { const o = (y * info.width + x) * ch; ls.push(L(data[o], data[o + 1], data[o + 2])); }
        ls.sort((a, b2) => a - b2); const bg = ls[Math.min(ls.length - 1, Math.floor(ls.length * 0.98))]; total++;
        const fgs = it.grad ? stops.map((s) => L(...hex(s))) : [L(...it.c.slice(0, 3)) * 1]; // text colour luminance (alpha/opacity blended below)
        const need = it.large ? 3 : 4.5; let worst = 99;
        for (const f of fgs) { const a = it.grad ? 1 : it.c[3] * it.op; const fl = it.grad ? f : (a * f + (1 - a) * bg); const cr = (Math.max(fl, bg) + 0.05) / (Math.min(fl, bg) + 0.05); worst = Math.min(worst, cr); }
        if (it.grad && !it.large) worst = Math.min(worst, 1.0);  // gradient text must be large
        if (worst < need) { const k = it.text + "|" + it.size; if (!fails.has(k)) fails.set(k, { ...it, cr: +worst.toFixed(2), need, where: [] }); fails.get(k).where.push(`${w}px ${r}`); }
        if (r === "/" && w === 1280) worstImg = worst < worstImg.cr ? { cr: +worst.toFixed(2), text: it.text } : worstImg;
      }
    }
    await ctx.close();
  }
  console.log(`image-aware contrast: ${total} text elements measured against real pixels (14 routes x 2 widths)`);
  console.log(`lowest ratio on the homepage at 1280px: ${worstImg.cr}:1 ("${worstImg.text}")`);
  if (!fails.size) console.log("ALL PASS"); for (const f of [...fails.values()].sort((a, b2) => a.cr - b2.cr)) console.log(`FAIL ${f.cr}:1 (need ${f.need}) "${f.text}" ${f.size}px <${f.tag}> x${f.where.length}: ${f.where.slice(0, 3).join(", ")}`);
  await b.close();
})();
