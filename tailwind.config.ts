import type { Config } from "tailwindcss";

const c = (v: string) => `rgb(var(--${v}) / <alpha-value>)`;

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: c("bg"),
        surface: { 1: c("surface-1"), 2: c("surface-2") },
        line: { DEFAULT: c("border"), strong: c("border-strong"), control: c("control") },
        ink: { DEFAULT: c("text"), 2: c("text-2"), muted: c("text-muted") },
        accent: { DEFAULT: c("accent"), hover: c("accent-hover"), tech: c("accent-tech") },
        success: c("success"),
        warning: c("warning"),
        danger: c("danger"),
      },
      borderRadius: { sm: "var(--radius-sm)", md: "var(--radius-md)", lg: "var(--radius-lg)", xl: "var(--radius-xl)" },
      fontFamily: {
        display: ["var(--font-display, Newsreader)", "Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
        sans: ["var(--font-sans, Inter)", "SF Pro Text", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-mono, Geist Mono)", "ui-monospace", "SF Mono", "Menlo", "Consolas", "monospace"],
      },
      transitionDuration: { fast: "var(--dur-fast)", base: "var(--dur-base)", slow: "var(--dur-slow)" },
      transitionTimingFunction: { out: "var(--ease-out)", "in-out": "var(--ease-in-out)" },
      boxShadow: { overlay: "var(--shadow-overlay)" },
      backgroundImage: { brand: "linear-gradient(90deg, var(--brand-0) 0%, var(--brand-1) 32%, var(--brand-2) 58%, var(--brand-3) 82%, var(--brand-4) 100%)" },
      backdropBlur: { glass: "var(--blur-glass)" },
      maxWidth: { site: "80rem" },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 7vw, 5.5rem)", { lineHeight: "1.03", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 3.75rem)", { lineHeight: "1.06", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.75rem, 3.2vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
      },
    },
  },
  plugins: [],
} satisfies Config;
