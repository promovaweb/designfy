/** Exercises the public Designfy MCP tools through the real stdio entry point. */
import { afterAll, beforeAll, expect, test } from "bun:test";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ExitCode } from "../src/app/exit-codes.ts";
import { manifest } from "../src/app/manifest.ts";
import { HOME_VARIABLE } from "../src/config/paths.ts";

const repo = join(import.meta.dir, "..");
const fixtures = join(import.meta.dir, "fixtures/viewspec");
const screen = "viewspec/0002-dashboard-de-vendas/VIEWSPEC.md";
const theme = "src/styles/globals.css";
const components = "src/design-components";
const capture = ".designfy/captures/review";
const writeTools = ["capture_run", "components_add"];
const requestOptions = { timeout: 30_000 };

let project: string;
let settings: string;
let client: Client;

function put(file: string, contents: string | object) {
  const path = join(project, file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, typeof contents === "string" ? contents : JSON.stringify(contents));
}

function createProject() {
  put("package.json", {
    name: "designfy-mcp-fixture",
    dependencies: { react: "^19", vite: "^8", tailwindcss: "^4", "@tailwindcss/vite": "^4" },
  });
  put("designfy.json", { schemaVersion: 1, paths: { components, styles: dirname(theme) } });
  put(theme, `
    @import "tailwindcss";
    :root { --background: #fff; --foreground: #000; }
    .dark { --background: #000; }
    @theme inline {
      --color-background: var(--background);
      --color-foreground: var(--foreground);
    }
  `);
  mkdirSync(join(project, dirname(screen)), { recursive: true });
  copyFileSync(join(fixtures, "guide-valid/VIEWSPEC.md"), join(project, "VIEWSPEC.md"));
  copyFileSync(join(fixtures, "screen-valid", screen), join(project, screen));
  put(".mcp.json", { mcpServers: { designfy: { command: "designfy", args: ["mcp"] } } });

  const url = "https://example.test/";
  put(join(capture, "manifest.json"), {
    name: "review", createdAt: "2026-11-24T09:00:00Z", outDir: join(project, capture),
    urls: [url], theme: "light", fullPage: true, reducedMotion: false, waitMs: 0,
    viewports: [{ name: "mobile", width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true }],
    shots: [{ url, viewport: "mobile", file: "example-test--mobile.png", consoleErrors: [], pageErrors: [] }],
    errors: [],
  });
}

async function connect(readOnly = false) {
  const sdk = new Client({ name: "designfy-stdio-test", version: "1.0.0" });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["run", join(repo, "src/main.ts"), "mcp", ...(readOnly ? ["--read-only"] : [])],
    cwd: project,
    env: {
      [HOME_VARIABLE]: settings,
      DESIGNFY_HOME_DIR: settings,
      DESIGNFY_CATALOG_DIR: "",
      DESIGNFY_REGISTRY_FILE: "",
      NO_COLOR: "1",
    },
    stderr: "pipe",
  });

  let stderr = "";
  transport.stderr?.on("data", (chunk: Buffer) => {
    stderr = (stderr + chunk.toString()).slice(-4096);
  });
  try {
    await sdk.connect(transport, requestOptions);
    return sdk;
  } catch (cause) {
    await sdk.close();
    throw new Error(`Could not start Designfy MCP over stdio.\n${stderr}`, { cause });
  }
}

beforeAll(async () => {
  project = realpathSync(mkdtempSync(join(tmpdir(), "designfy-mcp-")));
  settings = join(project, "settings");
  mkdirSync(settings, { mode: 0o700 });
  createProject();
  client = await connect();
}, 45_000);

afterAll(async () => {
  try {
    await client?.close();
  } finally {
    if (project) rmSync(project, { recursive: true, force: true });
  }
}, 10_000);

function documentedTools() {
  const docs = readFileSync(join(repo, "docs/mcp.md"), "utf8");
  const [, tools] = /^## Tools\r?\n([\s\S]*?)^## /m.exec(docs) ?? [];
  return [...(tools ?? "").matchAll(/^\| `([a-z_]+)` \|/gm)].map(([, name]) => name!).sort();
}

