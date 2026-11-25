/** Shared input and directory resolution for project-scoped MCP tools. */
import { z } from "zod";
import { resolveProjectDirectory } from "../design/project.ts";

export const projectInput = z.string().min(1).optional()
  .describe("Project directory, absolute or relative to the server working directory. Omit to use the server directory.");

/** Resolves a call's project without changing the server working directory. */
export function toolProject(project?: string): string {
  return resolveProjectDirectory(process.cwd(), project);
}
