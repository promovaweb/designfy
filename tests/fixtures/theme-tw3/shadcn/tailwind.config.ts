/** Tailwind 3 configuration with shadcn roles and explicit design tokens. */
import { existsSync } from "node:fs";

if (!existsSync("src/styles/global.css")) throw new Error("Expected project cwd.");
console.log("Config diagnostics must stay off the CLI and MCP stdout.");

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      brand: { 700: "var(--brand-deep)", "900": "rebeccapurple" },
    },
    fontFamily: { sans: ["Inter", "sans-serif"] },
    fontSize: { headline: ["1.5rem", { lineHeight: "2rem" }] },
    fontWeight: { semibold: 600 },
    spacing: { 1: "0.25rem" },
    screens: { md: "768px" },
    extend: {
      colors: {
        primary: { DEFAULT: "hsl(var(--primary) / <alpha-value>)", foreground: "hsl(var(--primary-foreground))" },
        brand: { 500: "rgb(var(--brand-rgb) / <alpha-value>)" },
      },
      fontFamily: { heading: ["Example Serif", "serif"] },
      borderRadius: { lg: "var(--radius)" },
      spacing: { gutter: "24px" },
      boxShadow: { card: ["0 0 2px #000", "0 2px 4px #111"] },
      screens: { print: { raw: "print" } },
      transitionTimingFunction: { standard: "cubic-bezier(0.2, 0, 0, 1)" },
      transitionDuration: { reveal: "250ms" },
      keyframes: { reveal: { from: { opacity: "0" }, to: { opacity: "1" } } },
      animation: { reveal: "reveal 250ms ease-out" },
    },
  },
};
