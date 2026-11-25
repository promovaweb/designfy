/** Exercises screen viewspec parsing, collection queries, CLI output and MCP discovery. */
import { afterEach, beforeEach, expect, test } from "bun:test";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ExitCode } from "../src/app/exit-codes.ts";
import { HOME_VARIABLE, MASTER_KEY_VARIABLE } from "../src/config/paths.ts";
import { parseViewspec, readViewspec, readViewspecProgress, readViewspecs, validateViewspec } from "../src/design/viewspec.ts";
import { registerViewspecTools } from "../src/mcp/tools/viewspec.ts";
import type { Catalog } from "../src/mcp/server.ts";

const repo = join(import.meta.dir, "..");
const fixtures = join(import.meta.dir, "fixtures/viewspec");
const folder = "0002-dashboard-de-vendas";
const fixtureFile = join(fixtures, "screen-valid", "viewspec", folder, "VIEWSPEC.md");
const example = readFileSync(fixtureFile, "utf8");
let project: string;

beforeEach(() => {
  project = mkdtempSync(join(fixtures, "screen-test-"));
});
afterEach(() => rmSync(project, { recursive: true, force: true }));

function validate(markdown: string, file = fixtureFile) {
  return validateViewspec(parseViewspec(file, markdown));
}

function addScreen(id: string, markdown = example, viewspecPath = "viewspec") {
  const directory = join(project, viewspecPath, id + "-dashboard-de-vendas");
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, "VIEWSPEC.md"), markdown.replace('id: "0002"', 'id: "' + id + '"'));
}

