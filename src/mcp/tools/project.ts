/** Registers the read-only MCP tools for project, skill and dependency state. */
import { z } from "zod";
import { AppError } from "../../app/errors.ts";
import { getProjectStatus, projectStatusSchema } from "../../cli/commands/status.ts";
import { checkDependencies, dependencyGroupStateSchema, listDependencies } from "../../design/deps.ts";
import { listSkills, skillStateSchema } from "../../design/skills.ts";
import { projectInput, toolProject } from "../project.ts";
import type { Registrar } from "../server.ts";

const annotations = { readOnlyHint: true, destructiveHint: false, openWorldHint: false };
const group = z.string().trim().min(1).optional().describe("Catalog dependency group ID. Omit to use the tool's default scope.");

function response(collect: () => Record<string, unknown>, isFailure?: (data: Record<string, unknown>) => boolean) {
  try {
    const data = collect();
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      structuredContent: data,
      isError: isFailure?.(data),
    };
  } catch (cause) {
    const error = cause instanceof AppError ? { code: cause.code } : {};
    const data = { ...error, message: "Could not read project data. Check the project files and catalog configuration." };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      structuredContent: data,
      isError: true,
    };
  }
}

/** Registers project_status, skills_list, deps_list and deps_check. */
export function registerProjectTools({ server, catalog }: Registrar): void {
  const statusDescription = "Use to inspect the current web project. Returns detection, effective project settings, installation counts, viewspec progress, guide counts and the Tailwind stylesheet.";
  catalog.tools.push({ name: "project_status", description: statusDescription });
  server.registerTool("project_status", {
    title: "Project status",
    description: statusDescription,
    inputSchema: { project: projectInput },
    outputSchema: projectStatusSchema,
    annotations,
  }, async ({ project }) => response(() => getProjectStatus(toolProject(project))));

  const skillsDescription = "Use to discover catalog skills. Returns the skills and their project or global installation scope.";
  catalog.tools.push({ name: "skills_list", description: skillsDescription });
  server.registerTool("skills_list", {
    title: "List skills",
    description: skillsDescription,
    inputSchema: {
      project: projectInput,
      internal: z.boolean().optional().describe("Include internal skills."),
      external: z.boolean().optional().describe("Include external skills."),
    },
    outputSchema: { skills: z.array(skillStateSchema) },
    annotations,
  }, async ({ project, ...filters }) => response(() => ({ skills: listSkills(toolProject(project), filters) })));

  const listDescription = "Use to inspect suggested dependencies. Returns catalog groups and package versions and states.";
  catalog.tools.push({ name: "deps_list", description: listDescription });
  server.registerTool("deps_list", {
    title: "List dependencies",
    description: listDescription,
    inputSchema: { project: projectInput, group },
    outputSchema: { groups: z.array(dependencyGroupStateSchema) },
    annotations,
  }, async ({ project, group }) => response(() => ({ groups: listDependencies(toolProject(project), group) })));

  const checkDescription = "Use to verify dependencies for a group or the project's defaults and for copied components. Returns missing and outdated package names.";
  catalog.tools.push({ name: "deps_check", description: checkDescription });
  server.registerTool("deps_check", {
    title: "Check dependencies",
    description: checkDescription,
    inputSchema: { project: projectInput, group },
    outputSchema: { ok: z.boolean(), missing: z.array(z.string()), outdated: z.array(z.string()) },
    annotations,
  }, async ({ project, group }) => response(() => ({ ...checkDependencies(toolProject(project), group) }), (data) => data.ok === false));
}
