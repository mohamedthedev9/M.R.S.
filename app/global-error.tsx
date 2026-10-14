"use client";
import "./globals.css";

/** Last-resort boundary: replaces the root layout, so it brings its own <html>/<body> and uses system fonts only. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ display: "grid", minHeight: "100vh", placeItems: "center", padding: "2rem", textAlign: "center" }}>
        <main>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 600 }}>Something went wrong.</h1>
          <p style={{ marginTop: "1rem", color: "rgb(154 166 180)" }}>The page could not be displayed. Please try again.</p>
          <button type="button" onClick={reset} style={{ marginTop: "1.5rem", minHeight: 44, padding: "0 1.25rem", borderRadius: 6, background: "rgb(91 140 255)", color: "rgb(7 9 12)", font: "500 0.9rem system-ui, sans-serif" }}>Try again</button>
        </main>
      </body>
    </html>
  );
}
