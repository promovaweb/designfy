/** Plans browser captures, runs the embedded Node script, and reads capture manifests. */
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { z } from "zod";
import { classifyFsError, error } from "../app/errors.ts";
import { ExitCode } from "../app/exit-codes.ts";
import { getPath, readSettings } from "../config/settings.ts";
import { run } from "./exec.ts";
// @ts-expect-error Bun embeds the Node runner as text; TypeScript does not declare this .mjs text import.
import runnerSource from "./capture-runner.mjs" with { type: "text" };

const viewportSchema = z.object({
  name: z.string(),
  width: z.number(),
  height: z.number(),
  deviceScaleFactor: z.number(),
  isMobile: z.boolean(),
  hasTouch: z.boolean(),
});
const themeSchema = z.enum(["light", "dark"]);
const maxTimerMs = 2_147_483_647;
const shotSchema = z.object({
  url: z.string(),
  viewport: z.string(),
  theme: themeSchema.optional(),
  scrollSteps: z.number().int().nonnegative().optional(),
  incompleteImages: z.array(z.string()).optional(),
  scrollBudgetExhausted: z.boolean().optional(),
  file: z.string().optional(),
  title: z.string().optional(),
  documentWidth: z.number().optional(),
  documentHeight: z.number().optional(),
  viewportWidth: z.number().optional(),
  overflowX: z.boolean().optional(),
  consoleErrors: z.array(z.string()),
  pageErrors: z.array(z.string()),
  error: z.string().optional(),
});
const runnerResultSchema = z.object({
  shots: z.array(shotSchema),
  errors: z.array(z.object({
    url: z.string().optional(), viewport: z.string().optional(), theme: themeSchema.optional(), error: z.string(),
  })),
});

/** Runtime shape of a capture manifest returned by the CLI and MCP. */
export const captureManifestSchema = runnerResultSchema.extend({
  name: z.string(),
  createdAt: z.string(),
  outDir: z.string(),
  urls: z.array(z.string()),
  viewports: z.array(viewportSchema),
  theme: themeSchema,
  themes: z.array(themeSchema).nonempty().optional(),
  fullPage: z.boolean(),
  scroll: z.boolean().optional(),
  scrollBudgetMs: z.number().int().nonnegative().optional(),
  showDevOverlays: z.boolean().optional(),
  hide: z.array(z.string()).optional(),
  reducedMotion: z.boolean(),
  waitMs: z.number(),
  selector: z.string().optional(),
});

export type Viewport = z.infer<typeof viewportSchema>;
export type CaptureManifest = z.infer<typeof captureManifestSchema>;
type CaptureTheme = z.infer<typeof themeSchema>;

export interface CaptureOptions {
  viewports?: string | readonly string[];
  theme?: string | readonly string[];
  fullPage?: boolean;
  scroll?: boolean;
  scrollBudgetMs?: number;
  showDevOverlays?: boolean;
  hide?: string | readonly string[];
  reducedMotion?: boolean;
  waitMs?: number;
  selector?: string;
  outDir?: string;
  name?: string;
}

export type CapturePlan = Omit<CaptureManifest, "shots" | "errors"> & {
  cwd: string;
  themes: [CaptureTheme, ...CaptureTheme[]];
  scroll: boolean;
  scrollBudgetMs: number;
  showDevOverlays: boolean;
  hide: string[];
};

