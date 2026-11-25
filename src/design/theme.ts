/** Discovers Tailwind stylesheets, reads their tokens, and audits semantic contrast. */
import { readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { basename, dirname, relative, resolve, sep } from "node:path";
import { classifyFsError, error } from "../app/errors.ts";
import { ExitCode } from "../app/exit-codes.ts";
import { parseColor, toHex, wcagContrast, type Oklch } from "./color.ts";
import { detectProject, readProjectConfig, resolveProject, type ProjectConfigOverrides, type ThemePair } from "./project.ts";
import { loadRegistry } from "./registry.ts";
import { readTailwindConfig } from "./theme-config.ts";
import { parseViewspec } from "./viewspec.ts";

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
  darkOverride?: true;
}

export interface ThemeTextToken extends ThemeToken {
  lineHeight: ThemeToken | null;
}

/** Tailwind version, sources and diagnostics shared by full and group results. */
export interface ThemeSources {
  file: string;
  files: string[];
  selection: ThemeSelection;
  entryFile: string | null;
  tailwind: 3 | 4;
  configFile: string | null;
  warnings: string[];
}

export const themeSelections = ["--file", "paths.theme", "tokensFile", "conventional entry", "Tailwind search"] as const;
type ThemeSelection = (typeof themeSelections)[number];

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
  label?: string;
  min?: number;
}

