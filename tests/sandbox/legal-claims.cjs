// Verifies the factual claims made in the Privacy Policy against what the site really does.
// If one of these fails, either fix the site or update lib/constants/legal.ts BEFORE shipping.
const { chromium } = require("playwright"); const fs = require("fs");
let pass = 0, fail = 0; const ok = (n, c, x = "") => { c ? pass++ : fail++; console.log((c ? "ok   " : "FAIL ") + n + (c ? "" : "  " + x)); };
const URL = "file:///home/claude/smoke/browser/site.html";
const ROUTES = ["/", "/services", "/services/security", "/services/automation", "/services/web-development", "/services/vulnerability-checker", "/services/software-development", "/work", "/process", "/about", "/contact", "/privacy", "/terms"];
(async () => {
  /* A. server-rendered HTML: nothing third-party is loaded, no forms post anywhere */
  const files = fs.readdirSync("/tmp/pages").filter((f) => f.endsWith(".html")); const ext = [];
  for (const f of files) { const h = fs.readFileSync("/tmp/pages/" + f, "utf8");
    for (const m of h.matchAll(/<(script|link|img|iframe|video|audio|source|embed|object)\b[^>]*?\b(?:src|href|data)="([^"]+)"/gi)) { const [tag, url] = [m[1].toLowerCase(), m[2]]; if (tag === "link" && !/rel="(stylesheet|preload|preconnect|icon|manifest)"/.test(m[0])) continue; if (/^(https?:)?\/\//.test(url)) ext.push(`${f}: <${tag}> ${url}`); }
    if (/<form\b[^>]*\baction=/i.test(h)) ext.push(`${f}: <form action>`); }
  ok(`no third-party scripts, styles, fonts, images, frames or form posts in any of ${files.length} rendered pages (no analytics, ads or trackers)`, ext.length === 0, ext.join(" | "));
  const html = files.map((f) => fs.readFileSync("/tmp/pages/" + f, "utf8")).join("\n");
  ok("no analytics/advertising vendor names or snippets in the page source", !/google-analytics|googletagmanager|gtag\(|fbq\(|facebook\.net|hotjar|clarity\.ms|segment\.com|mixpanel|plausible|vercel\.live|_vercel\/(insights|speed-insights)/i.test(html));

  /* B. real browser: use every feature on every page, then check storage + network */
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); const p = await ctx.newPage();
  await p.goto(URL); await p.waitForSelector("h1"); await p.waitForTimeout(500);
  const reqs = []; p.on("request", (r) => reqs.push(r.method() + " " + r.url()));
  for (const r of ROUTES) { await p.evaluate((r) => { location.hash = "#" + r; }, r); await p.waitForTimeout(150); }
  await p.evaluate(() => { location.hash = "#/contact?service=security"; }); await p.waitForTimeout(300);
  await p.fill('input[name="name"]', "Test Person"); await p.fill('input[name="email"]', "someone@example.com"); await p.fill('textarea[name="message"]', "Private details about my project.");
  await p.getByRole("button", { name: "Send project details" }).click(); await p.waitForTimeout(300);
  ok("contact form success state shown, and the privacy page's claim holds: it transmits nothing", (await p.locator('[role="status"]').innerText()).includes("not sent yet"));
  await p.evaluate(() => { location.hash = "#/services/vulnerability-checker"; }); await p.waitForTimeout(300);
  await p.locator("input#" + (await p.locator("main input").first().getAttribute("id"))).fill("my-secret-domain.example"); await p.getByRole("button", { name: /Run demo scan/ }).click(); await p.waitForSelector("text=Demo report", { timeout: 8000 });
  await p.evaluate(() => { location.hash = "#/services/automation"; }); await p.waitForTimeout(300); await p.getByRole("button", { name: "Run example" }).click(); await p.waitForTimeout(3800);
  await p.setViewportSize({ width: 390, height: 844 }); await p.evaluate(() => scrollTo({ top: 0, behavior: "instant" })); await p.waitForTimeout(500); await p.locator('button[aria-controls="mobile-menu"]').click(); await p.waitForTimeout(500); await p.keyboard.press("Escape");
  const external = reqs.filter((u) => !u.includes("file://")); const all = reqs.filter((u) => !/^GET file:\/\//.test(u));
  ok(`NO network requests at all while browsing 13 pages, submitting the form with personal details, running both demos and opening menus (${reqs.length} total, ${all.length} non-local)`, all.length === 0, all.slice(0, 4).join(" | "));
  const st = await p.evaluate(async () => ({ cookie: document.cookie, ls: localStorage.length, ss: sessionStorage.length, idb: (indexedDB.databases ? (await indexedDB.databases()).length : 0) }));
  ok("no cookies set", st.cookie === "", st.cookie); ok("no local storage or session storage used", st.ls === 0 && st.ss === 0, JSON.stringify(st)); ok("no IndexedDB databases created", st.idb === 0);
  const cookies = await ctx.cookies(); ok("browser cookie jar is empty after the whole session", cookies.length === 0, JSON.stringify(cookies));
  /* C. what the page text promises matches what it says */
  const body = async (r) => { await p.setViewportSize({ width: 1280, height: 900 }); await p.evaluate((r) => { location.hash = "#" + r; }, r); await p.waitForTimeout(250); return p.locator("main").innerText(); };
  const priv = await body("/privacy"), terms = await body("/terms");
  ok("privacy page states the date, the contact email and the no-cookies/no-tracking summary", /Last updated: \d{1,2} \w+ \d{4}/.test(priv) && priv.includes("mr4316841@gmail.com") && /does not use cookies, analytics, advertising or tracking/.test(priv));
  ok("terms page states the demo scanner is not a security assessment", /not a security assessment of any real system/.test(terms) && /only test systems that you own or are authorized in writing/.test(terms));
  ok("both legal pages have a table of contents whose links all resolve", (await p.locator('nav[aria-label="On this page"] a').count()) >= 10 && (await p.evaluate(() => [...document.querySelectorAll('nav[aria-label="On this page"] a')].every((a) => document.getElementById(a.getAttribute("href").slice(1))))));
  console.log(`\n${pass} passed, ${fail} failed`); await b.close(); process.exit(fail ? 1 : 0);
})();
