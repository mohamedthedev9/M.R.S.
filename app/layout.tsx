import type { Metadata, Viewport } from "next";
import "./globals.css";
import { display, sans, mono } from "@/lib/fonts";
import { SiteShell } from "@/components/layout/SiteShell";
import { SITE } from "@/lib/constants/content";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE.metaTitle, template: `%s | ${SITE.name}` },
  description: SITE.metaDescription,
  applicationName: SITE.name,
  openGraph: { type: "website", siteName: SITE.name, title: SITE.metaTitle, description: SITE.metaDescription, url: "/", locale: "en_US" },
  twitter: { card: "summary_large_image", title: SITE.metaTitle, description: SITE.metaDescription },
  robots: { index: true, follow: true },
  // Canonicals are set per page (lib/seo.ts); a canonical here would point every page at "/".
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Only facts the owner supplied: name, legal name, URL and profile links. No ratings, addresses or invented data. */
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  legalName: SITE.legalName,
  founder: { "@type": "Person", name: SITE.founder },
  url: SITE_URL,
  sameAs: [SITE.social.facebook.href, SITE.social.tiktok.href],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
