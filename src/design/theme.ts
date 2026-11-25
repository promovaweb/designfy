/** Discovers Tailwind stylesheets, reads their tokens, and audits semantic contrast. */
import { readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { classifyFsError, error } from "../app/errors.ts";
import { ExitCode } from "../app/exit-codes.ts";
import { parseColor, toHex, wcagContrast, type Oklch } from "./color.ts";
import { readProjectConfig, resolveProject } from "./project.ts";
import { loadRegistry } from "./registry.ts";

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

export interface Theme {
  file: string;
  files: string[];
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

export interface ThemeCheck {
  file: string;
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

function containsTailwind(file: string, active = new Set<string>()): boolean {
  const key = realpathSync(file);
  if (active.has(key)) return false;
  active.add(key);
  try {
    for (const statement of statements(readCss(file))) {
      const target = importTarget(statement);
      if (target === "tailwindcss") return true;
      const imported = target && localImport(file, target);
      if (imported && isFile(imported) && containsTailwind(imported, active)) return true;
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

  const styles = readProjectConfig(cwd)?.paths?.styles ?? "src/styles";
  const directories = new Set([styles, "src/styles", "src/app"].map((path) => resolve(cwd, path)));
  for (const directory of directories) {
    const candidates = isFile(directory) ? [directory] : cssFiles(directory);
    const match = candidates.find((file) => containsTailwind(file));
    if (match) return match;
  }
  for (const path of ["src/index.css", "app/globals.css"]) {
    const file = resolve(cwd, path);
    if (isFile(file) && containsTailwind(file)) return file;
  }

  throw error.notFound(`No Tailwind stylesheet found. Run "${hint}".`, { hint });
}

type Scope = "theme" | "root" | "dark";
interface Frame {
  scope?: Scope;
  darkMedia: boolean;
  ignored: boolean;
}

function frameFor(selector: string, parent?: Frame): Frame {
  const darkMedia = parent?.darkMedia === true ||
    /^@media\b[^{}]*\(\s*prefers-color-scheme\s*:\s*dark\s*\)/i.test(selector);
  const root = /(?:^|,)\s*:root\s*(?=,|$)/.test(selector);
  const dark = /(?:^|,|:root|html)\s*(?:\.dark(?![\w-])|\[\s*data-theme\s*=\s*(?:"dark"|'dark'|dark)\s*\])\s*(?=,|$)/.test(selector);
  const theme = /^@theme(?:\s|$)/i.test(selector);
  const ignored = parent?.ignored === true ||
    (!root && !dark && !theme && !/^@(?:media|supports|layer|container)\b/i.test(selector));
  const scope = dark || (darkMedia && (root || theme)) ? "dark" : root ? "root" : theme ? "theme" : undefined;
  return { scope, darkMedia, ignored };
}

function collectTokens(file: string) {
  const files = new Set<string>();
  const active = new Set<string>();
  const declarations = { theme: new Map<string, string>(), root: new Map<string, string>(), dark: new Map<string, string>() };
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
  const light = new Map([...declarations.theme, ...declarations.root]);
  return { files: [...files], keyframes: [...keyframes], light, dark: new Map([...light, ...declarations.dark]) };
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

  return resolveName;
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

const namedColors: Record<string, string> = { black: "#000000", white: "#ffffff" };

function readColor(value: string | null): Oklch | null {
  if (value === null) return null;
  try {
    return parseColor(cssChannels(value) ?? namedColors[value.toLowerCase()] ?? value);
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
  if (name.startsWith("--font-weight-")) return "weights";
  if (name.startsWith("--font-")) return "fonts";
  if (name.startsWith("--text-")) return "text";
  if (/^--radius(?:-|$)/.test(name)) return "radius";
  if (/^--spacing(?:-|$)/.test(name)) return "spacing";
  if (name.startsWith("--shadow-")) return "shadows";
  if (name.startsWith("--breakpoint-")) return "breakpoints";
  if (/^--(?:ease|animate|duration)-/.test(name)) return "motion";
  return "other";
}

/** Reads Tailwind and shadcn variables, preserving declarations and resolving both theme modes. */
export function readTheme(cwd: string, { file }: { file?: string } = {}): Theme {
  const path = findThemeFile(cwd, file);
  const { files, keyframes, light, dark } = collectTokens(path);
  const resolveLight = resolver(light);
  const resolveDark = resolver(dark);
  const theme: Theme = {
    file: path, files, colors: [], fonts: [], text: [], weights: [], radius: [], spacing: [],
    shadows: [], breakpoints: [], motion: { tokens: [], keyframes }, other: [],
  };

  function token(name: string, isColor = false): ThemeToken {
    function value(declared: string | undefined, resolved: string | null): ThemeValue | null {
      if (declared === undefined) return null;
      const parsed = isColor ? readColor(resolved) : null;
      return { declared, resolved: isColor ? (parsed && toHex(parsed)) : resolved };
    }
    return { name, light: value(light.get(name), resolveLight(name)), dark: value(dark.get(name), resolveDark(name)) };
  }

  for (const name of dark.keys()) {
    const group = classify(name);
    if (group === "text") {
      const companion = `${name}--line-height`;
      if (name.endsWith("--line-height") && dark.has(name.slice(0, -"--line-height".length))) continue;
      theme.text.push({ ...token(name), lineHeight: dark.has(companion) ? token(companion) : null });
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
  return { file: theme.file, ok: summary.failed === 0 && summary.unresolved === 0 && !missingRoles.length, contrast, missingRoles, summary };
}
