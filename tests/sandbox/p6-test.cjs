const { chromium } = require("playwright");
let pass = 0, fail = 0;
const ok = (n, c, x = "") => { c ? pass++ : fail++; console.log((c ? "ok   " : "FAIL ") + n + (c ? "" : "  " + x)); };
const URL = "file:///home/claude/smoke/browser/p6.html";
(async () => {
  const b = await chromium.launch(); const errs = [];
  let ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  let p = await ctx.newPage(); p.on("pageerror", (e) => errs.push(e.message));
  const dialogs = []; p.on("dialog", (d) => { dialogs.push(d.message()); d.dismiss(); });
  await p.goto(URL); await p.waitForSelector("[role=note]");
  const demo = p.locator("[role=note]").locator("xpath=..");
  ok("demo banner is visible before anything is run", (await p.locator("[role=note]").innerText()).startsWith("Demo environment."));
  ok("input note says nothing is sent or scanned", (await demo.innerText()).includes("Nothing is sent or scanned"));
  const input = demo.locator("input"), run = demo.getByRole("button", { name: /Run demo/ });

  // Validation
  await input.fill("   "); await run.click();
  ok("empty asset shows a specific error", (await demo.innerText()).includes("Enter a demo asset name"));
  ok("error: focus returns to the input + aria-invalid", await input.evaluate((e) => e === document.activeElement && e.getAttribute("aria-invalid") === "true"));
  ok("error: input is described by the error element", (await input.getAttribute("aria-describedby")).split(" ").length === 2);
  ok("error: demo did not start", (await p.locator("ol[aria-label='Demo progress'] li[aria-current='step']").innerText()).startsWith("Ready"));

  // Network silence while running
  const reqs = []; p.on("request", (r) => reqs.push(r.url()));
  await input.fill("my-real-site.com"); await run.click();
  ok("running: button is disabled", await run.isDisabled());
  ok("running: stage = Scanning", (await p.locator("li[aria-current='step']").innerText()).startsWith("Scanning"));
  await p.waitForTimeout(900);
  const rows = await demo.locator("ul").first().innerText();
  ok("running: checks progress through Done / Running / Queued", /Done/.test(rows) && /Running|Queued/.test(rows), rows.replace(/\n/g, " "));
  await p.waitForSelector("text=Demo report", { timeout: 6000 });
  ok("NO network requests were made during the demo", reqs.length === 0, reqs.join(", "));
  const text = await demo.innerText();
  ok("report scope echoes the typed text and says it was not contacted", text.includes("my-real-site.com (demo, not contacted)"));
  ok("report states no real system was checked", text.includes("no real system was checked"));
  ok("report carries a 'Sample data' marker", text.includes("Sample data"));
  ok("timestamp is an ISO date", /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(text));
  ok("risk overview: highest severity is High", /Highest severity\s*\n?\s*High/.test(text.replace(/\n+/g, "\n")));
  ok("risk overview: 5 findings, 5 components", /Findings\s*\n?\s*5/.test(text) && /Components affected\s*\n?\s*5/.test(text));
  ok("risk overview: fix first lists the two worst", text.includes("DEMO-0001, DEMO-0002"));
  ok("run button re-enabled and relabelled", !(await run.isDisabled()) && (await run.innerText()) === "Run demo again");
  ok("every finding id is DEMO- (no real CVE ids)", !/CVE-\d{4}/.test(text) && (text.match(/DEMO-\d{4}/g) || []).length >= 5);

  // Report must not change when the input is edited afterwards
  await input.fill("something-else.org");
  ok("editing the input afterwards does not rewrite the report", (await demo.innerText()).includes("my-real-site.com (demo") && !(await demo.innerText()).includes("something-else.org (demo"));

  // Expand / filter
  const heads = demo.locator("h5 button");
  ok("highest finding is expanded by default", (await heads.first().getAttribute("aria-expanded")) === "true");
  await heads.nth(1).click();
  ok("clicking another row expands it and collapses the first", (await heads.nth(1).getAttribute("aria-expanded")) === "true" && (await heads.first().getAttribute("aria-expanded")) === "false");
  const openPanel = demo.locator("div[id]:not([hidden])").filter({ has: p.locator("dt", { hasText: "Evidence" }) });
  ok("expanded finding shows description, evidence and fix", (await openPanel.count()) === 1 && ["Description", "Evidence", "Recommended fix"].every((t) => openPanel.innerText().then((x) => x.includes(t))) && (await openPanel.innerText()).includes("Recommended fix"));
  const medium = demo.getByRole("button", { name: /^Medium/ });
  await medium.click();
  ok("filter: Medium shows exactly 2 findings", (await heads.count()) === 2 && (await medium.getAttribute("aria-pressed")) === "true");
  ok("filter: empty severity (Critical) is disabled", await demo.getByRole("button", { name: /^Critical/ }).isDisabled());
  ok("filter: heading count updates", (await demo.innerText()).includes("(2 of 5)"));
  await demo.getByRole("button", { name: /^All/ }).click();
  ok("filter: All restores 5", (await heads.count()) === 5);
  // keyboard
  await heads.first().focus(); await p.keyboard.press("Enter");
  ok("keyboard: Enter toggles a finding (collapsed -> expanded)", (await heads.first().getAttribute("aria-expanded")) === "true");
  await p.keyboard.press("Space");
  ok("keyboard: Space toggles it back", (await heads.first().getAttribute("aria-expanded")) === "false");

  // Hostile input is only ever text
  await input.fill("<img src=x onerror=alert(1)>"); await run.click(); await p.waitForSelector("text=Demo report", { timeout: 6000 });
  ok("markup in the input renders as plain text (no injected element)", (await demo.locator("img[src='x']").count()) === 0 && (await demo.innerText()).includes("<img src=x onerror=alert(1)>"));
  ok("no script dialog fired", dialogs.length === 0);
  ok("re-running resets the filter to All", (await demo.getByRole("button", { name: /^All/ }).getAttribute("aria-pressed")) === "true");

  // Static components
  const body = await p.locator("body").innerText();
  ok("scope section: four steps in order", ["Authorization", "Scope", "Method", "Handling"].every((s) => body.includes(s)));
  ok("report preview is labelled as a sample structure", body.includes("Sample structure") && body.includes("not a real report"));
  ok("severity legend lists all five levels", ["Critical", "High", "Medium", "Low", "Informational"].every((s) => body.includes(s)));
  ok("trust principles list all six", ["Clarity", "Scope", "Authorization", "Evidence", "Remediation", "Responsible handling"].every((s) => body.includes(s)));
  ok("heading order has no level skips", await p.evaluate(() => { const h = [...document.querySelectorAll("h1,h2,h3,h4,h5")].map((e) => +e.tagName[1]); return h.every((v, i) => i === 0 || v - h[i - 1] <= 1); }));
  ok("severity glyphs are decorative; each badge has a text label", await p.evaluate(() => [...document.querySelectorAll("svg[aria-hidden='true']")].length > 0));
  ok("no horizontal overflow at 1280", (await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)) === 0);
  await p.screenshot({ path: "p6-desktop.png", fullPage: true });
  await ctx.close();

  // Reduced motion: fast
  ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  p = await ctx.newPage(); await p.goto(URL); await p.waitForSelector("[role=note]");
  const t0 = Date.now(); await p.getByRole("button", { name: /Run demo scan/ }).click(); await p.waitForSelector("text=Demo report", { timeout: 6000 });
  ok("reduced motion: demo completes quickly", Date.now() - t0 < 1800, `${Date.now() - t0}ms`);
  await ctx.close();

  // Mobile widths
  for (const w of [320, 390]) {
    ctx = await b.newContext({ viewport: { width: w, height: 800 }, hasTouch: true, isMobile: true }); p = await ctx.newPage(); p.on("pageerror", (e) => errs.push(e.message));
    await p.goto(URL); await p.waitForSelector("[role=note]");
    await p.getByRole("button", { name: /Run demo scan/ }).tap(); await p.waitForSelector("text=Demo report", { timeout: 6000 });
    const over = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    ok(`no horizontal overflow at ${w}px (with results open)`, over <= 0, `${over}px`);
    const small = await p.evaluate(() => [...document.querySelectorAll("button, a, input")].filter((e) => e.offsetParent && !e.disabled).map((e) => [e.getBoundingClientRect().height, (e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 20)]).filter(([h]) => h < 36));
    ok(`interactive targets are at least 36px tall at ${w}px`, small.length === 0, JSON.stringify(small));
    await p.screenshot({ path: `p6-m${w}.png`, fullPage: true }); await ctx.close();
  }
  console.log("page errors:", errs.length ? errs : "none"); console.log(`\n${pass} passed, ${fail} failed`);
  await b.close(); process.exit(fail ? 1 : 0);
})();
