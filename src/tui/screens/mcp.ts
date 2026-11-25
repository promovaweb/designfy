/** Inspects MCP servers across clients and applies approved project configuration changes. */
import { join } from "node:path";
import { loadMcpCatalog, type McpServerEntry } from "../../design/catalog.ts";
import { applySetup, detectClients, mcpClients, planSetup, type McpClient, type SetupEntry } from "../../design/mcp-clients.ts";
import { commandLine, projectScreen, shortcut } from "./project-screen.ts";

type ServerRow = McpServerEntry & { clients: SetupEntry[] };

/** Creates the MCP server and client configuration screen. */
export function createMcpScreen() {
  let client: McpClient | undefined;
  let force = false;
  let detected: McpClient[] = [];
  return projectScreen<ServerRow>({
    id: "mcp", title: "MCP", icon: "agent", description: "Inspect and configure catalog MCP servers in project clients",
    empty: "No MCP servers in the catalog", multiple: true, listTitle: "MCP servers", detailTitle: "Clients",
    summary: () => `Client: ${client ?? "auto"} · Force: ${force ? "on" : "off"}`,
    watch: (cwd) => [".mcp.json", ".codex/config.toml", "opencode.json", ".cursor/mcp.json", ".gemini/settings.json"].map((file) => join(cwd, file)),
    load(cwd) {
      detected = detectClients(cwd);
      const { servers } = loadMcpCatalog();
      const plan = planSetup(cwd, { servers, clients: mcpClients, force });
      return servers.map((server) => ({ ...server, clients: plan.entries.filter(({ id }) => id === server.id) }));
    },
    label: (server) => {
      const count = server.clients.filter(({ state }) => state === "same").length;
      return { content: server.title, detail: server.description, state: count ? "installed" : "available",
        stateLabel: count ? `${count} clients` : "Available" };
    },
    detail(server, view) {
      view.heading(server.title);
      view.text(server.description);
      view.field("Command", commandLine(server));
      view.heading("Configuration state");
      for (const entry of server.clients) {
        const selected = client ? entry.client === client : detected.length ? detected.includes(entry.client) : entry.client === "claude";
        view.tag(entry.state === "different" ? "outdated" : entry.state === "same" ? "installed" : "available",
          `${selected ? "> " : ""}${entry.client} · ${entry.state}`);
      }
    },
    actions: [
      shortcut("return", "focus clients", (view) => view.focusDetail(), "Enter"),
      shortcut("c", "next client", (view) => {
        client = mcpClients[client === undefined ? 0 : mcpClients.indexOf(client) + 1];
        return view.reload();
      }),
      shortcut("f", "toggle force", (view) => { force = !force; return view.reload(); }),
      shortcut("i", "write config", (view) => view.confirmPlan("i", "Writing MCP configuration…", () => {
        const servers = view.visibleMarks;
        if (!servers.length) { view.ctx.notify("Mark at least one server", "warn"); return; }
        const options = { servers, clients: client ? [client] : undefined, force };
        const plan = planSetup(view.cwd, options);
        const conflicts = plan.entries.filter(({ action }) => action === "conflict");
        if (conflicts.length) {
          view.report({ summary: "Existing MCP entries differ · use f to allow replacement", lines: conflicts.map(({ id, file }) => `${id} · ${file}`) });
          return;
        }
        return {
          title: "Write MCP configuration",
          lines: plan.entries.map(({ action, id, file }) => `${action}: ${id} → ${file}`),
          apply() {
            const { written } = applySetup(view.cwd, options);
            return { summary: `${written.length} MCP files written`, lines: written };
          },
        };
      })),
    ],
  });
}
