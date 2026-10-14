const { chromium } = require("playwright");
const URL = "file:///home/claude/smoke/browser/site.html";
const ROUTES = ["/", "/services", "/services/security", "/services/automation", "/services/web-development", "/services/vulnerability-checker", "/services/software-development", "/work", "/process", "/about", "/contact", "/privacy", "/terms", "/nope"];
let pass = 0, fail = 0; const ok = (n, c, x = "") => { c ? pass++ : fail++; console.log((c ? "ok   " : "FAIL ") + n + (c ? "" : "  " + x)); };
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])';

async function tabAudit(p) {
  await p.evaluate((sel) => { document.activeElement && document.activeElement.blur(); scrollTo({ top: 0, behavior: "instant" }); let i = 0; document.querySelectorAll(sel).forEach((e) => { const cs = getComputedStyle(e), r = e.getBoundingClientRect(); const vis = cs.visibility !== "hidden" && cs.display !== "none" && !e.closest("[hidden], [inert]") && (r.width > 0 || r.height > 0); if (vis) e.dataset.qa = String(i++); }); window.__expected = i; }, FOCUSABLE);
  const visited = new Set(); const bad = { noIndicator: [], obscured: [], unexpected: [] }; let first = null, wrapped = false, stops = 0, skip = null;
  for (let i = 0; i < 700; i++) {
    await p.keyboard.press("Tab"); stops++;
    const s = await p.evaluate(() => { const a = document.activeElement; if (!a || a === document.body || a === document.documentElement) return { body: true }; const cs = getComputedStyle(a), r = a.getBoundingClientRect(); const hdr = document.querySelector("header.fixed"); const hr = hdr.getBoundingClientRect(); const hdrVisible = !hdr.className.includes("-translate-y-full") && hr.bottom > 0; const cx = r.left + r.width / 2, cy = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1); const top = document.elementFromPoint(cx, cy);
      return { qa: a.dataset.qa, label: (a.getAttribute("aria-label") || a.textContent || a.getAttribute("href") || "").trim().replace(/\s+/g, " ").slice(0, 30), tag: a.tagName, ind: (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== "none"), obscured: !!(hdrVisible && top && hdr.contains(top) && !hdr.contains(a)), href: a.getAttribute("href"), top: r.top }; });
    if (s.body) { wrapped = true; break; }
    if (first === null) { first = s.qa; skip = s; } else if (s.qa === first && stops > 2) { wrapped = true; break; }
    if (s.qa === undefined) bad.unexpected.push(s.label); else visited.add(s.qa);
    if (!s.ind) bad.noIndicator.push(`${s.tag}:${s.label}`); if (s.obscured) bad.obscured.push(s.label);
  }
  const expected = await p.evaluate(() => window.__expected);
  return { stops, wrapped, visited: visited.size, expected, bad, skip };
}

