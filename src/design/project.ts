/** Detects web projects and reads or writes their designfy.json configuration. */
import { existsSync, linkSync, mkdtempSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";
import { classifyFsError, error } from "../app/errors.ts";
import { ExitCode } from "../app/exit-codes.ts";

export const frameworks = ["astro", "next", "react-vite", "react", "unknown"] as const;
export const packageManagers = ["bun", "pnpm", "yarn", "npm"] as const;
export const PROJECT_VARIABLE = "DESIGNFY_PROJECT";
export type Framework = (typeof frameworks)[number];
export type PackageManager = (typeof packageManagers)[number];

export const projectDetectionSchema = z.object({
  framework: z.enum(frameworks),
  typescript: z.boolean(),
  packageManager: z.enum(packageManagers),
  tailwind: z.number().int().nonnegative().nullable(),
  shadcn: z.boolean(),
});

const themePairSchema = z.object({
  fg: z.string().trim().min(1),
  bg: z.string().trim().min(1),
  label: z.string().trim().min(1).optional(),
  min: z.number().min(1).max(21).optional(),
});

export type ThemePair = z.infer<typeof themePairSchema>;

export const projectConfigSchema = projectDetectionSchema.extend({
  schemaVersion: z.literal(1),
  paths: z.object({
    components: z.string().min(1),
    styles: z.string().min(1),
    theme: z.string().trim().min(1).optional(),
    viewspec: z.string().min(1),
  }),
  aliases: z.object({ components: z.string().min(1) }),
  theme: z.object({ pairs: z.array(themePairSchema).optional() }).optional(),
});

const projectOverrides = projectConfigSchema.partial().extend({
  paths: projectConfigSchema.shape.paths.partial().optional(),
  aliases: projectConfigSchema.shape.aliases.partial().optional(),
});

const packageSchema = z.object({
  dependencies: z.record(z.string(), z.string()).optional(),
  devDependencies: z.record(z.string(), z.string()).optional(),
  peerDependencies: z.record(z.string(), z.string()).optional(),
  optionalDependencies: z.record(z.string(), z.string()).optional(),
});

export type ProjectDetection = z.infer<typeof projectDetectionSchema>;
export type ProjectConfig = z.infer<typeof projectConfigSchema>;
export type ProjectConfigOverrides = z.infer<typeof projectOverrides>;

const lockfiles: readonly [string, PackageManager][] = [
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
  ["pnpm-lock.yaml", "pnpm"],
  ["yarn.lock", "yarn"],
  ["package-lock.json", "npm"],
];

/** Resolves an optional project directory against the caller's working directory. */
export function resolveProjectDirectory(cwd: string, project?: string): string {
  if (project === undefined) return cwd;
  const path = resolve(cwd, project);
  try {
    if (!project || !statSync(path).isDirectory()) throw error.notFound(`Project directory not found: ${path}`, { path });
  } catch (cause) {
    if (["ENOENT", "ENOTDIR"].includes((cause as NodeJS.ErrnoException).code ?? "")) {
      throw error.notFound(`Project directory not found: ${path}`, { path });
    }
    throw classifyFsError(cause, ExitCode.CONFIG, `Failed to inspect project directory ${path}`);
  }
  return path;
}

function readJson(path: string): unknown {
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch (cause) {
    if ((cause as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw classifyFsError(cause, ExitCode.CONFIG, `Failed to read ${path}`);
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw error.config(`${path} does not contain valid JSON.`, { path });
  }
}

function validate<T>(schema: z.ZodType<T>, data: unknown, path: string): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw error.config(`Invalid configuration in ${path}.`, {
      path,
      issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
    });
  }
  return parsed.data;
}

/** Reads package.json and combines its declared dependency ranges. */
export function readProjectPackages(cwd: string): Record<string, string> | null {
  const path = join(cwd, "package.json");
  const raw = readJson(path);
  if (raw === undefined) return null;
  const pkg = validate(packageSchema, raw, path);
  return { ...pkg.peerDependencies, ...pkg.optionalDependencies, ...pkg.devDependencies, ...pkg.dependencies };
}

/** Reads the first major in a declared version range, or null for unversioned references. */
export function versionMajor(range: string): number | null {
  const match = /^(?:[~^<>=]+\s*)?v?(\d+)(?=\.|\s|$)/.exec(range.trim());
  return match ? Number(match[1]) : null;
}

/** Detects the package manager by lockfile, defaulting to npm. */
export function detectPackageManager(cwd: string): PackageManager {
  return lockfiles.find(([file]) => existsSync(join(cwd, file)))?.[1] ?? "npm";
}

/** Detects framework, TypeScript, Tailwind, shadcn and the package manager. */
export function detectProject(cwd: string, { requirePackage = false }: { requirePackage?: boolean } = {}): ProjectDetection {
  const packages = readProjectPackages(cwd);
  if (requirePackage && packages === null) {
    throw error.notFound("No package.json found in the current directory.", { cwd });
  }
  const has = (name: string) => packages !== null && Object.hasOwn(packages, name);
  let framework: Framework = "unknown";
  if (has("astro")) framework = "astro";
  else if (has("next")) framework = "next";
  else if (has("react")) framework = has("vite") ? "react-vite" : "react";

  return {
    framework,
    typescript: has("typescript") || existsSync(join(cwd, "tsconfig.json")),
    packageManager: detectPackageManager(cwd),
    tailwind: versionMajor(packages?.tailwindcss ?? ""),
    shadcn: existsSync(join(cwd, "components.json")),
  };
}

/** Reads validated project overrides, or null when designfy.json is missing. */
export function readProjectConfig(cwd: string): ProjectConfigOverrides | null {
  const path = join(cwd, "designfy.json");
  const raw = readJson(path);
  return raw === undefined ? null : validate(projectOverrides, raw, path);
}

/** Writes a complete designfy.json and returns its path. */
export function writeProjectConfig(cwd: string, config: ProjectConfig, options: { exclusive?: boolean } = {}): string {
  const path = join(cwd, "designfy.json");
  const data = validate(projectConfigSchema, config, path);
  let staging: string | undefined;
  try {
    staging = mkdtempSync(join(cwd, ".designfy-config-"));
    const temporary = join(staging, "designfy.json");
    writeFileSync(temporary, `${JSON.stringify(data, null, 2)}\n`);
    if (options.exclusive) linkSync(temporary, path);
    else renameSync(temporary, path);
  } catch (cause) {
    if ((cause as NodeJS.ErrnoException).code === "EEXIST") {
      throw error.usage("designfy.json already exists. Use --force to overwrite it.", { path });
    }
    throw classifyFsError(cause, ExitCode.CONFIG, `Failed to write ${path}`);
  } finally {
    if (staging) rmSync(staging, { recursive: true, force: true });
  }
  return path;
}

/** Fills in the default paths and aliases for a detected project. */
export function defaultProjectConfig(detection: ProjectDetection): ProjectConfig {
  return {
    schemaVersion: 1,
    ...detection,
    paths: {
      components: "src/components/designfy",
      styles: "src/styles",
      viewspec: "viewspec",
    },
    aliases: { components: "@/components/designfy" },
  };
}

/** Resolves project settings by merging saved overrides over current detection. */
export function resolveProject(cwd: string): ProjectConfig {
  const defaults = defaultProjectConfig(detectProject(cwd));
  const config = readProjectConfig(cwd);
  return {
    ...defaults,
    ...config,
    paths: { ...defaults.paths, ...config?.paths },
    aliases: { ...defaults.aliases, ...config?.aliases },
  };
}
