import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "M.R.S. — Mohamed Reda Services | Import & Digital Solutions",
  description: "Modern multi-service business providing practical business and digital services. From product sourcing and import coordination to web development and content creation.",
  openGraph: {
    title: "M.R.S. — Mohamed Reda Services",
    description: "Import assistance. Digital solutions. Practical execution.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-[#050505] text-neutral-200 antialiased selection:bg-white/20">
        {children}
      </body>
    </html>
  );
}