function textOf(content: unknown) {
  expect(content).toEqual([expect.objectContaining({ type: "text", text: expect.any(String) })]);
  return (content as [{ text: string }])[0].text;
}

function call(name: string, args: Record<string, unknown> = {}) {
  return client.callTool({ name, arguments: args }, undefined, requestOptions);
}

async function structured(name: string, args: Record<string, unknown> = {}, isError = false) {
  const result = await call(name, args);
  const text = textOf(result.content);
  if (Boolean(result.isError) !== isError) {
    throw new Error(`${name} returned unexpected isError=${result.isError}: ${text}`);
  }
  expect(result.structuredContent).toEqual(expect.any(Object));
  expect(JSON.parse(text)).toEqual(result.structuredContent);
  return result.structuredContent as Record<string, unknown>;
}

test.each([{ readOnly: false }, { readOnly: true }])("matches the documented tool set and contracts (read-only: $readOnly)", async ({ readOnly }) => {
  const sdk = readOnly ? await connect(true) : client;
  try {
    const { tools, nextCursor } = await sdk.listTools({}, requestOptions);
    const documented = documentedTools();
    expect(documented).toHaveLength(30);
    expect(nextCursor).toBeUndefined();
    expect(tools.map(({ name }) => name).sort()).toEqual(readOnly
      ? documented.filter((name) => !writeTools.includes(name))
      : documented);

    for (const { name, description, inputSchema, annotations } of tools) {
      expect({ name, description }).toMatchObject({ description: expect.stringMatching(/\S/) });
      expect(inputSchema.type).toBe("object");
      for (const [property, schema] of Object.entries(inputSchema.properties ?? {})) {
        const field = schema as { description?: string };
        expect({ name, property, description: field.description }).toMatchObject({ description: expect.stringMatching(/\S/) });
      }
      expect({ name, readOnlyHint: annotations?.readOnlyHint }).toEqual({
        name, readOnlyHint: !writeTools.includes(name),
      });
    }
  } finally {
    if (readOnly) await sdk.close();
  }
}, 75_000);

test("reads the inherited diagnostics, identity, documentation, settings and vault tools", async () => {
  expect(await structured("doctor")).toMatchObject({
    ok: true,
    checks: expect.arrayContaining([{ name: "tailwind-theme", status: "ok", detail: join(project, theme) }]),
  });
  expect(await structured("about")).toMatchObject({
    bin: manifest.bin, version: manifest.version, dataDir: settings,
    runtime: expect.stringContaining("Bun"), platform: expect.any(String), credits: expect.any(Array),
  });
  expect(await structured("exit_codes")).toMatchObject({
    codes: expect.arrayContaining([expect.objectContaining({ code: ExitCode.SUCCESS })]),
  });
  const docs = await call("skill", { topic: "mcp" });
  expect(docs.isError).not.toBe(true);
  expect(textOf(docs.content)).toContain("# MCP");
  expect(await structured("config_list")).toMatchObject({
    file: join(settings, "settings.json"),
    values: { "output.format": "text" },
    schema: expect.arrayContaining([expect.objectContaining({ key: "output.format" })]),
  });
  expect(await structured("config_get", { key: "output.format" })).toEqual({
    key: "output.format", value: "text", exists: true,
  });
  expect(await structured("credentials_status")).toEqual({
    file: join(settings, "credentials.json"), exists: false, masterKeySource: "none", count: 0, names: [],
  });
}, 75_000);

test("reads project, skill, and dependency state from the fixture", async () => {
  expect(await structured("project_status")).toMatchObject({
    detected: { framework: "react-vite", tailwind: 4 },
    project: { paths: { components } },
    skillsInstalled: 0, componentsCopied: 0, dependenciesPresent: expect.any(Number),
    viewspecs: { byStatus: { in_progress: 1 }, total: 1, nextId: "0001" },
    guide: { exists: true, rules: 33, pendingProposals: 2 },
    theme: { found: true, file: join(project, theme) },
  });
  expect(await structured("skills_list", { internal: true })).toMatchObject({
    skills: expect.arrayContaining([expect.objectContaining({ name: "designfy", kind: "internal", installed: "no" })]),
  });
  const { groups } = await structured("deps_list", { group: "vite" });
  expect(groups).toMatchObject([{
    id: "vite", packages: [{ name: "@tailwindcss/vite", version: expect.any(String), installed: "^4", state: "ok" }],
  }]);
  expect(await structured("deps_check", { group: "vite" })).toEqual({ ok: true, missing: [], outdated: [] });
}, 75_000);

