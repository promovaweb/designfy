/** Reviews Tailwind theme tokens, truecolor swatches, and WCAG contrast. */
import { StyledText, TextRenderable, parseColor as terminalColor } from "@opentui/core";
import { basename, join } from "node:path";
import { meter } from "../components.ts";
import { AppError } from "../../app/errors.ts";
import { ExitCode } from "../../app/exit-codes.ts";
import { formatOklch, parseColor, toHex, wcagContrast } from "../../design/color.ts";
import { checkTheme, findThemeFile, readTheme, themeGroups, type Theme, type ThemeGroup, type ThemeTextToken, type ThemeToken } from "../../design/theme.ts";
import { projectScreen, shortcut } from "./project-screen.ts";

type ThemeRow = { id: string; token: ThemeToken; group: ThemeGroup };
type Mode = "light" | "dark";

function role(token: ThemeToken): string {
  return token.name.replace(/^--(?:color-)?/, "");
}

function tokens(theme: Theme, group: ThemeGroup): ThemeToken[] {
  if (group === "motion") {
    return [...theme.motion.tokens, ...theme.motion.keyframes.map((name) => ({
      name, light: { declared: "Keyframes", resolved: null }, dark: { declared: "Keyframes", resolved: null },
    }))];
  }
  return theme[group];
}

function value(token: ThemeToken | null, mode: Mode): string {
  return token?.[mode]?.declared ?? "Not declared";
}

function ratioLabel(ratio: number): string {
  return `${ratio.toFixed(2)}:1 ${ratio >= 4.5 ? "pass" : "fail"}`;
}

/** Creates a read-only theme inspection screen. */
export function createThemeScreen() {
  let mode: Mode = "light";
  let groupIndex = 0;
  let loaded: Theme | undefined;
  let loading: Promise<Theme> | undefined;
  let contrasts: ReturnType<typeof checkTheme>["contrast"] = [];

  function colorDetails(row: ThemeRow): string[] {
    const declared = row.token[mode];
    if (!declared?.resolved) return [`Declared: ${value(row.token, mode)}`, "Color could not be resolved."];
    const oklch = parseColor(declared.resolved);
    const hex = toHex(oklch);
    const rgb = hex.slice(1).match(/../g)?.map((part) => Number.parseInt(part, 16));
    const lines = [`Declared: ${declared.declared}`, `Hex: ${hex}`, `RGB: rgb(${rgb?.join(" ")})`, `OKLCH: ${formatOklch(oklch)}`];
    for (const baseline of ["background", "foreground"]) {
      const matching = loaded?.colors.find((token) => token.name === `--color-${baseline}`)?.[mode] ??
        loaded?.colors.find((token) => token.name === `--${baseline}`)?.[mode];
      lines.push(`Against ${baseline}: ${matching?.resolved ? ratioLabel(wcagContrast(hex, matching.resolved)) : "Unavailable"}`);
    }
    return lines;
  }

  return projectScreen<ThemeRow>({
    id: "theme", title: "Theme", icon: "theme", description: "Inspect the project's Tailwind theme and contrast",
    empty: () => loaded ? "No tokens in this group" : "No Tailwind CSS found",
    emptyHint: () => loaded ? undefined : "designfy components add designfy-theme",
    listTitle: "Theme tokens",
    summary: () => `${mode} · ${themeGroups[groupIndex]} · ${loaded ? basename(loaded.file) : "No Tailwind CSS found"}`,
    watch(cwd) {
      const files = [join(cwd, "designfy.json")];
      try { files.push(findThemeFile(cwd)); } catch { /* The screen reports discovery errors. */ }
      return files;
    },
    async load(cwd) {
      const request = readTheme(cwd);
      loading = request;
      try {
        const theme = await request;
        if (loading !== request) return [];
        loaded = theme;
      } catch (error) {
        if (loading !== request) return [];
        loaded = undefined;
        if (error instanceof AppError && error.code === ExitCode.NOT_FOUND) return [];
        throw error;
      }
      contrasts = checkTheme(loaded).contrast;
      const group = themeGroups[groupIndex]!;
      return tokens(loaded, group).map((token) => ({ id: token.name, token, group }));
    },
    label({ token, group }) {
      const current = token[mode];
      const declared = value(token, mode);
      if (group === "fonts") return `Aa Bb Cc 0123  ${token.name}  ${declared}`;
      if (group === "text") {
        const size = Number.parseFloat(current?.resolved ?? declared);
        const cells = Math.max(1, Math.min(10, Math.round(size / (declared.includes("rem") ? 0.3 : 5)))) || 1;
        return `${"A".repeat(cells)} ${token.name}  ${declared} / ${value((token as ThemeTextToken).lineHeight, mode)}`;
      }
      if (group !== "colors") return `${token.name}  ${declared}`;
      const name = role(token);
      const matches = contrasts.filter((pair) => pair.mode === mode && pair.ratio !== null &&
        (pair.foreground === name || pair.background === name));
      const checked = matches.map(({ratio}) => ratioLabel(ratio!)).join(" · ");
      const append = [declared, current?.resolved, checked].filter(Boolean).join("  ");
      return {
        content: new StyledText([
          { __isChunk: true, text: current?.resolved ? "   " : " ? ", bg: current?.resolved ? terminalColor(current.resolved) : undefined },
          { __isChunk: true, text: ` ${name}` },
        ]),
        detail: append,
        state: !current?.resolved ? "pending" : matches.some(({ status }) => status === "fail") ? "error" : matches.length ? "ok" : undefined,
        stateLabel: !current?.resolved ? "Unresolved" : matches.some(({ status }) => status === "fail") ? "Fail" : "Pass",
      };
    },
    detail(row, view) {
      view.heading(row.token.name);
      if (row.group === "colors") {
        const current = row.token[mode];
        if (current?.resolved) view.add(new TextRenderable(view.ctx.renderer, {
          content: "        ", width: 8, height: 1, flexShrink: 0, bg: terminalColor(current.resolved),
        }));
        for (const line of colorDetails(row)) {
          const split = line.indexOf(": ");
          if (split < 0) view.text(line);
          else view.field(line.slice(0, split), line.slice(split + 2));
        }
        for (const pair of contrasts) {
          if (pair.mode !== mode || pair.ratio === null || ![pair.foreground, pair.background].includes(role(row.token))) continue;
          const { renderer, theme } = view.ctx;
          view.tag(pair.status === "pass" ? "ok" : "error", `${pair.foreground} / ${pair.background}`);
          view.add(meter(renderer, theme, Number(pair.ratio.toFixed(2)), 21, { color: pair.status === "pass" ? theme.ok : theme.error }));

        }
        return;
      }
      if (row.group === "fonts") view.text("Aa Bb Cc 0123");
      view.section(mode, value(row.token, mode));
      if (row.group === "text") view.section("Line height", value((row.token as ThemeTextToken).lineHeight, mode));
    },
    actions: [
      shortcut("t", "light / dark", (view) => { mode = mode === "light" ? "dark" : "light"; return view.reload(); }),
      shortcut("g", "next group", (view) => { groupIndex = (groupIndex + 1) % themeGroups.length; return view.reload(); }),
      shortcut("return", "inspect color", (view) => {
        const row = view.selected;
        if (row?.group === "colors") return view.read(row.token.name, () => colorDetails(row).join("\n"));
      }, "Enter"),
    ],
  });
}
