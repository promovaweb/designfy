/** End-to-end CLI palette rendering and read-only MCP palette tools. */
import { afterAll, beforeAll, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { HOME_VARIABLE } from "../src/config/paths.ts";
import { registerPaletteTools } from "../src/mcp/tools/palette.ts";
import type { Catalog } from "../src/mcp/server.ts";

let directory: string;
beforeAll(() => { directory = mkdtempSync(join(tmpdir(), "designfy-palette-")); });
afterAll(() => rmSync(directory, { recursive: true, force: true }));

async function run(args: string[]) {
  // Register only this lot's command if the shared registry is still being assembled.
  const script = `
    import { root } from "./src/cli/commands.ts";
    import { paletteCommand } from "./src/cli/commands/palette.ts";
    import { runCli } from "./src/cli/index.ts";
    if (!root.subcommands?.some((command) => command.name === "palette")) {
      root.subcommands = [...root.subcommands ?? [], paletteCommand];
    }
    process.exit(await runCli(JSON.parse(process.env.PALETTE_TEST_ARGS)));
  `;
  const processHandle = Bun.spawn(["bun", "-e", script], {
    cwd: join(import.meta.dir, ".."),
    env: { ...process.env, [HOME_VARIABLE]: directory, NO_COLOR: "1", PALETTE_TEST_ARGS: JSON.stringify(args) },
    stdout: "pipe", stderr: "pipe",
  });
  const [code, stdout, stderr] = await Promise.all([
    processHandle.exited, new Response(processHandle.stdout).text(), new Response(processHandle.stderr).text(),
  ]);
  return { code, stdout, stderr };
}

test("generates shadcn CSS by default, including both modes, aliases, and accent scales", async () => {
  const result = await run(["palette", "generate", "--base", "#6750a4", "--harmony", "analogous"]);
  expect(result.code).toBe(0);
  expect(result.stderr).toBe("");
  expect(result.stdout).toContain(":root {\n  --background: oklch(");
  expect(result.stdout).toContain(".dark {\n  --background: oklch(");
  expect(result.stdout).toContain("@theme inline {\n  --color-background: var(--background);");
  for (const scale of ["primary", "neutral", "accent", "accent-2"]) {
    expect(result.stdout).toContain(`--color-${scale}-50: oklch(`);
    expect(result.stdout).toContain(`--color-${scale}-950: oklch(`);
  }
});

test("emits a raw JSON format and a structured CLI envelope", async () => {
  const args = ["palette", "generate", "--base", "oklch(60% 0.2 330)", "--format", "json"];
  const raw = await run(args);
  const envelope = await run([...args, "--json"]);
  expect(raw.code).toBe(0);
  expect(envelope.code).toBe(0);
  const { data, command, ok } = JSON.parse(envelope.stdout);
  expect(ok).toBe(true);
  expect(command).toBe("designfy palette generate");
  expect(data).toEqual(JSON.parse(raw.stdout));
  expect(data.scales.primary[50].h).toBe(330);
  expect(data.semantic.dark["primary-foreground"]).toBeDefined();
});

test("writes the requested Tailwind format to --out", async () => {
  const file = join(directory, "tailwind.css");
  const result = await run(["palette", "generate", "--base", "#eba", "--format", "tailwind", "--out", file, "--json"]);
  expect(result.code).toBe(0);
  expect(JSON.parse(result.stdout).data.file).toBe(file);
  const output = readFileSync(file, "utf8");
  expect(output).toStartWith("@theme {\n  --color-primary-50: oklch(");
  expect(output).not.toContain("var(");
  expect(output).not.toContain(":root");
});

test("reports harmonies and preserves contrast data when --min fails", async () => {
  const wheel = await run(["palette", "wheel", "#605"]);
  expect(wheel.code).toBe(0);
  expect(wheel.stdout).toContain("split-complementary");
  expect(wheel.stdout).toContain("oklch(");
  const wheelJson = await run(["palette", "wheel", "#605", "--json"]);
  expect(wheelJson.code).toBe(0);
  expect(JSON.parse(wheelJson.stdout).data.harmonies.tetradic).toHaveLength(3);
  const text = await run(["palette", "contrast", "#777", "#fff"]);
  expect(text.code).toBe(0);
  expect(text.stdout).toContain("4.48:1");
  expect(text.stdout).toContain("AAA N/A");
  const result = await run(["palette", "contrast", "#777", "#fff", "--min", "4.5", "--json"]);
  expect(result.code).toBe(10);
  expect(JSON.parse(result.stdout).data).toMatchObject({ passed: false, min: 4.5, verdicts: { normalText: { aa: false } } });
  const pass = await run(["palette", "contrast", "#000", "#fff", "--min", "21"]);
  expect(pass.code).toBe(0);
  expect(pass.stdout).toContain("(pass)");
});

test("rejects missing colors, invalid formats, and invalid contrast thresholds", async () => {
  for (const args of [
    ["generate"], ["generate", "--base", "#abc", "--format", "yaml"], ["wheel", "#abcde"],
    ["contrast", "#abc"], ["contrast", "#abc", "#def", "--min", "21.1"],
  ]) {
    const result = await run(["palette", ...args, "--json"]);
    expect(result.code).toBe(2);
    expect(JSON.parse(result.stdout).error.name).toBe("USAGE");
  }
});

test("registers palette tools and returns matching structured and text results", async () => {
  const server = new McpServer({ name: "test", version: "1.0.0" });
  const client = new Client({ name: "test-client", version: "1.0.0" });
  const catalog: Catalog = { name: "test", version: "1.0.0", tools: [], resources: [], prompts: [] };
  registerPaletteTools({ server, catalog });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  try {
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const listed = (await client.listTools()).tools;
    expect(listed.map(({ name }) => name)).toEqual(catalog.tools.map(({ name }) => name));
    expect(listed.every((tool) => tool.annotations?.readOnlyHint)).toBe(true);
    for (const [name, args] of [
      ["palette_generate", { base: "#abc", harmony: "triadic" }],
      ["palette_wheel", { color: "#abc" }],
      ["palette_contrast", { foreground: "#000", background: "#fff" }],
    ] as const) {
      const result = await client.callTool({ name, arguments: args });
      expect(result.isError).toBeUndefined();
      const content = result.content as Array<{ type: string; text: string }>;
      expect(JSON.parse(content[0]!.text)).toEqual(result.structuredContent);
    }
    const invalid = await client.callTool({ name: "palette_wheel", arguments: { color: "invalid" } });
    expect(invalid.isError).toBe(true);
    const missing = await client.callTool({ name: "palette_generate", arguments: {} });
    expect(missing.isError).toBe(true);
  } finally {
    await client.close();
    await server.close();
  }
});
