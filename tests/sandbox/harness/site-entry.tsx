import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import Home from "@/app/page";
import Services from "@/app/services/page";
import Work from "@/app/work/page";
import Process from "@/app/process/page";
import About from "@/app/about/page";
import Contact from "@/app/contact/page";
import Privacy from "@/app/privacy/page";
import Terms from "@/app/terms/page";
import NotFound from "@/app/not-found";
import Loading from "@/app/loading";
import { ServicePageView } from "@/components/services/ServicePageView";
import { SERVICES, getService } from "@/lib/constants/services";

const route = () => { const h = location.hash; return h.startsWith("#/") ? h.slice(1).split("?")[0] : "/"; };
function Page({ path }: { path: string }) {
  if (path === "/") return <Home />; if (path === "/services") return <Services />; if (path === "/work") return <Work />;
  if (path === "/process") return <Process />; if (path === "/about") return <About />; if (path === "/contact") return <Contact />; if (path === "/privacy") return <Privacy />; if (path === "/terms") return <Terms />; if (path === "/__loading") return <Loading />;
  const s = SERVICES.find((x) => x.href === path); return s ? <ServicePageView service={getService(s.slug)!} /> : <NotFound />;
}
function App() {
  const [path, setPath] = useState(route());
  (window as any).__path = path;
  useEffect(() => {
    const onHash = () => {
      const h = location.hash;
      if (h && !h.startsWith("#/")) { document.getElementById(h.slice(1))?.scrollIntoView(); return; } // in-page anchor: no route change
      (window as any).__path = route(); setPath(route()); window.scrollTo({ top: 0, behavior: "instant" });
    };
    addEventListener("hashchange", onHash); return () => removeEventListener("hashchange", onHash);
  }, []);
  return <SiteShell><Page path={path} key={path + location.hash} /></SiteShell>;
}
createRoot(document.getElementById("root")!).render(<App />);
