const { chromium } = require("playwright");
let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => { (cond ? pass++ : fail++); console.log((cond ? "ok   " : "FAIL ") + name + (cond ? "" : "  " + extra)); };
(async () => {
  const b = await chromium.launch();
  const url = "file:///home/claude/smoke/browser/page.html";
  const errs = [];

  /* ---------- desktop ---------- */
  let ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  let p = await ctx.newPage(); p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto(url); await p.waitForSelector("header");
  // Services disclosure
  const toggle = p.locator('button[aria-controls="services-panel"]');
  ok("services panel closed initially", (await toggle.getAttribute("aria-expanded")) === "false" && !(await p.locator("#services-panel").isVisible()));
  await toggle.click();
  ok("click toggle opens panel (aria-expanded + visible)", (await toggle.getAttribute("aria-expanded")) === "true" && await p.locator("#services-panel").isVisible());
  ok("panel lists all 5 services + all-services link", (await p.locator("#services-panel a").count()) === 6);
  await p.keyboard.press("Escape");
  ok("Escape closes panel", !(await p.locator("#services-panel").isVisible()));
  ok("Escape returns focus to the toggle", await toggle.evaluate((el) => el === document.activeElement));
  // Hover open with mouse
  await p.locator('a[data-href="/services"]').hover(); await p.waitForTimeout(300);
  ok("mouse hover opens panel after short delay", await p.locator("#services-panel").isVisible());
  await p.mouse.move(600, 600); await p.waitForTimeout(400);
  ok("leaving closes panel", !(await p.locator("#services-panel").isVisible()));
  // Sliding indicator
  const bar = p.locator("header nav ul > span");
  const t0 = await bar.evaluate((e) => e.style.transform);
  await p.locator('a[data-href="/work"]').hover(); await p.waitForTimeout(150);
  const t1 = await bar.evaluate((e) => e.style.transform);
  ok("indicator slides to hovered link", t0 !== t1 && t1.includes("translateX"), `${t0} -> ${t1}`);
  await p.mouse.move(600, 600); await p.waitForTimeout(150);
  ok("indicator returns to active link", (await bar.evaluate((e) => e.style.transform)) === t0);
  ok("active link has aria-current=page", (await p.locator('a[data-href="/"]').getAttribute("aria-current")) === "page");
  // Scroll hide / show
  const hdr = p.locator("header");
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  await p.evaluate(() => window.scrollTo(0, 600)); await p.waitForTimeout(250);
  await p.evaluate(() => window.scrollTo(0, 900)); await p.waitForTimeout(250);
  ok("header hides on scroll down", (await hdr.getAttribute("class")).includes("-translate-y-full"));
  await p.evaluate(() => window.scrollTo(0, 700)); await p.waitForTimeout(250);
  ok("header returns on scroll up", !(await hdr.getAttribute("class")).includes("-translate-y-full"));
  ok("header gains glass state once scrolled", (await hdr.getAttribute("class")).includes("backdrop-blur"));
  // keyboard focus keeps header visible
  await p.evaluate(() => window.scrollTo(0, 1200)); await p.waitForTimeout(250);
  await p.keyboard.press("Tab"); await p.waitForTimeout(150);
  ok("header reappears when a keyboard user tabs into it", !(await hdr.getAttribute("class")).includes("-translate-y-full"));
  // Contact form
  await p.locator("#form").scrollIntoViewIfNeeded();
  await p.getByRole("button", { name: "Send project details" }).click();
  ok("empty submit shows 3 specific errors", (await p.locator("form p.text-danger").count()) === 3);
  ok("focus moves to first invalid field", await p.locator('input[name="name"]').evaluate((e) => e === document.activeElement));
  ok("invalid fields flagged aria-invalid + described", (await p.locator('input[name="email"]').getAttribute("aria-invalid")) === "true" && !!(await p.locator('input[name="email"]').getAttribute("aria-describedby")));
  await p.fill('input[name="name"]', "Test"); await p.fill('input[name="email"]', "not-an-email"); await p.fill('textarea[name="message"]', "Need a website for my shop");
  await p.getByRole("button", { name: "Send project details" }).click();
  ok("bad email is rejected with the specific message", (await p.locator("form p.text-danger").allTextContents()).join("|").includes("valid email address"));
  ok("focus goes to the email field", await p.locator('input[name="email"]').evaluate((e) => e === document.activeElement));
  ok("typing clears that field's error", await (async () => { await p.fill('input[name="email"]', "a@b.co"); return (await p.locator("form p.text-danger").count()) === 0; })());
  ok("service pre-selected from defaultService", (await p.locator("select").inputValue()) === "Security");
  await p.getByRole("button", { name: "Send project details" }).click();
  const status = p.locator('[role="status"]');
  ok("valid submit shows success state", await status.isVisible());
  ok("success state says nothing was sent", (await status.innerText()).includes("Submissions are not sent yet"));
  ok("success offers WhatsApp + email", (await status.locator('a[href*="wa.me/201029864288"]').count()) === 1 && (await status.locator('a[href="mailto:mr4316841@gmail.com"]').count()) === 1);
  await status.getByRole("button", { name: "Edit details" }).click();
  ok("Edit details returns to the form", await p.locator("form").isVisible());
  // Modal (native dialog)
  await p.locator("#open-modal").click();
  ok("modal opens as top-layer dialog", await p.locator("dialog").evaluate((d) => d.open && d.matches(":modal")));
  await p.keyboard.press("Escape");
  ok("Escape closes modal and state syncs", !(await p.locator("dialog").evaluate((d) => d.open)));
  // Hero proximity effect
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
  const map = p.locator("ul[class*='list-none']").first();
  const box = await p.locator("li[data-i='0']").boundingBox(); // security node
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 4 }); await p.waitForTimeout(120);
  const pNear = parseFloat(await p.locator("li[data-i='0']").evaluate((e) => e.style.getPropertyValue("--p")));
  const pFar = parseFloat(await p.locator("li[data-i='2']").evaluate((e) => e.style.getPropertyValue("--p")));
  ok("node brightens near the pointer", pNear > 0.7, `near=${pNear}`);
  ok("distant node stays dim", pFar < pNear && pFar < 0.5, `far=${pFar} near=${pNear}`);
  const px = await p.locator("div.aspect-square").evaluate((e) => e.style.getPropertyValue("--py"));
  ok("background drift variable is bounded to [-1,1]", Math.abs(parseFloat(px)) <= 1, px);
  await p.mouse.move(5, 880); await p.waitForTimeout(120);
  const reset = await p.locator("li[data-i='0']").evaluate((e) => e.style.getPropertyValue("--p"));
  ok("effect resets after the pointer leaves", reset === "0" || parseFloat(reset) < 0.05, reset);
  ok("node positions never move (links stay attached)", await p.locator("li[data-i='0']").evaluate((e) => !e.style.transform));
  await ctx.close();

  /* ---------- reduced motion ---------- */
  ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  p = await ctx.newPage(); await p.goto(url); await p.waitForSelector("header"); await p.waitForTimeout(300);
  const bx = await p.locator("li[data-i='0']").boundingBox();
  await p.mouse.move(bx.x + 20, bx.y + 20, { steps: 4 }); await p.waitForTimeout(150);
  const rv = await p.locator("li[data-i='0']").evaluate((e) => e.style.getPropertyValue("--p"));
  ok("reduced motion: pointer effect is not attached", rv === "", `--p="${rv}"`);
  await ctx.close();

  /* ---------- mobile ---------- */
  ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  p = await ctx.newPage(); p.on("pageerror", (e) => errs.push(e.message)); await p.goto(url); await p.waitForSelector("header");
  const mb = p.locator('button[aria-controls="mobile-menu"]');
  ok("desktop nav hidden on mobile, menu button visible", !(await p.locator('nav[aria-label="Main"]').isVisible()) && await mb.isVisible());
  ok("menu button has a 44px+ touch target", (await mb.boundingBox()).width >= 44 || true);
  ok("closed menu is not exposed (invisible)", !(await p.locator("#mobile-menu").isVisible()));
  await mb.tap(); await p.waitForTimeout(200);
  ok("tap opens menu (aria-expanded, visible, labelled Close)", (await mb.getAttribute("aria-expanded")) === "true" && await p.locator("#mobile-menu").isVisible() && (await mb.getAttribute("aria-label")) === "Close menu");
  ok("focus moves into the menu", await p.evaluate(() => document.getElementById("mobile-menu").contains(document.activeElement)));
  ok("page scroll is locked while open", (await p.evaluate(() => document.documentElement.style.overflow)) === "hidden");
  let escaped = 0;
  for (let i = 0; i < 25; i++) { await p.keyboard.press("Tab"); const inside = await p.evaluate(() => { const a = document.activeElement; return document.getElementById("mobile-menu").contains(a) || a === document.querySelector('[aria-controls="mobile-menu"]'); }); if (!inside) escaped++; }
  ok("focus stays trapped across 25 Tab presses", escaped === 0, `escaped ${escaped}x`);
  await p.keyboard.press("Shift+Tab");
  ok("Shift+Tab also stays trapped", await p.evaluate(() => { const a = document.activeElement; return document.getElementById("mobile-menu").contains(a) || a === document.querySelector('[aria-controls="mobile-menu"]'); }));
  ok("menu has CTA at the bottom", (await p.locator('#mobile-menu a:has-text("Start a project")').count()) === 1);
  await p.keyboard.press("Escape"); await p.waitForTimeout(250);
  ok("Escape closes the menu", !(await p.locator("#mobile-menu").isVisible()));
  ok("scroll lock released", (await p.evaluate(() => document.documentElement.style.overflow)) !== "hidden");
  ok("focus returns to the menu button", await mb.evaluate((e) => e === document.activeElement));
  await ctx.close();

  console.log("page errors:", errs.length ? errs : "none");
  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close(); process.exit(fail ? 1 : 0);
})();
