/** Exposes Tailwind theme inspection and contrast checks as read-only MCP tools. */
import { z } from "zod";
import { AppError } from "../../app/errors.ts";
import {
  checkTheme, readTheme, themeGroups, themeSelections, themeSources,
} from "../../design/theme.ts";
import { projectInput, toolProject } from "../project.ts";
import type { Registrar } from "../server.ts";

const fileInput = z.string().min(1).optional().describe("Explicit CSS path, relative to the selected project directory or absolute.");
const value = z.object({ declared: z.string(), resolved: z.string().nullable() }).nullable();
const token = z.object({ name: z.string(), light: value, dark: value, darkOverride: z.literal(true).optional() });
const tokens = z.array(token);
const mode = z.enum(["light", "dark"]);
const contrast = z.object({
  mode, foreground: z.string(), background: z.string(), ratio: z.number().nullable(),
  status: z.enum(["pass", "fail", "missing", "unresolved"]),
  label: z.string().optional(), min: z.number().optional(),
});
const sources = {
  file: z.string(), files: z.array(z.string()), tailwind: z.union([z.literal(3), z.literal(4)]),
  configFile: z.string().nullable(), warnings: z.array(z.string()),
  selection: z.enum(themeSelections), entryFile: z.string().nullable(),
};
const showOutput = {
  ...sources,
  colors: tokens.optional(), fonts: tokens.optional(), weights: tokens.optional(),
  text: z.array(token.extend({ lineHeight: token.nullable() })).optional(),
  radius: tokens.optional(), spacing: tokens.optional(), shadows: tokens.optional(), breakpoints: tokens.optional(),
  motion: z.object({ tokens, keyframes: z.array(z.string()) }).optional(),
  other: tokens.optional(),
};
const checkOutput = {
  ...sources, ok: z.boolean(), contrast: z.array(contrast),
  mode: z.enum(["shadcn", "custom"]), notes: z.array(z.string()),
  missingRoles: z.array(z.object({ role: z.string(), modes: z.array(mode) })),
  summary: z.object({ passed: z.number(), failed: z.number(), missing: z.number(), unresolved: z.number() }),
};

async function reply(operation: () => Promise<Record<string, unknown>>, check = false) {
  try {
    const data = await operation();
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data) }],
      structuredContent: data,
      ...(check && data.ok === false ? { isError: true } : {}),
    };
  } catch (cause) {
    if (!(cause instanceof AppError)) throw cause;
    const data = { error: cause.toJSON() };
    return { content: [{ type: "text" as const, text: JSON.stringify(data) }], isError: true };
  }
}

/** Registers theme inspection and validation tools for the current project. */
export function registerThemeTools({ server, catalog }: Registrar): void {
  const show = "Read the project's Tailwind stylesheet and, for Tailwind 3, its configuration. Returns declared and resolved tokens, including colors in both modes.";
  catalog.tools.push({ name: "theme_show", description: show });
  server.registerTool("theme_show", {
    title: "Show Tailwind theme",
    description: show,
    inputSchema: { project: projectInput, file: fileInput, group: z.enum(themeGroups).optional().describe("Restrict the result to one token group.") },
    outputSchema: showOutput,
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, ({ project, file, group }) => reply(async () => {
    const theme = await readTheme(toolProject(project), { file });
    return group ? { ...themeSources(theme), [group]: theme[group] } : { ...theme };
  }));

  const check = "Check color contrast in shadcn and custom themes. Returns the audit mode, pair results and any missing shadcn roles.";
  catalog.tools.push({ name: "theme_check", description: check });
  server.registerTool("theme_check", {
    title: "Check Tailwind theme",
    description: check,
    inputSchema: { project: projectInput, file: fileInput },
    outputSchema: checkOutput,
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, ({ project, file }) => reply(async () => {
    const cwd = toolProject(project);
    return { ...checkTheme(await readTheme(cwd, { file }), { cwd }) };
  }, true));
}
