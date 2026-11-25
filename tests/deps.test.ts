/** Checks dependency state, registry requirements and package manager plans. */
import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ExitCode } from "../src/app/exit-codes.ts";
import { HOME_VARIABLE } from "../src/config/paths.ts";
import { checkDependencies, executeDependencyPlan, listDependencies, planDependencyInstall } from "../src/design/deps.ts";
import type { DependencyCommand } from "../src/design/deps.ts";
import { resetRunner, setRunner } from "../src/design/exec.ts";

const variables = ["DESIGNFY_REGISTRY_FILE", "DESIGNFY_CATALOG_DIR", HOME_VARIABLE];
let originalEnv: Array<string | undefined>;
let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "designfy-deps-"));
  originalEnv = variables.map((key) => process.env[key]);
  delete process.env.DESIGNFY_REGISTRY_FILE;
  process.env.DESIGNFY_CATALOG_DIR = dir;
  process.env[HOME_VARIABLE] = dir;

  const pkg = (name: string, dev = false) => ({ name, version: "^4.2.0", dev, purpose: name, url: "https://example.com" });
  put("dependencies.json", {
    schemaVersion: 1,
    groups: [
      { id: "core", title: "Core", description: "Core packages.", frameworks: [], default: true, packages: [pkg("example"), pkg("example-dev", true)] },
      { id: "astro", title: "Astro", description: "Astro packages.", frameworks: ["astro"], default: true, packages: [pkg("astro-only")] },
      { id: "charts", title: "Charts", description: "Chart packages.", frameworks: [], default: false, packages: [pkg("charts")] },
    ],
  });
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

test("recognizes missing, older major, compatible and newer package ranges", () => {
  put("package.json", { dependencies: { example: "^3.9.0", charts: "~5.1.0" } });
  const [core] = listDependencies(dir, "core");
  expect(core?.packages).toMatchObject([
    { name: "example", version: "^4.2.0", installed: "^3.9.0", state: "outdated" },
    { name: "example-dev", installed: null, state: "missing" },
  ]);
  expect(checkDependencies(dir)).toEqual({ ok: false, missing: ["example-dev"], outdated: ["example"] });
  expect(checkDependencies(dir, "charts").ok).toBe(true);

  put("package.json", { dependencies: { example: "^3.9.0 || ^4.0.1" }, devDependencies: { "example-dev": ">=3" } });
  expect(checkDependencies(dir)).toEqual({ ok: true, missing: [], outdated: [] });
  put("package.json", { dependencies: { example: "<4.0.0" } });
  expect(checkDependencies(dir).outdated).toEqual(["example"]);
  expect(() => listDependencies(dir, "absent")).toThrow(expect.objectContaining({ code: ExitCode.NOT_FOUND }));
});

test("includes noncatalog dependencies of copied registry components in a check", () => {
  put("package.json", { dependencies: { example: "^4.2.0", "example-dev": "^4.2.0" } });
  const item = {
    name: "example-panel", type: "registry:component", title: "Example", description: "A test item.",
    categories: [], dependencies: ["@example/extra@^2"], devDependencies: ["example-extra-dev"], registryDependencies: [],
    files: [{ path: "registry/example.tsx", type: "registry:component", target: "example.tsx", content: "" }],
    meta: { motion: false, surface: "both" },
  };
  put("registry.json", { react: { items: [item] }, astro: { items: [] } });
  process.env.DESIGNFY_REGISTRY_FILE = join(dir, "registry.json");
  expect(checkDependencies(dir, "core").ok).toBe(true);

  put("designfy.json", { paths: { components: "components" } });
  mkdirSync(join(dir, "components"));
  put("components/example.tsx", "present");
  expect(checkDependencies(dir, "core")).toEqual({
    ok: false, missing: ["@example/extra", "example-extra-dev"], outdated: [],
  });
});

test("plans only missing compatible defaults, with separate runtime and development installs", () => {
  put("package.json", { dependencies: { astro: "^5", example: "^3.9.0" } });
  put("yarn.lock", {});
  const plan = planDependencyInstall(dir);
  expect(plan).toEqual([
    { command: "yarn", args: ["add", "astro-only@^4.2.0"] },
    { command: "yarn", args: ["add", "-D", "example-dev@^4.2.0"] },
  ]);

  put("settings.json", { deps: { packageManager: "pnpm" } });
  expect(planDependencyInstall(dir, { names: ["charts"] })).toEqual([
    { command: "pnpm", args: ["add", "charts@^4.2.0"] },
  ]);
  expect(planDependencyInstall(dir, { names: ["core", "example"], packageManager: "npm" })).toEqual([
    { command: "npm", args: ["install", "example@^4.2.0"] },
    { command: "npm", args: ["install", "-D", "example-dev@^4.2.0"] },
  ]);
  expect(() => planDependencyInstall(dir, { names: ["not-a-package"] })).toThrow(expect.objectContaining({ code: ExitCode.NOT_FOUND }));
});

test("executes each planned package manager command and reports a launch failure", async () => {
  const plan = planDependencyInstall(dir, { names: ["core"], packageManager: "bun" });
  const observed: DependencyCommand[] = [];
  setRunner(async (command, args, { cwd, inherit }) => {
    expect(cwd).toBe(dir);
    expect(inherit).toBe(true);
    observed.push({ command: command as DependencyCommand["command"], args });
    return { code: 0, stdout: "", stderr: "" };
  });
  await executeDependencyPlan(dir, plan);
  expect(observed).toEqual(plan);

  setRunner(async () => { throw new Error("command not found"); });
  await expect(executeDependencyPlan(dir, plan)).rejects.toMatchObject({
    code: ExitCode.NETWORK_OR_API, details: plan[0],
  });
});