test("filters and searches the interface catalog and reads component metadata", async () => {
  const { entries } = await structured("catalog_list", { kind: "dashboard" });
  const dashboards = entries as Array<{ id: string; kinds: string[] }>;
  expect(dashboards.map(({ id }) => id)).toContain("stat-card");
  expect(dashboards.every(({ kinds }) => kinds.includes("dashboard"))).toBe(true);
  expect(await structured("catalog_show", { id: "hero-split" })).toMatchObject({
    id: "hero-split", purpose: expect.any(String), anatomy: expect.any(Array), variants: expect.any(Array),
    states: expect.any(Array), tokens: expect.any(Array), sources: expect.any(Array),
  });
  expect(await structured("catalog_search", { text: "Stat card" })).toMatchObject({
    entries: expect.arrayContaining([expect.objectContaining({ id: "stat-card" })]),
  });
  const { framework, items } = await structured("components_list", { category: "data-display" });
  expect(framework).toBe("react-vite");
  const statCard = (items as Array<{ name: string; files: unknown[] }>).find(({ name }) => name === "stat-card");
  expect(statCard).toMatchObject({ files: [expect.objectContaining({ target: "stat-card/stat-card.tsx" })] });
  expect(statCard?.files[0]).not.toHaveProperty("content");
  expect(await structured("components_show", { name: "stat-card", source: true })).toMatchObject({
    framework: "react-vite",
    item: { name: "stat-card", registryDependencies: expect.arrayContaining(["cn"]),
      files: [{ target: "stat-card/stat-card.tsx", content: expect.stringMatching(/export /) }] },
  });
}, 75_000);

