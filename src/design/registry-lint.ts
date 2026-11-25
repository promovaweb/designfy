/** Validates interface catalog links and token usage in registry source files. */

const themeTokenFile = "registry/shared/styles/designfy-theme.css";
const optionalCatalogTypes = new Set(["registry:lib", "registry:style"]);

/** Returns the shadcn CLI argument for a dependency hosted by an external registry. */
export function externalRegistryItem(dependency: string): string | undefined {
  if (dependency.startsWith("shadcn:")) return dependency.slice("shadcn:".length);
  if (dependency.startsWith("reui:")) return `@reui/${dependency.slice("reui:".length)}`;
}

interface CatalogLinkedItem {
  path: string;
  name: string;
  type: string;
  meta?: { catalog?: unknown };
}

interface RegistrySource {
  path: string;
  content: string;
}

/** Reports registry items with missing or unknown interface catalog IDs. */
export function checkRegistryCatalog(items: readonly CatalogLinkedItem[], catalogIds: ReadonlySet<string>): string[] {
  return items.flatMap(({ path, name, type, meta }) => {
    const id = meta?.catalog;
    const label = `${path}: ${name}`;
    if (id === undefined && optionalCatalogTypes.has(type)) return [];
    if (typeof id !== "string" || !id.trim()) return [`${label}: meta.catalog must contain a catalog ID.`];
    return catalogIds.has(id) ? [] : [`${label}: unknown meta.catalog ID "${id}".`];
  });
}

const fixedPalette = /(?<![\w-])(?:bg|text|border|ring|fill|stroke|from|via|to|outline|decoration|shadow|divide|placeholder|caret|accent)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}(?![\w-])/g;
const arbitraryColor = /(?<![\w-])(?:bg|text|border|ring|fill|stroke|from|via|to|outline|decoration|shadow|divide|placeholder|caret|accent)-\[(?:color:)?([a-z]+)\]/gi;
const allowedColorKeywords = new Set(["transparent", "currentcolor", "inherit"]);
const fixedBlackWhite = /(?<![\w-])(?:bg|text|border|ring|fill|stroke|from|via|to|outline|decoration|shadow|divide|placeholder|caret|accent)-(?:black|white)(?![\w-])/g;
const fontValue = /\bfont-family\s*:\s*([^;{}]+)|\bfontFamily\s*:\s*(["'`])([^\n]*?)\2/gi;
const fontTokens = /^var\(\s*--font-[\w-]+\s*\)(?:\s*,\s*var\(\s*--font-[\w-]+\s*\))*\s*(?:!important)?$/i;
const themeFontTokens = /^var\(\s*--(?:df-)?font-[\w-]+\s*\)(?:\s*,\s*var\(\s*--(?:df-)?font-[\w-]+\s*\))*\s*(?:!important)?$/i;
const namedColors = /\b([\w-]+)\s*:\s*([^;{}\n]*\b(?:black|white)\b[^;{}\n]*)/gi;
const colorProperty = /^(?:--[\w-]*(?:color|foreground|background)|color|background(?:-color)?|(?:border|outline|text-decoration)(?:-[\w-]+)?|fill|stroke|(?:box|text)-shadow|caret-color|accent-color)$/i;

/** Reports literal colors, fixed palette utilities and literal font families with source lines. */
export function checkRegistryTheme(files: readonly RegistrySource[]): string[] {
  const problems: string[] = [];
  for (const { path, content } of files) {
    const source = content.replace(/\/\*[\s\S]*?\*\/|^[ \t]*\/\/[^\n]*/gm, (comment) => comment.replace(/[^\n]/g, " "));
    const report = (index: number, message: string) => {
      const line = source.slice(0, index).split("\n").length;
      problems.push(`${path}:${line}: ${message}`);
    };
    const isTokenFile = path === themeTokenFile;
    if (!isTokenFile) {
      const fallbackRanges = checkColors(source, report);
      for (const pattern of [fixedPalette, fixedBlackWhite]) {
        for (const match of source.matchAll(pattern)) {
          report(match.index, `Fixed palette utility ${match[0]}; use a theme role.`);
        }
      }
      for (const match of source.matchAll(arbitraryColor)) {
        const value = match[1]!.toLowerCase();
        if (!allowedColorKeywords.has(value) && Bun.color(value, "hex")) {
          report(match.index, `Literal color in ${match[0]}; use a theme role.`);
        }
      }
      for (const match of source.matchAll(namedColors)) {
        if (!colorProperty.test(match[1]!)) continue;
        const value = match[2]!;
        const start = match.index + match[0].length - value.length;
        for (const color of value.matchAll(/(?<![\w-])(?:black|white)(?![\w-])/gi)) {
          const index = start + color.index;
          if (fallbackRanges.some(([from, to]) => from <= index && index < to)) continue;
          report(index, `Literal color in ${match[1]}; use a theme role.`);
        }
      }
    }
    for (const match of source.matchAll(fontValue)) {
      const value = (match[1] ?? match[3]!).trim();
      if (!(isTokenFile ? themeFontTokens : fontTokens).test(value)) {
        const tokens = isTokenFile ? "var(--font-*) or var(--df-font-*)" : "var(--font-*)";
        report(match.index, `Use ${tokens} for font-family: ${value}.`);
      }
    }
  }
  return problems;
}

function checkColors(source: string, report: (index: number, message: string) => void): [number, number][] {
  const functions: { variable: boolean; fallback?: number }[] = [];
  const ranges: [number, number][] = [];
  let fallbacks = 0;
  // Tailwind arbitrary values encode whitespace as underscores.
  const tokens = /(?<![a-z0-9-])(?:var|rgba?|hsla?|oklch|oklab)\s*\(|(?<![a-z0-9-])#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})(?![a-z0-9-])|[(),]/gi;
  for (const { 0: token, index } of source.matchAll(tokens)) {
    if (token === ")") {
      const fallback = functions.pop()?.fallback;
      if (fallback !== undefined) {
        fallbacks--;
        ranges.push([fallback, index]);
      }
    } else if (token === ",") {
      const frame = functions.at(-1);
      if (frame?.variable && frame.fallback === undefined) {
        frame.fallback = index + 1;
        fallbacks++;
      }
    } else {
      const variable = /^var/i.test(token);
      if (!fallbacks && token !== "(" && !variable) {
        report(index, `Literal color ${token}; use a theme role.`);
      }
      if (token.endsWith("(")) functions.push({ variable });
    }
  }
  return ranges;
}
