/** Reads the project MCP configuration and prepares or applies catalog server entries. */
import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, realpathSync, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { classifyFsError, error } from "../app/errors.ts";
import { ExitCode } from "../app/exit-codes.ts";
import { loadMcpCatalog } from "./catalog.ts";

const clientFiles = {
  claude: ".mcp.json",
  codex: ".codex/config.toml",
  opencode: "opencode.json",
  cursor: ".cursor/mcp.json",
  gemini: ".gemini/settings.json",
} as const;

export type McpClient = keyof typeof clientFiles;
/** Supported project MCP clients in display order. */
export const mcpClients = Object.keys(clientFiles) as McpClient[];

export type ServerState = "absent" | "same" | "different";
export interface McpServerEntry { id: string; command: string; args: readonly string[] }
export interface SetupOptions {
  servers: readonly McpServerEntry[];
  clients?: readonly McpClient[];
  force?: boolean;
  dryRun?: boolean;
}
export interface SetupEntry {
  client: McpClient;
  file: string;
  id: string;
  state: ServerState;
  action: "add" | "replace" | "skip" | "conflict";
}
export interface SetupPlan { entries: SetupEntry[]; written: string[] }

type Config = Record<string, unknown>;
const isRecord = (value: unknown): value is Config =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function readClientFile(file: string): string | undefined {
  try {
    return readFileSync(file, "utf8");
  } catch (cause) {
    if ((cause as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw classifyFsError(cause, ExitCode.CONFIG, `Cannot read ${file}`);
  }
}

/** Lists supported clients whose configuration file exists in the project. */
export function detectClients(cwd: string): McpClient[] {
  return mcpClients.filter((client) => {
    const file = resolve(cwd, clientFiles[client]);
    try {
      return statSync(file).isFile();
    } catch (cause) {
      if ((cause as NodeJS.ErrnoException).code === "ENOENT") return false;
      throw classifyFsError(cause, ExitCode.CONFIG, `Cannot inspect ${file}`);
    }
  });
}

function serverKey(client: McpClient): string {
  if (client === "opencode") return "mcp";
  return client === "codex" ? "mcp_servers" : "mcpServers";
}

function readConfig(cwd: string, client: McpClient) {
  const file = resolve(cwd, clientFiles[client]);
  const source = readClientFile(file);
  let config: unknown = {};
  if (source !== undefined) {
    try {
      config = client === "codex" ? Bun.TOML.parse(source) : JSON.parse(source);
    } catch {
      // Parser diagnostics can contain environment values from the config.
      throw error.config(`Invalid ${client === "codex" ? "TOML" : "JSON"} configuration in ${file}.`);
    }
  }
  if (!isRecord(config)) throw error.config(`Expected a configuration object in ${file}.`);
  const key = serverKey(client);
  const servers = Object.hasOwn(config, key) ? config[key] : {};
  if (!isRecord(servers)) throw error.config(`Expected a "${key}" object in ${file}.`);
  return { file, source, config, key, servers };
}

function sameArray(actual: unknown, expected: readonly string[]): boolean {
  return Array.isArray(actual) && actual.length === expected.length &&
    expected.every((value, index) => actual[index] === value);
}

function stateOf(entries: Config, client: McpClient, id: string, expected?: McpServerEntry): ServerState {
  if (!Object.hasOwn(entries, id)) return "absent";
  const stored = entries[id];
  if (!isRecord(stored) || !expected) return "different";
  if (client === "opencode") {
    return stored.type === "local" && (stored.enabled === undefined || stored.enabled === true) &&
      sameArray(stored.command, [expected.command, ...expected.args]) ? "same" : "different";
  }
  return stored.command === expected.command && (stored.args === undefined && expected.args.length === 0 ||
    sameArray(stored.args, expected.args)) ? "same" : "different";
}

/** Compares a project server entry with the catalog or an explicitly supplied definition. */
export function readServerState(cwd: string, client: McpClient, id: string, expected?: McpServerEntry): ServerState {
  const { servers } = readConfig(cwd, client);
  return stateOf(servers, client, id, expected ?? loadMcpCatalog().servers.find((server) => server.id === id));
}

/** Lists catalog servers with their installation state for each supported client. */
export function listMcpServers(cwd: string) {
  const configs = mcpClients.map((client) => ({ client, ...readConfig(cwd, client) }));
  return {
    clients: configs.filter(({ source }) => source !== undefined).map(({ client }) => client),
    servers: loadMcpCatalog().servers.map((server) => ({
      ...server,
      states: Object.fromEntries(configs.map(({ client, servers }) => [client, stateOf(servers, client, server.id, server)])),
    })),
  };
}

function jsonEntry(client: McpClient, server: McpServerEntry): Config {
  return client === "opencode"
    ? { type: "local", command: [server.command, ...server.args], enabled: true }
    : { command: server.command, args: server.args };
}

function tomlString(value: string): string {
  return JSON.stringify(value).replace(/\u007f/g, "\\u007F");
}

interface TomlSection { start: number; bodyStart: number; id: string | undefined }

function tomlSections(source: string): TomlSection[] {
  const sections: TomlSection[] = [];
  let offset = 0;
  let arrayDepth = 0;
  let multiline = "";
  for (const line of source.match(/[^\n]*\n|[^\n]+$/g) ?? []) {
    const header = line.trimStart();
    if (!multiline && arrayDepth === 0 && header.startsWith("[")) {
      const table = Bun.TOML.parse(header) as Config;
      const servers = table.mcp_servers;
      const id = isRecord(servers) ? Object.keys(servers)[0] : undefined;
      const value = id !== undefined && isRecord(servers) ? servers[id] : undefined;
      sections.push({ start: offset, bodyStart: offset + line.length, id: isRecord(value) && !Object.keys(value).length ? id : undefined });
    } else {
      // Ignore quoted values and comments while recognizing multiline values.
      const tokens = /\\.|"""|'''|"|'|#|\[|\]/g;
      let quote = "";
      for (const match of line.matchAll(tokens)) {
        const token = match[0];
        if (multiline) {
          if (token === multiline) multiline = "";
        } else if (quote) {
          if (token === quote) quote = "";
        } else if (token === "#") {
          break;
        } else if (token === '"""' || token === "'''") {
          multiline = token;
        } else if (token === '"' || token === "'") {
          quote = token;
        } else if (token === "[") {
          arrayDepth++;
        } else if (token === "]") {
          arrayDepth--;
        }
      }
    }
    offset += line.length;
  }
  return sections;
}

