/** Reads a project's Tailwind theme and reports semantic color contrast. */
import { error } from "../../app/errors.ts";
import { ExitCode } from "../../app/exit-codes.ts";
import { manifest } from "../../app/manifest.ts";
import {
  checkTheme, readTheme, themeGroups, themeSources,
  type Theme, type ThemeCheck, type ThemeGroup, type ThemeToken, type ThemeValue,
} from "../../design/theme.ts";
import { blocks, section, table, useColors } from "../format.ts";
import type { Command } from "../registry.ts";

const codes = [ExitCode.NOT_FOUND, ExitCode.CONFIG, ExitCode.PERMISSION];
const fileOption = { name: "--file", argument: { name: "path" }, description: "Read this CSS file instead of discovering the project stylesheet." };

function valueText(value: ThemeValue | null, color: boolean): string {
  if (!value) return "missing";
  const hex = value.resolved;
  if (!color) return hex === null ? `${value.declared} (unresolved)` : value.declared;
  if (!hex) return `${value.declared} → unresolved`;
  const channels = hex.slice(1).match(/../g)?.map((channel) => Number.parseInt(channel, 16));
  const swatch = useColors() && channels ? `\u001b[48;2;${channels.join(";")}m  \u001b[0m ` : "";
  return `${swatch}${value.declared} → ${hex}`;
}

function tokenText(token: ThemeToken, color = false): string {
  return `light ${valueText(token.light, color)} | dark ${valueText(token.dark, color)}`;
}

function groupText(theme: Theme, group: ThemeGroup | "weights" | "other"): string {
  if (group === "motion") {
    const rows: [string, string][] = theme.motion.tokens.map((token) => [token.name, tokenText(token)]);
    if (theme.motion.keyframes.length) rows.push(["@keyframes", theme.motion.keyframes.join(", ")]);
    return rows.length ? `${section(group)}\n${table(rows)}` : "";
  }

  const rows: [string, string][] = theme[group].flatMap((token) => {
    const row: [string, string] = [token.name, tokenText(token, group === "colors")];
    if ("lineHeight" in token && token.lineHeight) {
      return [row, [token.lineHeight.name, tokenText(token.lineHeight)]];
    }
    return [row];
  });
  return rows.length ? `${section(group)}\n${table(rows)}` : "";
}

const show: Command = {
  name: "show",
  description: "Show the project's Tailwind colors, typography, spacing, and motion tokens.",
  options: [
    fileOption,
    { name: "--group", argument: { name: "group", values: themeGroups }, description: "Show only this token group." },
  ],
  examples: [`${manifest.bin} theme show --group colors`, `${manifest.bin} theme show --file src/index.css --json`],
  exitCodes: codes,
  run: async ({ options, stderr }) => {
    const data = await readTheme(process.cwd(), { file: options.file as string | undefined });
    for (const warning of data.warnings) stderr(`Warning: ${warning}`);
    const group = options.group as ThemeGroup | undefined;
    return {
      data: group ? { ...themeSources(data), [group]: data[group] } : data,
      text: () => blocks(
        `Tailwind ${data.tailwind}`,
        table([
          ["Selected by", data.selection],
          ...(data.entryFile ? [["Entry", data.entryFile] as [string, string]] : []),
          ...data.files.map((file, index): [string, string] => [index === 0 ? "CSS" : "Import", file]),
          ...(data.configFile ? [["Config", data.configFile] as [string, string]] : []),
        ]),
        ...(group ? [groupText(data, group) || `No ${group} tokens found.`] :
          [...themeGroups, "weights", "other"].map((key) => groupText(data, key as ThemeGroup | "weights" | "other"))),
      ),
    };
  },
};

function contrastTable(result: ThemeCheck): string {
  return table(result.contrast.map(({ mode, foreground, background, ratio, status, label, min }) => [
    `${mode} ${foreground} on ${background}${label ? ` (${label})` : ""}`,
    `${ratio === null ? status : `${ratio.toFixed(2)}:1 ${status}`}${min === undefined ? "" : ` (min ${min}:1)`}`,
  ]));
}

const check: Command = {
  name: "check",
  description: "Check light and dark contrast for the project's shadcn or custom theme.",
  options: [fileOption],
  examples: [`${manifest.bin} theme check`, `${manifest.bin} theme check --file app/globals.css --json`],
  exitCodes: [...codes, ExitCode.CHECK_FAILED],
  run: async ({ options, stderr }) => {
    const cwd = process.cwd();
    const theme = await readTheme(cwd, { file: options.file as string | undefined });
    for (const warning of theme.warnings) stderr(`Warning: ${warning}`);
    const result = checkTheme(theme, { cwd });
    const customReport = () => blocks("Mode: custom", ...result.notes, contrastTable(result));
    if (result.mode === "custom") {
      if (!result.ok) throw error.checkFailed(`Theme check failed.\n${customReport()}`, { ...result });
      return { data: result, text: () => blocks("Theme check passed.", customReport()) };
    }

    const failures = result.contrast.filter(({ status }) => status === "fail" || status === "unresolved")
      .map(({ mode, foreground, background, ratio }) =>
        `${mode} ${foreground} on ${background} (${ratio === null ? "unresolved" : `${ratio.toFixed(2)}:1`})`);
    if (!result.ok) {
      const missing = result.missingRoles.map(({ role, modes }) => `${role} (${modes.join(", ")})`);
      const details = [...failures, ...missing.map((role) => `missing ${role}`)];
      throw error.checkFailed(`Theme check failed. ${details.join("; ")}.`, { ...result });
    }

    const skipped = result.summary.missing;
    return {
      data: result,
      text: () => blocks("Theme check passed.",
        skipped ? `Skipped ${skipped} contrast checks with missing tokens.` : "",
        contrastTable(result)),
    };
  },
};

/** Command family for Tailwind theme inspection and validation. */
export const themeCommand: Command = {
  name: "theme",
  description: "Inspect the Tailwind theme and check semantic contrast.",
  subcommands: [show, check],
  examples: [`${manifest.bin} theme show`, `${manifest.bin} theme check`],
  exitCodes: check.exitCodes,
};