(async () => {
  const b = await chromium.launch(); const errs = [];

  /* ---------- keyboard: every route, desktop + mobile ---------- */
  for (const [w, h, label] of [[1280, 900, "desktop"], [390, 844, "mobile"]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } }); const p = await ctx.newPage(); p.on("pageerror", (e) => errs.push(e.message));
    for (const r of ROUTES) {
      await p.goto(URL + "#" + r); await p.reload(); await p.waitForSelector("h1"); await p.waitForTimeout(400);
      const a = await tabAudit(p); const t = `[${label} ${r}]`;
      ok(`${t} first Tab lands on a visible 'Skip to content' link`, a.skip && a.skip.href === "#main" && /Skip to content/.test(a.skip.label) && a.skip.top >= 0 && a.skip.top < 100, JSON.stringify(a.skip));
      ok(`${t} no keyboard trap (focus order ends/wraps after ${a.stops} stops)`, a.wrapped, `stops=${a.stops}`);
      ok(`${t} every visible control is reachable by Tab (${a.visited}/${a.expected})`, a.visited === a.expected, `visited ${a.visited} of ${a.expected}`);
      ok(`${t} no focus lands on an unexpected/hidden element`, a.bad.unexpected.length === 0, a.bad.unexpected.join(" | "));
      ok(`${t} every focused control shows a visible focus indicator`, a.bad.noIndicator.length === 0, a.bad.noIndicator.slice(0, 4).join(" | "));
      ok(`${t} focused control is never hidden behind the sticky header`, a.bad.obscured.length === 0, a.bad.obscured.slice(0, 4).join(" | "));
    }
    await ctx.close();
  }

  /* ---------- widgets by keyboard ---------- */
  let ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); let p = await ctx.newPage();
  await p.goto(URL + "#/services/security"); await p.reload(); await p.waitForSelector("h1");
  const acc = p.locator("main h3 button[aria-expanded]").first(); await acc.focus(); const e0 = await acc.getAttribute("aria-expanded");
  await p.keyboard.press("Enter"); const e1 = await acc.getAttribute("aria-expanded"); await p.keyboard.press("Space"); const e2 = await acc.getAttribute("aria-expanded");
  ok("accordion: Enter and Space both toggle", e0 !== e1 && e1 !== e2 && e0 === e2, `${e0}/${e1}/${e2}`);
  await p.goto(URL + "#/"); await p.reload(); await p.waitForSelector("h1");
  await p.locator('button[aria-controls="services-panel"]').focus(); await p.keyboard.press("Enter");
  ok("services menu opens from the keyboard and its links are focusable", (await p.locator("#services-panel").isVisible()) && (await p.locator("#services-panel a").count()) === 6);
  await p.keyboard.press("Tab"); ok("Tab from the toggle moves into the panel", await p.evaluate(() => !!document.activeElement.closest("#services-panel")));
  await p.keyboard.press("Escape"); ok("Escape closes it and returns focus to the toggle", !(await p.locator("#services-panel").isVisible()) && (await p.evaluate(() => document.activeElement.getAttribute("aria-controls"))) === "services-panel");
  /* skip link really moves focus to <main> */
  await p.goto(URL + "#/about"); await p.reload(); await p.waitForSelector("h1"); await p.keyboard.press("Tab"); await p.keyboard.press("Enter"); await p.waitForTimeout(150);
  ok("skip link moves focus to <main>", await p.evaluate(() => document.activeElement && document.activeElement.id === "main"));
  /* in-page anchor lands below the sticky header */
  await p.goto(URL + "#/"); await p.reload(); await p.waitForSelector("h1"); await p.getByRole("link", { name: "See what we do" }).click(); await p.waitForTimeout(1600);
  const top = await p.evaluate(() => document.getElementById("capabilities").getBoundingClientRect().top);
  ok("anchor target lands below the 64px sticky header (not hidden under it)", top >= 60 && top < 130, `top=${Math.round(top)}`);
  await ctx.close();

  /* ---------- touch targets, clipping, oversized visuals ---------- */
  for (const w of [320, 390]) {
    ctx = await b.newContext({ viewport: { width: w, height: 844 }, hasTouch: true, isMobile: true }); p = await ctx.newPage();
    const small = new Map(), clipped = [], wide = [];
    for (const r of ROUTES) { await p.goto(URL + "#" + r); await p.reload(); await p.waitForSelector("h1"); await p.waitForTimeout(350);
      if (r === "/services/vulnerability-checker") { await p.getByRole("button", { name: /Run demo scan/ }).tap(); await p.waitForSelector("text=Demo report", { timeout: 8000 }); }
      const res = await p.evaluate((sel) => { const small = [], clipped = [], wide = [];
        document.querySelectorAll(sel).forEach((e) => { const cs = getComputedStyle(e), r = e.getBoundingClientRect(); if (cs.visibility === "hidden" || cs.display === "none" || e.closest("[hidden]") || r.width === 0 || e.closest(".sr-only") || e.matches(".sr-only")) return;
          const inline = e.tagName === "A" && e.parentElement && /^(P|SPAN)$/.test(e.parentElement.tagName) && e.parentElement.textContent.trim().length > e.textContent.trim().length + 3; if (inline) return;
          const m = Math.min(r.width, r.height); if (m < 44) small.push([Math.round(m), (e.getAttribute("aria-label") || e.textContent || e.getAttribute("href") || e.tagName).trim().replace(/\s+/g, " ").slice(0, 26), Math.round(r.width) + "x" + Math.round(r.height)]); });
        document.querySelectorAll("body *").forEach((e) => { const cs = getComputedStyle(e); if (cs.textOverflow === "ellipsis" && e.scrollWidth > e.clientWidth + 1 && e.textContent.trim()) clipped.push(e.textContent.trim().slice(0, 30)); });
        document.querySelectorAll('ol[aria-label="Demo progress"] li > span:last-child').forEach((e) => { if (e.scrollWidth > e.clientWidth + 1) clipped.push('stage label overflows: ' + e.textContent.trim().slice(0, 20)); });
        document.querySelectorAll("svg, img, video, canvas").forEach((e) => { const r = e.getBoundingClientRect(); if (r.width > innerWidth + 1 && !e.closest("[aria-hidden='true']")) wide.push(e.tagName + Math.round(r.width)); });
        return { small, clipped, wide }; }, FOCUSABLE);
      res.small.forEach((s) => small.set(s[1], s)); clipped.push(...res.clipped.map((c) => r + ": " + c)); wide.push(...res.wide);
    }
    const under24 = [...small.values()].filter((s) => s[0] < 24), under44 = [...small.values()].filter((s) => s[0] >= 24);
    ok(`[${w}px] no touch target smaller than 24px (WCAG 2.5.8 minimum)`, under24.length === 0, under24.map((s) => `${s[1]} ${s[2]}`).join(" | "));
    console.log(`info [${w}px] controls between 24 and 44px (below the recommended size, but above the AA minimum): ${under44.length}${under44.length ? " -> " + under44.slice(0, 8).map((s) => `${s[1]} ${s[2]}`).join(" | ") : ""}`);
    ok(`[${w}px] no truncated (ellipsised) text`, clipped.length === 0, clipped.join(" | "));
    ok(`[${w}px] no graphic wider than the viewport`, wide.length === 0, wide.join(","));
    await ctx.close();
  }

  /* ---------- layout shift (CLS) per route ---------- */
  const cls = [];
  for (const [w, h, mob] of [[1280, 900, false], [390, 844, true]]) {
    for (const r of ROUTES.filter((x) => x !== "/nope")) {
      const c = await b.newContext({ viewport: { width: w, height: h }, ...(mob ? { hasTouch: true, isMobile: true } : {}) }); const pg = await c.newPage();
      await pg.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true }); });
      await pg.goto(URL + "#" + r); await pg.waitForSelector("h1"); await pg.waitForTimeout(2200); cls.push([w + " " + r, +(await pg.evaluate(() => window.__cls)).toFixed(4)]); await c.close();
    }
  }
  const worst = cls.reduce((a, b2) => (b2[1] > a[1] ? b2 : a));
  ok(`layout shift: every route/width under 0.1 ("good"); worst = ${worst[1]} at ${worst[0]}`, cls.every((c) => c[1] < 0.1), cls.filter((c) => c[1] >= 0.1).map((c) => c.join("=")).join(" | "));

  /* ---------- pointer-effect cost ---------- */
  ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); p = await ctx.newPage(); await p.goto(URL); await p.waitForSelector("h1"); await p.waitForTimeout(1800);
  const ms = await p.evaluate(async () => { const el = document.querySelector("li[data-i]").closest("div.relative"); const r = el.getBoundingClientRect(); const t0 = performance.now(); for (let i = 0; i < 600; i++) el.dispatchEvent(new PointerEvent("pointermove", { clientX: r.left + (i % 100) * r.width / 100, clientY: r.top + ((i * 7) % 100) * r.height / 100, bubbles: true })); const t1 = performance.now(); await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))); return { dispatch: t1 - t0, total: performance.now() - t0 }; });
  ok(`pointer effect: 600 events cost ${ms.total.toFixed(1)}ms total (rAF-throttled, < 50ms)`, ms.total < 50, JSON.stringify(ms));
  await ctx.close();

  console.log("page errors:", errs.length ? errs : "none"); console.log(`\n${pass} passed, ${fail} failed`); await b.close(); process.exit(fail ? 1 : 0);
})();