const presets = {
  mobile: { name: "mobile", width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  tablet: { name: "tablet", width: 820, height: 1180, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  desktop: { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  wide: { name: "wide", width: 1920, height: 1080, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
} as const satisfies Record<string, Viewport>;

/** Parses named viewport presets and positive WIDTHxHEIGHT dimensions. */
export function parseViewport(value: string): Viewport {
  const key = value.trim().toLowerCase();
  if (Object.hasOwn(presets, key)) return { ...presets[key as keyof typeof presets] };
  const dimensions = /^(\d+)x(\d+)$/.exec(key);
  const width = Number(dimensions?.[1]);
  const height = Number(dimensions?.[2]);
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0) {
    throw error.usage(`Invalid viewport "${value}". Use mobile, tablet, desktop, wide, or WIDTHxHEIGHT.`);
  }
  return { name: `${width}x${height}`, width, height, deviceScaleFactor: 1, isMobile: false, hasTouch: false };
}

/** Expands comma-separated or repeated viewport values in order, deduplicating names. */
export function parseViewports(values: string | readonly string[]): Viewport[] {
  const list = typeof values === "string" ? [values] : values;
  if (list.length === 0) throw error.usage("At least one viewport is required.");
  const parsed = list.flatMap((value) => value.split(",").map(parseViewport));
  return [...new Map(parsed.map((viewport) => [viewport.name, viewport])).values()];
}

function parseThemes(values: string | readonly string[]): CapturePlan["themes"] {
  const list = typeof values === "string" ? [values] : values;
  const names = [...new Set(list.flatMap((value) => value.split(",").map((item) => item.trim())))];
  const parsed = z.tuple([themeSchema]).rest(themeSchema).safeParse(names);
  if (!parsed.success) throw error.usage("Capture themes must be light or dark.");
  return parsed.data;
}

function captureRoot(cwd: string, outDir: unknown): string {
  return resolve(cwd, typeof outDir === "string" && outDir ? outDir : ".designfy/captures");
}

function validateUrl(value: string): void {
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") return;
  } catch {
    // Report validation errors through the CLI and MCP adapters.
  }
  throw error.usage("Capture URLs must use HTTP or HTTPS.");
}

/** Validates capture options and computes the destination from settings or explicit overrides. */
export function planCapture(
  cwd: string,
  urls: readonly string[],
  options: CaptureOptions = {},
  now = new Date(),
): CapturePlan {
  if (urls.length === 0) throw error.usage("At least one URL is required.");
  urls.forEach(validateUrl);
  const createdAt = now.toISOString();
  const timestamp = createdAt.slice(0, 19).replace(/[-:]/g, "").replace("T", "-");
  const name = options.name ?? timestamp;
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(name) || name.endsWith(".")) {
    throw error.usage("Use letters, digits, dots, hyphens, or underscores for the run name, starting with a letter or digit.");
  }
  const waitMs = options.waitMs ?? 0;
  if (!Number.isInteger(waitMs) || waitMs < 0 || waitMs > maxTimerMs) {
    throw error.usage("Capture wait must be an integer between 0 and 2147483647 milliseconds.");
  }
  const scrollBudgetMs = options.scrollBudgetMs ?? 15_000;
  if (!Number.isInteger(scrollBudgetMs) || scrollBudgetMs < 0 || scrollBudgetMs > maxTimerMs) {
    throw error.usage("Capture scroll budget must be an integer between 0 and 2147483647 milliseconds.");
  }
  const themes = parseThemes(options.theme ?? "light");
  const hide = typeof options.hide === "string" ? [options.hide] : [...(options.hide ?? [])];
  if (hide.some((selector) => !selector.trim())) throw error.usage("Capture hide selectors must not be empty.");

  const settings = readSettings();
  const savedViewports = getPath(settings, "capture.viewports");
  const viewports = options.viewports ?? (typeof savedViewports === "string" || (
    Array.isArray(savedViewports) && savedViewports.every((item) => typeof item === "string")
  ) ? savedViewports : "mobile,desktop");
  const root = captureRoot(cwd, options.outDir ?? getPath(settings, "capture.outDir"));
  return {
    cwd: resolve(cwd),
    name,
    createdAt,
    outDir: join(root, name),
    urls: [...urls],
    viewports: parseViewports(viewports),
    theme: themes[0],
    themes,
    fullPage: options.fullPage ?? true,
    scroll: options.scroll ?? true,
    scrollBudgetMs,
    showDevOverlays: options.showDevOverlays ?? false,
    hide,
    reducedMotion: options.reducedMotion ?? false,
    waitMs,
    selector: options.selector,
  };
}

/** Runs the capture and writes a manifest even when some or all browser shots fail. */
export async function runCapture(plan: CapturePlan): Promise<CaptureManifest> {
  const { cwd, ...manifestFields } = plan;
  const { outDir } = manifestFields;
  const folder = mkdtempSync(join(tmpdir(), "designfy-capture-"));
  let ownsRunDirectory = false;
  try {
    const script = join(folder, "runner.mjs");
    const planFile = join(folder, "plan.json");
    writeFileSync(script, runnerSource);
    writeFileSync(planFile, JSON.stringify(manifestFields));
    try {
      mkdirSync(resolve(outDir, ".."), { recursive: true });
      mkdirSync(outDir);
      ownsRunDirectory = true;
    } catch (cause) {
      if ((cause as NodeJS.ErrnoException).code === "EEXIST") {
        throw error.usage(`Capture run "${plan.name}" already exists. Choose another --name.`);
      }
      throw classifyFsError(cause, ExitCode.CONFIG, `Failed to prepare capture directory ${outDir}`);
    }

    let result;
    try {
      result = await run("node", [script, planFile], { cwd });
    } catch {
      throw error.network("Could not start the Node capture runner. Ensure Node is available on PATH.");
    }

    if (result.code === 3) {
      const hint = "designfy deps install testing";
      throw error.checkFailed(`Playwright is unavailable. Run ${hint}.`, { hint });
    }
    if (result.code !== 0 && result.code !== 4) {
      throw error.network("The Node capture runner failed.", { code: result.code });
    }

    let output;
    try {
      output = runnerResultSchema.parse(JSON.parse(result.stdout));
    } catch {
      throw error.network("The Node capture runner returned an invalid result.", { code: result.code });
    }
    const manifest = { ...manifestFields, ...output };
    const manifestPath = join(outDir, "manifest.json");
    try {
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
    } catch (cause) {
      throw classifyFsError(cause, ExitCode.CONFIG, `Failed to write ${manifestPath}`);
    }
    if (result.code === 4) {
      throw error.network(`One or more screenshots failed. See ${manifestPath}.`, { manifestPath, errors: manifest.errors });
    }
    return manifest;
  } finally {
    rmSync(folder, { recursive: true, force: true });
    if (ownsRunDirectory) {
      try {
        rmdirSync(outDir);
      } catch {
        // Preserve screenshots and manifests in nonempty directories.
      }
    }
  }
}

/** Lists valid manifests in the capture directory, newest first. */
export function listCaptures(cwd: string, outDir?: string): CaptureManifest[] {
  const root = captureRoot(cwd, outDir ?? getPath(readSettings(), "capture.outDir"));
  let entries;
  try {
    entries = readdirSync(root, { withFileTypes: true });
  } catch (cause) {
    if ((cause as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw classifyFsError(cause, ExitCode.CONFIG, `Failed to list captures in ${root}`);
  }

  const captures: CaptureManifest[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const path = join(root, entry.name, "manifest.json");
    try {
      const parsed = captureManifestSchema.safeParse(JSON.parse(readFileSync(path, "utf8")));
      if (parsed.success) captures.push(parsed.data);
    } catch (cause) {
      if (cause instanceof SyntaxError || (cause as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw classifyFsError(cause, ExitCode.CONFIG, `Failed to read ${path}`);
    }
  }
  return captures.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.name.localeCompare(a.name));
}
