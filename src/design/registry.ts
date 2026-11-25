/** Queries the embedded registries and plans or copies components into a project. */
import { existsSync, lstatSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep, win32 } from "node:path";
import { z } from "zod";
import { classifyFsError, error } from "../app/errors.ts";
import { ExitCode } from "../app/exit-codes.ts";
import { manifest } from "../app/manifest.ts";
import { REGISTRY } from "../generated/registry.ts";
import { externalRegistryItem } from "./registry-lint.ts";
import { readProjectPackages, resolveProject, type Framework } from "./project.ts";

const registryFileSchema = z.object({
  path: z.string().min(1),
  type: z.string(),
  target: z.string().min(1),
  content: z.string(),
});
/** Runtime shape of a registry item with its embedded source. */
export const registryItemSchema = z.object({
  name: z.string().min(1),
  type: z.string(),
  title: z.string(),
  description: z.string(),
  categories: z.array(z.string()),
  dependencies: z.array(z.string()),
  devDependencies: z.array(z.string()),
  registryDependencies: z.array(z.string()),
  files: z.array(registryFileSchema),
  meta: z.object({
    motion: z.boolean(),
    surface: z.enum(["site", "system", "both"]),
    catalog: z.string().min(1).optional(),
    targetRoot: z.enum(["components", "styles"]).optional(),
  }),
});
const registrySchema = z.object({
  $schema: z.string().optional(),
  name: z.string().optional(),
  homepage: z.string().optional(),
  items: z.array(registryItemSchema),
});
const embeddedSchema = z.object({ react: registrySchema, astro: registrySchema });

export type RegistryItem = z.infer<typeof registryItemSchema>;
export type Registry = z.infer<typeof registrySchema>;
export type EmbeddedRegistry = z.infer<typeof embeddedSchema>;

export interface ItemFilters {
  framework?: Framework;
  category?: string;
  surface?: RegistryItem["meta"]["surface"];
}

export interface AddOptions {
  framework?: Framework;
  path?: string;
  overwrite?: boolean;
}

type FileAction = "write" | "unchanged" | "skip";
interface AddFile {
  root: string;
  path: string;
  content: string;
  action: FileAction;
}

export interface AddPlan {
  framework: Framework;
  configured: boolean;
  overwrite: boolean;
  items: string[];
  files: AddFile[];
  missingDependencies: string[];
  missingDevDependencies: string[];
  shadcnItems: string[];
}

export interface AddResult {
  framework: Framework;
  configured: boolean;
  items: string[];
  written: string[];
  unchanged: string[];
  skipped: string[];
  missingDependencies: string[];
  missingDevDependencies: string[];
  shadcnItems: string[];
  dryRun: boolean;
}

/** Loads the framework registry, honoring the fixture override when set. */
export function loadRegistry(framework: Framework = "unknown"): Registry {
  const key = framework === "astro" ? "astro" : "react";
  const file = process.env.DESIGNFY_REGISTRY_FILE;
  if (!file) return REGISTRY[key];

  let raw: string;
  try {
    raw = readFileSync(file, "utf8");
  } catch (cause) {
    throw classifyFsError(cause, ExitCode.CONFIG, "Failed to read the registry override");
  }
  try {
    return embeddedSchema.parse(JSON.parse(raw))[key];
  } catch {
    throw error.config("Invalid embedded registry override.", { file });
  }
}

/** Finds registry entries matching the selected category and surface. */
export function listItems(filters: ItemFilters = {}): RegistryItem[] {
  return loadRegistry(filters.framework).items.filter((item) =>
    (!filters.category || item.categories.includes(filters.category)) &&
    (!filters.surface || item.meta.surface === filters.surface ||
      (filters.surface !== "both" && item.meta.surface === "both")),
  );
}

function requireItem(registry: Registry, name: string, framework?: Framework): RegistryItem {
  const item = registry.items.find((entry) => entry.name === name);
  if (item) return item;
  const alternate = framework === "astro" ? "react" : "astro";
  const available = loadRegistry(alternate).items.some((entry) => entry.name === name);
  const hint = available
    ? `Available in the ${alternate} registry. Select it with --framework ${alternate}.`
    : `Run "${manifest.bin} components list" to see available items.`;
  throw error.notFound(`Unknown component "${name}". ${hint}`, { known: registry.items.map((entry) => entry.name) });
}

/** Retrieves one registry entry or reports the names available in the selected registry. */
export function getItem(name: string, framework?: Framework): RegistryItem {
  return requireItem(loadRegistry(framework), name, framework);
}

/** Resolves Designfy dependencies depth first, rejecting cycles with the chain that produced them. */
export function resolveItems(names: readonly string[], framework?: Framework): RegistryItem[] {
  const registry = loadRegistry(framework);
  const resolved = new Map<string, RegistryItem>();
  const visiting = new Set<string>();

  function visit(name: string): void {
    if (resolved.has(name)) return;
    if (visiting.has(name)) {
      throw error.config("Cyclic Designfy component dependencies.", { cycle: [...visiting, name] });
    }
    const item = requireItem(registry, name, framework);
    visiting.add(name);
    for (const dependency of item.registryDependencies) {
      if (externalRegistryItem(dependency) === undefined) visit(dependency);
    }
    visiting.delete(name);
    resolved.set(name, item);
  }

  for (const name of names) visit(name);
  return [...resolved.values()];
}

