const { chromium } = require("playwright");
let pass = 0, fail = 0; const ok = (n, c, x = "") => { c ? pass++ : fail++; console.log((c ? "ok   " : "FAIL ") + n + (c ? "" : "  " + x)); };
(async () => {
  const b = await chromium.launch(); const errs = [];
  const p = await b.newPage({ viewport: { width: 1280, height: 860 } }); p.on("pageerror", (e) => errs.push(e.message));
  await p.addInitScript(() => { window.__path = "/services/security"; }); // be "on" a Services page so Services is the active item
  await p.goto("file:///home/claude/smoke/browser/p7.html"); await p.waitForSelector("header"); await p.waitForTimeout(1500);
  const geo = () => p.evaluate(() => { const ul = document.querySelector("header nav ul"), bar = ul.querySelector(":scope > span"); const r = (e) => e.getBoundingClientRect(); return { bar: [r(bar).left, r(bar).width], ul: r(ul).left, links: [...ul.querySelectorAll("a[data-href]")].map((a) => [a.dataset.href, r(a).left, r(a).width]) }; });
  // indicator aligns with the active link (page is /services/security per the stub => Services)
  let g = await geo(); const svc = g.links.find((l) => l[0] === "/services");
  ok("indicator sits under the ACTIVE link (Services), not under Home", Math.abs(g.bar[0] - svc[1]) <= 1 && Math.abs(g.bar[1] - svc[2]) <= 1, `bar=${g.bar} link=${svc.slice(1)}`);
  // ...and under every other link when hovered
  for (const [href] of g.links) {
    await p.locator(`a[data-href="${href}"]`).hover(); await p.waitForTimeout(600);
    g = await geo(); const l = g.links.find((x) => x[0] === href);
    ok(`indicator aligns when hovering ${href}`, Math.abs(g.bar[0] - l[1]) <= 1.5 && Math.abs(g.bar[1] - l[2]) <= 1.5, `bar=${g.bar.map(Math.round)} link=${l.slice(1).map(Math.round)}`);
    await p.mouse.move(640, 500); await p.waitForTimeout(200); await p.keyboard.press("Escape");
  }
  // services panel: opens beneath the nav item, fully on-screen, not overlapping the link
  await p.mouse.move(640, 500); await p.waitForTimeout(300);
  await p.locator('button[aria-controls="services-panel"]').click(); await p.waitForTimeout(300);
  const pr = await p.evaluate(() => { const e = document.getElementById("services-panel").getBoundingClientRect(), l = document.querySelector('a[data-href="/services"]').getBoundingClientRect(); return { top: e.top, bottom: e.bottom, left: e.left, right: e.right, linkBottom: l.bottom, vw: innerWidth }; });
  ok("services panel is below the link and inside the viewport", pr.top >= pr.linkBottom - 1 && pr.left >= 0 && pr.right <= pr.vw, JSON.stringify(pr));
  await p.keyboard.press("Escape");
  // hero headline: three deliberate lines
  const lines = await p.evaluate(() => [...document.querySelectorAll("h1 > span")].map((s) => s.textContent));
  ok("headline renders as three sentence-lines", lines.length === 3 && lines[0].trim() === "Build it." && lines[2] === "Automate the rest.", JSON.stringify(lines));
  ok("headline text reads as one sentence stream", (await p.locator("h1").innerText()).replace(/\s+/g, " ") === "Build it. Secure it. Automate the rest.");
  // service card reveal
  await p.locator("#capabilities").scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
  const card = p.locator("#capabilities a[href='#/services/automation']");
  const hBefore = await card.evaluate((e) => e.querySelector("ul").getBoundingClientRect().height);
  await card.hover(); await p.waitForTimeout(800);
  const hAfter = await card.evaluate((e) => e.querySelector("ul").getBoundingClientRect().height);
  ok("service card reveals its capability list on hover", hBefore < 2 && hAfter > 60, `${hBefore} -> ${hAfter}`);
  // timeline connector exists and the page never scrolls sideways
  ok("timeline has 6 steps and 5 connectors", (await p.locator("ol li .tl-line").count()) === 5 && (await p.locator("ol li:has(.tl-line), ol li:has(h3)").count()) >= 6);
  ok("no horizontal overflow at 1280", (await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)) === 0);
  // mobile
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }); m.on("pageerror", (e) => errs.push(e.message));
  await m.goto("file:///home/claude/smoke/browser/p7.html"); await m.waitForSelector("header"); await m.waitForTimeout(1200);
  await m.locator('button[aria-controls="mobile-menu"]').tap(); await m.waitForTimeout(900);
  const mr = await m.evaluate(() => { const e = document.getElementById("mobile-menu").getBoundingClientRect(), cta = [...document.querySelectorAll("#mobile-menu a")].find((a) => a.textContent.includes("Start a project")).getBoundingClientRect(); return { top: e.top, h: e.height, vh: innerHeight, ctaBottom: cta.bottom, ctaH: cta.height }; });
  ok("mobile menu fills the screen", mr.top === 0 && Math.abs(mr.h - mr.vh) <= 1, JSON.stringify(mr));
  ok("mobile CTA is visible without scrolling, 48px+ tall", mr.ctaBottom <= mr.vh && mr.ctaH >= 48, JSON.stringify(mr));
  const tgt = await m.evaluate(() => [...document.querySelectorAll("#mobile-menu a, #mobile-menu button")].map((e) => e.getBoundingClientRect().height).filter((h) => h < 44).length);
  ok("every mobile menu link is at least 44px tall", tgt === 0, `${tgt} too small`);
  ok("mobile menu links to the /services overview", (await m.locator("#mobile-menu a[href='#/services']").count()) === 1);
  await m.keyboard.press("Escape"); await m.waitForTimeout(500);
  ok("no horizontal overflow at 390 (full page)", (await m.evaluate(() => document.documentElement.scrollWidth - innerWidth)) === 0);
  console.log("page errors:", errs.length ? errs : "none"); console.log(`\n${pass} passed, ${fail} failed`); await b.close(); process.exit(fail ? 1 : 0);
})();
