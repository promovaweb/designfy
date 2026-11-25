/** Covers interface catalog validation, filters, search, and CLI and MCP adapters. */
import { afterEach, beforeEach, expect, test } from "bun:test";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AppError } from "../src/app/errors.ts";
import { ExitCode } from "../src/app/exit-codes.ts";
import { catalogCommand } from "../src/cli/commands/catalog.ts";
import { parse } from "../src/cli/parser.ts";
import { getEntry, listEntries, loadInterfaceCatalog, searchEntries, validateCatalog } from "../src/design/interface-catalog.ts";
import type { Catalog } from "../src/mcp/server.ts";
import { registerInterfaceCatalogTools } from "../src/mcp/tools/interface-catalog.ts";

let savedDirectory: string | undefined;

beforeEach(() => {
  savedDirectory = process.env.DESIGNFY_CATALOG_DIR;
  process.env.DESIGNFY_CATALOG_DIR = join(import.meta.dir, "fixtures", "interface-catalog");
});

afterEach(() => {
  if (savedDirectory === undefined) delete process.env.DESIGNFY_CATALOG_DIR;
  else process.env.DESIGNFY_CATALOG_DIR = savedDirectory;
});

test("loads fixture and embedded catalogs with valid relationships", () => {
  expect(loadInterfaceCatalog().entries).toHaveLength(6);
  expect(validateCatalog()).toEqual(loadInterfaceCatalog());
  delete process.env.DESIGNFY_CATALOG_DIR;
  expect(loadInterfaceCatalog().entries.length).toBeGreaterThan(6);
});

test("combines category, surface and viewspec filters, including entries shared by both surfaces", () => {
  const ids = (filters: Parameters<typeof listEntries>[0]) => listEntries(filters).map(({ id }) => id);
  expect(ids({ surface: "site", category: "marketing", kind: "landing-page" })).toEqual(["hero", "call-to-action"]);
  expect(ids({ surface: "webapp", kind: "dashboard" })).toEqual(["breadcrumbs", "sidebar"]);
  expect(ids({ surface: "system" })).toEqual(ids({ surface: "webapp" }));
  expect(ids({ surface: "both" })).toEqual(["breadcrumbs", "filters"]);
  expect(ids({ category: "missing" })).toEqual([]);
});

test("searches name, purpose, useWhen and anatomy case- and accent-insensitively", () => {
  expect(searchEntries("FILTROS RAPIDOS").map(({ id }) => id)).toEqual(["filters"]);
  expect(searchEntries("RELATIONAL DATASET").map(({ id }) => id)).toEqual(["table"]);
  expect(searchEntries("ORIENTACAO").map(({ id }) => id)).toEqual(["breadcrumbs"]);
  expect(searchEntries("CABECALHO").map(({ id }) => id)).toEqual(["table"]);
});

test("validates unique IDs, category references, related references, and allowed sources", () => {
  const duplicate = loadInterfaceCatalog();
  duplicate.entries.push(duplicate.entries[0]!);
  duplicate.categories.push(duplicate.categories[0]!);
  expect(() => validateCatalog(duplicate)).toThrow("Invalid catalog");

  const invalid = loadInterfaceCatalog();
  invalid.entries[0]!.category = "missing";
  invalid.entries[0]!.related = ["another"];
  try {
    validateCatalog(invalid);
    throw new Error("Expected catalog validation to fail");
  } catch (cause) {
    expect(cause).toBeInstanceOf(AppError);
    expect(cause).toMatchObject({ code: ExitCode.CONFIG, details: { issues: [
      { path: ["entries", 0, "category"], message: 'Unknown category "missing".' },
      { path: ["entries", 0, "related", 0], message: 'Unknown related id "another".' },
    ] } });
  }

  const malformed = loadInterfaceCatalog();
  malformed.entries[0]!.sources.push("package:invalid");
  expect(() => validateCatalog(malformed)).toThrow("Invalid catalog");
});

test("reports unknown entry IDs and the available choices", () => {
  expect(getEntry("hero").sources).toEqual(["designfy:hero"]);
  try {
    getEntry("missing");
    throw new Error("Expected missing entry");
  } catch (cause) {
    expect(cause).toMatchObject({
      code: ExitCode.NOT_FOUND,
      details: { known: ["hero", "call-to-action", "breadcrumbs", "sidebar", "table", "filters"] },
    });
  }
});

function runCatalog(args: string[]) {
  const parsed = parse({ name: "designfy", description: "Test", subcommands: [catalogCommand] }, ["catalog", ...args]);
  return parsed.command.run!({
    args: parsed.args, options: parsed.options, path: parsed.path, json: false, interactive: false, stdout() {}, stderr() {},
  });
}

test("passes CLI filters and returns the whole entry with a readable description", async () => {
  const filtered = await runCatalog(["list", "--surface", "site", "--kind", "landing-page"]);
  expect(filtered.data).toEqual({ entries: [getEntry("hero"), getEntry("call-to-action")] });
  const detail = await runCatalog(["show", "hero"]);
  expect(detail.data).toEqual(getEntry("hero"));
  expect((detail.text as () => string)()).toContain("designfy:hero");
  expect((await runCatalog(["search", "cabeçalho"])).data).toEqual({ entries: [getEntry("table")] });
});

test("registers read-only catalog tools with matching text and structured responses", async () => {
  const server = new McpServer({ name: "catalog-test", version: "1.0.0" });
  const client = new Client({ name: "catalog-test-client", version: "1.0.0" });
  const catalog: Catalog = { name: "test", version: "1.0.0", tools: [], resources: [], prompts: [] };
  registerInterfaceCatalogTools({ server, catalog });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  try {
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const { tools } = await client.listTools();
    expect(tools.map(({ name, annotations }) => [name, annotations?.readOnlyHint])).toEqual([
      ["catalog_list", true], ["catalog_show", true], ["catalog_search", true],
    ]);
    const found = await client.callTool({ name: "catalog_search", arguments: { text: "ORIENTACAO" } });
    expect(found.isError).toBeUndefined();
    expect(found.structuredContent).toEqual({ entries: [getEntry("breadcrumbs")] });
    const content = found.content as Array<{ text: string }>;
    expect(JSON.parse(content[0]!.text)).toEqual(found.structuredContent);
    const missing = await client.callTool({ name: "catalog_show", arguments: { id: "missing" } });
    expect(missing.isError).toBe(true);
    const errors = missing.content as Array<{ text: string }>;
    expect(JSON.parse(errors[0]!.text)).toMatchObject({
      error: { code: ExitCode.NOT_FOUND, details: { known: expect.any(Array) } },
    });
  } finally {
    await client.close();
    await server.close();
  }
});
