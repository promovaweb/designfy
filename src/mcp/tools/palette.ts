/** Read-only MCP tools for palette generation, color harmonies, and contrast. */
import { z } from "zod";
import { AppError } from "../../app/errors.ts";
import { describeContrast, describeWheel, generatePalette, harmonyNames } from "../../design/color.ts";
import type { Registrar } from "../server.ts";

const colorInput = (role: string) => z.string().min(1).max(512).describe(`${role} as #RGB, #RRGGBB, or oklch(L C H).`);
const colorDescription = z.object({ hex: z.string(), oklch: z.string() });
const oklch = z.object({ l: z.number(), c: z.number(), h: z.number() });
const textVerdict = z.object({ aa: z.boolean(), aaa: z.boolean() });
const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

function respond<T extends Record<string, unknown>>(query: () => T) {
  try {
    const data = query();
    return { structuredContent: data, content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  } catch (cause) {
    const text = cause instanceof AppError ? cause.message : "Could not calculate the requested colors.";
    return { isError: true, content: [{ type: "text" as const, text }] };
  }
}

/** Registers the palette generation, wheel, and contrast tools. */
export function registerPaletteTools({ server, catalog }: Registrar): void {
  const generate = "Generate OKLCH scales, light and dark tokens, and WCAG ratios from a base color and optional harmony.";
  catalog.tools.push({ name: "palette_generate", description: generate });
  server.registerTool("palette_generate", {
    title: "Generate a design palette",
    description: generate,
    annotations,
    inputSchema: {
      base: colorInput("Base color"),
      harmony: z.enum(harmonyNames).optional().describe("Color-wheel harmony for additional accent scales."),
    },
    outputSchema: {
      scales: z.record(z.string(), z.record(z.string(), oklch)),
      semantic: z.object({ light: z.record(z.string(), oklch), dark: z.record(z.string(), oklch) }),
      contrast: z.array(z.object({ mode: z.enum(["light", "dark"]), foreground: z.string(), background: z.string(), ratio: z.number() })),
    },
  }, (input) => respond(() => ({ ...generatePalette(input) })));

  const wheel = "Find the companion colors for every color-wheel harmony, with hex and OKLCH for each color.";
  catalog.tools.push({ name: "palette_wheel", description: wheel });
  server.registerTool("palette_wheel", {
    title: "Explore the color wheel",
    description: wheel,
    annotations,
    inputSchema: { color: colorInput("Base color") },
    outputSchema: { base: colorDescription, harmonies: z.record(z.string(), z.array(colorDescription)) },
  }, ({ color }) => respond(() => describeWheel(color)));

  const contrast = "Measure the WCAG ratio and signed APCA Lc, and return WCAG verdicts for normal text, large text, and UI components.";
  catalog.tools.push({ name: "palette_contrast", description: contrast });
  server.registerTool("palette_contrast", {
    title: "Measure color contrast",
    description: contrast,
    annotations,
    inputSchema: { foreground: colorInput("Foreground color"), background: colorInput("Background color") },
    outputSchema: {
      foreground: colorDescription,
      background: colorDescription,
      ratio: z.number(),
      apca: z.number(),
      verdicts: z.object({
        normalText: textVerdict, largeText: textVerdict,
        uiComponent: z.object({ aa: z.boolean(), aaa: z.null() }),
      }),
    },
  }, ({ foreground, background }) => respond(() => describeContrast(foreground, background)));
}
