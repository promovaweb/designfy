/** Tests registry selection, dependency order, and component copies using isolated fixtures. */
import { afterEach, beforeEach, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ExitCode } from "../src/app/exit-codes.ts";
import { applyAdd, countCopiedComponents, getItem, listItems, planAdd, resolveItems, type EmbeddedRegistry, type RegistryItem } from "../src/design/registry.ts";

let cwd: string;
let previousOverride: string | undefined;

beforeEach(() => {
  cwd = mkdtempSync(join(tmpdir(), "designfy-components-"));
  previousOverride = process.env.DESIGNFY_REGISTRY_FILE;
  delete process.env.DESIGNFY_REGISTRY_FILE;
});

afterEach(() => {
  if (previousOverride === undefined) delete process.env.DESIGNFY_REGISTRY_FILE;
  else process.env.DESIGNFY_REGISTRY_FILE = previousOverride;
  rmSync(cwd, { recursive: true, force: true });
});

function item(name: string, dependencies: string[] = []): RegistryItem {
  return {
    name,
    type: "registry:component",
    title: name,
    description: `Fixture for ${name}.`,
    categories: ["fixtures"],
    dependencies: [],
    devDependencies: [],
    registryDependencies: dependencies,
    meta: { motion: false, surface: "site" },
    files: [{
      type: "registry:component",
      path: `fixtures/${name}.ts`,
      target: `${name}.ts`,
      content: 'export { cn } from "@designfy/components/lib/cn";\n',
    }],
  };
}

function useRegistry(items: RegistryItem[]): void {
  const registry: EmbeddedRegistry = { react: { items }, astro: { items: [] } };
  const file = join(cwd, "registry.json");
  writeFileSync(file, JSON.stringify(registry));
  process.env.DESIGNFY_REGISTRY_FILE = file;
}

test("embedded registries select framework, category and surface", () => {
  for (const framework of ["next", "react-vite", "react", "unknown"] as const) {
    expect(listItems({ framework, category: "utilities", surface: "system" }).map(({ name }) => name)).toContain("cn");
  }
  expect(listItems({ framework: "astro", category: "utilities" }).map(({ name }) => name)).toContain("cn");
  expect(getItem("cn").files[0]?.content).toContain("twMerge");
  expect(getItem("designfy-theme", "astro").meta.targetRoot).toBe("styles");
  expect(() => getItem("missing", "astro")).toThrow(expect.objectContaining({
    code: ExitCode.NOT_FOUND,
    details: { known: expect.arrayContaining(["designfy-theme"]) },
  }));
});

test("copies foundation items to their component and style roots", () => {
  writeFileSync(join(cwd, "package.json"), JSON.stringify({ dependencies: { react: "*", clsx: "*" } }));
  const react = applyAdd(planAdd(cwd, ["cn"]));
  expect(react.configured).toBe(false);
  expect(react.written).toEqual([join(cwd, "src/components/designfy/lib/cn.ts")]);
  expect(react.missingDependencies).toEqual(["tailwind-merge"]);
  expect(countCopiedComponents(cwd)).toBe(1);

  writeFileSync(join(cwd, "designfy.json"), JSON.stringify({ framework: "astro", paths: { styles: "custom/styles" } }));
  const astro = applyAdd(planAdd(cwd, ["designfy-theme"]));
  expect(astro.configured).toBe(true);
  expect(astro.written).toEqual([join(cwd, "custom/styles/designfy-theme.css")]);
  expect(countCopiedComponents(cwd)).toBe(2);
});

test("resolves dependencies depth first once and rejects cycles before planning a write", () => {
  useRegistry([
    item("page", ["nav", "footer", "shadcn:button", "reui:alert"]),
    item("nav", ["base"]),
    item("footer", ["base"]),
    item("base"),
    item("loop", ["loop2"]),
    item("loop2", ["loop"]),
  ]);
  expect(resolveItems(["page", "base"]).map(({ name }) => name)).toEqual(["base", "nav", "footer", "page"]);
  expect(planAdd(cwd, ["page"]).shadcnItems).toEqual(["button", "@reui/alert"]);
  expect(() => planAdd(cwd, ["loop"])).toThrow(expect.objectContaining({
    code: ExitCode.CONFIG,
    details: { cycle: ["loop", "loop2", "loop"] },
  }));
  expect(existsSync(join(cwd, "src"))).toBe(false);
});

test("predicts writes, substitutes aliases, preserves existing content and supports overwrite", () => {
  const card = item("card");
  card.dependencies = ["clsx", "@scope/runtime@^1"];
  card.devDependencies = ["@scope/tool@^2", "clsx"];
  useRegistry([card]);
  writeFileSync(join(cwd, "designfy.json"), JSON.stringify({
    paths: { components: "ui" },
    aliases: { components: "$&/ui" },
  }));
  writeFileSync(join(cwd, "package.json"), JSON.stringify({ dependencies: { "@scope/runtime": "^1" } }));

  const path = join(cwd, "ui/card.ts");
  const plan = planAdd(cwd, ["card"]);
  expect(applyAdd(plan, { dryRun: true })).toMatchObject({
    dryRun: true,
    written: [path],
    missingDependencies: ["clsx"],
    missingDevDependencies: ["@scope/tool@^2"],
  });
  expect(existsSync(join(cwd, "ui"))).toBe(false);
  expect(applyAdd(plan).written).toEqual([path]);
  expect(readFileSync(path, "utf8")).toBe('export { cn } from "$&/ui/lib/cn";\n');
  expect(applyAdd(plan).unchanged).toEqual([path]);

  writeFileSync(path, "custom");
  expect(applyAdd(plan).skipped).toEqual([path]);
  expect(readFileSync(path, "utf8")).toBe("custom");
  expect(applyAdd(planAdd(cwd, ["card"], { overwrite: true })).written).toEqual([path]);
  expect(readFileSync(path, "utf8")).toContain("$&/ui");
  expect(applyAdd(planAdd(cwd, ["card"], { path: "other" })).written).toEqual([join(cwd, "other/card.ts")]);
});

test("rejects escaping registry targets and symlink destinations", () => {
  const card = item("card");
  card.files[0]!.target = "../outside.ts";
  useRegistry([card]);
  expect(() => planAdd(cwd, ["card"], { path: "ui" })).toThrow(expect.objectContaining({ code: ExitCode.CONFIG }));

  card.files[0]!.target = "redirect/card.ts";
  useRegistry([card]);
  mkdirSync(join(cwd, "ui"));
  mkdirSync(join(cwd, "outside"));
  symlinkSync(join(cwd, "outside"), join(cwd, "ui/redirect"), "junction");
  expect(() => planAdd(cwd, ["card"], { path: "ui" })).toThrow(expect.objectContaining({ code: ExitCode.PERMISSION }));
  expect(existsSync(join(cwd, "outside/card.ts"))).toBe(false);
});
