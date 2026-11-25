/** Registers read-only MCP tools for local screen viewspecs and the project guide. */
import { z } from "zod";
import { AppError, error } from "../../app/errors.ts";
import {
  guideFrontMatterSchema, listViewspecSummaries, readGuide, readViewspec, readViewspecProgress,
  validateProjectViewspecs, viewFrontMatterSchema, viewKinds, viewStatuses,
} from "../../design/viewspec.ts";
import { projectInput, toolProject } from "../project.ts";
import type { Registrar } from "../server.ts";

const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const id = z.string().regex(/^[0-9]{4}$/).describe("Four-digit screen viewspec id with leading zeros.");
const status = z.enum(viewStatuses);
const kind = z.enum(viewKinds);
const count = z.number().int().nonnegative();
const progressSchema = z.object({ done: count, total: count });
const errorsSchema = z.array(z.object({
  file: z.string(), line: z.number().int().positive().optional(), field: z.string().optional(), message: z.string(),
}));
const sectionSchema = z.object({ title: z.string(), text: z.string(), line: z.number() });
const origin = z.enum(["@agente", "@pessoa", "@revisão"]);
const learning = z.object({ origin, date: z.string(), text: z.string(), destination: z.string(), line: z.number() });
const guideDescription = "Read the local project VIEWSPEC.md guide, including rules, learnings and pending proposals.";
const listDescription = "List local screen viewspec summaries and checklist progress, with optional status and kind filters.";
const showDescription = "Read one local screen viewspec, including its front matter, Markdown sections and checklist.";
const progressDescription = "Summarize local screen viewspec counts by status, checklist completion and the next free id.";
const validateDescription = "Check the local guide and one or all screen viewspecs, returning file and line diagnostics.";

type Report = Record<string, unknown> & { errors: unknown[] };

function report(run: () => Report) {
  try {
    const data = run();
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      structuredContent: data,
      isError: data.errors.length > 0,
    };
  } catch (cause) {
    if (!(cause instanceof AppError)) throw cause;
    const data = { error: cause.toJSON() };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      isError: true,
    };
  }
}

/** Registers all viewspec tools and their discovery metadata. */
export function registerViewspecTools({ server, catalog }: Registrar): void {
  catalog.tools.push(
    { name: "viewspec_guide", description: guideDescription },
    { name: "viewspec_list", description: listDescription },
    { name: "viewspec_show", description: showDescription },
    { name: "viewspec_progress", description: progressDescription },
    { name: "viewspec_validate", description: validateDescription },
  );
  server.registerTool("viewspec_guide", {
    title: "Read project interface guide",
    description: guideDescription,
    annotations,
    inputSchema: { project: projectInput },
    outputSchema: {
      file: z.string(), exists: z.boolean(), frontMatter: guideFrontMatterSchema.nullable(),
      sections: z.array(sectionSchema),
      rules: z.array(z.object({ id: z.string(), section: z.string(), origin, text: z.string(), line: z.number() })),
      learnings: z.array(learning), pendingProposals: z.array(learning),
      bySection: z.record(z.string(), count), byOrigin: z.record(origin, count), errors: errorsSchema,
    },
  }, async ({ project }) => report(() => {
    const guide = readGuide(toolProject(project));
    if (!guide.exists) throw error.notFound("Project guide VIEWSPEC.md is missing from the project root.", { file: guide.file });
    return guide;
  }));
  server.registerTool("viewspec_list", {
    title: "List screen viewspecs",
    description: listDescription,
    annotations,
    inputSchema: {
      project: projectInput,
      status: status.optional().describe("Filter by status. Omit to include all statuses."),
      kind: kind.optional().describe("Filter by screen kind. Omit to include all kinds."),
    },
    outputSchema: {
      items: z.array(z.object({
        file: z.string(), id, title: z.string(), summary: z.string(), kind, status, progress: progressSchema,
      })),
      errors: errorsSchema, nextId: id.nullable(),
    },
  }, async ({ project, ...filter }) => report(() => listViewspecSummaries(toolProject(project), filter)));
  server.registerTool("viewspec_show", {
    title: "Read screen viewspec",
    description: showDescription,
    annotations,
    inputSchema: { project: projectInput, id },
    outputSchema: {
      item: z.object({
        file: z.string(), frontMatter: viewFrontMatterSchema, sections: z.array(sectionSchema), progress: progressSchema,
        checklist: z.array(z.object({ id: z.string(), text: z.string(), done: z.boolean(), skill: z.string(), line: z.number() })),
      }).nullable(),
      errors: errorsSchema,
    },
  }, async ({ project, id: viewId }) => report(() => {
    const cwd = toolProject(project);
    const { item, found, errors } = readViewspec(cwd, viewId);
    if (!found && !errors.length) {
      const known = listViewspecSummaries(cwd).items.map(({ id }) => id);
      throw error.notFound(`No screen viewspec uses id "${viewId}". Use viewspec_list to discover available screens.`, { id: viewId, known });
    }
    return { item, errors };
  }));
  server.registerTool("viewspec_progress", {
    title: "Summarize viewspec progress",
    description: progressDescription,
    annotations,
    inputSchema: { project: projectInput },
    outputSchema: { ...progressSchema.shape, byStatus: z.record(status, count), nextId: id.nullable(), errors: errorsSchema },
  }, async ({ project }) => report(() => readViewspecProgress(toolProject(project))));
  server.registerTool("viewspec_validate", {
    title: "Validate project viewspecs",
    description: validateDescription,
    annotations,
    inputSchema: { project: projectInput, id: id.optional().describe("Screen viewspec id. Omit to validate all screens and the project guide.") },
    outputSchema: { valid: z.boolean(), guide: z.enum(["missing", "valid", "invalid"]), errors: errorsSchema },
  }, async ({ project, id: viewId }) => report(() => validateProjectViewspecs(toolProject(project), viewId)));
}