async function run(args: string[]) {
  // Register only in this isolated process if repository integration is still pending.
  const entry = [
    'import { root } from ' + JSON.stringify(join(repo, "src/cli/commands.ts")) + ';',
    'import { runCli } from ' + JSON.stringify(join(repo, "src/cli/index.ts")) + ';',
    'import { viewspecCommand } from ' + JSON.stringify(join(repo, "src/cli/commands/viewspec.ts")) + ';',
    'if (!root.subcommands.some((cmd) => cmd.name === "viewspec")) root.subcommands = [...root.subcommands, viewspecCommand];',
    'process.exit(await runCli(process.argv.slice(1)));',
  ].join("\n");
  const env = { ...process.env, [HOME_VARIABLE]: join(project, ".config-test"), NO_COLOR: "1" };
  delete env[MASTER_KEY_VARIABLE];
  const proc = Bun.spawn(["bun", "-e", entry, "--", ...args], { cwd: project, env, stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, code] = await Promise.all([
    new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited,
  ]);
  return { stdout, stderr, code };
}

test("the complete contract example matches the fixture and validates cleanly", () => {
  const contract = readFileSync(join(repo, "docs/viewspec.md"), "utf8");
  const fencedExample = /### Exemplo\n\n\x60\x60\x60markdown\n([\s\S]*?)\x60\x60\x60/.exec(contract);
  expect(example).toBe(fencedExample?.[1] ?? "");
  const { item, errors } = validate(example);
  expect(errors).toEqual([]);
  expect(item?.frontMatter.id).toBe("0002");
  expect(item?.sections).toHaveLength(9);
  expect(item?.progress).toEqual({ done: 1, total: 6 });
  expect(item?.checklist[0]).toMatchObject({ id: "k2a9", done: true, skill: "designfy-systems" });
});

test("parses quoted scalars, block and inline lists, dates, BOM and CRLF", () => {
  const markdown = example.replace("title: Dashboard de vendas", "title: 'Operação d''água #1' # title")
    .replace('priority: high', 'source: "Weekly \\"sales\\" review"')
    .replace("components: [app-shell, stat-card, data-table, chart-area]", 'components: ["shell, v2", \'chart-area\',] # components')
    .replace("2026-11-24T15:00:00-03:00", '"2026-11-24T15:00:00-03:00"')
    .replace(" \x60#designfy-systems\x60 {#k2a9}", " {#k2a9}");
  const result = validate("\uFEFF" + markdown.replaceAll("\n", "\r\n"));
  expect(result.errors).toEqual([]);
  expect(result.item?.frontMatter).toMatchObject({
    title: "Operação d'água #1", priority: "medium", components: ["shell, v2", "chart-area"],
    relatedFiles: ["src/pages/app/vendas.tsx"], source: 'Weekly "sales" review',
  });
  expect(result.item?.checklist[0]?.skill).toBe("designfy-systems");
});

const screenRejections: Array<[string, (value: string) => string, string, RegExp]> = [
  ["unknown field", (value) => value.replace("priority: high", "otherField: nope"), "otherField", /unknown/],
  ["invalid enum", (value) => value.replace("status: in_progress", "status: ready"), "status", /Invalid option/],
  ["invalid type", (value) => value.replace("title: Dashboard de vendas", "title: false"), "title", /expected string/],
  ["mismatched id", (value) => value.replace('id: "0002"', 'id: "0003"'), "id", /directory name/],
  ["mismatched slug", (value) => value.replace("slug: dashboard-de-vendas", "slug: overview"), "slug", /directory name/],
  ["missing heading", (value) => value.replace("## Objetivo", "### Objetivo"), "Objetivo", /required heading/],
  ["wrong heading order", (value) => value.replace("## Objetivo", "## Estrutura").replace("\n## Estrutura\n\n1.", "\n## Objetivo\n\n1."), "Objetivo", /Move/],
  ["missing checklist id", (value) => value.replace(" {#k2a9}", ""), "Checklist", /four-character/],
  ["duplicate checklist id", (value) => value.replace("{#p0x4}", "{#k2a9}"), "Checklist", /unique/],
  ["malformed checkbox", (value) => value.replace("- [x]", "- [X]"), "Checklist", /GFM checkbox/],
  ["pending item in done viewspec", (value) => value.replace("status: in_progress", "status: done"), "Checklist", /Complete every/],
  ["missing capture in done viewspec", (value) => value.replace("status: in_progress", "status: done").replaceAll("- [ ]", "- [x]"), "captures", /reviewed capture/],
  ["missing blocked reason", (value) => value.replace("status: in_progress", "status: blocked"), "blockedReason", /Provide a reason/],
  ["unexpected blocked reason", (value) => value.replace("priority: high", "blockedReason: Awaiting data"), "blockedReason", /Remove this reason/],
  ["missing archived reason", (value) => value.replace("status: in_progress", "status: archived"), "archivedReason", /Provide a reason/],
  ["unexpected archived reason", (value) => value.replace("priority: high", "archivedReason: Duplicate"), "archivedReason", /Remove this reason/],
  ["kind and surface mismatch", (value) => value.replace("surface: system", "surface: site"), "surface", /Use "system"/],
  ["skill outside the Designfy family", (value) => value.replace("skills: [designfy-systems", "skills: [hallmark"), "skills", /designfy/],
  ["nonexistent calendar date", (value) => value.replace("2026-11-24T", "2026-02-31T"), "createdAt", /ISO datetime/],
  ["duplicate front matter field", (value) => value.replace("priority: high", "priority: high\npriority: low"), "priority", /only once/],
  ["deviations without notes", (value) => value.replace("priority: high", "deviations: [c001]")
    .replace(/## Notas[\s\S]*$/, "## Notas\n"), "deviations", /Explain/],
];
test.each(screenRejections)("rejects %s", (_name, change, field, message) => {
  const result = validate(change(example));
  expect(result.item).toBeNull();
  expect(result.errors).toContainEqual(expect.objectContaining({ file: fixtureFile, field, message: expect.stringMatching(message) }));
});

test("accepts the done status when every task is complete and a capture is linked", () => {
  const result = validate(example.replace("status: in_progress", "status: done")
    .replaceAll("- [ ]", "- [x]").replace("priority: high", "captures: [sales-review]"));
  expect(result.errors).toEqual([]);
  expect(result.item?.progress).toEqual({ done: 6, total: 6 });
});

test("resolves the configured project folder, counts status, preserves occupied invalid ids and finds a gap", () => {
  writeFileSync(join(project, "designfy.json"), '{"paths":{"viewspec":"plans"}}');
  addScreen("0001", example, "plans");
  addScreen("0002", example.replace("status: in_progress", "status: draft").replace("kind: dashboard", "kind: table"), "plans");
  addScreen("0004", example.replace("kind: dashboard", "kind: unknown"), "plans");
  expect(readViewspecs(project).nextId).toBe("0003");
  expect(readViewspecs(project, { status: "draft" }).items.map((item) => item.frontMatter.id)).toEqual(["0002"]);
  const filtered = readViewspecs(project, { status: "in_progress", kind: "dashboard" });
  expect(filtered.items.map((item) => item.frontMatter.id)).toEqual(["0001"]);
  expect(filtered.errors[0]).toMatchObject({ field: "kind", line: expect.any(Number) });
  expect(readViewspecProgress(project)).toMatchObject({
    byStatus: { draft: 1, in_progress: 1, done: 0, blocked: 0, archived: 0 }, done: 2, total: 12, nextId: "0003",
  });
  expect(readViewspec(project, "0004")).toMatchObject({ found: true, item: null });
  expect(readViewspec(project, "0003")).toEqual({ found: false, item: null, errors: [] });
});

test("reports duplicate ids and refuses to choose between their directories", () => {
  addScreen("0001");
  cpSync(join(project, "viewspec/0001-dashboard-de-vendas"), join(project, "viewspec/0001-other"), { recursive: true });
  expect(readViewspecs(project)).toMatchObject({ items: [], nextId: "0002" });
  expect(readViewspec(project, "0001").errors.some(({ message }) => message.includes("Choose a unique id"))).toBe(true);
});

test("runs list, show and progress through the CLI in text and JSON", async () => {
  addScreen("0002");
  const list = await run(["viewspec", "list", "--kind", "dashboard", "--status", "in_progress"]);
  expect(list.code).toBe(ExitCode.SUCCESS);
  expect(list.stdout).toContain("Dashboard de vendas");
  expect(list.stdout).toContain("1/6");
  expect(list.stderr).toBe("");
  const listJson = await run(["viewspec", "list", "--kind", "table", "--json"]);
  expect(listJson.code).toBe(ExitCode.SUCCESS);
  expect(JSON.parse(listJson.stdout).data).toMatchObject({ items: [], errors: [], nextId: "0001" });
  const show = await run(["viewspec", "show", "0002"]);
  expect(show.code).toBe(ExitCode.SUCCESS);
  expect(show.stdout).toContain("## Checklist");
  expect(show.stdout).toContain("## Notas");
  const showJson = await run(["viewspec", "show", "0002", "--json"]);
  expect(showJson.code).toBe(ExitCode.SUCCESS);
  expect(JSON.parse(showJson.stdout).data.item.checklist).toHaveLength(6);
  const progress = await run(["viewspec", "progress"]);
  expect(progress.code).toBe(ExitCode.SUCCESS);
  expect(progress.stdout).toMatch(/Next id\s+0001/);
  const progressJson = await run(["viewspec", "progress", "--json"]);
  expect(progressJson.code).toBe(ExitCode.SUCCESS);
  expect(JSON.parse(progressJson.stdout).data).toMatchObject({ total: 6, done: 1, byStatus: { in_progress: 1 } });
});

test("CLI returns 10 and structured diagnostics for invalid screens even when filtered out", async () => {
  addScreen("0002", example.replace(" {#k2a9}", ""));
  const list = await run(["viewspec", "list", "--status", "archived", "--json"]);
  expect(list.code).toBe(ExitCode.CHECK_FAILED);
  expect(JSON.parse(list.stdout).data).toMatchObject({
    items: [], errors: [{ file: expect.stringContaining(folder), field: "Checklist", line: expect.any(Number) }],
  });
  const validation = await run(["viewspec", "validate", "0002", "--json"]);
  expect(validation.code).toBe(ExitCode.CHECK_FAILED);
  expect(JSON.parse(validation.stdout).data).toMatchObject({ guide: "missing", valid: false });
  expect(validation.stderr).toBe("guide: missing\n");
  const missing = await run(["viewspec", "show", "0003", "--json"]);
  expect(missing.code).toBe(ExitCode.NOT_FOUND);
  expect(JSON.parse(missing.stdout).error.name).toBe("NOT_FOUND");
});

test("MCP discovers five read-only tools and returns the same structured data as its JSON text", async () => {
  addScreen("0002");
  cpSync(join(fixtures, "guide-valid", "VIEWSPEC.md"), join(project, "VIEWSPEC.md"));
  const previous = process.cwd();
  const catalog: Catalog = { name: "test", version: "1.0.0", tools: [], resources: [], prompts: [] };
  const server = new McpServer({ name: "viewspec-test", version: "1.0.0" });
  const client = new Client({ name: "viewspec-client", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  try {
    process.chdir(project);
    registerViewspecTools({ server, catalog });
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const { tools } = await client.listTools();
    expect(tools.map(({ name }) => name).sort()).toEqual(catalog.tools.map(({ name }) => name).sort());
    expect(tools).toHaveLength(5);
    for (const tool of tools) {
      expect(tool.annotations?.readOnlyHint).toBe(true);
      const result = await client.callTool({ name: tool.name, arguments: tool.name === "viewspec_show" ? { id: "0002" } : {} });
      expect(result.isError).toBe(false);
      const [content] = result.content as Array<{ type: string; text: string }>;
      expect(JSON.parse(content!.text)).toEqual(result.structuredContent);
    }
    const missing = await client.callTool({ name: "viewspec_show", arguments: { id: "0003" } });
    expect(missing.isError).toBe(true);
    const [content] = missing.content as Array<{ text: string }>;
    expect(JSON.parse(content!.text)).toMatchObject({ error: { code: ExitCode.NOT_FOUND } });
    const malformed = await client.callTool({ name: "viewspec_show", arguments: { id: "../" } });
    expect(malformed.isError).toBe(true);
  } finally {
    process.chdir(previous);
    await client.close();
    await server.close();
  }
});

test("reports missing guides on stderr during validation and uses exit 6 for guide", async () => {
  const validation = await run(["viewspec", "validate"]);
  expect(validation.code).toBe(ExitCode.SUCCESS);
  expect(validation.stdout).toBe("Viewspec validation passed.\n");
  expect(validation.stderr).toBe("guide: missing\n");
  const guide = await run(["viewspec", "guide", "--json"]);
  expect(guide.code).toBe(ExitCode.NOT_FOUND);
  expect(JSON.parse(guide.stdout).error).toMatchObject({ code: ExitCode.NOT_FOUND });
});

test("renders the guide in text and JSON and validates it with a selected screen", async () => {
  const guideFile = join(project, "VIEWSPEC.md");
  const guide = readFileSync(join(fixtures, "guide-valid", "VIEWSPEC.md"), "utf8");
  addScreen("0002");
  writeFileSync(guideFile, guide);
  const text = await run(["viewspec", "guide"]);
  expect(text.code).toBe(ExitCode.SUCCESS);
  expect(text.stdout).toContain("Mesa de Pedidos");
  expect(text.stdout).toContain("Pending proposals");
  const json = await run(["viewspec", "guide", "--json"]);
  expect(json.code).toBe(ExitCode.SUCCESS);
  expect(JSON.parse(json.stdout).data).toMatchObject({
    bySection: { Cores: 3 }, pendingProposals: [expect.any(Object), expect.any(Object)],
  });
  const validation = await run(["viewspec", "validate", "0002", "--json"]);
  expect(validation.code).toBe(ExitCode.SUCCESS);
  expect(JSON.parse(validation.stdout).data).toEqual({ valid: true, guide: "valid", errors: [] });
  expect(validation.stderr).toBe("");
  writeFileSync(guideFile, guide.replace("{#v001}", "{#t001}"));
  const invalid = await run(["viewspec", "validate", "0002", "--json"]);
  expect(invalid.code).toBe(ExitCode.CHECK_FAILED);
  expect(JSON.parse(invalid.stdout).data).toMatchObject({ valid: false, guide: "invalid", errors: [{ file: guideFile }] });
});