function updateToml(source: string, server: McpServerEntry, file: string): string {
  const newline = source.match(/\r?\n/)?.[0] ?? "\n";
  const id = /^[A-Za-z0-9_-]+$/.test(server.id) ? server.id : tomlString(server.id);
  const replacement = [
    `[mcp_servers.${id}]`,
    `command = ${tomlString(server.command)}`,
    `args = [${server.args.map(tomlString).join(", ")}]`,
    "",
  ].join(newline);
  const sections = tomlSections(source);
  const index = sections.findIndex((section) => section.id === server.id);
  let updated: string;
  if (index === -1) {
    const separator = source && !source.endsWith("\n") ? newline : "";
    updated = source + separator + replacement;
  } else {
    const start = sections[index]!;
    const next = sections[index + 1]?.start ?? source.length;
    const body = source.slice(start.bodyStart, next);
    // A comment or blank line after the table's last value may introduce the next table.
    const lines = body.split(/(?<=\n)/);
    let end = next;
    while (lines.length && /^[ \t]*(?:#[^\r\n]*)?\s*$/.test(lines.at(-1)!)) {
      end -= lines.pop()!.length;
    }
    updated = source.slice(0, start.start) + replacement + source.slice(end);
  }
  try {
    Bun.TOML.parse(updated);
  } catch {
    throw error.config(`Cannot update the server table in ${file} because the MCP configuration uses an incompatible TOML declaration.`);
  }
  return updated;
}

function prepareSetup(cwd: string, { servers, clients, force }: SetupOptions) {
  const detected = clients?.length ? clients : detectClients(cwd);
  const selected: readonly McpClient[] = detected.length ? detected : ["claude"];
  const entries: SetupEntry[] = [];
  const updates: { file: string; contents: string }[] = [];
  for (const client of new Set(selected)) {
    const current = readConfig(cwd, client);
    let toml = current.source ?? "";
    let changed = false;
    const records = { ...current.servers };
    for (const server of new Map(servers.map((server) => [server.id, server])).values()) {
      const state = stateOf(current.servers, client, server.id, server);
      const action = state === "absent" ? "add" : state === "same" ? "skip" : force ? "replace" : "conflict";
      entries.push({ client, file: current.file, id: server.id, state, action });
      if (action === "skip" || action === "conflict") continue;
      changed = true;
      if (client === "codex") toml = updateToml(toml, server, current.file);
      else Object.defineProperty(records, server.id, { value: jsonEntry(client, server), enumerable: true, configurable: true });
    }
    if (changed) {
      const contents = client === "codex" ? toml : JSON.stringify({ ...current.config, [current.key]: records }, null, 2) + "\n";
      updates.push({ file: current.file, contents });
    }
  }
  return { entries, updates };
}

/** Plans server installation without creating or changing any files. */
export function planSetup(cwd: string, options: SetupOptions): SetupPlan {
  return { entries: prepareSetup(cwd, options).entries, written: [] };
}

function writeConfig(file: string, contents: string): void {
  let temporary: string | undefined;
  try {
    let target = file;
    let mode = 0o600;
    try {
      target = realpathSync(file);
      mode = statSync(target).mode & 0o777;
    } catch (cause) {
      if ((cause as NodeJS.ErrnoException).code !== "ENOENT") throw cause;
    }
    mkdirSync(dirname(target), { recursive: true });
    temporary = `${target}.${randomUUID()}.tmp`;
    writeFileSync(temporary, contents, { flag: "wx", mode });
    renameSync(temporary, target);
    temporary = undefined;
  } catch (cause) {
    throw classifyFsError(cause, ExitCode.CONFIG, `Cannot write ${file}`);
  } finally {
    if (temporary) {
      try { unlinkSync(temporary); } catch { /* Preserve the write failure. */ }
    }
  }
}

/** Applies approved additions and replacements, or returns the plan for a dry run. */
export function applySetup(cwd: string, options: SetupOptions): SetupPlan {
  const { entries, updates } = prepareSetup(cwd, options);
  const written: string[] = [];
  if (!options.dryRun) {
    for (const { file, contents } of updates) {
      writeConfig(file, contents);
      written.push(file);
    }
  }
  return { entries, written };
}
