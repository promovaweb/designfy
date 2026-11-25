/** Registers MCP tools for reading and copying embedded Designfy components. */
import { z } from "zod";
import { AppError } from "../../app/errors.ts";
import { detectProject, frameworks, resolveProject } from "../../design/project.ts";
import { applyAdd, getItem, listItems, planAdd, registryItemSchema, tailwindRegistryNote } from "../../design/registry.ts";
import { projectInput, toolProject } from "../project.ts";
import type { Registrar } from "../server.ts";

const framework = z.enum(frameworks).optional().describe("Registry framework. Defaults to the current project framework.");
const fileMetadata = registryItemSchema.shape.files.element.omit({ content: true });
const itemMetadata = registryItemSchema.extend({ files: z.array(fileMetadata) });

function content(data: Record<string, unknown>) {
  return [{ type: "text" as const, text: JSON.stringify(data, null, 2) }];
}

function query(read: () => Record<string, unknown>) {
  try {
    const data = read();
    return { content: content(data), structuredContent: data };
  } catch (cause) {
    if (cause instanceof AppError) return { content: content({ error: cause.toJSON() }), isError: true };
    throw cause;
  }
}

/** Registers the component discovery and detail tools in every MCP mode. */
export function registerComponentsReadTools({ server, catalog }: Registrar): void {
  const listDescription = "Use to find Designfy components. Returns metadata filtered by framework, category, and surface.";
  catalog.tools.push({ name: "components_list", description: listDescription });
  server.registerTool("components_list", {
    title: "List Designfy components",
    description: listDescription,
    annotations: { readOnlyHint: true, openWorldHint: false },
    inputSchema: {
      project: projectInput,
      framework,
      category: z.string().min(1).optional().describe("Registry category to match."),
      surface: z.enum(["site", "system", "both"]).optional().describe("Surface to match. Shared items also match site and system."),
    },
    outputSchema: { warning: z.string().optional(), framework: z.enum(frameworks), items: z.array(itemMetadata) },
  }, (input) => query(() => {
    const cwd = toolProject(input.project);
    const selected = input.framework ?? resolveProject(cwd).framework;
    const warning = tailwindRegistryNote(detectProject(cwd).tailwind);
    const items = listItems({ ...input, framework: selected }).map(({ files, ...item }) => ({
      ...item,
      files: files.map(({ content: _content, ...file }) => file),
    }));
    return { framework: selected, ...(warning ? { warning } : {}), items };
  }));

  const showDescription = "Use to inspect a Designfy component. Returns its files, dependency requirements, and optional source.";
  catalog.tools.push({ name: "components_show", description: showDescription });
  server.registerTool("components_show", {
    title: "Show a Designfy component",
    description: showDescription,
    annotations: { readOnlyHint: true, openWorldHint: false },
    inputSchema: {
      project: projectInput,
      name: z.string().min(1).describe("Registry item name."),
      framework,
      source: z.boolean().optional().describe("Include the embedded source of every file. Defaults to false."),
    },
    outputSchema: {
      warning: z.string().optional(),
      framework: z.enum(frameworks),
      item: registryItemSchema.extend({ files: z.array(fileMetadata.extend({ content: z.string().optional() })) }),
    },
  }, (input) => query(() => {
    const cwd = toolProject(input.project);
    const selected = input.framework ?? resolveProject(cwd).framework;
    const warning = tailwindRegistryNote(detectProject(cwd).tailwind);
    const item = getItem(input.name, selected);
    const files = item.files.map(({ content, ...file }) => input.source ? { ...file, content } : file);
    return { framework: selected, ...(warning ? { warning } : {}), item: { ...item, files } };
  }));
}

/** Registers the component copy tool for write-enabled MCP mode. */
export function registerComponentsWriteTools({ server, catalog }: Registrar): void {
  const description = "Use to copy Designfy components and their dependencies into the current project. Writes files unless dryRun is set. Returns file changes and dependency requirements.";
  catalog.tools.push({ name: "components_add", description });
  server.registerTool("components_add", {
    title: "Copy Designfy components",
    description,
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    inputSchema: {
      project: projectInput,
      names: z.array(z.string().min(1)).nonempty().describe("Registry item names to copy."),
      framework,
      path: z.string().min(1).optional().describe("Destination directory override for component and style files."),
      overwrite: z.boolean().optional().describe("Replace differing files when true. Defaults to false."),
      allowTailwind3: z.boolean().optional().describe("Copy Tailwind 4 files into a Tailwind 3 project with a warning. Defaults to false."),
      dryRun: z.boolean().optional().describe("Predict changes without writing files. Defaults to false."),
    },
    outputSchema: {
      warning: z.string().optional(),
      framework: z.enum(frameworks),
      configured: z.boolean(),
      items: z.array(z.string()),
      written: z.array(z.string()),
      unchanged: z.array(z.string()),
      skipped: z.array(z.string()),
      missingDependencies: z.array(z.string()),
      missingDevDependencies: z.array(z.string()),
      shadcnItems: z.array(z.string()),
      dryRun: z.boolean(),
    },
  }, ({ project, names, dryRun, ...options }) => query(() => ({
    ...applyAdd(planAdd(toolProject(project), names, options), { dryRun }),
  })));
}
