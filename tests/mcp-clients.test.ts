/** MCP client configuration, conflict handling, and precise TOML edits. */
import { afterEach, beforeEach, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { HOME_VARIABLE } from "../src/config/paths.ts";
import { applySetup, detectClients, listMcpServers, mcpClients, planSetup, readServerState } from "../src/design/mcp-clients.ts";

const server = { id: "designfy", command: "designfy", args: ["mcp"] };
const files = {
  claude: ".mcp.json",
  codex: ".codex/config.toml",
  opencode: "opencode.json",
  cursor: ".cursor/mcp.json",
  gemini: ".gemini/settings.json",
} as const;
let directory: string;

beforeEach(() => { directory = mkdtempSync(join(tmpdir(), "designfy-mcp-")); });
afterEach(() => rmSync(directory, { recursive: true, force: true }));

function write(relative: string, contents: string): string {
  const file = join(directory, relative);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, contents, "utf8");
  return file;
}

function read(relative: string): string {
  return readFileSync(join(directory, relative), "utf8");
}

test("installs into all five clients and preserves all unrelated configuration", () => {
  const existing = { command: "other", args: ["start"], env: { SETTING: "example" } };
  const otherJson = { arbitrary: { keep: true } };
  const toml = '# settings\r\nmodel = "example"\r\n\r\n[mcp_servers.other]\r\ncommand = "other"';
  write(files.codex, toml);
  for (const client of mcpClients.filter((name) => name !== "codex")) {
    const key = client === "opencode" ? "mcp" : "mcpServers";
    write(files[client], JSON.stringify({ ...otherJson, [key]: { other: existing } }));
  }
  expect(detectClients(directory)).toEqual(mcpClients);
  const plan = applySetup(directory, { servers: [server] });
  expect(plan.entries.map(({ action }) => action)).toEqual(Array(5).fill("add"));
  expect(plan.written).toHaveLength(5);
  for (const client of mcpClients) {
    expect(readServerState(directory, client, server.id)).toBe("same");
    const contents = read(files[client]);
    if (client === "codex") {
      expect(contents).toBe(toml + '\r\n[mcp_servers.designfy]\r\ncommand = "designfy"\r\nargs = ["mcp"]\r\n');
    } else {
      const key = client === "opencode" ? "mcp" : "mcpServers";
      const designfy = client === "opencode"
        ? { type: "local", command: ["designfy", "mcp"], enabled: true }
        : { command: "designfy", args: ["mcp"] };
      expect(contents).toBe(JSON.stringify({ ...otherJson, [key]: { other: existing, designfy } }, null, 2) + "\n");
    }
  }
  const { clients, servers } = listMcpServers(directory);
  expect(clients).toEqual(mcpClients);
  expect(servers.find(({ id }) => id === "designfy")?.states).toEqual({
    claude: "same", codex: "same", opencode: "same", cursor: "same", gemini: "same",
  });
  expect(JSON.stringify(servers)).not.toContain("SETTING");
  expect(applySetup(directory, { servers: [server] }).written).toEqual([]);
});

test("dry run plans changes with the default Claude file and leaves the project untouched", () => {
  expect(detectClients(directory)).toEqual([]);
  expect(readServerState(directory, "claude", "designfy")).toBe("absent");
  const plan = planSetup(directory, { servers: [server] });
  expect(plan.entries).toEqual([{
    client: "claude", file: join(directory, files.claude), id: "designfy", state: "absent", action: "add",
  }]);
  expect(applySetup(directory, { servers: [server], dryRun: true })).toEqual(plan);
  expect(existsSync(join(directory, files.claude))).toBe(false);
  expect(applySetup(directory, { servers: [server] }).written).toEqual([join(directory, files.claude)]);
});

