/** Exposes catalog MCP servers and their project configuration status. */
import { z } from "zod";
import { listMcpServers, mcpClients } from "../../design/mcp-clients.ts";
import type { Registrar } from "../server.ts";

/** Registers a read-only MCP server catalog tool for the current project. */
export function registerMcpServersTools({ server, catalog }: Registrar): void {
  const description = "List recommended MCP servers and their configuration state per supported project client.";
  catalog.tools.push({ name: "mcp_servers", description });
  server.registerTool("mcp_servers", {
    title: "List catalog MCP servers",
    description,
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    inputSchema: {},
    outputSchema: {
      clients: z.array(z.enum(mcpClients)),
      servers: z.array(z.object({
        id: z.string(), title: z.string(), description: z.string(), command: z.string(),
        args: z.array(z.string()), url: z.string(), default: z.boolean(),
        states: z.record(z.string(), z.enum(["absent", "same", "different"])),
      })),
    },
  }, () => {
    try {
      const data = listMcpServers(process.cwd());
      return { structuredContent: data, content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    } catch {
      return { isError: true, content: [{ type: "text", text: "Could not read the MCP catalog or project client configuration." }] };
    }
  });
}
