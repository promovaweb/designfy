/** Lists, checks and installs the packages recommended by the dependency catalog. */
import { lstatSync } from "node:fs";
import { isAbsolute, resolve, win32 } from "node:path";
import { z } from "zod";
import { classifyFsError, error } from "../app/errors.ts";
import { ExitCode } from "../app/exit-codes.ts";
import { getPath, readSettings } from "../config/settings.ts";
import { dependencyGroupSchema, dependencyPackageSchema, loadDependenciesCatalog } from "./catalog.ts";
import { run } from "./exec.ts";
import { packageManagers, readProjectPackages, resolveProject, versionMajor } from "./project.ts";
import type { Framework, PackageManager, ProjectConfig } from "./project.ts";
import { listItems } from "./registry.ts";

export const dependencyStateSchema = dependencyPackageSchema.extend({
  installed: z.string().nullable(),
  state: z.enum(["missing", "ok", "outdated"]),
});
export const dependencyGroupStateSchema = dependencyGroupSchema.extend({
  packages: z.array(dependencyStateSchema),
});

export type DependencyState = z.infer<typeof dependencyStateSchema>;
export type DependencyGroupState = z.infer<typeof dependencyGroupStateSchema>;

export interface DependencyCheck {
  ok: boolean;
  missing: string[];
  outdated: string[];
}

export interface DependencyCommand {
  command: PackageManager;
  args: string[];
}

export interface DependencyInstallOptions {
  names?: readonly string[];
  packageManager?: PackageManager;
}

function isOutdated(installed: string, reference: string): boolean {
  const referenceMajor = versionMajor(reference);
  if (referenceMajor === null || Bun.semver.satisfies(`${referenceMajor}.0.0`, installed)) return false;
  return installed.split("||").every((part) => {
    const major = versionMajor(part);
    if (major === null) return false;
    if (major < referenceMajor) return true;
    return major === referenceMajor && /^<\s*v?\d+(?:\.0){0,2}(?:\s|$)/.test(part.trim());
  });
}

function compatible(frameworks: readonly Framework[], framework: Framework): boolean {
  return !frameworks.length || frameworks.includes(framework);
}

function findGroups(groups: DependencyGroupState[], group?: string): DependencyGroupState[] {
  if (group === undefined) return groups;
  const matching = groups.filter(({ id }) => id === group);
  if (!matching.length) throw error.notFound(`Unknown dependency group "${group}".`, { known: groups.map(({ id }) => id) });
  return matching;
}

function defaultGroups(groups: DependencyGroupState[], framework: Framework): DependencyGroupState[] {
  return groups.filter((group) => group.default && compatible(group.frameworks, framework));
}

/** Lists the catalog groups and their package.json installation states. */
export function listDependencies(cwd: string, group?: string): DependencyGroupState[] {
  const declared = readProjectPackages(cwd);
  const groups = loadDependenciesCatalog().groups.map((entry) => ({
    ...entry,
    packages: entry.packages.map((pkg): DependencyState => {
      const installed = declared && Object.hasOwn(declared, pkg.name) ? declared[pkg.name]! : null;
      let state: DependencyState["state"] = "ok";
      if (installed === null) state = "missing";
      else if (isOutdated(installed, pkg.version)) state = "outdated";
      return { ...pkg, installed, state };
    }),
  }));
  return findGroups(groups, group);
}

function copiedComponentPackages(cwd: string, project: ProjectConfig): Set<string> {
  const required = new Set<string>();
  for (const item of listItems({ framework: project.framework })) {
    const root = resolve(cwd, project.paths[item.meta.targetRoot ?? "components"]);
    const isCopied = item.files.length && item.files.every(({ target }) => {
      if (isAbsolute(target) || win32.isAbsolute(target) || target.split(/[/\\]/).includes("..")) {
        throw error.config(`Invalid component file target "${target}".`, { target });
      }
      const path = resolve(root, target);
      try {
        return lstatSync(path, { throwIfNoEntry: false })?.isFile();
      } catch (cause) {
        throw classifyFsError(cause, ExitCode.CONFIG, `Failed to inspect ${path}`);
      }
    });
    if (!isCopied) continue;
    for (const spec of [...item.dependencies, ...item.devDependencies]) {
      const versionStart = spec.indexOf("@", 1);
      required.add(versionStart < 0 ? spec : spec.slice(0, versionStart));
    }
  }
  return required;
}

