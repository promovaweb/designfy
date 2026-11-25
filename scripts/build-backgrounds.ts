/** Generates the theme-only background stylesheet, preset metadata, and reference catalog. */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  linearToOklab, oklabToOklch, parseColor, srgbToLinear, type Oklch, type Rgb,
} from "../src/design/color.ts";

const root = join(import.meta.dir, "..");
const referenceDir = "skills/designfy-design-system/references/backgrounds";
const registryDir = "registry/shared/backgrounds";
const galleryPath = "examples/backgrounds/index.html";
const galleryStart = '<script id="background-presets" type="application/json">';
const galleryEnd = "</script>";

const categories = {
  gradients: "Gradientes",
  geometric: "Geométricos",
  decorative: "Decorativos",
  effects: "Efeitos",
};
type Category = keyof typeof categories;
const sourceLabels = { reactbd: "ReactBD BG", gradientdeck: "GradientDeck" };
type Source = keyof typeof sourceLabels;
type Tone = "light" | "dark";
type Legibility = "text-safe" | "needs-fade" | "decorative-only";
const cssComments = /\/\*[\s\S]*?\*\//g;
interface Pattern {
  id: string;
  name: string;
  category: Category;
  theme: Tone;
  style: {
    [property: string]: string | number | undefined;
    background?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    animation?: string;
  };
  code: string;
  cssCode?: string;
  animated: boolean;
  keyframes: string | null;
}

interface Sample extends Oklch {
  alpha: number;
}

const hueRoles = ["primary", "accent", "chart-3", "chart-4", "chart-5"] as const;
type Role = "background" | "foreground" | "border" | "muted" | typeof hueRoles[number];