test("reads the theme, reports contrast findings and computes palette data", async () => {
  const file = join(project, theme);
  expect(await structured("theme_show", { group: "colors" })).toMatchObject({
    file, files: [file],
    colors: expect.arrayContaining([expect.objectContaining({
      name: "--color-background",
      light: expect.objectContaining({ resolved: "#ffffff" }),
      dark: expect.objectContaining({ resolved: "#000000" }),
    })]),
  });
  expect(await structured("theme_check", {}, true)).toMatchObject({
    file, mode: "custom", ok: false, missingRoles: [], summary: { failed: 1 },
    contrast: [
      { mode: "light", foreground: "--foreground", background: "--background", min: 4.5, ratio: 21, status: "pass" },
      { mode: "dark", foreground: "--foreground", background: "--background", min: 4.5, ratio: 1, status: "fail" },
    ],
  });
  expect(await structured("palette_generate", { base: "#336699", harmony: "complementary" })).toMatchObject({
    scales: { primary: { "500": { l: expect.any(Number), c: expect.any(Number), h: expect.any(Number) } } },
    semantic: { light: { background: expect.any(Object) }, dark: { background: expect.any(Object) } },
    contrast: expect.arrayContaining([expect.objectContaining({ ratio: expect.any(Number) })]),
  });
  expect(await structured("palette_wheel", { color: "#336699" })).toMatchObject({
    base: { hex: "#336699", oklch: expect.stringMatching(/^oklch\(/) },
    harmonies: { complementary: expect.arrayContaining([expect.objectContaining({ hex: expect.any(String) })]) },
  });
  expect(await structured("palette_contrast", { foreground: "#000", background: "#fff" })).toMatchObject({
    foreground: { hex: "#000000" }, background: { hex: "#ffffff" }, ratio: 21, apca: expect.any(Number),
    verdicts: { normalText: { aa: true, aaa: true }, largeText: { aa: true, aaa: true }, uiComponent: { aa: true, aaa: null } },
  });
}, 75_000);

test("reads the viewspec guide, screen, progress and validation", async () => {
  const stats = { done: 1, total: 6 };
  expect(await structured("viewspec_guide")).toMatchObject({
    file: join(project, "VIEWSPEC.md"), exists: true, frontMatter: { scope: "project", name: "Mesa de Pedidos" },
    rules: expect.arrayContaining([expect.objectContaining({ id: "v001", origin: "@pessoa" })]),
    pendingProposals: expect.any(Array), errors: [],
  });
  expect(await structured("viewspec_list", { kind: "dashboard", status: "in_progress" })).toMatchObject({
    items: [{ id: "0002", kind: "dashboard", status: "in_progress", progress: stats }],
    nextId: "0001", errors: [],
  });
  expect(await structured("viewspec_show", { id: "0002" })).toMatchObject({
    item: {
      file: join(project, screen), frontMatter: { id: "0002", route: "/app/vendas" }, progress: stats,
      sections: expect.arrayContaining([expect.objectContaining({ title: "Objetivo" })]),
      checklist: expect.arrayContaining([expect.objectContaining({ id: "k2a9", done: true })]),
    },
    errors: [],
  });
  expect(await structured("viewspec_progress")).toEqual({
    ...stats, byStatus: { draft: 0, in_progress: 1, blocked: 0, done: 0, archived: 0 }, nextId: "0001", errors: [],
  });
  expect(await structured("viewspec_validate", { id: "0002" })).toEqual({ valid: true, guide: "valid", errors: [], warnings: [] });
}, 75_000);

test("reads synthetic capture history and project MCP configuration", async () => {
  expect(await structured("capture_list")).toMatchObject({
    captures: [{
      name: "review", outDir: join(project, capture), theme: "light",
      shots: [{ viewport: "mobile", file: "example-test--mobile.png", consoleErrors: [], pageErrors: [] }],
      errors: [],
    }],
  });
  expect(await structured("mcp_servers")).toMatchObject({
    clients: ["claude"],
    servers: expect.arrayContaining([expect.objectContaining({
      id: "designfy", command: "designfy", args: ["mcp"],
      states: expect.objectContaining({ claude: "same", codex: "absent" }),
    })]),
  });
}, 75_000);

test.each([
  { tool: "catalog_show", args: { id: "not-a-fragment" }, message: /Unknown interface entry "not-a-fragment"/, known: "hero-split" },
  { tool: "components_show", args: { name: "not-a-component" }, message: /Unknown component "not-a-component"/, known: "stat-card" },
  { tool: "viewspec_show", args: { id: "9999" }, message: /No screen viewspec uses id "9999"/, known: "0002" },
])("$tool reports unknown identifiers and lists known identifiers", async ({ tool, args, message, known }) => {
  const result = await call(tool, args);
  expect(result.isError).toBe(true);
  expect(JSON.parse(textOf(result.content))).toMatchObject({
    error: { code: ExitCode.NOT_FOUND, message: expect.stringMatching(message),
      details: { known: expect.arrayContaining([known]) } },
  });
}, 45_000);

test("previews and copies a component and its dependencies", async () => {
  const names = ["stat-card"];
  const root = join(project, components);
  const planned = await structured("components_add", { names, dryRun: true });
  expect(planned).toMatchObject({
    framework: "react-vite", configured: true, dryRun: true,
    items: expect.arrayContaining(["stat-card", "cn"]), unchanged: [], skipped: [],
    missingDependencies: expect.arrayContaining(["motion"]), missingDevDependencies: expect.any(Array),
    shadcnItems: expect.arrayContaining(["skeleton"]),
  });
  const paths = planned.written as string[];
  const component = join(root, "stat-card/stat-card.tsx");
  expect(paths).toEqual(expect.arrayContaining([component, join(root, "lib/cn.ts")]));
  expect(existsSync(root)).toBe(false);
  for (const path of paths) expect(existsSync(path)).toBe(false);

  expect(await structured("components_add", { names })).toEqual({ ...planned, dryRun: false });
  for (const path of paths) expect(statSync(path).isFile()).toBe(true);
  expect(readFileSync(component, "utf8")).toContain("StatCard");
}, 75_000);
