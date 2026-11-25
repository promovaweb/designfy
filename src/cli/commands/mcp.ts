/**
 * MCP command: starts the stdio server or manages project client entries.
 *
 * The process then speaks JSON-RPC on stdin/stdout, so nothing else may be
 * written to stdout. Diagnostics go to stderr. The command only returns when
 * the client closes the transport.
 */
import { manifest } from "../../app/manifest.ts";
import { ExitCode } from "../../app/exit-codes.ts";
import { error } from "../../app/errors.ts";
import { loadMcpCatalog } from "../../design/catalog.ts";
import { applySetup, listMcpServers, mcpClients, type McpClient } from "../../design/mcp-clients.ts";
import { table } from "../format.ts";
import type { Command } from "../registry.ts";

const servers: Command = {
  name: "servers",
  description: "List catalog servers and their configuration state in each project client.",
  examples: [`${manifest.bin} mcp servers --json`],
  exitCodes: [ExitCode.CONFIG, ExitCode.PERMISSION, ExitCode.NOT_FOUND],
  run: () => {
    const data = listMcpServers(process.cwd());
    return {
      data,
      text: () => table(data.servers.map(({ id, title, states }) => [
        `${id} (${title})`,
        mcpClients.map((client) => `${client}: ${states[client]}`).join(", "),
      ])),
    };
  },
};

const setup: Command = {
  name: "setup",
  description: "Configure catalog servers in supported MCP clients for this project.",
  arguments: [{ name: "servers", description: "Server IDs to configure. Defaults to the recommended servers.", variadic: true }],
  options: [
    { name: "--client", argument: { name: "clients" }, description: `Comma-separated clients: ${mcpClients.join(", ")}. Defaults to detected clients or claude.` },
    { name: "--force", description: "Replace different entries for the selected servers." },
    { name: "--dry-run", description: "Show planned changes without writing files." },
  ],
  examples: [
    `${manifest.bin} mcp setup`,
    `${manifest.bin} mcp setup shadcn --client codex,cursor --dry-run`,
  ],
  exitCodes: [ExitCode.USAGE, ExitCode.CONFIG, ExitCode.PERMISSION, ExitCode.NOT_FOUND],
  run: (ctx) => {
    const available = loadMcpCatalog().servers;
    const clients = typeof ctx.options.client === "string" ? ctx.options.client.split(",").map((client) => client.trim()) : undefined;
    if (clients?.some((client) => !mcpClients.includes(client as McpClient))) {
      throw error.usage(`Unknown MCP client. Choose from: ${mcpClients.join(", ")}.`);
    }
    const selected = ctx.args.length ? ctx.args.map((id) => {
      const server = available.find((entry) => entry.id === id);
      if (!server) throw error.notFound(`Unknown MCP server "${id}".`, { known: available.map((entry) => entry.id) });
      return server;
    }) : available.filter((entry) => entry.default);
    const dryRun = ctx.options["dry-run"] === true;
    const plan = applySetup(process.cwd(), {
      servers: selected, clients: clients as McpClient[] | undefined, force: ctx.options.force === true, dryRun,
    });
    for (const entry of plan.entries) {
      if (entry.action === "conflict") ctx.stderr(`Different entry for ${entry.id} in ${entry.file}. Use --force to replace it.`);
    }
    return {
      data: { ...plan, dryRun },
      text: () => plan.entries.length ? table(plan.entries.map(({ client, id, action, file }) => [
        `${client} / ${id}`, `${dryRun ? "planned " : ""}${action} · ${file}`,
      ])) : "No MCP servers selected.",
    };
  },
};

export const mcpCommand: Command = {
  name: "mcp",
  description: "Start the MCP server (stdio) with tools, resources and prompts for agents.",
  longDescription:
    `Configure in the MCP client: { "command": "${manifest.bin}", "args": ["mcp"] }.\n` +
    `Run "${manifest.bin} mcp --list" to see the registered tools, resources and prompts.\n` +
    `No tool returns the value of a credential.`,
  options: [
    { name: "--list", description: "Instead of starting the server, list registered tools, resources and prompts and exit." },
    { name: "--read-only", description: "Register only the tools that do not write to the project (leaves out components_add and capture_run)." },
  ],
  subcommands: [servers, setup],
  exitCodes: [ExitCode.MCP],
  examples: [`${manifest.bin} mcp`, `${manifest.bin} mcp --list --json`, `${manifest.bin} mcp --read-only`],
  run: async (ctx) => {
    const { describeServer, startStdioServer } = await import("../../mcp/server.ts");
    const readOnly = ctx.options["read-only"] === true;
    if (ctx.options.list === true) {
      const d = describeServer({ readOnly });
      return {
        data: d,
        text: () =>
          [
            `MCP server ${d.name} v${d.version}`,
            "",
            "Tools:",
            ...d.tools.map((t) => `  ${t.name}  ${t.description}`),
            "",
            "Resources:",
            ...d.resources.map((r) => `  ${r.uri}  ${r.description}`),
            "",
            "Prompts:",
            ...d.prompts.map((p) => `  ${p.name}  ${p.description}`),
          ].join("\n"),
      };
    }
    await startStdioServer({ readOnly });
    return { data: { closed: true }, text: "" };
  },
};
