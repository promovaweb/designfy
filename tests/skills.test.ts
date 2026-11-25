/** Checks skill catalog, lockfile precedence and runner-driven operations. */
import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ExitCode } from "../src/app/exit-codes.ts";
import { HOME_VARIABLE } from "../src/config/paths.ts";
import { loadMcpCatalog, loadSkillsCatalog } from "../src/design/catalog.ts";
import { resetRunner, setRunner } from "../src/design/exec.ts";
import {
  executeSkillPlan,
  listSkills,
  planSkillInstall,
  planSkillRemove,
  planSkillUpdate,
} from "../src/design/skills.ts";

const variables = ["DESIGNFY_HOME_DIR", "DESIGNFY_CATALOG_DIR", HOME_VARIABLE];
let originalEnv: Array<string | undefined>;
let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "designfy-skills-"));
  originalEnv = variables.map((key) => process.env[key]);
  process.env.DESIGNFY_HOME_DIR = dir;
  process.env[HOME_VARIABLE] = dir;
  delete process.env.DESIGNFY_CATALOG_DIR;
});

afterEach(() => {
  resetRunner();
  variables.forEach((key, index) => {
    const value = originalEnv[index];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  });
  rmSync(dir, { recursive: true, force: true });
});

function put(file: string, value: unknown): void {
  writeFileSync(join(dir, file), JSON.stringify(value));
}

test("lists embedded skills and detects project, global, aggregate and absent entries", () => {
  mkdirSync(join(dir, ".agents"));
  put("skills-lock.json", { skills: { designfy: {}, shadcn: {} } });
  put(".agents/.skill-lock.json", {
    skills: { designfy: {}, hallmark: {}, "astrofy-page-design": { source: "https://github.com/promovaweb/astrofy.git" } },
  });
  const skills = Object.fromEntries(listSkills(dir).map(({ name, installed }) => [name, installed]));
  expect(skills).toMatchObject({
    designfy: "project", shadcn: "project", hallmark: "global", astrofy: "global", specsfy: "no", brandfy: "no",
  });
  expect(loadSkillsCatalog().skills.find(({ name }) => name === "specsfy")).toMatchObject({
    kind: "external", source: "promovaweb/specsfy", default: false, all: true,
    description: expect.stringContaining("specsfy-specialist-interface"),
  });
  expect(listSkills(dir, { internal: true }).every(({ kind }) => kind === "internal")).toBe(true);
  expect(listSkills(dir, { external: true }).map(({ name }) => name)).toContain("hallmark");
  expect(loadMcpCatalog().servers.map(({ id }) => id)).toContain("designfy");
});

test("validates the runtime catalog override on each load", () => {
  const skill = loadSkillsCatalog().skills[0]!;
  process.env.DESIGNFY_CATALOG_DIR = dir;
  put("skills.json", { schemaVersion: 1, skills: [{ ...skill, name: "test-skill" }] });
  expect(listSkills(dir).map(({ name }) => name)).toEqual(["test-skill"]);

  put("skills.json", { schemaVersion: 2, skills: [] });
  expect(() => loadSkillsCatalog()).toThrow(expect.objectContaining({ code: ExitCode.CONFIG }));
});

test("plans compatible defaults, groups sources and validates explicit selections", () => {
  put("package.json", { dependencies: { astro: "^5" } });
  const defaults = planSkillInstall(dir, { external: true });
  expect(defaults.map(({ args }) => args[3])).toEqual(["nutlope/hallmark", "shadcn/ui"]);

  put("settings.json", { skills: { source: "example/designfy", agents: "codex,opencode" } });
  const plan = planSkillInstall(dir, {
    names: ["designfy", "designfy-motion", "astrofy", "shadcn", "migrate-radix-to-base"],
    agents: ["claude-code", "codex"],
    global: true,
  });
  expect(plan).toEqual([
    { command: "npx", args: ["-y", "skills", "add", "example/designfy", "--skill", "designfy", "--skill", "designfy-motion", "-a", "claude-code", "-a", "codex", "-y", "-g"] },
    { command: "npx", args: ["-y", "skills", "add", "shadcn/ui", "--skill", "shadcn", "--skill", "migrate-radix-to-base", "-a", "claude-code", "-a", "codex", "-y", "-g"] },
    { command: "npx", args: ["-y", "skills", "add", "promovaweb/astrofy", "--skill", "*", "-a", "claude-code", "-a", "codex", "-y", "-g"] },
  ]);
  expect(planSkillInstall(dir, { all: true, external: true }).map(({ args }) => args[3])).toContain("promovaweb/brandfy");
  expect(() => planSkillInstall(dir, { names: ["unknown"] })).toThrow(expect.objectContaining({
    code: ExitCode.NOT_FOUND, details: { known: expect.arrayContaining(["designfy"]) },
  }));
});

test("executes update and remove vectors and stops after a failed command", async () => {
  const observed: { command: string; args: string[]; cwd?: string; inherit?: boolean }[] = [];
  setRunner(async (command, args, options) => {
    observed.push({ command, args, ...options });
    return { code: args.includes("remove") ? 17 : 0, stdout: "", stderr: "" };
  });
  const update = planSkillUpdate(["designfy"]);
  const remove = planSkillRemove(["designfy-motion"]);
  expect(planSkillUpdate([], true)[0]!.args).toEqual(["-y", "skills", "update", "-y", "-g"]);
  await expect(executeSkillPlan(dir, [...update, ...remove, ...update])).rejects.toMatchObject({
    code: ExitCode.NETWORK_OR_API, details: { ...remove[0], code: 17 },
  });
  expect(observed).toEqual([
    { command: "npx", args: ["-y", "skills", "update", "designfy", "-y", "-p"], cwd: dir, inherit: true },
    { command: "npx", args: ["-y", "skills", "remove", "designfy-motion", "-y"], cwd: dir, inherit: true },
  ]);
});
