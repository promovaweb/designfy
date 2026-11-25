/** Reads skill lockfiles and plans and executes Skills CLI operations. */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { z } from "zod";
import { classifyFsError, error } from "../app/errors.ts";
import { ExitCode } from "../app/exit-codes.ts";
import { getPath, readSettings } from "../config/settings.ts";
import { loadSkillsCatalog, skillSchema } from "./catalog.ts";
import { run } from "./exec.ts";
import { resolveProject } from "./project.ts";

export const skillStateSchema = skillSchema.extend({
  installed: z.enum(["project", "global", "no"]),
});

export type SkillState = z.infer<typeof skillStateSchema>;
export interface SkillFilters {
  internal?: boolean;
  external?: boolean;
}

export interface SkillInstallOptions extends SkillFilters {
  names?: readonly string[];
  all?: boolean;
  agents?: readonly string[];
  global?: boolean;
}

export interface SkillCommand {
  command: string;
  args: string[];
}

const lockSchema = z.object({ skills: z.record(z.string(), z.unknown()) });
const lockEntrySchema = z.object({ source: z.string() });
type SkillLock = z.infer<typeof lockSchema>["skills"];

function readSkillLock(path: string): SkillLock {
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch (cause) {
    if ((cause as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw classifyFsError(cause, ExitCode.CONFIG, `Failed to read ${path}`);
  }
  try {
    return lockSchema.parse(JSON.parse(raw)).skills;
  } catch {
    throw error.config(`Invalid skill lockfile at ${path}.`, { path });
  }
}

function normalizeSource(source: string): string {
  return source.replace(/^(?:https?:\/\/github\.com\/|git@github\.com:)/, "").replace(/(?:\.git)?\/$|\.git$/, "");
}

function matchesInstallation(lock: SkillLock, skill: { name: string; source: string; all?: boolean }): boolean {
  if (Object.hasOwn(lock, skill.name)) return true;
  if (!skill.all) return false;

  const source = normalizeSource(skill.source);
  return Object.values(lock).some((value) => {
    const entry = lockEntrySchema.safeParse(value);
    return entry.success && normalizeSource(entry.data.source) === source;
  });
}

function matchesKind(kind: "internal" | "external", filters: SkillFilters): boolean {
  if (Boolean(filters.internal) === Boolean(filters.external)) return true;
  return kind === (filters.internal ? "internal" : "external");
}

function validatePositionals(values: readonly string[], label: string): void {
  if (values.some((value) => !value.trim() || value.startsWith("-"))) {
    throw error.usage(`Invalid ${label}.`);
  }
}

/** Lists catalog skills and their installation scope. */
export function listSkills(cwd: string, filters: SkillFilters = {}): SkillState[] {
  const project = readSkillLock(join(cwd, "skills-lock.json"));
  const global = readSkillLock(join(process.env.DESIGNFY_HOME_DIR || homedir(), ".agents", ".skill-lock.json"));
  return loadSkillsCatalog().skills
    .filter((skill) => matchesKind(skill.kind, filters))
    .map((skill) => ({
      ...skill,
      installed: matchesInstallation(project, skill) ? "project" : matchesInstallation(global, skill) ? "global" : "no",
    }));
}

/** Plans one Skills CLI add command per selected source. */
export function planSkillInstall(cwd: string, options: SkillInstallOptions = {}): SkillCommand[] {
  const { skills } = loadSkillsCatalog();
  const names = options.names ?? [];
  const known = skills.map((skill) => skill.name);
  const unknown = names.filter((name) => !known.includes(name));
  if (unknown.length) throw error.notFound(`Unknown skill(s): ${unknown.join(", ")}.`, { known });

  const framework = names.length || options.all ? undefined : resolveProject(cwd).framework;
  const selected = skills.filter((skill) => {
    if (!matchesKind(skill.kind, options)) return false;
    if (names.length) return names.includes(skill.name);
    if (options.all) return true;
    return skill.default && (!skill.frameworks.length || (framework !== undefined && skill.frameworks.includes(framework)));
  });

  if (!selected.length) return [];
  const settings = readSettings();
  const sourceOverride = getPath(settings, "skills.source");
  const agentSetting = getPath(settings, "skills.agents");
  const agents = options.agents ?? (typeof agentSetting === "string" ? agentSetting.split(",").map((agent) => agent.trim()).filter(Boolean) : []);
  if (!agents.length) throw error.config("Configure at least one agent in skills.agents or use --agent.");
  validatePositionals(agents, "agent name");
  const bySource = new Map<string, string[]>();
  for (const skill of selected) {
    const source = skill.kind === "internal" ? sourceOverride : skill.source;
    if (typeof source !== "string" || !source.trim() || source.startsWith("-")) {
      throw error.config("The skill source must be a nonempty repository reference.");
    }
    if (!skill.all) validatePositionals([skill.name], "skill name");
    const sourceSkills = bySource.get(source) ?? [];
    sourceSkills.push(skill.all ? "*" : skill.name);
    bySource.set(source, sourceSkills);
  }

  return Array.from(bySource, ([source, names]) => ({
    command: "npx",
    args: [
      "-y", "skills", "add", source,
      ...(names.includes("*") ? ["--skill", "*"] : names.flatMap((name) => ["--skill", name])),
      ...Array.from(new Set(agents)).flatMap((agent) => ["-a", agent]),
      "-y",
      ...(options.global ? ["-g"] : []),
    ],
  }));
}

/** Plans a project or global Skills CLI update. */
export function planSkillUpdate(names: readonly string[] = [], global = false): SkillCommand[] {
  validatePositionals(names, "skill name");
  return [{ command: "npx", args: ["-y", "skills", "update", ...names, "-y", global ? "-g" : "-p"] }];
}

/** Plans a Skills CLI removal from the project. */
export function planSkillRemove(names: readonly string[]): SkillCommand[] {
  if (!names.length) throw error.usage("Specify at least one skill to remove.");
  validatePositionals(names, "skill name");
  return [{ command: "npx", args: ["-y", "skills", "remove", ...names, "-y"] }];
}

/** Executes the plan in order and stops on the first failed command. */
export async function executeSkillPlan(cwd: string, plan: readonly SkillCommand[], inherit = true): Promise<void> {
  for (const { command, args } of plan) {
    let code: number;
    try {
      ({ code } = await run(command, args, { cwd, inherit }));
    } catch {
      throw error.network("Could not start the Skills CLI.", { command, args });
    }
    if (code !== 0) throw error.network(`The Skills CLI exited with code ${code}.`, { command, args, code });
  }
}
