/** Exposes interface catalog filtering, lookup, and search as read-only MCP tools. */
import { z } from "zod";
import { AppError } from "../../app/errors.ts";
import { getEntry, interfaceEntrySchema, interfaceKinds, interfaceSurfaces, listEntries, searchEntries } from "../../design/interface-catalog.ts";
import type { Registrar } from "../server.ts";

const entryList = { entries: z.array(interfaceEntrySchema) };

function reply(operation: () => Record<string, unknown>) {
  try {
    const data = operation();
    return { content: [{ type: "text" as const, text: JSON.stringify(data) }], structuredContent: data };
  } catch (cause) {
    if (!(cause instanceof AppError)) throw cause;
    const data = { error: cause.toJSON() };
    return { content: [{ type: "text" as const, text: JSON.stringify(data) }], isError: true };
  }
}

/** Registers the interface catalog query tools. */
export function registerInterfaceCatalogTools({ server, catalog }: Registrar): void {
  const list = "List candidate interface fragments for a site or system. Returns entries filtered by surface, category, and viewspec kind.";
  catalog.tools.push({ name: "catalog_list", description: list });
  server.registerTool("catalog_list", {
    title: "List interface fragments",
    description: list,
    inputSchema: {
      surface: z.enum(interfaceSurfaces).optional().describe("Target interface surface."),
      category: z.string().min(1).optional().describe("Catalog category ID."),
      kind: z.enum(interfaceKinds).optional().describe("Viewspec kind the fragment should suit."),
    },
    outputSchema: entryList,
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, (filters) => reply(() => ({ entries: listEntries(filters) })));

  const show = "Read a known interface fragment by ID. Returns its purpose, anatomy, variants, states, tokens, and implementation sources.";
  catalog.tools.push({ name: "catalog_show", description: show });
  server.registerTool("catalog_show", {
    title: "Show interface fragment",
    description: show,
    inputSchema: { id: z.string().min(1).describe("Interface fragment ID, such as hero-split.") },
    outputSchema: interfaceEntrySchema,
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, ({ id }) => reply(() => getEntry(id)));

  const search = "Find interface fragments when the ID is unknown. Searches names, purposes, use cases, and anatomy without case or accent sensitivity.";
  catalog.tools.push({ name: "catalog_search", description: search });
  server.registerTool("catalog_search", {
    title: "Search interface fragments",
    description: search,
    inputSchema: { text: z.string().trim().min(1).describe("Text to match in the interface catalog.") },
    outputSchema: entryList,
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, ({ text }) => reply(() => ({ entries: searchEntries(text) })));
}
