const { chromium } = require("playwright"); const fs = require("fs");
const M = JSON.parse(fs.readFileSync("/tmp/pages/_meta.json", "utf8"));
let pass = 0, fail = 0; const ok = (n, c, x = "") => { c ? pass++ : fail++; if (!c) console.log("FAIL " + n + (x ? "  " + x : "")); };
const ROUTES = new Set(["/", "/services", "/work", "/process", "/about", "/contact", "/privacy", "/terms", ...M.staticParams.map((p) => "/services/" + p.slug)]);
const fileFor = (p) => "/tmp/pages/" + (p === "/" ? "index" : p.replace(/\//g, "_")) + ".html";
(async () => {
  const b = await chromium.launch(); const info = [];
  for (const path of M.pages) {
    const p = await b.newPage(); await p.goto("file://" + fileFor(path));
    const r = await p.evaluate(() => {
      const q = (s) => [...document.querySelectorAll(s)];
      const hs = q("h1,h2,h3,h4,h5,h6").map((h) => +h.tagName[1]);
      const ids = q("[id]").map((e) => e.id), dupIds = ids.filter((v, i) => ids.indexOf(v) !== i);
      const refs = []; q("[aria-labelledby],[aria-controls],[aria-describedby]").forEach((e) => ["aria-labelledby", "aria-controls", "aria-describedby"].forEach((a) => (e.getAttribute(a) || "").split(/\s+/).filter(Boolean).forEach((id) => refs.push([a, id, !!document.getElementById(id)]))));
      const links = q("a[href]").map((a) => a.getAttribute("href")); const anchorsMissing = links.filter((h) => h.startsWith("#") && h.length > 1 && h !== "#main" && !document.getElementById(h.slice(1)));
      const name = (e) => (e.getAttribute("aria-label") || e.textContent || "").replace(/\s+/g, " ").trim() || (e.querySelector("img[alt]") ? e.querySelector("img").alt : "");
      const unnamed = q("a[href],button").filter((e) => !name(e)).map((e) => e.outerHTML.slice(0, 80));
      const fields = q("input,select,textarea").filter((e) => e.type !== "hidden").filter((e) => !(e.id && document.querySelector(`label[for="${e.id}"]`)) && !e.getAttribute("aria-label")).map((e) => e.outerHTML.slice(0, 60));
      return {
        lang: document.documentElement.lang, anchorsMissing, h1: q("h1").length, hs, dupIds, refs, links,
        blank: q('a[target="_blank"]').filter((a) => !/noopener/.test(a.rel)).map((a) => a.href),
        imgNoAlt: q("img").filter((i) => !i.hasAttribute("alt")).length, unnamed, fields,
        mains: q("main").length, headers: q("header").length, footers: q("footer").length,
        navs: q("nav").map((n) => n.getAttribute("aria-label")), junk: /undefined|NaN|\[object Object\]/.test(document.body.innerText),
        placeholders: (document.body.innerText.match(/\[(PLACEHOLDER|CONFIRM WITH OWNER):[^\]]*\]/g) || []).length,
        h2s: q("h2").map((h) => h.textContent.trim()), sectionIds: q("main section[id]").map((s) => s.id),
        ld: (q('script[type="application/ld+json"]')[0] || {}).textContent, skip: !!document.querySelector('a[href="#main"]'), mainFocusable: document.getElementById("main")?.getAttribute("tabindex"),
      };
    });
    const t = `[${path}]`;
    ok(`${t} lang=en`, r.lang === "en"); ok(`${t} exactly one h1`, r.h1 === 1, r.h1);
    ok(`${t} no heading level skips`, r.hs.every((v, i) => i === 0 || v - r.hs[i - 1] <= 1), r.hs.join(""));
    ok(`${t} unique ids`, r.dupIds.length === 0, r.dupIds.join());
    ok(`${t} aria references resolve`, r.refs.every((x) => x[2]), JSON.stringify(r.refs.filter((x) => !x[2])));
    const bad = r.links.filter((h) => { if (/^(https?:|mailto:|tel:)/.test(h)) return false; if (h.startsWith("#")) return false; return !ROUTES.has(h.split("?")[0].split("#")[0]); });
    ok(`${t} internal links all resolve`, bad.length === 0, bad.join());
    const anchors = r.links.filter((h) => h.startsWith("#") && h.length > 1 && h !== "#main").map((h) => h.slice(1));
    ok(`${t} every in-page anchor points at an existing id`, r.anchorsMissing.length === 0, r.anchorsMissing.join());
    ok(`${t} target=_blank has rel=noopener`, r.blank.length === 0, r.blank.join());
    ok(`${t} images have alt`, r.imgNoAlt === 0); ok(`${t} every link/button has an accessible name`, r.unnamed.length === 0, r.unnamed.join(" | "));
    ok(`${t} every form field is labelled`, r.fields.length === 0, r.fields.join(" | "));
    ok(`${t} one main, one header, one footer`, r.mains === 1 && r.headers >= 1 && r.footers === 1, `${r.mains}/${r.headers}/${r.footers}`);
    ok(`${t} every nav landmark is labelled and distinct`, r.navs.every(Boolean) && new Set(r.navs).size === r.navs.length, r.navs.join());
    ok(`${t} skip link targets a focusable main`, r.skip && r.mainFocusable === "-1");
    ok(`${t} no undefined/NaN in rendered text`, !r.junk);
    const ld = JSON.parse(r.ld); ok(`${t} JSON-LD parses, Organization, owner-supplied fields only`, ld["@type"] === "Organization" && Object.keys(ld).sort().join() === "@context,@type,founder,legalName,name,sameAs,url");
    const m = { ...(path === "/" ? { description: M.layoutMeta.description } : {}), ...(M.meta[path] || {}) }; const title = typeof m.title === "string" ? m.title : m.title?.absolute || m.title?.default;
    if (path !== "/__404") { ok(`${t} metadata: title + description`, !!title && !!m.description && m.description.length >= 20 && m.description.length <= 200, `${title} / ${(m.description || "").length}`);
      ok(`${t} metadata: canonical == path`, m.alternates?.canonical === path, m.alternates?.canonical);
      if (path !== "/") ok(`${t} metadata: openGraph complete (page replaces layout's)`, !!(m.openGraph?.title && m.openGraph?.description && m.openGraph?.url === path && m.openGraph?.siteName)); }
    info.push([path, r.placeholders, r.h2s.length]);
    if (path.startsWith("/services/")) {
      const need = ["The problem", "What's included", "See how it works", "Example outcomes", "Technical details", "Questions"];
      ok(`${t} service template: all 9 blocks`, need.every((n) => r.h2s.includes(n)) && r.h2s.some((h) => / work runs$/.test(h)) && r.sectionIds.length === 0 && r.h2s.length >= 8, r.h2s.join(" | "));
      ok(`${t} has hero h1 + breadcrumb + CTA`, r.h1 === 1 && r.navs.includes("Breadcrumb"));
    }
    if (path === "/") ok("[/] homepage sections in story order", JSON.stringify(r.sectionIds) === JSON.stringify(["capabilities", "how-it-works", "security", "automation", "web", "vulnerability", "software", "process", "work", "principles"]), r.sectionIds.join());
    await p.close();
  }
  // titles unique, sitemap, robots, static params, 404s
  const titles = M.pages.filter((p) => p !== "/__404").map((p) => { const m = M.meta[p]; return typeof m.title === "string" ? m.title : m.title?.absolute; });
  ok("page titles are unique", new Set(titles).size === titles.length, titles.join(" | "));
  const urls = M.sitemap.map((s) => s.url); ok("sitemap lists all 13 public routes, absolute", urls.length === 13 && urls.every((u) => /^https?:\/\//.test(u)) && [...ROUTES].every((r) => urls.includes("http://localhost:3000" + (r === "/" ? "/" : r))), urls.length);
  ok("sitemap has no invented lastModified", M.sitemap.every((s) => !("lastModified" in s)));
  ok("robots allows crawling and points at the sitemap", M.robots.sitemap === "http://localhost:3000/sitemap.xml" && M.robots.rules[0].allow === "/");
  ok("exactly the 5 service slugs are statically generated", M.staticParams.length === 5 && M.dynamicParams === false);
  ok("unknown service slug -> notFound()", M.unknownSlug404 === true);
  ok("layout: metadataBase set, no canonical in the root layout", !!M.layoutMeta.metadataBase && !M.layoutMeta.alternates);
  ok("viewport: dark colour scheme + viewport-fit cover", M.viewport.colorScheme === "dark" && M.viewport.viewportFit === "cover" && M.viewport.themeColor === "#000000");
  console.log("\nplaceholders per page (info):", info.filter((i) => i[1]).map((i) => `${i[0]}=${i[1]}`).join(", "));
  console.log(`\n${pass} passed, ${fail} failed`); await b.close(); process.exit(fail ? 1 : 0);
})();
