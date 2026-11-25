/**
 * Captures every page of the example with the Designfy capture command, in
 * mobile and desktop, light and dark, plus one reduced-motion run. Prints the
 * manifest problems (horizontal overflow and console errors) at the end.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const base = process.env.PREVIEW_URL ?? "http://localhost:4321";
const pages = ["/", "/blog/", "/blog/page/2/", "/blog/a-regua-de-chuva/", "/blog/nevoeiro-das-seis/", "/blog/categoria/metodo/", "/blog/categoria/campo/"];
// `df-capture` asks the page for the final state of the content that enters on
// scroll, because a full-page screenshot does not scroll.
const urls = pages.map((path) => {
  const url = new URL(path, base);
  url.searchParams.set("df-capture", "1");
  return url.toString();
});

const runs = [
  { name: "light-mobile", theme: "light", viewports: "mobile", reduced: false },
  { name: "light-desktop", theme: "light", viewports: "desktop", reduced: false },
  { name: "dark-mobile", theme: "dark", viewports: "mobile", reduced: false },
  { name: "dark-desktop", theme: "dark", viewports: "desktop", reduced: false },
  { name: "reduced-mobile", theme: "light", viewports: "mobile", reduced: true },
  { name: "reduced-desktop", theme: "light", viewports: "desktop", reduced: true },
] as const;

interface Manifest {
  name: string;
  shots: { url: string; viewport: string; file?: string; overflowX?: boolean; consoleErrors: string[]; pageErrors: string[]; error?: string }[];
  errors: { url?: string; error: string }[];
}

const failures: string[] = [];

for (const run of runs) {
  const args = [
    "run",
    "../../src/main.ts",
    "capture",
    "run",
    ...urls,
    "--viewport",
    run.viewports,
    "--theme",
    run.theme,
    "--out",
    "captures",
    "--name",
    run.name,
  ];
  if (run.reduced) args.push("--reduced-motion");
  const result = spawnSync("bun", args, { stdio: "inherit" });
  if (result.status !== 0) {
    failures.push(`${run.name}: capture command exited with ${result.status}`);
    continue;
  }
  const manifest = JSON.parse(readFileSync(join("captures", run.name, "manifest.json"), "utf8")) as Manifest;
  for (const shot of manifest.shots) {
    if (shot.error) failures.push(`${run.name}: ${shot.url} ${shot.viewport}: ${shot.error}`);
    if (shot.overflowX) failures.push(`${run.name}: ${shot.url} ${shot.viewport}: horizontal overflow`);
    for (const message of [...shot.consoleErrors, ...shot.pageErrors]) failures.push(`${run.name}: ${shot.url} ${shot.viewport}: ${message}`);
  }
  for (const error of manifest.errors) failures.push(`${run.name}: ${error.url ?? ""} ${error.error}`);
}

if (failures.length > 0) {
  process.stderr.write(`\nProblems found:\n${failures.map((item) => `- ${item}`).join("\n")}\n`);
  process.exit(1);
}
process.stdout.write("\nAll captures are clean: no overflow, no console errors.\n");
