import { Newsreader, Inter, Geist_Mono } from "next/font/google";

// No `weight` list: omitted, next/font fetches the variable font as a single file instead of one file per weight.
export const display = Newsreader({ subsets: ["latin"], variable: "--font-display", display: "swap" });
export const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
export const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
// app/layout.tsx: <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
