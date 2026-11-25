/** Exposes screenshot capture and manifest history as CLI subcommands. */
import { error } from "../../app/errors.ts";
import { ExitCode } from "../../app/exit-codes.ts";
import { manifest } from "../../app/manifest.ts";
import { listCaptures, planCapture, runCapture } from "../../design/capture.ts";
import { table } from "../format.ts";
import type { Command, OptionDefinition } from "../registry.ts";

const outOption: OptionDefinition = {
  name: "--out",
  argument: { name: "dir" },
  description: "Capture root directory. Defaults to the capture.outDir setting.",
};

// The shared CLI parser joins repeatable values with commas before invoking this command.
const viewportOption = {
  name: "--viewport",
  argument: { name: "viewport" },
  description: "Use mobile, tablet, desktop, wide, or WIDTHxHEIGHT. Repeat or separate with commas. Defaults to capture.viewports.",
  repeatable: true,
};

const list: Command = {
  name: "list",
  description: "List capture manifests from newest to oldest.",
  options: [outOption],
  examples: [`${manifest.bin} capture list --json`],
  exitCodes: [ExitCode.CONFIG, ExitCode.NOT_FOUND, ExitCode.PERMISSION],
  run: ({ options }) => {
    const captures = listCaptures(process.cwd(), options.out as string | undefined);
    return {
      data: { captures },
      text: () => captures.length ? table(captures.map((capture) =>
        [capture.name, `${capture.shots.filter((shot) => shot.file).length} screenshots (${capture.outDir})`],
      )) : "No capture runs found.",
    };
  },
};

const run: Command = {
  name: "run",
  description: "Capture each URL at the selected viewport sizes.",
  arguments: [{ name: "urls", description: "One or more HTTP or HTTPS URLs to capture.", required: true, variadic: true }],
  options: [
    viewportOption,
    { name: "--theme", argument: { name: "theme", values: ["light", "dark"] }, description: "Browser color scheme. Defaults to light." },
    { name: "--full-page", description: "Capture the full page. Enabled by default." },
    { name: "--fold", description: "Capture only the visible viewport." },
    { name: "--reduced-motion", description: "Set the browser preference to reduced motion." },
    { name: "--wait", argument: { name: "ms" }, description: "Wait this many milliseconds after page load. Defaults to zero." },
    { name: "--selector", argument: { name: "css" }, description: "Capture only the element matching this CSS selector." },
    outOption,
    { name: "--name", argument: { name: "run" }, description: "Name the run directory. Defaults to a UTC timestamp." },
  ],
  examples: [
    `${manifest.bin} capture run http://localhost:4321 --viewport mobile,desktop`,
    `${manifest.bin} capture run http://localhost:4321 --viewport mobile --viewport tablet --fold`,
  ],
  exitCodes: [ExitCode.CONFIG, ExitCode.NETWORK_OR_API, ExitCode.NOT_FOUND, ExitCode.PERMISSION, ExitCode.CHECK_FAILED],
  run: async ({ args, options }) => {
    if (options.fold && options["full-page"]) throw error.usage("Choose either --fold or --full-page.");
    const wait = options.wait as string | undefined;
    if (wait !== undefined && !/^\d+$/.test(wait)) throw error.usage("--wait requires a nonnegative integer.");
    const plan = planCapture(process.cwd(), args, {
      viewports: options.viewport as string | undefined,
      theme: options.theme as "light" | "dark" | undefined,
      fullPage: options.fold !== true,
      reducedMotion: options["reduced-motion"] === true,
      waitMs: wait !== undefined ? Number(wait) : undefined,
      selector: options.selector as string | undefined,
      outDir: options.out as string | undefined,
      name: options.name as string | undefined,
    });
    const data = await runCapture(plan);
    return {
      data,
      text: () => table([
        ["Run", data.name],
        ["Directory", data.outDir],
        ...data.shots.map((shot): [string, string] => [
          shot.viewport,
          `${shot.file ?? shot.error}${shot.overflowX ? " (horizontal overflow)" : ""}`,
        ]),
      ]),
    };
  },
};

/** Command group for capturing pages and listing previous runs. */
export const captureCommand: Command = {
  name: "capture",
  description: "Capture browser screenshots and inspect previous runs.",
  examples: [`${manifest.bin} capture list`],
  exitCodes: run.exitCodes,
  subcommands: [run, list],
};
