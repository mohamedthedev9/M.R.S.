import type { MetadataRoute } from "next";
import { NAV } from "@/lib/constants/content";
import { SERVICES } from "@/lib/constants/services";
import { absoluteUrl } from "@/lib/site";

/** No lastModified: we don't invent dates. Add them when content is versioned. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...NAV.map((n) => n.href), ...SERVICES.map((s) => s.href), "/privacy", "/terms"];
  return [...new Set(paths)].map((p) => ({ url: absoluteUrl(p), priority: p === "/" ? 1 : p.startsWith("/services/") ? 0.8 : 0.6 }));
}
