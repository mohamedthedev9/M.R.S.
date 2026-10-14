import { renderToStaticMarkup } from "react-dom/server";
import fs from "node:fs";
import RootLayout, * as layoutMod from "./app/layout";
import Home, * as homeMod from "./app/page";
import Services, * as servicesMod from "./app/services/page";
import ServiceSlug, * as slugMod from "./app/services/[slug]/page";
import Work, * as workMod from "./app/work/page";
import Process, * as processMod from "./app/process/page";
import About, * as aboutMod from "./app/about/page";
import Contact, * as contactMod from "./app/contact/page";
import Privacy, * as privacyMod from "./app/privacy/page";
import Terms, * as termsMod from "./app/terms/page";
import NotFound, * as nfMod from "./app/not-found";
import sitemap from "./app/sitemap";
import robots from "./app/robots";
import { SERVICES } from "./lib/constants/services";

const wrap = (el: React.ReactElement) => "<!doctype html>" + renderToStaticMarkup(<RootLayout>{el}</RootLayout>);
const pages: Array<[string, () => Promise<React.ReactElement> | React.ReactElement, any]> = [
  ["/", () => <Home />, homeMod], ["/services", () => <Services />, servicesMod], ["/work", () => <Work />, workMod],
  ["/process", () => <Process />, processMod], ["/about", () => <About />, aboutMod], ["/contact", () => <Contact />, contactMod],
  ["/privacy", () => <Privacy />, privacyMod], ["/terms", () => <Terms />, termsMod], ["/__404", () => <NotFound />, nfMod],
  ...SERVICES.map((s) => [s.href, async () => await ServiceSlug({ params: Promise.resolve({ slug: s.slug }) }), slugMod] as [string, any, any]),
];
fs.mkdirSync("/tmp/pages", { recursive: true });
(async () => {
  const meta: Record<string, any> = {};
  for (const [path, make, mod] of pages) {
    (globalThis as any).__PATH__ = path;
    const html = wrap(await make());
    fs.writeFileSync(`/tmp/pages/${path === "/" ? "index" : path.replace(/\//g, "_")}.html`, html);
    const slug = path.startsWith("/services/") ? path.split("/")[2] : null;
    meta[path] = mod.generateMetadata ? await mod.generateMetadata({ params: Promise.resolve({ slug }) }) : mod.metadata ?? {};
  }
  let threw = false; try { await ServiceSlug({ params: Promise.resolve({ slug: "nope" }) }); } catch (e: any) { threw = e.digest === "NEXT_NOT_FOUND"; }
  fs.writeFileSync("/tmp/pages/_meta.json", JSON.stringify({ meta, layoutMeta: layoutMod.metadata, viewport: layoutMod.viewport, sitemap: sitemap(), robots: robots(),
    unknownSlug404: threw, staticParams: slugMod.generateStaticParams(), dynamicParams: slugMod.dynamicParams, pages: pages.map((p) => p[0]) }, null, 1));
  console.log("rendered", pages.length, "pages");
})();