test("conflicting entries stay byte-for-byte and force replaces only the selected server", () => {
  const old = '{"mcpServers":{"designfy":{"command":"older","args":["mcp"]},"other":{"command":"other"}},"keep":true}';
  write(files.claude, old);
  expect(readServerState(directory, "claude", "designfy")).toBe("different");
  const conflict = applySetup(directory, { servers: [server] });
  expect(conflict.entries[0]?.action).toBe("conflict");
  expect(conflict.written).toEqual([]);
  expect(read(files.claude)).toBe(old);
  const preview = applySetup(directory, { servers: [server], force: true, dryRun: true });
  expect(preview.entries[0]?.action).toBe("replace");
  expect(read(files.claude)).toBe(old);
  expect(applySetup(directory, { servers: [server], force: true }).written).toHaveLength(1);
  expect(JSON.parse(read(files.claude))).toEqual({
    mcpServers: { designfy: { command: "designfy", args: ["mcp"] }, other: { command: "other" } },
    keep: true,
  });
});

test("adds other servers in the same file while a conflicting entry is retained", () => {
  write(files.opencode, JSON.stringify({
    mcp: { designfy: { type: "local", command: ["designfy", "mcp"], enabled: false } },
  }));
  const result = applySetup(directory, { servers: [server, { id: "another", command: "other", args: [] }] });
  expect(result.entries.map(({ action }) => action)).toEqual(["conflict", "add"]);
  expect(JSON.parse(read(files.opencode)).mcp).toEqual({
    designfy: { type: "local", command: ["designfy", "mcp"], enabled: false },
    another: { type: "local", command: ["other"], enabled: true },
  });
});

test("edits only the actual Codex table, retaining comments and multiline strings", () => {
  const before = [
    '# a preamble', 'instructions = """', '[mcp_servers.designfy]', 'This is only prompt text.', '"""',
    '', '[mcp_servers.other]', 'command = "original"', 'args = [', '  "a",', '  "b",', ']', '',
  ].join("\r\n") + "\r\n";
  const block = [
    '  [mcp_servers."designfy"]  # existing', 'args = ["wrong"]', '', '# inside table', 'command = "old"',
  ].join("\r\n") + "\r\n";
  const after = '\r\n# keep this heading\r\n[profile]\r\nmodel = "newer"';
  write(files.codex, before + block + after);
  expect(readServerState(directory, "codex", "designfy")).toBe("different");
  expect(applySetup(directory, { servers: [server], clients: ["codex"] }).written).toEqual([]);
  expect(read(files.codex)).toBe(before + block + after);
  expect(applySetup(directory, { servers: [server], clients: ["codex"], force: true }).written).toHaveLength(1);
  expect(read(files.codex)).toBe(
    before + '[mcp_servers.designfy]\r\ncommand = "designfy"\r\nargs = ["mcp"]\r\n' + after,
  );
  expect(readServerState(directory, "codex", "designfy")).toBe("same");
});

test("Codex round-trips quoted IDs, executable paths, and escaped arguments", () => {
  const custom = { id: "custom.server", command: 'C:\\Tools\\\"example\"', args: ["#tag", "line\nnext", "\\", ""] };
  const plan = applySetup(directory, { servers: [custom], clients: ["codex"] });
  expect(plan.entries[0]?.action).toBe("add");
  expect(readServerState(directory, "codex", custom.id, custom)).toBe("same");
});

test("invalid client configuration is reported without exposing file contents or writing a partial plan", () => {
  const bad = '{"mcpServers":{"secret-confidential":';
  write(files.cursor, bad);
  expect(() => applySetup(directory, { servers: [server], clients: ["claude", "cursor"] }))
    .toThrow(/Invalid JSON configuration in [^\n]+mcp\.json/);
  expect(read(files.cursor)).toBe(bad);
  expect(existsSync(join(directory, files.claude))).toBe(false);
});