function targetPath(root: string, target: string): string {
  const path = resolve(root, target);
  const fromRoot = relative(root, path);
  if (isAbsolute(target) || win32.isAbsolute(target) || !fromRoot ||
      target.split(/[/\\]/).includes("..") || isAbsolute(fromRoot) ||
      fromRoot === ".." || fromRoot.startsWith(`..${sep}`)) {
    throw error.config(`Invalid component file target "${target}".`, { target });
  }
  return path;
}

function checkTarget(root: string, path: string): void {
  for (let current = path; current !== root; current = dirname(current)) {
    if (lstatSync(current, { throwIfNoEntry: false })?.isSymbolicLink()) {
      throw error.permission(`Component target follows a symbolic link: ${current}.`, { path });
    }
  }
}

function fileAction(file: Omit<AddFile, "action">, overwrite: boolean): FileAction {
  try {
    checkTarget(file.root, file.path);
    const current = readFileSync(file.path);
    if (current.equals(Buffer.from(file.content))) return "unchanged";
    return overwrite ? "write" : "skip";
  } catch (cause) {
    if ((cause as NodeJS.ErrnoException).code === "ENOENT") return "write";
    throw classifyFsError(cause, ExitCode.CONFIG, `Failed to read ${file.path}`);
  }
}

function packageName(dependency: string): string {
  const versionStart = dependency.indexOf("@", 1);
  return versionStart < 0 ? dependency : dependency.slice(0, versionStart);
}

/** Builds the complete add plan without changing the project. */
export function planAdd(cwd: string, names: readonly string[], options: AddOptions = {}): AddPlan {
  const project = resolveProject(cwd);
  const framework = options.framework ?? project.framework;
  const overwrite = options.overwrite ?? false;
  const items = resolveItems(names, framework);
  const files = new Map<string, AddFile>();
  const packages = readProjectPackages(cwd) ?? {};
  const dependencies = new Map<string, string>();
  const devDependencies = new Map<string, string>();
  const shadcnItems = new Set<string>();

  for (const item of items) {
    for (const name of item.dependencies) dependencies.set(packageName(name), name);
    for (const name of item.devDependencies) devDependencies.set(packageName(name), name);
    for (const dependency of item.registryDependencies) {
      const external = externalRegistryItem(dependency);
      if (external !== undefined) shadcnItems.add(external);
    }
    const root = resolve(cwd, options.path ?? project.paths[item.meta.targetRoot ?? "components"]);
    for (const file of item.files) {
      const path = targetPath(root, file.target);
      const content = file.content.replaceAll("@designfy/components", () => project.aliases.components);
      const previous = files.get(path);
      if (previous) {
        if (previous.content !== content) throw error.config(`Component files conflict at ${path}.`, { path });
        continue;
      }
      const target = { root, path, content };
      files.set(path, { ...target, action: fileAction(target, overwrite) });
    }
  }

  return {
    framework,
    configured: existsSync(join(cwd, "designfy.json")),
    overwrite,
    items: items.map((item) => item.name),
    files: [...files.values()],
    missingDependencies: [...dependencies].filter(([name]) => !Object.hasOwn(packages, name)).map(([, spec]) => spec),
    missingDevDependencies: [...devDependencies]
      .filter(([name]) => !dependencies.has(name) && !Object.hasOwn(packages, name)).map(([, spec]) => spec),
    shadcnItems: [...shadcnItems],
  };
}

function applyFile(file: AddFile, overwrite: boolean): FileAction {
  const action = fileAction(file, overwrite);
  if (action !== "write") return action;
  try {
    mkdirSync(dirname(file.path), { recursive: true });
    writeFileSync(file.path, file.content, { flag: overwrite ? "w" : "wx" });
    return "write";
  } catch (cause) {
    if (!overwrite && (cause as NodeJS.ErrnoException).code === "EEXIST") {
      return fileAction(file, false) === "unchanged" ? "unchanged" : "skip";
    }
    throw classifyFsError(cause, ExitCode.CONFIG, `Failed to write ${file.path}`);
  }
}

/** Applies a planned copy or summarizes the predicted writes when dryRun is set. */
export function applyAdd(plan: AddPlan, options: { dryRun?: boolean } = {}): AddResult {
  const { framework, configured, items, missingDependencies, missingDevDependencies, shadcnItems } = plan;
  const dryRun = options.dryRun ?? false;
  const result: AddResult = {
    framework, configured, items, missingDependencies, missingDevDependencies, shadcnItems,
    dryRun, written: [], unchanged: [], skipped: [],
  };
  const buckets = { write: result.written, unchanged: result.unchanged, skip: result.skipped };
  for (const file of plan.files) {
    const action = dryRun ? file.action : applyFile(file, plan.overwrite);
    buckets[action].push(file.path);
  }
  return result;
}

/** Counts items whose target files all exist under the configured project roots. */
export function countCopiedComponents(cwd: string): number {
  const project = resolveProject(cwd);
  return listItems({ framework: project.framework }).filter((item) => {
    const root = resolve(cwd, project.paths[item.meta.targetRoot ?? "components"]);
    return item.files.length > 0 && item.files.every((file) =>
      lstatSync(targetPath(root, file.target), { throwIfNoEntry: false })?.isFile(),
    );
  }).length;
}
