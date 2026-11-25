/** Configures Tailwind and the registry alias for the React sample site. */
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  publicDir: "../astro-site/public",
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