/** Checks selected groups and requirements of copied registry components. */
export function checkDependencies(cwd: string, group?: string): DependencyCheck {
  const project = resolveProject(cwd);
  const groups = listDependencies(cwd);
  const selected = group === undefined ? defaultGroups(groups, project.framework) : findGroups(groups, group);
  const packages = selected.flatMap((entry) => entry.packages);
  const missing = new Set(packages.filter((pkg) => pkg.state === "missing").map((pkg) => pkg.name));
  const outdated = new Set(packages.filter((pkg) => pkg.state === "outdated").map((pkg) => pkg.name));

  const required = copiedComponentPackages(cwd, project);
  if (required.size) {
    const declared = readProjectPackages(cwd);
    const states = new Map(groups.flatMap((entry) => entry.packages).map((pkg) => [pkg.name, pkg.state]));
    for (const name of required) {
      if (!declared || !Object.hasOwn(declared, name)) missing.add(name);
      else if (states.get(name) === "outdated") outdated.add(name);
    }
  }

  return { ok: !missing.size && !outdated.size, missing: [...missing], outdated: [...outdated] };
}

/** Resolves the override, the global preference, then the project's package manager. */
export function resolvePackageManager(cwd: string, override?: PackageManager): PackageManager {
  if (override !== undefined) return override;
  const preference = getPath(readSettings(), "deps.packageManager");
  if (preference === "auto") return resolveProject(cwd).packageManager;
  const manager = packageManagers.find((value) => value === preference);
  if (!manager) throw error.config("Invalid deps.packageManager setting.", { known: ["auto", ...packageManagers] });
  return manager;
}

/** Plans installs for missing defaults or explicitly requested groups and packages. */
export function planDependencyInstall(cwd: string, options: DependencyInstallOptions = {}): DependencyCommand[] {
  const groups = listDependencies(cwd);
  const names = options.names ?? [];
  const selected = new Map<string, DependencyState>();
  if (!names.length) {
    for (const group of defaultGroups(groups, resolveProject(cwd).framework)) {
      for (const pkg of group.packages) {
        if (pkg.state === "missing") selected.set(pkg.name, pkg);
      }
    }
  } else {
    const byGroup = new Map(groups.map((entry) => [entry.id, entry]));
    const byPackage = new Map(groups.flatMap((entry) => entry.packages).map((pkg) => [pkg.name, pkg]));
    for (const name of names) {
      const group = byGroup.get(name);
      if (group) {
        for (const pkg of group.packages) selected.set(pkg.name, pkg);
        continue;
      }
      const pkg = byPackage.get(name);
      if (!pkg) {
        throw error.notFound(`Unknown dependency group or package "${name}".`, {
          known: [...new Set([...byGroup.keys(), ...byPackage.keys()])],
        });
      }
      selected.set(pkg.name, pkg);
    }
  }

  if (!selected.size) return [];
  const manager = resolvePackageManager(cwd, options.packageManager);
  const packages = [...selected.values()];
  const plan: DependencyCommand[] = [];
  for (const dev of [false, true]) {
    const targets = packages.filter((pkg) => pkg.dev === dev).map(({ name, version }) => `${name}@${version}`);
    if (!targets.length) continue;
    plan.push({
      command: manager,
      args: [manager === "npm" ? "install" : "add", ...(dev ? ["-D"] : []), ...targets],
    });
  }
  return plan;
}

/** Executes the dependency plan in order and stops on the first failure. */
export async function executeDependencyPlan(cwd: string, plan: readonly DependencyCommand[], inherit = true): Promise<void> {
  for (const { command, args } of plan) {
    let code: number;
    try {
      ({ code } = await run(command, args, { cwd, inherit }));
    } catch {
      throw error.network(`Could not start ${command}.`, { command, args });
    }
    if (code !== 0) throw error.network(`${command} exited with code ${code}.`, { command, args, code });
  }
}
