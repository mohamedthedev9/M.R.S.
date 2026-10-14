import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "./Footer";
import { BrandSprite } from "./BrandSprite";

/** Everything that wraps a page: skip link, navigation, <main> landmark, footer. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BrandSprite />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-bg">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">{children}</main>
      <Footer />
    </>
  );
}
