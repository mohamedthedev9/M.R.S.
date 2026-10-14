const { chromium } = require("playwright");
let pass = 0, fail = 0; const ok = (n, c, x = "") => { c ? pass++ : fail++; console.log((c ? "ok   " : "FAIL ") + n + (c ? "" : "  " + x)); };
const URL = "file:///home/claude/smoke/browser/site.html";
const ROUTES = ["/", "/services", "/services/security", "/services/automation", "/services/web-development", "/services/vulnerability-checker", "/services/software-development", "/work", "/process", "/about", "/contact", "/privacy", "/terms", "/nope"];
const WIDTHS = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
(async () => {
  const b = await chromium.launch(); const errs = [];
  const open = async (w, h, hash = "", extra = {}) => { const ctx = await b.newContext({ viewport: { width: w, height: h }, ...extra }); const p = await ctx.newPage(); p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && !/ERR_FILE_NOT_FOUND|Failed to load resource/.test(m.text()) && errs.push(m.text())); await p.goto(URL + hash); await p.waitForSelector("header"); await p.waitForTimeout(250); return [ctx, p]; };
  const h1 = (p) => p.locator("h1").first().innerText().then((t) => t.replace(/\s+/g, " ").trim());

  /* ---------- navigation flows (desktop) ---------- */
  let [ctx, p] = await open(1280, 900);
  ok("home: h1 is the hero headline", (await h1(p)) === "Build it. Secure it. Automate the rest.");
  await p.getByRole("link", { name: "See what we do" }).click(); await p.waitForTimeout(1500);
  ok("hero 'See what we do' scrolls to #capabilities without changing page", (await h1(p)) === "Build it. Secure it. Automate the rest." && (await p.evaluate(() => document.getElementById("capabilities").getBoundingClientRect().top)) < 200);
  ok("header hid itself after the page scrolled down (hide-on-scroll)", (await p.locator("header.fixed").getAttribute("class")).includes("-translate-y-full"));
  await p.mouse.wheel(0, -120); await p.waitForTimeout(700);
  ok("header returns on the first upward scroll", !(await p.locator("header.fixed").getAttribute("class")).includes("-translate-y-full"));
  await p.locator('header nav a[data-href="/services"]').click(); await p.waitForTimeout(300);
  ok("nav: Services -> overview page", (await h1(p)) === "Five capabilities, one system." && (await p.locator("main li a[href='#/services/security']").count()) === 1);
  ok("nav: active page gets aria-current", (await p.locator('header nav a[data-href="/services"]').getAttribute("aria-current")) === "page");
  await p.locator("main a[href='#/services/security']").first().click(); await p.waitForTimeout(300);
  ok("overview row -> Security service page", (await h1(p)) === "Security you can explain to your team.");
  ok("breadcrumb is present and the current page is marked", (await p.locator('nav[aria-label="Breadcrumb"] [aria-current="page"]').innerText()) === "Security");
  ok("route change scrolls back to the top", (await p.evaluate(() => scrollY)) === 0);
  await p.getByRole("link", { name: "Ask about a review" }).first().click(); await p.waitForTimeout(400);
  ok("service CTA -> Contact with the service pre-selected", (await h1(p)) === "Start a project." && (await p.locator("select").inputValue()) === "Security", await p.locator("select").inputValue().catch(() => "?"));
  await p.fill('input[name="name"]', "T"); await p.fill('input[name="email"]', "a@b.co"); await p.fill('textarea[name="message"]', "I need a security review of my site.");
  await p.getByRole("button", { name: "Send project details" }).click();
  ok("contact: success state says nothing was sent + offers WhatsApp", (await p.locator('[role="status"]').innerText()).includes("not sent yet") && (await p.locator('[role="status"] a[href*="wa.me/201029864288"]').count()) === 1);
  await p.locator('footer a[href="#/process"]').click(); await p.waitForTimeout(300);
  ok("footer link -> Process page, six steps", (await h1(p)) === "How a project runs." && (await p.locator("main ol > li").count()) >= 6);
  await p.goto(URL + "#/services/automation"); await p.reload(); await p.waitForSelector("h1");
  ok("deep link loads the right service page", (await h1(p)).startsWith("Automate what you repeat"));
  await p.getByRole("button", { name: "Run example" }).click(); await p.waitForTimeout(3800);
  ok("automation demo runs to Complete on its page", (await p.locator("main").innerText()).includes("Complete"));
  await p.goto(URL + "#/services/vulnerability-checker"); await p.reload(); await p.waitForSelector("h1");
  ok("vulnerability page hosts the demo scanner with its demo banner", (await p.locator("[role=note]").first().innerText()).startsWith("Demo environment"));
  await p.goto(URL + "#/does-not-exist"); await p.reload(); await p.waitForSelector("h1");
  ok("unknown route -> 404 page with a way home", (await h1(p)) === "This page doesn't exist." && (await p.locator("main a[href='#/']").count()) === 1);
  await ctx.close();

  /* ---------- mobile flow ---------- */
  [ctx, p] = await open(390, 844, "", { hasTouch: true, isMobile: true });
  await p.locator('button[aria-controls="mobile-menu"]').tap(); await p.waitForTimeout(700);
  await p.locator('#mobile-menu a[href="#/work"]').tap(); await p.waitForTimeout(600);
  ok("mobile: menu link navigates and the menu closes itself", (await h1(p)) === "Selected work" && !(await p.locator("#mobile-menu").isVisible()));
  ok("mobile: page scroll unlocked after navigating", (await p.evaluate(() => document.documentElement.style.overflow)) !== "hidden");
  await p.locator('button[aria-controls="mobile-menu"]').tap(); await p.waitForTimeout(700);
  await p.locator('#mobile-menu a[href="#/services/software-development"]').tap(); await p.waitForTimeout(500);
  ok("mobile: service link from the menu works", (await h1(p)).startsWith("Software built around"));
  await ctx.close();

  /* ---------- responsive matrix: no horizontal overflow, anywhere ---------- */
  const bad = [];
  for (const w of WIDTHS) { const [c, pg] = await open(w, 900);
    for (const r of ROUTES) { await pg.evaluate((r) => { location.hash = "#" + r; }, r); await pg.waitForTimeout(120);
      const o = await pg.evaluate(() => { const de = document.documentElement; const wide = [...document.querySelectorAll("body *")].filter((e) => { const x = e.getBoundingClientRect(); return x.width > 0 && x.right > innerWidth + 1 && getComputedStyle(e).position !== "fixed" && !e.closest("[aria-hidden='true'], .overflow-x-auto, #mobile-menu, [hidden]") && getComputedStyle(e).visibility !== "hidden"; }).slice(0, 2).map((e) => e.tagName + "." + String(e.className).slice(0, 40)); return { over: de.scrollWidth - innerWidth, wide }; });
      if (o.over > 0) bad.push(`${w}px ${r}: +${o.over}px ${o.wide.join(" ")}`); }
    await c.close(); }
  ok(`no horizontal overflow: ${ROUTES.length} routes x ${WIDTHS.length} widths (${ROUTES.length * WIDTHS.length} checks)`, bad.length === 0, "\n    " + bad.join("\n    "));

  console.log("page errors:", errs.length ? errs : "none"); console.log(`\n${pass} passed, ${fail} failed`); await b.close(); process.exit(fail ? 1 : 0);
})();
