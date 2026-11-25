/** Discovers Tailwind stylesheets, reads their tokens, and audits semantic contrast. */
import { readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { classifyFsError, error } from "../app/errors.ts";
import { ExitCode } from "../app/exit-codes.ts";
import { parseColor, toHex, wcagContrast, type Oklch } from "./color.ts";
import { detectProject, readProjectConfig, resolveProject } from "./project.ts";
import { loadRegistry } from "./registry.ts";
import { readTailwindConfig } from "./theme-config.ts";

export const themeGroups = ["colors", "fonts", "text", "radius", "spacing", "shadows", "breakpoints", "motion"] as const;
export type ThemeGroup = (typeof themeGroups)[number];
type Mode = "light" | "dark";
const modes = ["light", "dark"] as const;

export interface ThemeValue {
  declared: string;
  resolved: string | null;
}

export interface ThemeToken {
  name: string;
  light: ThemeValue | null;
  dark: ThemeValue | null;
}

export interface ThemeTextToken extends ThemeToken {
  lineHeight: ThemeToken | null;
}

/** Tailwind version, sources and diagnostics shared by full and group results. */
export interface ThemeSources {
  file: string;
  files: string[];
  tailwind: 3 | 4;
  configFile: string | null;
  warnings: string[];
}

export interface Theme extends ThemeSources {
  colors: ThemeToken[];
  fonts: ThemeToken[];
  text: ThemeTextToken[];
  weights: ThemeToken[];
  radius: ThemeToken[];
  spacing: ThemeToken[];
  shadows: ThemeToken[];
  breakpoints: ThemeToken[];
  motion: { tokens: ThemeToken[]; keyframes: string[] };
  other: ThemeToken[];
}

interface Statement {
  text: string;
  opens: boolean;
}

interface ContrastCheck {
  mode: Mode;
  foreground: string;
  background: string;
  ratio: number | null;
  status: "pass" | "fail" | "missing" | "unresolved";
}

export interface ThemeCheck extends ThemeSources {
  ok: boolean;
  contrast: ContrastCheck[];
  missingRoles: { role: string; modes: Mode[] }[];
  summary: { passed: number; failed: number; missing: number; unresolved: number };
}

/** Scans CSS statement terminators outside strings, comments, and function arguments. */
function* statements(css: string): Generator<Statement> {
  let statement = "";
  let quote = "";
  let depth = 0;

  for (let index = 0; index < css.length; index++) {
    const char = css[index]!;
    if (char === "\\") {
      statement += css.slice(index, index + 2);
      index++;
    } else if (quote) {
      statement += char;
      if (char === quote) quote = "";
    } else if (char === '"' || char === "'") {
      quote = char;
      statement += char;
    } else if (css.startsWith("/*", index)) {
      const end = css.indexOf("*/", index + 2);
      if (end < 0) break;
      index = end + 1;
    } else if (char === "(" || char === "[") {
      depth++;
      statement += char;
    } else if (char === ")" || char === "]") {
      depth = Math.max(0, depth - 1);
      statement += char;
    } else if (depth === 0 && (char === "{" || char === "}" || char === ";")) {
      const text = statement.trim();
      if (text) yield { text, opens: char === "{" };
      if (char === "}") yield { text: "}", opens: false };
      statement = "";
    } else {
      statement += char;
    }
  }

  if (statement.trim()) yield { text: statement.trim(), opens: false };
}

function importTarget(statement: Statement): string | undefined {
  if (statement.opens) return undefined;
  return /^@import\s+(?:url\(\s*)?(["'])([^"']+)\1/i.exec(statement.text)?.[2];
}

function localImport(file: string, target: string): string | undefined {
  if (/^\.{1,2}\//.test(target)) return resolve(dirname(file), target);
  if (/^(?!\/|[#?]|[\w+.-]+:|@).+\.css$/i.test(target)) {
    const candidate = resolve(dirname(file), target);
    if (isFile(candidate)) return candidate;
  }
}

function missing(cause: unknown): boolean {
  const code = (cause as NodeJS.ErrnoException).code;
  return code === "ENOENT" || code === "ENOTDIR";
}

function isFile(file: string): boolean {
  try {
    return statSync(file).isFile();
  } catch (cause) {
    if (missing(cause)) return false;
    throw classifyFsError(cause, ExitCode.CONFIG, `Failed to inspect ${file}`);
  }
}

function readCss(file: string): string {
  try {
    return readFileSync(file, "utf8");
  } catch (cause) {
    throw classifyFsError(cause, ExitCode.CONFIG, `Failed to read ${file}`);
  }
}

function cssFiles(directory: string): string[] {
  try {
    const entries = readdirSync(directory, { withFileTypes: true });
    entries.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    return [
      ...entries.filter((entry) => /\.css$/i.test(entry.name) &&
        (entry.isFile() || (entry.isSymbolicLink() && isFile(resolve(directory, entry.name)))))
        .map((entry) => resolve(directory, entry.name)),
      ...entries.filter((entry) => entry.isDirectory()).flatMap((entry) => cssFiles(resolve(directory, entry.name))),
    ];
  } catch (cause) {
    if (missing(cause)) return [];
    throw classifyFsError(cause, ExitCode.CONFIG, `Failed to search ${directory}`);
  }
}

function containsTailwind(file: string, tailwind: 3 | 4, active = new Set<string>()): boolean {
  const key = realpathSync(file);
  if (active.has(key)) return false;
  active.add(key);
  try {
    for (const statement of statements(readCss(file))) {
      const target = importTarget(statement);
      if (tailwind === 3
        ? target === "tailwindcss/base" || (!statement.opens && /^@tailwind\s+base$/i.test(statement.text))
        : target === "tailwindcss") return true;
      const imported = target && localImport(file, target);
      if (imported && isFile(imported) && containsTailwind(imported, tailwind, active)) return true;
    }
    return false;
  } finally {
    active.delete(key);
  }
}

/** Locates the first Tailwind CSS entry point, or uses an explicitly selected stylesheet. */
export function findThemeFile(cwd: string, override?: string): string {
  const hint = "designfy components add designfy-theme";
  if (override !== undefined) {
    const file = resolve(cwd, override);
    if (isFile(file)) return file;
    throw error.notFound(`Theme stylesheet not found: ${file}. Run "${hint}".`, { file, hint });
  }

  return discoverThemeFile(cwd, detectProject(cwd).tailwind === 3 ? 3 : 4);
}

function discoverThemeFile(cwd: string, tailwind: 3 | 4): string {
  const hint = "designfy components add designfy-theme";
  const styles = readProjectConfig(cwd)?.paths?.styles ?? "src/styles";
  const directories = new Set([styles, "src/styles", "src/app"].map((path) => resolve(cwd, path)));
  for (const directory of directories) {
    const candidates = isFile(directory) ? [directory] : cssFiles(directory);
    const match = candidates.find((file) => containsTailwind(file, tailwind));
    if (match) return match;
  }
  for (const path of ["src/index.css", "app/globals.css"]) {
    const file = resolve(cwd, path);
    if (isFile(file) && containsTailwind(file, tailwind)) return file;
  }

  throw error.notFound(`No Tailwind stylesheet found. Run "${hint}".`, { hint });
}

type Scope = "theme" | "root" | Mode;
interface Frame {
  scope?: Scope;
  media?: Mode;
  ignored: boolean;
}

function frameFor(selector: string, parent?: Frame): Frame {
  const media = /^@media\b[^{}]*\(\s*prefers-color-scheme\s*:\s*(light|dark)\s*\)/i.exec(selector)?.[1]?.toLowerCase() as Mode | undefined;
  const mode = media ?? parent?.media;
  const root = /(?:^|,)\s*:root\s*(?=,|$)/.test(selector);
  const dataTheme = /(?:^|,)\s*(?::root|html)?\s*\[\s*data-theme\s*=\s*(?:"(light|dark)"|'(light|dark)'|(light|dark))\s*\]\s*(?=,|$)/.exec(selector);
  const dark = /(?:^|,)\s*(?::root|html)?\s*\.dark\s*(?=,|$)/.test(selector);
  const theme = /^@theme(?:\s|$)/i.test(selector);
  const explicit = dark ? "dark" : (dataTheme?.[1] ?? dataTheme?.[2] ?? dataTheme?.[3]) as Mode | undefined;
  const scope = explicit ?? (root ? mode ?? "root" : theme ? mode ?? "theme" : undefined);
  const ignored = parent?.ignored === true || (Boolean(explicit && mode && explicit !== mode)) ||
    (!scope && !/^@(?:media|supports|layer|container)\b/i.test(selector));
  return { scope, media: mode, ignored };
}

function collectTokens(file: string) {
  const files = new Set<string>();
  const active = new Set<string>();
  const declarations = {
    theme: new Map<string, string>(), root: new Map<string, string>(),
    light: new Map<string, string>(), dark: new Map<string, string>(),
  };
  const keyframes = new Set<string>();

  function visit(path: string): void {
    const css = readCss(path);
    const key = realpathSync(path);
    if (active.has(key)) return;
    files.add(path);
    active.add(key);
    const stack: Frame[] = [];
    for (const statement of statements(css)) {
      if (statement.opens) {
        const name = /^@(?:-webkit-)?keyframes\s+([^\s]+)/i.exec(statement.text)?.[1];
        if (name) keyframes.add(name.replace(/^(["'])(.*)\1$/, "$2"));
        stack.push(frameFor(statement.text, stack.at(-1)));
      } else if (statement.text === "}") {
        stack.pop();
      } else if (!stack.length) {
        const target = importTarget(statement);
        const imported = target && localImport(path, target);
        if (imported) visit(imported);
      } else {
        const frame = stack.at(-1)!;
        if (frame.ignored || !frame.scope) continue;
        const declaration = /^(--[\w-]+)\s*:\s*([\s\S]*)$/.exec(statement.text);
        if (declaration) declarations[frame.scope].set(declaration[1]!, declaration[2]!.replace(/\s*!important$/i, "").trim());
      }
    }
    active.delete(key);
  }

  visit(file);
  const base = [...declarations.theme, ...declarations.root];
  return {
    files: [...files], keyframes: [...keyframes],
    light: new Map([...base, ...declarations.light]),
    dark: new Map([...base, ...declarations.dark]),
  };
}

function closingParen(value: string, start: number): number {
  let depth = 1;
  let quote = "";
  for (let index = start; index < value.length; index++) {
    const char = value[index]!;
    if (char === "\\") index++;
    else if (quote) {
      if (char === quote) quote = "";
    } else if (char === '"' || char === "'") quote = char;
    else if (char === "(") depth++;
    else if (char === ")" && --depth === 0) return index;
  }
  return -1;
}

function resolver(declarations: ReadonlyMap<string, string>) {
  // Every member of a variable cycle is invalid, including references in fallback branches.
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const cyclic = new Set<string>();
  function inspect(name: string): void {
    if (visiting.has(name)) {
      const chain = [...visiting];
      for (const member of chain.slice(chain.indexOf(name))) cyclic.add(member);
      return;
    }
    if (visited.has(name)) return;
    visiting.add(name);
    const value = declarations.get(name) ?? "";
    for (const match of value.matchAll(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|(?<![\w-])var\(\s*(--[\w-]+)/gi)) {
      if (match[1]) inspect(match[1]);
    }
    visiting.delete(name);
    visited.add(name);
  }
  for (const name of declarations.keys()) inspect(name);

  const cache = new Map<string, string | null>();
  function resolveName(name: string): string | null {
    if (cache.has(name)) return cache.get(name)!;
    const value = declarations.get(name);
    const result = value === undefined || cyclic.has(name) || /^initial$/i.test(value) ? null : substitute(value);
    cache.set(name, result);
    return result;
  }

  function substitute(value: string): string | null {
    const pattern = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|(?<![\w-])var\(/gi;
    let output = "";
    let offset = 0;
    for (let match = pattern.exec(value); match; match = pattern.exec(value)) {
      if (match[0][0] === '"' || match[0][0] === "'") continue;
      const end = closingParen(value, pattern.lastIndex);
      if (end < 0) return null;
      const ref = /^\s*(--[\w-]+)\s*(?:,([\s\S]*))?$/.exec(value.slice(pattern.lastIndex, end));
      if (!ref) return null;
      const resolved = resolveName(ref[1]!) ?? (ref[2] === undefined ? null : substitute(ref[2].trim()));
      if (resolved === null) return null;
      output += value.slice(offset, match.index) + resolved;
      offset = end + 1;
      pattern.lastIndex = offset;
    }
    return (output + value.slice(offset)).trim();
  }

  return { resolveName, substitute };
}

const cssNumber = /^([+-]?(?:\d*\.\d+|\d+\.?\d*)(?:e[+-]?\d+)?)(%|deg|grad|turn|rad)?$/i;

function cssChannels(value: string): string | null {
  const match = /^(rgb|hsl)a?\(\s*([\s\S]*?)\s*\)$/i.exec(value);
  if (!match) return null;
  const rgb = match[1]!.toLowerCase() === "rgb";
  const parts = match[2]!.trim().split(/\s*[,/]\s*|\s+/);
  const channels = parts.map((part) => cssNumber.exec(part));
  if ((channels.length !== 3 && channels.length !== 4) || channels.some((channel) => !channel)) return null;
  const [first, second, third, alpha] = channels;
  if (alpha && (!["", "%"].includes(alpha[2] ?? "") || Number(alpha[1]) < (alpha[2] === "%" ? 100 : 1))) return null;

  const clamp = (number: number) => Math.min(1, Math.max(0, number));
  let values: number[];
  if (rgb) {
    if (channels.slice(0, 3).some((channel) => !["", "%"].includes(channel![2] ?? ""))) return null;
    values = channels.slice(0, 3).map((channel) => clamp(Number(channel![1]) / (channel![2] === "%" ? 100 : 255)));
  } else {
    if (first![2] === "%" || second![2] !== "%" || third![2] !== "%") return null;
    const angleUnits: Record<string, number> = { grad: 0.9, rad: 180 / Math.PI, turn: 360 };
    const degrees = Number(first![1]) * (angleUnits[first![2]?.toLowerCase() ?? ""] ?? 1);
    const hue = ((degrees % 360) + 360) % 360 / 30;
    const saturation = clamp(Number(second![1]) / 100);
    const lightness = clamp(Number(third![1]) / 100);
    const chroma = saturation * Math.min(lightness, 1 - lightness);
    values = [0, 8, 4].map((shift) => {
      const position = (shift + hue) % 12;
      return lightness - chroma * Math.max(-1, Math.min(position - 3, 9 - position, 1));
    });
  }

  if (!values.every(Number.isFinite)) return null;
  return "#" + values.map((channel) => Math.round(channel * 255).toString(16).padStart(2, "0")).join("");
}

function readColor(value: string | null): Oklch | null {
  if (value === null) return null;
  try {
    const named = /^[a-z]+$/i.test(value) && value.toLowerCase() !== "transparent" ? Bun.color(value, "hex") : null;
    return parseColor(cssChannels(value) ?? named ?? value);
  } catch {
    return null;
  }
}

const contrastPairs = [
  ["foreground", "background"], ["primary-foreground", "primary"], ["muted-foreground", "muted"],
  ["muted-foreground", "background"], ["card-foreground", "card"], ["accent-foreground", "accent"],
  ["destructive-foreground", "destructive"],
] as const;

const semanticColors = new Set([
  ...contrastPairs.flat(), "popover", "popover-foreground", "border", "input", "ring",
  "secondary", "secondary-foreground", "sidebar", "sidebar-foreground", "sidebar-primary",
  "sidebar-primary-foreground", "sidebar-accent", "sidebar-accent-foreground", "sidebar-border",
  "sidebar-ring", "success", "success-foreground", "warning", "warning-foreground", "info", "info-foreground",
]);

function classify(name: string): Exclude<ThemeGroup, "motion"> | "motion" | "weights" | "other" {
  if (name.startsWith("--color-") || semanticColors.has(name.slice(2)) || /^--chart-\d+$/.test(name)) return "colors";
  if (/^--font-weight(?:-|$)/.test(name)) return "weights";
  if (/^--font(?:-|$)/.test(name)) return "fonts";
  if (/^--text(?:-|$)/.test(name)) return "text";
  if (/^--radius(?:-|$)/.test(name)) return "radius";
  if (/^--spacing(?:-|$)/.test(name)) return "spacing";
  if (/^--shadow(?:-|$)/.test(name)) return "shadows";
  if (/^--breakpoint(?:-|$)/.test(name)) return "breakpoints";
  if (/^--(?:ease|animate|duration)(?:-|$)/.test(name)) return "motion";
  return "other";
}

/** Selects the source metadata also included with a single token group. */
export function themeSources({ file, files, tailwind, configFile, warnings }: Theme): ThemeSources {
  return { file, files, tailwind, configFile, warnings };
}

/** Reads Tailwind and shadcn tokens, preserving declarations and resolving both theme modes. */
export async function readTheme(cwd: string, { file }: { file?: string } = {}): Promise<Theme> {
  const tailwind = detectProject(cwd).tailwind === 3 ? 3 : 4;
  const path = file === undefined ? discoverThemeFile(cwd, tailwind) : findThemeFile(cwd, file);
  const { files, keyframes, light, dark } = collectTokens(path);
  const resolveLight = resolver(light);
  const resolveDark = resolver(dark);
  const configFile = tailwind === 3
    ? ["ts", "mts", "js", "mjs", "cjs"].map((ext) => resolve(cwd, `tailwind.config.${ext}`)).find(isFile) ?? null
    : null;
  const warnings: string[] = [];
  let configTokens = new Map<string, string>();
  if (configFile) {
    try {
      const config = await readTailwindConfig(configFile);
      configTokens = config.declarations;
      keyframes.push(...[...config.keyframes].filter((name) => !keyframes.includes(name)));
    } catch {
      warnings.push(`Could not load Tailwind config ${configFile}. Showing CSS tokens only. Check the config and its imports.`);
    }
  }
  const theme: Theme = {
    file: path, files, tailwind, configFile, warnings, colors: [], fonts: [], text: [], weights: [], radius: [], spacing: [],
    shadows: [], breakpoints: [], motion: { tokens: [], keyframes }, other: [],
  };

  function token(name: string, isColor = false): ThemeToken {
    function value(declarations: ReadonlyMap<string, string>, resolveValue: ReturnType<typeof resolver>): ThemeValue | null {
      const config = configTokens.get(name);
      const declared = config ?? declarations.get(name);
      if (declared === undefined) return null;
      const resolved = config === undefined
        ? resolveValue.resolveName(name)
        : resolveValue.substitute(config.replaceAll("<alpha-value>", "1"));
      const parsed = isColor ? readColor(resolved) : null;
      return { declared, resolved: isColor ? (parsed && toHex(parsed)) : resolved };
    }
    return { name, light: value(light, resolveLight), dark: value(dark, resolveDark) };
  }

  const names = new Set([...light.keys(), ...dark.keys(), ...configTokens.keys()]);
  for (const name of names) {
    const group = classify(name);
    if (group === "text") {
      const companion = `${name}--line-height`;
      if (name.endsWith("--line-height") && names.has(name.slice(0, -"--line-height".length))) continue;
      theme.text.push({ ...token(name), lineHeight: names.has(companion) ? token(companion) : null });
    } else if (group === "motion") {
      theme.motion.tokens.push(token(name));
    } else {
      theme[group].push(token(name, group === "colors"));
    }
  }
  return theme;
}

/** Finds the theme roles used by the active framework's embedded registry. */
export function requiredThemeRoles(cwd: string): string[] {
  const { framework } = resolveProject(cwd);
  const roles = new Set<string>();
  for (const item of loadRegistry(framework).items) {
    for (const { content } of item.files) {
      for (const [, role] of content.matchAll(/\b(?:bg|text|border|outline|ring(?:-offset)?|fill|stroke|decoration|accent|caret|from|via|to)-([\w-]+)/g)) {
        if (classify(`--${role}`) === "colors") roles.add(role!);
      }
      for (const [font] of content.matchAll(/\bfont-(?:sans|serif|mono|heading)\b/g)) roles.add(font);
      for (const [, size] of content.matchAll(/\brounded(?:-([2-4]?xl|xs|sm|md|lg))?(?![\w-])/g)) {
        roles.add(size ? `radius-${size}` : "radius");
      }
      for (const [, name] of content.matchAll(/\bvar\(\s*(--[\w-]+)/g)) {
        if (classify(name!) !== "other") roles.add(name!.replace(/^--(?:color-)?/, ""));
      }
    }
  }
  return [...roles].sort();
}

/** Measures the known contrast pairs per mode and verifies that required theme roles exist. */
export function checkTheme(theme: Theme, { requiredRoles = [] }: { requiredRoles?: readonly string[] } = {}): ThemeCheck {
  const colors = new Map(theme.colors.map((token) => [token.name, token]));
  const tokens = new Map([
    ...theme.colors, ...theme.fonts, ...theme.text, ...theme.weights, ...theme.radius, ...theme.spacing,
    ...theme.shadows, ...theme.breakpoints, ...theme.motion.tokens, ...theme.other,
  ].map((token) => [token.name, token]));
  const colorFor = (role: string, mode: Mode) =>
    colors.get(`--color-${role}`)?.[mode] ?? colors.get(`--${role}`)?.[mode];
  const missingRoles = [...new Set(requiredRoles.map((role) => role.replace(/^--(?:color-)?/, "")))].flatMap((role) => {
    const absent = modes.filter((mode) => {
      const value = colorFor(role, mode) ?? tokens.get(`--${role}`)?.[mode];
      return !value || /^initial$/i.test(value.declared);
    });
    return absent.length ? [{ role, modes: absent }] : [];
  });
  const contrast: ContrastCheck[] = modes.flatMap((mode) => contrastPairs.map(([foreground, background]) => {
    const fg = colorFor(foreground, mode);
    const bg = colorFor(background, mode);
    if (!fg || !bg) return { mode, foreground, background, ratio: null, status: "missing" };
    if (!fg.resolved || !bg.resolved) return { mode, foreground, background, ratio: null, status: "unresolved" };
    const ratio = wcagContrast(fg.resolved, bg.resolved);
    return { mode, foreground, background, ratio, status: ratio >= 4.5 ? "pass" : "fail" };
  }));
  const summary = { passed: 0, failed: 0, missing: 0, unresolved: 0 };
  for (const { status } of contrast) {
    const key = status === "pass" ? "passed" : status === "fail" ? "failed" : status;
    summary[key]++;
  }
  return { ...themeSources(theme), ok: summary.failed === 0 && summary.unresolved === 0 && !missingRoles.length, contrast, missingRoles, summary };
}
