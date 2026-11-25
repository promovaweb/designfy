/** Reports project detection and the state of its Designfy resources. */
import { z } from "zod";
import { AppError } from "../../app/errors.ts";
import { ExitCode } from "../../app/exit-codes.ts";
import { manifest } from "../../app/manifest.ts";
import { listDependencies } from "../../design/deps.ts";
import { detectProject, projectDetectionSchema, projectConfigSchema, resolveProject } from "../../design/project.ts";
import { countCopiedComponents } from "../../design/registry.ts";
import { findThemeFile } from "../../design/theme.ts";
import { readGuide, readViewspecProgress, viewStatuses } from "../../design/viewspec.ts";
import { listSkills } from "../../design/skills.ts";
import { table } from "../format.ts";
import type { Command } from "../registry.ts";

export const projectStatusSchema = z.object({
  detected: projectDetectionSchema,
  project: projectConfigSchema,
  skillsInstalled: z.number().int(),
  dependenciesPresent: z.number().int(),
  componentsCopied: z.number().int(),
  viewspecs: z.object({
    byStatus: z.record(z.enum(viewStatuses), z.number().int()),
    total: z.number().int(),
    nextId: z.string().nullable(),
  }),
  guide: z.object({ exists: z.boolean(), rules: z.number().int(), pendingProposals: z.number().int() }),
  theme: z.object({ found: z.boolean(), file: z.string().nullable() }),
});

export type ProjectStatus = z.infer<typeof projectStatusSchema>;

/** Collects project status for the CLI and MCP. */
export function getProjectStatus(cwd: string): ProjectStatus {
  const detected = detectProject(cwd);
  const project = resolveProject(cwd);
  const skillsInstalled = listSkills(cwd).filter((skill) => skill.installed !== "no").length;
  const present = listDependencies(cwd).flatMap((group) => group.packages)
    .filter((pkg) => pkg.state !== "missing").map((pkg) => pkg.name);
  const { byStatus, nextId } = readViewspecProgress(cwd);
  const guide = readGuide(cwd);
  let themeFile: string | null = null;
  try {
    themeFile = findThemeFile(cwd);
  } catch (cause) {
    if (!(cause instanceof AppError) || cause.code !== ExitCode.NOT_FOUND) throw cause;
  }
  return {
    detected,
    project,
    skillsInstalled,
    dependenciesPresent: new Set(present).size,
    componentsCopied: countCopiedComponents(cwd),
    viewspecs: { byStatus, total: Object.values(byStatus).reduce((sum, count) => sum + count, 0), nextId },
    guide: { exists: guide.exists, rules: guide.rules.length, pendingProposals: guide.pendingProposals.length },
    theme: { found: themeFile !== null, file: themeFile },
  };
}

export const statusCommand: Command = {
  name: "status",
  description: "Show the detected project and its Designfy installation state.",
  examples: [`${manifest.bin} status`, `${manifest.bin} status --json`],
  exitCodes: [ExitCode.CONFIG, ExitCode.NOT_FOUND, ExitCode.PERMISSION],
  run: () => {
    const data = getProjectStatus(process.cwd());
    return {
      data,
      text: () => table([
        ["Framework", data.project.framework],
        ["Detected framework", data.detected.framework],
        ["TypeScript", data.project.typescript ? "yes" : "no"],
        ["Package manager", data.project.packageManager],
        ["Tailwind major", data.project.tailwind?.toString() ?? "none"],
        ["shadcn", data.project.shadcn ? "yes" : "no"],
        ["Skills installed", String(data.skillsInstalled)],
        ["Dependencies present", String(data.dependenciesPresent)],
        ["Components copied", String(data.componentsCopied)],
        ["Viewspecs", String(data.viewspecs.total)],
        ...Object.entries(data.viewspecs.byStatus).map(([status, count]): [string, string] => [`  ${status}`, String(count)]),
        ["Next viewspec ID", data.viewspecs.nextId ?? "none"],
        ["Viewspec guide", data.guide.exists ? `${data.guide.rules} rules, ${data.guide.pendingProposals} pending proposals` : "not found"],
        ["Tailwind theme", data.theme.file ?? "not found"],
      ]),
    };
  },
};
