import type { Metadata } from "next";
import { SITE } from "./constants/content";

/**
 * Per-page metadata. `openGraph` on a page REPLACES the layout's openGraph (no deep merge),
 * so every field is set here. The canonical is per page: never set one in the root layout.
 */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE.name, title: `${title} | ${SITE.name}`, description, url: path, locale: "en_US" },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE.name}`, description },
  };
}