export interface ThemeCheck extends ThemeSources {
  mode: "shadcn" | "custom";
  notes: string[];
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
  return /^@import\s+(?:url\(\s*)?(["'])([^"']+)\1/i.exec(statement.text)?.[2]
    ?? /^@import\s+url\(\s*([^\s"')]+)\s*\)/i.exec(statement.text)?.[1];
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

function readSource(file: string): string {
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

function findCssSource(file: string, matches: (file: string, statement: Statement) => boolean, active = new Set<string>()): string | undefined {
  const key = realpathSync(file);
  if (active.has(key)) return;
  active.add(key);
  try {
    for (const statement of statements(readSource(file))) {
      if (matches(file, statement)) return file;
      const target = importTarget(statement);
      const imported = target && localImport(file, target);
      if (imported && isFile(imported)) {
        const found = findCssSource(imported, matches, active);
        if (found) return found;
      }
    }
  } finally {
    active.delete(key);
  }
}

const themeHint = "designfy components add designfy-theme";
const entryNames = new Set(["global.css", "globals.css", "app.css", "main.css", "index.css", "styles.css", "tailwind.css"]);

function requireThemeFile(cwd: string, path: string): string {
  const file = resolve(cwd, path);
  if (isFile(file)) return file;
  throw error.notFound(`Theme stylesheet not found: ${file}. Run "${themeHint}".`, { file, hint: themeHint });
}

function themeCandidates(cwd: string, styles: string) {
  const directories = new Set([styles, "src/styles", "src/app"].map((path) => resolve(cwd, path)));
  const files = new Set([...directories].flatMap((directory) => isFile(directory) ? [directory] : cssFiles(directory)));
  for (const path of ["src/index.css", "app/globals.css"]) {
    const file = resolve(cwd, path);
    if (isFile(file)) files.add(file);
  }
  return [...files].map((file) => {
    const parts = relative(cwd, file).split(sep);
    const isolated = parts.some((part) => /^(docs|admin|email)(?:[-_.]|$)/i.test(part));
    const conventional = entryNames.has(basename(file).toLowerCase());
    return { file, conventional, priority: isolated ? 2 : conventional ? 0 : 1, depth: parts.length };
  }).sort((a, b) => a.priority - b.priority || (a.priority === 0 ? a.depth - b.depth : 0));
}

type ThemeLocation = Pick<ThemeSources, "file" | "entryFile" | "selection">;

function discoverThemeFile(cwd: string, tailwind: 3 | 4, config: ProjectConfigOverrides | null): ThemeLocation {
  const configured = config?.paths?.theme;
  const guide = resolve(cwd, "VIEWSPEC.md");
  const tokensFile = configured === undefined && isFile(guide)
    ? parseViewspec(guide, readSource(guide)).frontMatter.tokensFile
    : undefined;
  const explicit = configured !== undefined ? requireThemeFile(cwd, configured) :
    typeof tokensFile === "string" && isFile(resolve(cwd, tokensFile)) ? resolve(cwd, tokensFile) : undefined;
  const candidates = themeCandidates(cwd, config?.paths?.styles ?? "src/styles");
  if (explicit) {
    const key = realpathSync(explicit);
    const entry = candidates.find(({ file, priority }) => priority === 0 && realpathSync(file) !== key &&
      findCssSource(file, (source, statement) => {
        const target = importTarget(statement);
        const imported = target && localImport(source, target);
        return Boolean(imported && isFile(imported) && realpathSync(imported) === key);
      }));
    return { file: explicit, selection: configured !== undefined ? "paths.theme" : "tokensFile", entryFile: entry?.file ?? null };
  }

  for (const { file, conventional } of candidates) {
    const source = findCssSource(file, (_, statement) => {
      const target = importTarget(statement);
      return tailwind === 3
        ? target === "tailwindcss/base" || (!statement.opens && /^@tailwind\s+base$/i.test(statement.text))
        : target === "tailwindcss";
    });
    if (source) return { file, entryFile: null, selection: conventional ? "conventional entry" : "Tailwind search" };
  }
  throw error.notFound(`No Tailwind stylesheet found. Run "${themeHint}".`, { hint: themeHint });
}

/** Locates the project's Tailwind stylesheet, with an optional explicit override. */
export function findThemeFile(cwd: string, override?: string): string {
  if (override !== undefined) return requireThemeFile(cwd, override);
  return discoverThemeFile(cwd, detectProject(cwd).tailwind === 3 ? 3 : 4, readProjectConfig(cwd)).file;
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
    const css = readSource(path);
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
    files: [...files], keyframes: [...keyframes], darkOverrides: declarations.dark,
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

const shadcnCore = ["background", "foreground", "primary", "primary-foreground", "muted", "muted-foreground"];
const defaultCustomPairs: readonly ThemePair[] = [
  { fg: "--text-body", bg: "--bg-page" },
  { fg: "--text-heading", bg: "--bg-page" },
  { fg: "--accent-text", bg: "--bg-page" },
  { fg: "--foreground", bg: "--background" },
];

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
export function themeSources({ file, files, selection, entryFile, tailwind, configFile, warnings }: Theme): ThemeSources {
  return { file, files, selection, entryFile, tailwind, configFile, warnings };
}

/** Reads Tailwind and shadcn tokens, preserving declarations and resolving both theme modes. */
export async function readTheme(cwd: string, { file }: { file?: string } = {}): Promise<Theme> {
  const tailwind = detectProject(cwd).tailwind === 3 ? 3 : 4;
  const location: ThemeLocation = file === undefined ? discoverThemeFile(cwd, tailwind, readProjectConfig(cwd)) :
    { file: requireThemeFile(cwd, file), selection: "--file", entryFile: null };
  const { files, keyframes, light, dark, darkOverrides } = collectTokens(location.file);
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
    ...location, files, tailwind, configFile, warnings, colors: [], fonts: [], text: [], weights: [], radius: [], spacing: [],
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
    const result: ThemeToken = { name, light: value(light, resolveLight), dark: value(dark, resolveDark) };
    if (darkOverrides.has(name)) result.darkOverride = true;
    return result;
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

function customColor(value: ThemeValue): string | null {
  const raw = value.resolved;
  const channels = raw?.split(/\s+/);
  const rgb = channels?.length === 3 && channels.every((channel) => cssNumber.exec(channel)?.[1] === channel);
  const color = readColor(rgb ? `rgb(${raw})` : raw);
  return color && toHex(color);
}

function customContrast(
  tokens: ReadonlyMap<string, ThemeToken>,
  configured?: readonly ThemePair[],
): Pick<ThemeCheck, "contrast" | "notes"> {
  function tokenFor(name: string): ThemeToken | undefined {
    if (name.startsWith("--")) return tokens.get(name);
    const token = tokens.get(`--color-${name}`) ?? tokens.get(`--${name}`);
    if (token || (name !== "black" && name !== "white")) return token;
    const value = { declared: name, resolved: name };
    return { name, light: value, dark: value };
  }

  const defaults = defaultCustomPairs.map(({ fg, bg }) => ({
    fg: fg === "--foreground" && !tokens.has(fg) ? "--color-foreground" : fg,
    bg: bg === "--background" && !tokens.has(bg) ? "--color-background" : bg,
  })).filter(({ fg, bg }) => tokenFor(fg) && tokenFor(bg));
  const pairs: readonly ThemePair[] = configured?.length ? configured : defaults;
  const notes = ["project uses its own color scales; shadcn roles not checked"];
  if (!pairs.length) notes.push("No common semantic pairs found. Set theme.pairs in designfy.json to check contrast.");
  else if (!configured?.length) notes.push(`Default semantic pairs: ${pairs.map(({ fg, bg }) => `${fg} on ${bg}`).join(", ")}.`);

  const changes = (token?: ThemeToken) => token?.dark &&
    (token.darkOverride || token.dark.declared !== token.light?.declared || token.dark.resolved !== token.light?.resolved);
  const contrast: ContrastCheck[] = modes.flatMap((mode) => pairs.flatMap(({ fg, bg, label, min = 4.5 }): ContrastCheck[] => {
    const foreground = tokenFor(fg);
    const background = tokenFor(bg);
    if (mode === "dark" && !changes(foreground) && !changes(background)) return [];

    const first = foreground?.[mode];
    const second = background?.[mode];
    const pair = { mode, foreground: fg, background: bg, ...(label ? { label } : {}), min };
    if (!first || !second) return [{ ...pair, ratio: null, status: "missing" }];
    const fgColor = customColor(first);
    const bgColor = customColor(second);
    if (!fgColor || !bgColor) return [{ ...pair, ratio: null, status: "unresolved" }];
    const ratio = wcagContrast(fgColor, bgColor);
    return [{ ...pair, ratio, status: ratio >= min ? "pass" : "fail" }];
  }));
  return { contrast, notes };
}

/** Measures contrast and applies the registry role requirements to shadcn themes. */
export function checkTheme(
  theme: Theme,
  { cwd, requiredRoles }: { cwd?: string; requiredRoles?: readonly string[] } = {},
): ThemeCheck {
  const colors = new Map(theme.colors.map((token) => [token.name, token]));
  const tokens = new Map([
    ...theme.colors, ...theme.fonts, ...theme.text, ...theme.weights, ...theme.radius, ...theme.spacing,
    ...theme.shadows, ...theme.breakpoints, ...theme.motion.tokens, ...theme.other,
  ].map((token) => [token.name, token]));
  const colorFor = (role: string, mode: Mode) =>
    colors.get(`--color-${role}`)?.[mode] ?? colors.get(`--${role}`)?.[mode];
  const definesRole = (role: string) => modes.some((mode) => {
    const value = colorFor(role, mode);
    return value && !/^initial$/i.test(value.declared);
  });
  const shadcn = definesRole("background") && definesRole("foreground") &&
    shadcnCore.filter(definesRole).length > shadcnCore.length / 2;
  const roles = shadcn ? requiredRoles ?? (cwd ? requiredThemeRoles(cwd) : []) : [];
  const missingRoles = [...new Set(roles.map((role) => role.replace(/^--(?:color-)?/, "")))].flatMap((role) => {
    const absent = modes.filter((mode) => {
      const value = colorFor(role, mode) ?? tokens.get(`--${role}`)?.[mode];
      return !value || /^initial$/i.test(value.declared);
    });
    return absent.length ? [{ role, modes: absent }] : [];
  });
  const registryContrast = (): ContrastCheck[] => modes.flatMap((mode) => contrastPairs.map(([foreground, background]) => {
    const fg = colorFor(foreground, mode);
    const bg = colorFor(background, mode);
    if (!fg || !bg) return { mode, foreground, background, ratio: null, status: "missing" };
    if (!fg.resolved || !bg.resolved) return { mode, foreground, background, ratio: null, status: "unresolved" };
    const ratio = wcagContrast(fg.resolved, bg.resolved);
    return { mode, foreground, background, ratio, status: ratio >= 4.5 ? "pass" : "fail" };
  }));
  const { contrast, notes } = shadcn ? { contrast: registryContrast(), notes: [] } :
    customContrast(tokens, cwd ? readProjectConfig(cwd)?.theme?.pairs : undefined);
  const summary = { passed: 0, failed: 0, missing: 0, unresolved: 0 };
  for (const { status } of contrast) {
    const key = status === "pass" ? "passed" : status === "fail" ? "failed" : status;
    summary[key]++;
  }
  return {
    ...themeSources(theme), mode: shadcn ? "shadcn" : "custom", notes,
    ok: summary.failed === 0 && (!shadcn || (summary.unresolved === 0 && !missingRoles.length)),
    contrast, missingRoles, summary,
  };
}
