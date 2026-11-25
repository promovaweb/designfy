/** Captures the demo routes via Designfy and verifies every manifest. */
import { resolve } from "node:path";

const base = (process.env.DESIGNFY_PREVIEW_URL ?? "http://127.0.0.1:4373").replace(/\/$/, "");
const output = resolve(process.env.DESIGNFY_CAPTURE_DIR ?? ".designfy/captures");
const stamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
const routes = [
  "/app", "/app/orders", "/app/orders/new", "/app/orders/import", "/app/orders/PL-1040",
  "/app/settings", "/app/settings/notifications", "/app/settings/workspace", "/login",
  ...["loading", "empty", "error"].flatMap((state) => [`/app?state=${state}`, `/app/orders?state=${state}`]),
];
const runs = [
  { name: `light-${stamp}`, theme: "light", reduced: false },
  { name: `dark-${stamp}`, theme: "dark", reduced: false },
  { name: `reduced-motion-${stamp}`, theme: "light", reduced: true },
];
await Promise.all(runs.map(async ({ name, theme, reduced }) => {
  const urls = (reduced ? ["/app"] : routes).map((route) => base + route);
  const process = Bun.spawn([
    "bun", "run", "../../src/main.ts", "capture", "run", ...urls,
    "--name", name, "--out", output, "--viewport", "mobile,desktop",
    "--theme", theme, "--wait", "1100", ...(reduced ? ["--reduced-motion"] : []),
  ], { stderr: "inherit", stdout: "inherit" });
  if (await process.exited !== 0) throw new Error(`Capture failed for ${name}`);
  const manifest = await Bun.file(resolve(output, name, "manifest.json")).json();
  const bad = manifest.shots.filter((shot: { file?: string; overflowX?: boolean; error?: string; consoleErrors: string[]; pageErrors: string[] }) =>
    !shot.file || shot.overflowX !== false || shot.error || shot.consoleErrors.length || shot.pageErrors.length);
  if (manifest.shots.length !== 2 * urls.length || bad.length || manifest.errors.length) {
    throw new Error(JSON.stringify({ name, bad, errors: manifest.errors }, null, 2));
  }
}));
