/** Exercises Tailwind discovery, local imports, token resolution, contrast, and tool output. */
import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AppError } from "../src/app/errors.ts";
import { ExitCode } from "../src/app/exit-codes.ts";
import { themeCommand } from "../src/cli/commands/theme.ts";
import { forceColors } from "../src/cli/format.ts";
import { parse } from "../src/cli/parser.ts";
import { checkTheme, findThemeFile, readTheme, requiredThemeRoles, type ThemeCheck } from "../src/design/theme.ts";
import type { Catalog } from "../src/mcp/server.ts";
import { registerThemeTools } from "../src/mcp/tools/theme.ts";

const fixture = join(import.meta.dir, "fixtures", "theme");
const shadcn = join(fixture, "shadcn", "globals.css");
const split = join(fixture, "split", "globals.css");
const themeOnly = join(fixture, "theme-only.css");

function withProject(run: (cwd: string) => void): void {
  const directory = mkdtempSync(join(tmpdir(), "designfy-theme-"));
  try {
    run(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("discovers entry points in the specified search order and honors --file", () => withProject((cwd) => {
  const paths = ["assets/css/a.css", "src/styles/a.css", "src/app/nested/a.css", "src/index.css", "app/globals.css"];
  writeFileSync(join(cwd, "designfy.json"), JSON.stringify({ paths: { styles: "assets/css" } }));
  mkdirSync(join(cwd, "src/app/nested"), { recursive: true });
  mkdirSync(join(cwd, "src/styles"), { recursive: true });
  mkdirSync(join(cwd, "app"), { recursive: true });
  mkdirSync(join(cwd, "assets/css"), { recursive: true });
  writeFileSync(join(cwd, "assets/css/0.css"), '/* @import "tailwindcss"; */');
  for (const path of paths) writeFileSync(join(cwd, path), "@import 'tailwindcss' layer(theme);");
  expect(findThemeFile(cwd, themeOnly)).toBe(themeOnly);
  expect(findThemeFile(cwd, "app/globals.css")).toBe(join(cwd, "app/globals.css"));
  for (const path of paths) {
    expect(findThemeFile(cwd)).toBe(join(cwd, path));
    rmSync(join(cwd, path));
  }
  try {
    findThemeFile(cwd);
    throw new Error("Expected missing stylesheet");
  } catch (cause) {
    expect(cause).toBeInstanceOf(AppError);
    expect(cause).toMatchObject({ code: ExitCode.NOT_FOUND, details: { hint: "designfy components add designfy-theme" } });
    expect((cause as Error).message).toContain("designfy components add designfy-theme");
  }
  expect(() => readTheme(cwd, { file: "missing.css" })).toThrow("Theme stylesheet not found");
}));

test("resolves shadcn and Tailwind colors in both modes and groups the remaining tokens", () => {
  const theme = readTheme(fixture, { file: shadcn });
  const colors = Object.fromEntries(theme.colors.map((token) => [token.name, token]));
  expect(colors["--color-background"]).toEqual({
    name: "--color-background",
    light: { declared: "var(--background)", resolved: "#ffffff" },
    dark: { declared: "var(--background)", resolved: "#000000" },
  });
  expect(colors["--primary"]?.light?.resolved).toBe("#1f1f1f");
  expect(colors["--primary"]?.dark?.resolved).toBe("#e3e3e3");
  expect(colors["--muted-foreground"]?.dark?.resolved).toBe("#e6e6e6");
  expect(colors["--color-chain"]?.light?.resolved).toBe("#000000");
  expect(colors["--color-chain"]?.dark?.resolved).toBe("#ffffff");
  expect(colors["--color-mix-test"]?.light?.resolved).toBeNull();
  expect(theme.fonts[0]?.light?.resolved).toBe('"Example Sans", sans-serif');
  expect(theme.weights[0]?.light?.resolved).toBe("700");
  expect(theme.text[0]?.lineHeight?.dark?.resolved).toBe("1.25rem");
  expect(theme.text).toHaveLength(1);
  expect(theme.radius.find(({ name }) => name === "--radius-lg")?.light?.resolved).toBe(".625rem");
  expect(theme.spacing.map(({ name }) => name)).toEqual(["--spacing", "--spacing-card"]);
  expect(theme.shadows[0]?.name).toBe("--shadow-sm");
  expect(theme.breakpoints[0]?.name).toBe("--breakpoint-xl");
  expect(theme.motion.tokens.map(({ name }) => name)).toEqual(["--ease-in", "--animate-in", "--duration-in"]);
  expect(theme.motion.keyframes).toEqual(["enter"]);
  expect(theme.other.find(({ name }) => name === "--inline-block")?.light?.resolved).toBe("calc(2 * .25rem)");
  expect(theme.other.find(({ name }) => name === "--opaque")?.light?.resolved).toBe('"literal; { brace } var(--unknown)"');
});

test("follows local imports once per active chain and recognizes dark media and data attributes", () => {
  const theme = readTheme(fixture, { file: split });
  expect(theme.files.map((file) => file.slice(fixture.length + 1))).toEqual(["split/globals.css", "split/tokens.css", "split/type.css"]);
  expect(theme.colors.find(({ name }) => name === "--background")?.dark?.resolved).toBe("#111111");
  expect(theme.colors.find(({ name }) => name === "--foreground")?.dark?.resolved).toBe("#101010");
  expect(theme.colors.find(({ name }) => name === "--color-dark-only")).toMatchObject({
    light: null, dark: { resolved: "#112233" },
  });
  expect(theme.fonts[0]?.light?.resolved).toBe('"Test"');
  expect(theme.motion.keyframes).toEqual(["leave"]);
  withProject((cwd) => {
    mkdirSync(join(cwd, "src/styles"), { recursive: true });
    writeFileSync(join(cwd, "src/styles/globals.css"), '@import "./tokens.css";');
    writeFileSync(join(cwd, "src/styles/tokens.css"), '@import "tailwindcss";');
    expect(findThemeFile(cwd)).toBe(join(cwd, "src/styles/globals.css"));
  });
});

test("measures each of the seven contrast pairs in both modes and checks required roles", () => {
  const passing = checkTheme(readTheme(fixture, { file: shadcn }), { requiredRoles: ["--color-background"] });
  expect(passing.ok).toBe(true);
  expect(passing.summary).toEqual({ passed: 14, failed: 0, missing: 0, unresolved: 0 });
  expect(passing.contrast[0]?.ratio).toBeCloseTo(21);
  const failing = checkTheme(readTheme(fixture, { file: split }), { requiredRoles: ["ring", "dark-only"] });
  expect(failing.ok).toBe(false);
  expect(failing.contrast).toContainEqual({
    mode: "dark", foreground: "foreground", background: "background", ratio: expect.any(Number), status: "fail",
  });
  expect(failing.missingRoles).toEqual([{ role: "ring", modes: ["light", "dark"] }, { role: "dark-only", modes: ["light"] }]);
  expect(checkTheme(readTheme(fixture, { file: themeOnly })).summary.passed).toBe(2);
});

test("checks token roles used by registry components in the selected framework", () => withProject((cwd) => {
  writeFileSync(join(cwd, "package.json"), JSON.stringify({ dependencies: { astro: "1" } }));
  const registry = (content: string) => ({
    items: [{
      name: "example", type: "registry:component", title: "Example", description: "Example.",
      categories: [], dependencies: [], devDependencies: [], registryDependencies: [],
      files: [{ content, path: "example.tsx", target: "example.tsx", type: "registry:component" }],
      meta: { motion: false, surface: "both" },
    }],
  });
  const path = join(cwd, "registry.json");
  writeFileSync(path, JSON.stringify({
    astro: registry('<div class="bg-background font-heading rounded-lg text-foreground/80" />'),
    react: registry('<div className="text-accent" />'),
  }));
  const saved = process.env.DESIGNFY_REGISTRY_FILE;
  process.env.DESIGNFY_REGISTRY_FILE = path;
  try {
    const roles = requiredThemeRoles(cwd);
    expect(roles).toEqual(["background", "font-heading", "foreground", "radius-lg"]);
    const result = checkTheme(readTheme(cwd, { file: shadcn }), { requiredRoles: roles });
    expect(result.ok).toBe(false);
    expect(result.missingRoles).toEqual([{ role: "font-heading", modes: ["light", "dark"] }]);
  } finally {
    if (saved === undefined) delete process.env.DESIGNFY_REGISTRY_FILE;
    else process.env.DESIGNFY_REGISTRY_FILE = saved;
  }
}));

function runTheme(args: string[]) {
  const { command, path, options } = parse({ name: "designfy", description: "Test", subcommands: [themeCommand] }, ["theme", ...args]);
  return command.run!({ args: [], options, path, json: options.json === true, interactive: false, stdout() {}, stderr() {} });
}

test("filters CLI groups, prints truecolor swatches, and reports failed checks as exit 10", async () => {
  try {
    forceColors(true);
    const result = await runTheme(["show", "--file", themeOnly, "--group", "colors"]);
    expect(result.data).toEqual({ file: themeOnly, files: [themeOnly], colors: expect.any(Array) });
    const render = result.text as () => string;
    expect(render()).toContain("\u001b[48;2;170;187;204m  \u001b[0m");
    forceColors(false);
    expect(render()).not.toContain("\u001b");
    expect(render()).toContain("#abc → #aabbcc");
    try {
      await runTheme(["check", "--file", split]);
      throw new Error("Expected the failing check to throw.");
    } catch (cause) {
      expect(cause).toMatchObject({ code: ExitCode.CHECK_FAILED, details: { summary: { failed: 1 } } });
    }
  } finally {
    forceColors(undefined);
  }
});

test("registers read-only theme tools and marks failing checks in the MCP response", async () => {
  const server = new McpServer({ name: "theme-test", version: "1.0.0" });
  const client = new Client({ name: "theme-test-client", version: "1.0.0" });
  const catalog: Catalog = { name: "test", version: "1.0.0", tools: [], resources: [], prompts: [] };
  registerThemeTools({ server, catalog });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  try {
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    expect((await client.listTools()).tools.map(({ name, annotations }) => [name, annotations?.readOnlyHint]))
      .toEqual([["theme_show", true], ["theme_check", true]]);
    const shown = await client.callTool({ name: "theme_show", arguments: { file: shadcn, group: "motion" } });
    expect(shown.isError).toBeUndefined();
    expect(shown.structuredContent).toMatchObject({ motion: { keyframes: ["enter"] } });
    const checked = await client.callTool({ name: "theme_check", arguments: { file: split } });
    expect(checked.isError).toBe(true);
    expect((checked.structuredContent as ThemeCheck).summary.failed).toBe(1);
    const missing = await client.callTool({ name: "theme_show", arguments: { file: join(fixture, "missing.css") } });
    expect(missing.isError).toBe(true);
    const errors = missing.content as Array<{ text: string }>;
    expect(JSON.parse(errors[0]!.text)).toMatchObject({ error: { code: ExitCode.NOT_FOUND } });
  } finally {
    await client.close();
    await server.close();
  }
});