// Comments are consumed as single tokens so color names in prose stay intact.
const colorTokens = /\/\*[\s\S]*?\*\/|#[\da-f]+\b|(?<![\w-])(?:rgba?|hsla?|oklch)\([^()]*\)|(?<![\w-])(?:white|black|transparent)(?![\w-])/gi;
const gradientName = /^(repeating-)?(linear|radial|conic)-gradient\(/;
const normalizeHue = (hue: number) => ((hue % 360) + 360) % 360;
const hueDistance = (left: number, right: number) => Math.min(Math.abs(left - right), 360 - Math.abs(left - right));
const fraction = (value: string, scale = 1) => Number.parseFloat(value) / (value.endsWith("%") ? 100 : scale);
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const comment = (value: string) => value.startsWith("/*");

function hslToRgb(hue: string, saturation: string, lightness: string): Rgb {
  const unit = hue.match(/(?:grad|rad|turn|deg)$/)?.[0] ?? "deg";
  const units = { grad: 0.9, rad: 180 / Math.PI, turn: 360, deg: 1 };
  const h = normalizeHue(Number.parseFloat(hue) * units[unit as keyof typeof units]);
  const s = clamp(fraction(saturation));
  const l = clamp(fraction(lightness));
  const amplitude = s * Math.min(l, 1 - l);
  const channel = (offset: number) => {
    const k = (offset + h / 30) % 12;
    return l - amplitude * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [channel(0), channel(8), channel(4)];
}

function parseSample(token: string): Sample {
  const value = token.toLowerCase();
  if (value === "transparent") return { ...parseColor("#000"), alpha: 0 };
  if (value === "white" || value === "black") {
    return { ...parseColor(value === "white" ? "#fff" : "#000"), alpha: 1 };
  }
  if (value.startsWith("#")) {
    const digits = value.slice(1);
    const expanded = digits.length <= 4 ? digits.replace(/./g, (digit) => digit.repeat(2)) : digits;
    const alpha = expanded.length === 8 ? Number.parseInt(expanded.slice(6), 16) / 255 : 1;
    return { ...parseColor(`#${expanded.slice(0, 6)}`), alpha };
  }
  const components = value.slice(value.indexOf("(") + 1, -1).trim().split(/\s*[,/]\s*|\s+/);
  const [first, second, third, opacity] = components;
  if (!first || !second || !third) throw new Error(`Invalid color ${token}`);
  const alpha = opacity === undefined ? 1 : clamp(fraction(opacity));
  if (value.startsWith("oklch")) {
    return { ...parseColor(`oklch(${first} ${third === "none" ? 0 : second} ${third === "none" ? 0 : third})`), alpha };
  }
  const rgb: Rgb = value.startsWith("rgb")
    ? [clamp(fraction(first, 255)), clamp(fraction(second, 255)), clamp(fraction(third, 255))]
    : hslToRgb(first, second, third);
  return { ...oklabToOklch(linearToOklab(srgbToLinear(rgb))), alpha };
}

function samples(value: string): Sample[] {
  return [...value.matchAll(colorTokens)].map(([token]) => token).filter((token) => !comment(token)).map(parseSample);
}

function cssLayers(value: string): string[] {
  let depth = 0;
  let start = 0;
  const layers = [];
  // Skip punctuation in comments while finding commas between CSS layers.
  for (const match of value.matchAll(/\/\*[\s\S]*?\*\/|[(),]/g)) {
    if (match[0] === "(") depth++;
    if (match[0] === ")") depth--;
    if (match[0] === "," && depth === 0) {
      layers.push(value.slice(start, match.index).trim());
      start = match.index + 1;
    }
  }
  layers.push(value.slice(start).trim());
  return layers;
}

function solidColor(value: string): Sample | undefined {
  const clean = value.replace(/\/\*[\s\S]*?\*\//g, "").trim();
  const [match] = clean.matchAll(colorTokens);
  return match?.[0] === clean ? parseSample(clean) : undefined;
}

function sameColor(left: Sample, right: Sample): boolean {
  return Math.abs(left.l - right.l) < 1e-6 && Math.abs(left.c - right.c) < 1e-6 &&
    (left.c < 1e-6 || hueDistance(left.h, right.h) < 1e-4);
}

function baseSample(pattern: Pattern): Sample | undefined {
  const { style, code, theme } = pattern;
  const wrapper = code.split("\n", 1)[0] ?? "";
  const wrapperValue = wrapper.match(/\bbg-\[([^\]]+)\]/)?.[1]
    ?? wrapper.match(/\bbg-(white|black)\b/)?.[1];
  const source = style.background ?? wrapperValue;
  const explicit = solidColor(style.backgroundColor ?? "")
    ?? cssLayers(source ?? "").map(solidColor).findLast((sample) => sample && sample.alpha > 0);
  if (explicit) return explicit;

  // An opaque full-field gradient can supply its own canvas. Pick the
  // tone-matching extreme from its back layer, leaving other stops as accents.
  if (style.backgroundSize) return undefined;
  for (const layer of cssLayers(source ?? "").reverse()) {
    if (!gradientName.test(layer)) continue;
    const stops = samples(layer);
    const first = stops[0];
    if (!first || stops.some((stop) => stop.alpha < 1) || stops.every((stop) => sameColor(stop, first))) continue;
    const direction = theme === "dark" ? 1 : -1;
    return stops.toSorted((left, right) => direction * (left.l - right.l))[0];
  }
  return undefined;
}

function hueFamilies(colors: Sample[]): number[] {
  let remaining = colors;
  const families: number[] = [];
  // Recount after each assignment so the dominant family always wins first.
  while (remaining.length && families.length < hueRoles.length) {
    const scores = remaining.map((sample) =>
      remaining.filter((other) => hueDistance(sample.h, other.h) <= 60).length);
    const center = remaining[scores.indexOf(Math.max(...scores))]!.h;
    families.push(center);
    remaining = remaining.filter((sample) => hueDistance(sample.h, center) > 60);
  }
  return families;
}

function cssProperty(property: string): string {
  return property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function renameSpotlight(value: string): string {
  return value.replace(/--([xy])\b/g, "--df-bg-spotlight-$1");
}

function tokenizedPattern(pattern: Pattern) {
  const base = baseSample(pattern);
  const baseLightness = base?.l ?? (pattern.theme === "dark" ? 0.15 : 1);
  const entries = Object.entries(pattern.style);
  const hueColors = entries.flatMap(([property, value]) =>
    typeof value === "string" && !/mask/i.test(property) ? samples(value) : [])
    .filter((sample) => sample.alpha > 0 && sample.c >= 0.03 && !(base && sameColor(sample, base)));
  const families = hueFamilies(hueColors);
  const roles = new Set<Role>(["background"]);
  const tiled = /\dpx\b/.test(pattern.style.backgroundSize ?? "");

  function roleFor(sample: Sample, property: string): Role {
    if (/mask/i.test(property)) return "foreground";
    if (base && sameColor(sample, base)) return "background";
    if (sample.c < 0.03) {
      const difference = Math.abs(sample.l - baseLightness);
      if (tiled || pattern.category === "geometric") {
        return sample.alpha <= 0.15 || difference <= 0.16 ? "border" : "foreground";
      }
      return difference <= 0.24 ? "muted" : "foreground";
    }
    const matchingFamily = families.findIndex((center) => hueDistance(center, sample.h) <= 60);
    if (matchingFamily >= 0) return hueRoles[matchingFamily]!;
    const distances = families.map((center) => hueDistance(center, sample.h));
    return hueRoles[distances.indexOf(Math.min(...distances))] ?? "primary";
  }

  function replaceColors(value: string, property: string): string {
    return value.replace(colorTokens, (token) => {
      if (comment(token)) return token;
      const sample = parseSample(token);
      if (sample.alpha === 0) return "transparent";
      const role = roleFor(sample, property);
      roles.add(role);
      const themed = `var(--${role})`;
      if (sample.alpha === 1) return themed;
      return `color-mix(in oklab, ${themed} ${Number((sample.alpha * 100).toFixed(8))}%, transparent)`;
    });
  }

  const animationName = pattern.keyframes?.match(/^@keyframes\s+([\w-]+)/)?.[1];
  if (pattern.animated && (!animationName || !pattern.style.animation?.startsWith(`${animationName} `))) {
    throw new Error(`Missing animation or keyframes for ${pattern.id}`);
  }
  const animation = animationName ? `df-bg-${animationName.replace(/^reactbd-/, "")}` : undefined;
  const declarations = entries.map(([property, raw]) => {
    let value = String(raw);
    // Vellum's 0.7px dots fall between four pixel centers on 1x displays.
    if (pattern.id === "studio-vellum" && property === "backgroundImage") {
      value = value.replace("circle at 1px 1px", "circle at 0.5px 0.5px");
    }
    const themed = property === "animation" && animationName && animation
      ? value.replace(animationName, animation)
      : replaceColors(value, property);
    return `  ${cssProperty(property)}: ${animationName === "spotlight" ? renameSpotlight(themed) : themed};`;
  });
  const keyframes = animationName && animation && pattern.keyframes
    ? renameSpotlight(pattern.keyframes.replace(`@keyframes ${animationName}`, `@keyframes ${animation}`))
    : undefined;
  return { declarations, roles: [...roles], keyframes };
}

function technique(pattern: Pattern, portuguese = false): string {
  const { style } = pattern;
  const layers = cssLayers(style.backgroundImage ?? style.background ?? "").flatMap((layer) => {
    const match = gradientName.exec(layer.replace(/\/\*[\s\S]*?\*\//g, "").trim());
    return match ? [`${match[1] ?? ""}${match[2]}`] : [];
  });
  const sizes = [...new Set(cssLayers(style.backgroundSize ?? "").filter((size) => /\dpx\b/.test(size)))];
  const descriptions = [...new Set(layers)].map((kind) => {
    const count = layers.filter((layer) => layer === kind).length;
    if (!portuguese) return `${count} ${kind}-gradient ${count === 1 ? "layer" : "layers"}`;
    const repeat = kind.startsWith("repeating-") ? (count === 1 ? " repetido" : " repetidos") : "";
    const shape = kind.replace("repeating-", "");
    const names = { linear: ["linear", "lineares"], radial: ["radial", "radiais"], conic: ["cônico", "cônicos"] };
    const name = names[shape as keyof typeof names][count === 1 ? 0 : 1];
    return `${count} ${count === 1 ? "gradiente" : "gradientes"} ${name}${repeat}`;
  });
  if (sizes.length) descriptions.push(`${portuguese ? "módulos de" : "tiles"} ${sizes.join(", ")}`);
  if (style.mask || style.maskImage) descriptions.push(portuguese ? "máscara" : "mask");
  if (style.backgroundBlendMode || style.mixBlendMode) descriptions.push(portuguese ? "mesclagem" : "blending");
  if (style.filter) descriptions.push(portuguese ? "filtro" : "filter");
  return descriptions.join(" + ") || (portuguese ? "fundo uniforme" : "solid fill");
}

function slugFromId(id: string): string {
  return id.replace(/^(?:reactbd|gradientdeck)-/i, "").normalize("NFKD").toLowerCase()
    .replace(/\p{Mark}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function fingerprint(declarations: string[]): string {
  // Preserve declaration order because shorthands can reset earlier longhands.
  return declarations.join("\n").replace(cssComments, " ").replace(/\s+/g, " ")
    .replace(/\s*([,():;])\s*/g, "$1").trim();
}

function length(value: string | undefined, full: number, fallback: number): number {
  if (!value || !/^-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|%)?$/.test(value)) return fallback;
  return value.endsWith("%") ? fraction(value) * full : Number.parseFloat(value);
}

const inkStop = /^(?:var\(--([\w-]+)\)|color-mix\(in oklab, var\(--([\w-]+)\) ([\d.]+)%, transparent\)|transparent)(?=\s|$)\s*(.*)$/;

function gradientProjection(kind: string, geometry: string, width: number, height: number) {
  if (kind === "radial") {
    const [shape = "", anchor = ""] = geometry.startsWith("at ")
      ? ["", geometry.slice(3)] : geometry.split(/\s+at\s+/);
    const keywords: Record<string, string> = { left: "0%", right: "100%", top: "0%", bottom: "100%", center: "50%" };
    const [first, second] = anchor.split(/\s+/);
    const verticalFirst = first === "top" || first === "bottom";
    const horizontal = verticalFirst ? second : first;
    const vertical = verticalFirst ? first : second;
    const cx = length(keywords[horizontal ?? ""] ?? horizontal, width, width / 2);
    const cy = length(keywords[vertical ?? ""] ?? vertical, height, height / 2);
    const farX = Math.max(cx, width - cx);
    const farY = Math.max(cy, height - cy);
    const radius = shape.split(/\s+/).filter((part) => /(?:px|%)$/.test(part));
    const circle = shape.startsWith("circle");
    const rx = Math.max(1, length(radius[0], width, circle ? Math.hypot(farX, farY) : Math.SQRT2 * farX));
    const ry = circle ? rx : Math.max(1, length(radius[1], height, Math.SQRT2 * farY));
    return { full: rx, at: (x: number, y: number) => Math.hypot((x - cx) / rx, (y - cy) / ry) * rx };
  }
  const directions: Record<string, number> = { "to top": 0, "to right": 90, "to bottom": 180, "to left": 270 };
  const angle = (directions[geometry] ?? Number.parseFloat(geometry || "180")) * Math.PI / 180;
  const dx = Math.sin(angle);
  const dy = -Math.cos(angle);
  const full = Math.abs(dx) * width + Math.abs(dy) * height;
  return { full, at: (x: number, y: number) => full / 2 + (x - width / 2) * dx + (y - height / 2) * dy };
}

function sampleGradient(layer: string, size: string | undefined) {
  const kind = gradientName.exec(layer);
  if (!kind) return [];
  const [, repeat, shape] = kind;
  const args = cssLayers(layer.slice(kind[0].length, -1));
  const geometry = inkStop.test(args[0] ?? "") ? "" : args.shift() ?? "";
  const [sizeX, sizeY] = (size ?? "").split(/\s+/);
  const width = Math.max(1, length(sizeX, 800, 800));
  const height = Math.max(1, length(sizeY, 480, 480));
  const projection = gradientProjection(shape!, geometry, width, height);
  const stops = args.flatMap((arg) => {
    const match = inkStop.exec(arg);
    if (!match) return [];
    const [, solid, mixed, percent, offsets = ""] = match;
    const role = solid ?? mixed;
    const coverage = !role ? 0 : solid ? 1 : Number(percent) / 100;
    const alpha = role === "background" ? 0 : coverage;
    const chromatic = hueRoles.some((chromaRole) => chromaRole === role);
    return offsets.trim().split(/\s+/).map((offset) => ({
      position: length(offset, projection.full, Number.NaN), coverage, alpha, chromatic,
    }));
  });
  if (stops.length < 2) return [];
  const first = stops[0]!;
  const last = stops.at(-1)!;
  if (Number.isNaN(first.position)) first.position = 0;
  if (Number.isNaN(last.position)) last.position = projection.full;
  let startIndex = 0;
  for (const [index, stop] of stops.entries()) {
    if (Number.isNaN(stop.position)) continue;
    const start = stops[startIndex]!;
    stop.position = Math.max(start.position, stop.position);
    for (let between = startIndex + 1; between < index; between++) {
      stops[between]!.position = start.position + (stop.position - start.position) * (between - startIndex) / (index - startIndex);
    }
    startIndex = index;
  }
  const period = last.position - first.position;

  const axis = (sample: number, viewport: number, tile: number) =>
    tile <= viewport / 2 ? sample * tile : ((0.25 + sample / 2) * viewport) % tile;
  return Array.from({ length: 100 }, (_, index) => {
    const x = axis(((index % 10) + 0.37) / 10, 800, width);
    const y = axis((Math.floor(index / 10) + 0.61) / 10, 480, height);
    const distance = projection.at(x, y);
    const at = repeat && period > 0
      ? first.position + (((distance - first.position) % period) + period) % period
      : distance;
    const right = stops.findIndex((stop) => stop.position > at);
    const leftStop = right === -1 ? last : stops[Math.max(0, right - 1)]!;
    const rightStop = right <= 0 ? leftStop : stops[right]!;
    const span = rightStop.position - leftStop.position;
    const mix = span > 0 ? (at - leftStop.position) / span : 0;
    return {
      coverage: leftStop.coverage * (1 - mix) + rightStop.coverage * mix,
      alpha: leftStop.alpha * (1 - mix) + rightStop.alpha * mix,
      chromaticAlpha: (leftStop.chromatic ? leftStop.alpha : 0) * (1 - mix) +
        (rightStop.chromatic ? rightStop.alpha : 0) * mix,
    };
  });
}

function legibility(declarations: string[]): Legibility {
  const properties = new Map(declarations.map((declaration) => {
    const separator = declaration.indexOf(":");
    return [declaration.slice(0, separator).trim(),
      declaration.slice(separator + 1, -1).replace(cssComments, " ").replace(/\s+/g, " ").trim()];
  }));
  const sizes = cssLayers(properties.get("background-size") ?? "");
  const layers = cssLayers(properties.get("background-image") ?? properties.get("background") ?? "")
    .map((layer, index) => sampleGradient(layer, sizes[index % sizes.length])).reverse();
  const opacity = Number(properties.get("opacity") ?? 1);
  let maxAlpha = 0;
  let tintedArea = 0;
  let strongArea = 0;
  let chromaticArea = 0;
  for (let index = 0; index < 100; index++) {
    let alpha = 0;
    let chromatic = 0;
    for (const layer of layers) {
      const sample = layer[index];
      if (!sample) continue;
      alpha = sample.alpha + alpha * (1 - sample.coverage);
      chromatic = sample.chromaticAlpha + chromatic * (1 - sample.coverage);
    }
    maxAlpha = Math.max(maxAlpha, alpha * opacity);
    if (chromatic * opacity >= 0.12) tintedArea++;
    if (alpha * opacity >= 0.65) strongArea++;
    if (chromatic * opacity >= 0.35) chromaticArea++;
  }
  // Estimate the middle half of an 800x480 canvas, or a full tile for small repeats.
  // Peak alpha below .25 with <35% area tinted at .12 or more is text-safe.
  // At >=.65 peak alpha, >=65% strong area or >=55% chromatic area is decorative-only.
  // Everything in between needs a fade. Estimates ignore masks, blending and motion.
  if (maxAlpha < 0.25 && tintedArea < 35) return "text-safe";
  if (maxAlpha >= 0.65 && (strongArea >= 65 || chromaticArea >= 55)) return "decorative-only";
  return "needs-fade";
}

function readPatterns(file: string, source: Source) {
  const data = JSON.parse(readFileSync(join(root, referenceDir, file), "utf8")) as { patterns: Pattern[] };
  return data.patterns.map((pattern) => ({ ...pattern, source }));
}

const reactbd = readPatterns("reactbd-bg.json", "reactbd");
const gradientdeck = readPatterns("gradientdeck.json", "gradientdeck").map((pattern) => {
  const style: Pattern["style"] = Object.fromEntries(Object.entries(pattern.style)
    .map(([property, value]) => [property, typeof value === "string" ? value.trim() : value]));
  // Keep the linen lines visible after mapping their ink to the border role.
  if (pattern.id === "linen-texture") {
    style.backgroundImage = style.backgroundImage?.replaceAll("rgba(0,0,0,0.02)", "rgba(0,0,0,0.12)");
  }
  // The source blend modes flatten the texture on dark or light canvases.
  if (pattern.id === "micro-noise-fabric") delete style.mixBlendMode;
  if (pattern.id === "radiant-burst-rays") delete style.backgroundBlendMode;
  return { ...pattern, style };
});
const patterns = [...reactbd, ...gradientdeck];
const keyframes = new Set<string>();
const animationProperties = new Set<string>();
const rules: string[] = [];
const normalizedSlugs = new Set(reactbd.map(({ id }) => slugFromId(id)));
const slugs = new Set<string>();
const firstByFingerprint = new Map<string, { slug: string; variants: string[]; legibility: Legibility }>();
const presets = patterns.map((pattern) => {
  const normalized = slugFromId(pattern.id);
  if (!normalized) throw new Error(`Empty preset slug from ${pattern.id}`);
  const base = pattern.source === "gradientdeck" && slugs.has(normalized) ? `gd-${normalized}` : normalized;
  let slug = base;
  if (slugs.has(slug)) {
    let suffix = 2;
    do slug = `${base}-${suffix++}`;
    while (slugs.has(slug) || normalizedSlugs.has(slug));
  }
  slugs.add(slug);
  const { declarations, roles, keyframes: frames } = tokenizedPattern(pattern);
  if (frames) {
    keyframes.add(frames);
    for (const [property] of (pattern.cssCode ?? pattern.code).matchAll(/@property --[xy] \{[^}]+\}/g)) {
      animationProperties.add(renameSpotlight(property));
    }
  }
  rules.push(`[data-df-bg="${slug}"] {\n${declarations.join("\n")}\n}`);
  const key = fingerprint(declarations);
  const first = firstByFingerprint.get(key);
  const entry = {
    slug, source: pattern.source, sourceId: pattern.id, name: pattern.name, category: pattern.category, tone: pattern.theme,
    animated: pattern.animated, roles, technique: technique(pattern), variantOf: first?.slug ?? null,
    legibility: first?.legibility ?? legibility(declarations),
  };
  if (first) {
    first.variants.push(slug);
    return { ...entry, variants: undefined };
  }
  const canonical = { ...entry, variants: [] as string[] };
  firstByFingerprint.set(key, canonical);
  return canonical;
});
const bySlug = new Map(presets.map((preset) => [preset.slug, preset]));

const notice = readFileSync(join(root, referenceDir, "NOTICE.md"), "utf8").split("\n").slice(2)
  .map((line) => line.trimEnd()).join("\n").trimEnd();
const css = [
  `/* Generated by scripts/build-backgrounds.ts from ReactBD BG, Pattern Craft, and GradientDeck.\n\n${notice}\n*/`,
  "[data-df-bg] { position: absolute; inset: 0; pointer-events: none; z-index: 0; }",
  "[data-df-bg-fade] { position: absolute; inset: 0; pointer-events: none; }",
  '[data-df-bg-fade="bottom"] { mask-image: linear-gradient(var(--foreground) 35%, transparent); }',
  '[data-df-bg-fade="edges"] { mask-image: linear-gradient(to right, transparent, var(--foreground) 18% 82%, transparent); }',
  '[data-df-bg-fade="radial"] { mask-image: radial-gradient(ellipse at center, var(--foreground) 25%, transparent 75%); }',
  ...rules,
  ...animationProperties,
  ...keyframes,
  "@media (prefers-reduced-motion: reduce) {\n  [data-df-bg] { animation: none !important; }\n}",
].join("\n\n") + "\n";

const catalog = [
  "# Catálogo de fundos",
  "",
  `O catálogo reúne ${firstByFingerprint.size} fundos distintos entre os ${presets.length} presets adaptados do ReactBD BG e do GradientDeck.`,
  "O Pattern Craft, de Megh Bari, é a origem de boa parte dos padrões do ReactBD BG.",
  `Os ${gradientdeck.length} presets do GradientDeck aparecem nas tabelas das suas categorias.`,
  "Os componentes React e Astro aceitam o slug na propriedade `preset`.",
  "Importe `designfy-backgrounds.css` uma vez no projeto para carregar os estilos.",
  "A galeria exibe um cartão por fundo e permite mostrar os equivalentes nos dois temas.",
  "O CSS respeita a preferência por movimento reduzido do sistema.",
  "",
];
for (const [category, title] of Object.entries(categories)) {
  catalog.push(`## ${title}`, "", "| Slug | Nome | Fonte | Técnica | Papéis | Animação | Equivalentes |",
    "| --- | --- | --- | --- | --- | --- | --- |");
  presets.forEach((preset, index) => {
    if (preset.category !== category || (preset.variantOf !== null && preset.source === "reactbd")) return;
    const { slug, name, source, roles, animated, variantOf, variants } = preset;
    const equivalentSlugs = variantOf ? [variantOf] : variants;
    const equivalents = equivalentSlugs?.map((variant) => `${bySlug.get(variant)!.name} (\`${variant}\`)`).join("<br>") || "Nenhum";
    catalog.push(`| \`${slug}\` | ${name} | ${sourceLabels[source]} | ${technique(patterns[index]!, true)} | ${roles.map((role) => `\`--${role}\``).join(", ")} | ${animated ? "Sim" : "Não"} | ${equivalents} |`);
  });
  catalog.push("");
}

const types = [
  "/** Available background preset slugs. Generated by scripts/build-backgrounds.ts. */",
  "export type BackgroundPreset =",
  ...presets.map(({ slug }, index) => `  | "${slug}"${index === presets.length - 1 ? ";" : ""}`),
  "",
].join("\n");

const gallery = readFileSync(join(root, galleryPath), "utf8");
const galleryOffset = gallery.indexOf(galleryStart);
const galleryInsert = galleryOffset + galleryStart.length;
const galleryClose = gallery.indexOf(galleryEnd, galleryInsert);
if (galleryOffset < 0 || galleryClose < 0) throw new Error("Missing gallery preset data block");
const galleryData = presets.map(({ slug, name, category, variantOf, variants }) =>
  JSON.stringify({ slug, name, category, variantOf, variants }));
const galleryJson = `\n[\n  ${galleryData.join(",\n  ")}\n]\n`.replaceAll("<", "\\u003c");

const outputs = {
  [`${registryDir}/designfy-backgrounds.css`]: css,
  [`${registryDir}/presets.json`]: JSON.stringify(presets, null, 2) + "\n",
  [`${referenceDir}/catalogo.md`]: catalog.join("\n"),
  "registry/react/background/presets.ts": types,
  [galleryPath]: gallery.slice(0, galleryInsert) + galleryJson + gallery.slice(galleryClose),
};
for (const [relativePath, content] of Object.entries(outputs)) {
  const file = join(root, relativePath);
  if (process.argv.includes("--check")) {
    const current = await Bun.file(file).exists() ? await Bun.file(file).text() : undefined;
    if (current === content) continue;
    console.error(`Generated background output is out of date: ${relativePath}`);
    process.exitCode = 1;
  } else {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
}