async function runMcp(args: string[]) {
  const processHandle = Bun.spawn(["bun", join(import.meta.dir, "../src/main.ts"), "mcp", ...args], {
    cwd: directory,
    env: { ...process.env, [HOME_VARIABLE]: directory, NO_COLOR: "1" },
    stdout: "pipe", stderr: "pipe",
  });
  const [code, stdout, stderr] = await Promise.all([
    processHandle.exited, new Response(processHandle.stdout).text(), new Response(processHandle.stderr).text(),
  ]);
  return { code, stdout, stderr };
}

test("CLI configures catalog defaults, lists states, and preserves its existing --list mode", async () => {
  const dry = await runMcp(["setup", "--client", "codex,cursor", "--dry-run", "--json"]);
  expect(dry.code).toBe(0);
  const preview = JSON.parse(dry.stdout).data;
  expect(preview.written).toEqual([]);
  expect(preview.entries.map(({ id }: { id: string }) => id)).toEqual(["designfy", "shadcn", "designfy", "shadcn"]);
  expect(detectClients(directory)).toEqual([]);
  const activated = await runMcp(["setup", "shadcn", "--client", "codex,cursor"]);
  expect(activated.code).toBe(0);
  expect(activated.stdout).toContain("codex / shadcn");
  const catalog = await runMcp(["servers", "--json"]);
  expect(catalog.code).toBe(0);
  expect(JSON.parse(catalog.stdout).data.servers.find(({ id }: { id: string }) => id === "shadcn").states).toEqual({
    claude: "absent", codex: "same", opencode: "absent", cursor: "same", gemini: "absent",
  });
  const listed = await runMcp(["--list", "--json"]);
  expect(listed.code).toBe(0);
  expect(JSON.parse(listed.stdout).data.tools).toEqual(expect.arrayContaining([expect.objectContaining({ name: "about" })]));
  expect((await runMcp(["setup", "unknown-server"])).code).toBe(6);
  expect((await runMcp(["setup", "--client", "unknown-client"])).code).toBe(2);
});

test("mcp_servers lists catalog state over stdio without revealing values from project clients", async () => {
  const contents = JSON.stringify({
    mcpServers: { designfy: { command: "designfy", args: ["mcp"], env: { TOKEN: "fixture-secret" } } },
  });
  write(files.claude, contents);
  const registerUrl = new URL("../src/mcp/tools/mcp-servers.ts", import.meta.url);
  const serverScript = `
    import { McpServer } from ${JSON.stringify(import.meta.resolve("@modelcontextprotocol/sdk/server/mcp.js"))};
    import { StdioServerTransport } from ${JSON.stringify(import.meta.resolve("@modelcontextprotocol/sdk/server/stdio.js"))};
    import { registerMcpServersTools } from ${JSON.stringify(registerUrl.href)};
    const server = new McpServer({ name: "designfy-test", version: "1.0.0" });
    registerMcpServersTools({ server, catalog: { tools: [] } });
    await server.connect(new StdioServerTransport());
  `;
  const transport = new StdioClientTransport({
    command: process.execPath, args: ["-e", serverScript], cwd: directory, stderr: "pipe",
  });
  const client = new Client({ name: "test-client", version: "1.0.0" });
  try {
    await client.connect(transport);
    expect((await client.listTools()).tools[0]).toMatchObject({
      name: "mcp_servers", annotations: { readOnlyHint: true },
    });
    const response = await client.callTool({ name: "mcp_servers", arguments: {} });
    expect(response.isError).toBeUndefined();
    expect(response.structuredContent).toMatchObject({
      clients: ["claude"],
      servers: expect.arrayContaining([expect.objectContaining({
        id: "designfy", states: expect.objectContaining({ claude: "same", codex: "absent" }),
      })]),
    });
    expect(JSON.stringify(response)).not.toContain("fixture-secret");
    const content = response.content as Array<{ text: string }>;
    expect(JSON.parse(content[0]!.text)).toEqual(response.structuredContent);
    expect(read(files.claude)).toBe(contents);
  } finally {
    await client.close();
  }
});
