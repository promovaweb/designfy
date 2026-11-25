/** Exposes Tailwind theme inspection and contrast checks as read-only MCP tools. */
import { z } from "zod";
import { AppError } from "../../app/errors.ts";
import {
  checkTheme, readTheme, requiredThemeRoles, themeGroups,
} from "../../design/theme.ts";
import type { Registrar } from "../server.ts";

const fileInput = z.string().min(1).optional().describe("Explicit CSS path, relative to the server working directory or absolute.");
const value = z.object({ declared: z.string(), resolved: z.string().nullable() }).nullable();
const token = z.object({ name: z.string(), light: value, dark: value });
const tokens = z.array(token);
const mode = z.enum(["light", "dark"]);
const contrast = z.object({
  mode, foreground: z.string(), background: z.string(), ratio: z.number().nullable(),
  status: z.enum(["pass", "fail", "missing", "unresolved"]),
});
const showOutput = {
  file: z.string(), files: z.array(z.string()),
  colors: tokens.optional(), fonts: tokens.optional(), weights: tokens.optional(),
  text: z.array(token.extend({ lineHeight: token.nullable() })).optional(),
  radius: tokens.optional(), spacing: tokens.optional(), shadows: tokens.optional(), breakpoints: tokens.optional(),
  motion: z.object({ tokens, keyframes: z.array(z.string()) }).optional(),
  other: tokens.optional(),
};
const checkOutput = {
  file: z.string(), ok: z.boolean(), contrast: z.array(contrast),
  missingRoles: z.array(z.object({ role: z.string(), modes: z.array(mode) })),
  summary: z.object({ passed: z.number(), failed: z.number(), missing: z.number(), unresolved: z.number() }),
};

function reply(operation: () => Record<string, unknown>, check = false) {
  try {
    const data = operation();
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
  const show = "Read the current project's Tailwind stylesheet. Returns declared and resolved tokens, including colors in both modes.";
  catalog.tools.push({ name: "theme_show", description: show });
  server.registerTool("theme_show", {
    title: "Show Tailwind theme",
    description: show,
    inputSchema: { file: fileInput, group: z.enum(themeGroups).optional().describe("Restrict the result to one token group.") },
    outputSchema: showOutput,
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, ({ file, group }) => reply(() => {
    const theme = readTheme(process.cwd(), { file });
    return group ? { file: theme.file, files: theme.files, [group]: theme[group] } : { ...theme };
  }));

  const check = "Check known color contrast pairs and required registry roles. Returns light and dark results and a pass or fail summary.";
  catalog.tools.push({ name: "theme_check", description: check });
  server.registerTool("theme_check", {
    title: "Check Tailwind theme",
    description: check,
    inputSchema: { file: fileInput },
    outputSchema: checkOutput,
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, ({ file }) => reply(() => {
    const cwd = process.cwd();
    return { ...checkTheme(readTheme(cwd, { file }), { requiredRoles: requiredThemeRoles(cwd) }) };
  }, true));
}
