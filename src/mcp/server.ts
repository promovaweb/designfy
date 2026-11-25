/**
 * Embedded MCP server.
 *
 * Builds an `McpServer` with the tools, resources and prompts from `tools/`,
 * `resources/` and `prompts.ts`, and connects it to the stdio transport. The
 * same assembly feeds `mcp --list`, which describes what is registered
 * without opening the transport. To add a tool, create `tools/<name>.ts`
 * following the stub in `template/tool/` and register it in `registerAll`.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { manifest } from "../app/manifest.ts";
import { error } from "../app/errors.ts";
import { registerBaseTools } from "./tools/base.ts";
import { registerConfigTools } from "./tools/config.ts";
import { registerResources } from "./resources/base.ts";
import { registerPrompts } from "./prompts.ts";
import { registerDoctorTools } from "./tools/doctor.ts";
import { registerProjectTools } from "./tools/project.ts";
import { registerInterfaceCatalogTools } from "./tools/interface-catalog.ts";
import { registerComponentsReadTools, registerComponentsWriteTools } from "./tools/components.ts";
import { registerThemeTools } from "./tools/theme.ts";
import { registerPaletteTools } from "./tools/palette.ts";
import { registerViewspecTools } from "./tools/viewspec.ts";
import { registerCaptureReadTools, registerCaptureWriteTools } from "./tools/capture.ts";
import { registerMcpServersTools } from "./tools/mcp-servers.ts";

/** Options that shape what the server registers. */
export interface ServerOptions {
  /** Leaves out the tools that write to the project (components_add, capture_run). */
  readOnly?: boolean;
}

/** Metadata collected during registration, for `mcp --list`. */
export interface Catalog {
  name: string;
  version: string;
  tools: Array<{ name: string; description: string }>;
  resources: Array<{ uri: string; name: string; description: string }>;
  prompts: Array<{ name: string; description: string }>;
}

/** Registrar that accumulates metadata while registering on the server. */
export interface Registrar {
  server: McpServer;
  catalog: Catalog;
}

function createServer(options: ServerOptions = {}): Registrar {
  const server = new McpServer(
    { name: manifest.bin, version: manifest.version },
    {
      instructions:
        `${manifest.title}: ${manifest.description} ` +
        `Use the "skill" tool or the ${manifest.bin}://skill/cli resource to read the full documentation before calling other tools. ` +
        `No tool returns credential values.`,
    },
  );
  const catalog: Catalog = { name: manifest.bin, version: manifest.version, tools: [], resources: [], prompts: [] };
  const registrar: Registrar = { server, catalog };
  registerAll(registrar, options);
  return registrar;
}

function registerAll(r: Registrar, options: ServerOptions): void {
  registerBaseTools(r);
  registerConfigTools(r);
  registerDoctorTools(r);
  registerProjectTools(r);
  registerInterfaceCatalogTools(r);
  registerComponentsReadTools(r);
  registerThemeTools(r);
  registerPaletteTools(r);
  registerViewspecTools(r);
  registerCaptureReadTools(r);
  registerMcpServersTools(r);
  if (!options.readOnly) {
    registerComponentsWriteTools(r);
    registerCaptureWriteTools(r);
  }
  registerResources(r);
  registerPrompts(r);
}

/** Describes the server without opening a transport. */
export function describeServer(options: ServerOptions = {}): Catalog {
  return createServer(options).catalog;
}

/** Starts the server on stdio and waits for the transport to close. */
export async function startStdioServer(options: ServerOptions = {}): Promise<void> {
  const { server } = createServer(options);
  const transport = new StdioServerTransport();
  try {
    await server.connect(transport);
  } catch (e) {
    throw error.mcp(`Failed to start the MCP server: ${e instanceof Error ? e.message : String(e)}`);
  }
  process.stderr.write(`${manifest.bin} mcp: stdio server running (pid ${process.pid})\n`);
  await new Promise<void>((resolve) => {
    transport.onclose = () => resolve();
    process.stdin.on("end", () => resolve());
  });
}
