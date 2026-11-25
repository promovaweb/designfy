// Astro configuration of the example: Tailwind 4 through the Vite plugin and
// the `@` alias the Designfy components use after `components add`.
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "http://localhost:4321",
  markdown: {
    // Shiki emits `var(--shiki-token-*)`, so designfy-prose.css can keep the
    // highlights on theme roles instead of a fixed theme palette.
    shikiConfig: { theme: "css-variables" },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
