/** Palette commands for generation, color-wheel harmonies, and contrast checks. */
import { writeFileSync } from "node:fs";
import { classifyFsError, error } from "../../app/errors.ts";
import { ExitCode } from "../../app/exit-codes.ts";
import { manifest } from "../../app/manifest.ts";
import {
  describeContrast, describeWheel, generatePalette, harmonyNames, toCss, toJson, toTailwindTheme, type Harmony,
} from "../../design/color.ts";
import { table } from "../format.ts";
import type { Command } from "../registry.ts";

const formatters = { css: toCss, json: toJson, tailwind: toTailwindTheme };
type PaletteFormat = keyof typeof formatters;
const colorSyntax = "#RGB, #RRGGBB, or oklch(L C H)";

const generate: Command = {
  name: "generate",
  description: "Generate OKLCH scales, semantic tokens, and contrast measurements.",
  options: [
    { name: "--base", argument: { name: "color" }, description: `Base color as ${colorSyntax}. Required.` },
    { name: "--harmony", argument: { name: "harmony", values: harmonyNames }, description: "Add accent scales from the selected color-wheel harmony." },
    { name: "--format", argument: { name: "format", values: Object.keys(formatters) }, default: "css", description: "Output shadcn CSS, JSON, or a Tailwind scale theme. Default: css." },
    { name: "--out", argument: { name: "file" }, description: "Write the selected format to a file." },
  ],
  examples: [
    `${manifest.bin} palette generate --base '#6750a4' --harmony analogous`,
    `${manifest.bin} palette generate --base '#6750a4' --format tailwind --out theme.css`,
  ],
  exitCodes: [ExitCode.USAGE, ExitCode.PERMISSION, ExitCode.NOT_FOUND],
  run: (ctx) => {
    const base = ctx.options.base;
    if (typeof base !== "string") throw error.usage("--base is required.");
    const format = (ctx.options.format ?? "css") as PaletteFormat;
    const harmony = ctx.options.harmony as Harmony | undefined;
    const palette = generatePalette({ base, harmony });
    const output = formatters[format](palette);
    const file = ctx.options.out;
    if (typeof file !== "string") return { data: palette, text: output };
    try {
      writeFileSync(file, output, "utf8");
    } catch (cause) {
      throw classifyFsError(cause, ExitCode.GENERIC_ERROR, `Cannot write palette to ${file}`);
    }
    return { data: { ...palette, file, format }, text: `Wrote palette to ${file}` };
  },
};

const wheel: Command = {
  name: "wheel",
  description: "Show the companion colors for all color-wheel harmonies.",
  arguments: [{ name: "color", description: `Color as ${colorSyntax}.`, required: true }],
  examples: [`${manifest.bin} palette wheel '#6750a4' --json`],
  exitCodes: [ExitCode.USAGE],
  run: (ctx) => {
    const data = describeWheel(ctx.args[0]!);
    const render = ({ hex, oklch }: typeof data.base) => `${hex} ${oklch}`;
    return {
      data,
      text: () => table([
        ["Base", render(data.base)],
        ...Object.entries(data.harmonies).map(([name, colors]): [string, string] => [name, colors.map(render).join(", ")]),
      ]),
    };
  },
};

const contrast: Command = {
  name: "contrast",
  description: "Measure WCAG 2.2 and APCA contrast and list the WCAG verdicts by use.",
  arguments: [
    { name: "foreground", description: `Foreground color as ${colorSyntax}.`, required: true },
    { name: "background", description: `Background color as ${colorSyntax}.`, required: true },
  ],
  options: [{ name: "--min", argument: { name: "ratio" }, description: "Exit with code 10 if the WCAG ratio is below this value (1–21)." }],
  examples: [`${manifest.bin} palette contrast '#000' '#fff' --min 4.5`],
  exitCodes: [ExitCode.USAGE, ExitCode.CHECK_FAILED],
  run: (ctx) => {
    const min = ctx.options.min === undefined ? undefined : Number(ctx.options.min);
    if (min !== undefined && (!Number.isFinite(min) || min < 1 || min > 21)) {
      throw error.usage("--min must be a WCAG contrast ratio from 1 to 21.");
    }
    const data = describeContrast(ctx.args[0]!, ctx.args[1]!);
    const passed = min === undefined || data.ratio >= min;
    const verdict = (result: boolean | null) => result === null ? "N/A" : result ? "pass" : "fail";
    const labels = { normalText: "Normal text", largeText: "Large text", uiComponent: "UI component" } as const;
    const minimum: [string, string][] = min === undefined ? [] : [["Minimum ratio", `${min}:1 (${verdict(passed)})`]];
    return {
      data: min === undefined ? data : { ...data, min, passed },
      text: () => table([
        ["Foreground", data.foreground.hex],
        ["Background", data.background.hex],
        ["WCAG ratio", `${data.ratio.toFixed(2)}:1`],
        ["APCA", `Lc ${data.apca.toFixed(1)}`],
        ...Object.entries(labels).map(([key, label]): [string, string] => {
          const { aa, aaa } = data.verdicts[key as keyof typeof labels];
          return [label, `AA ${verdict(aa)}, AAA ${verdict(aaa)}`];
        }),
        ...minimum,
      ]),
      code: passed ? ExitCode.SUCCESS : ExitCode.CHECK_FAILED,
    };
  },
};

export const paletteCommand: Command = {
  name: "palette",
  description: "Generate palettes and compare colors.",
  subcommands: [generate, wheel, contrast],
  examples: [`${manifest.bin} palette generate --base '#6750a4'`],
  exitCodes: [ExitCode.USAGE, ExitCode.PERMISSION, ExitCode.NOT_FOUND, ExitCode.CHECK_FAILED],
};
