/** OKLCH palettes, sRGB gamut mapping, and WCAG and APCA contrast calculations. */
import { error } from "../app/errors.ts";

export type Rgb = readonly [red: number, green: number, blue: number];
export interface Oklab { l: number; a: number; b: number }
export interface Oklch { l: number; c: number; h: number }
type ColorInput = Oklch | string;

const numberPattern = String.raw`[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?`;
const oklchPattern = new RegExp(
  `^oklch\\(\\s*(${numberPattern})(%?)\\s+(${numberPattern})\\s+(${numberPattern})\\s*\\)$`, "i",
);
const normalizeHue = (hue: number) => ((hue % 360) + 360) % 360;
const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** Converts normalized sRGB channels to linear-light sRGB. */
export function srgbToLinear(rgb: Rgb): Rgb {
  const linear = (value: number) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  return [linear(rgb[0]), linear(rgb[1]), linear(rgb[2])];
}

/** Applies the sRGB transfer curve to linear-light channels. */
export function linearToSrgb(rgb: Rgb): Rgb {
  const encode = (value: number) => value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055;
  return [encode(rgb[0]), encode(rgb[1]), encode(rgb[2])];
}

/** Converts linear-light sRGB to OKLab using the linear sRGB and LMS matrices. */
export function linearToOklab([r, g, b]: Rgb): Oklab {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

/** Converts OKLab to linear-light sRGB without gamut mapping. */
export function oklabToLinear({ l, a, b }: Oklab): Rgb {
  const lmsL = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const lmsM = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const lmsS = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * lmsL - 3.3077115913 * lmsM + 0.2309699292 * lmsS,
    -1.2684380046 * lmsL + 2.6097574011 * lmsM - 0.3413193965 * lmsS,
    -0.0041960863 * lmsL - 0.7034186147 * lmsM + 1.707614701 * lmsS,
  ];
}

/** Expresses OKLab in OKLCH polar coordinates. */
export function oklabToOklch({ l, a, b }: Oklab): Oklch {
  const c = Math.hypot(a, b);
  return c < 1e-7 ? { l, c: 0, h: 0 } : { l, c, h: normalizeHue(Math.atan2(b, a) * 180 / Math.PI) };
}

/** Expresses OKLCH in OKLab Cartesian coordinates. */
export function oklchToOklab({ l, c, h }: Oklch): Oklab {
  const radians = h * Math.PI / 180;
  return { l, a: c * Math.cos(radians), b: c * Math.sin(radians) };
}

/** Parses an opaque hex or OKLCH color. Explicit OKLCH inputs may be outside sRGB. */
export function parseColor(input: string): Oklch {
  const value = input.trim();
  if (/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value)) {
    const digits = value.slice(1);
    const hex = digits.length === 3 ? digits.replace(/./g, (digit) => digit.repeat(2)) : digits;
    const rgb = Number.parseInt(hex, 16);
    const r = (rgb >> 16) / 255;
    const g = ((rgb >> 8) & 255) / 255;
    const b = (rgb & 255) / 255;
    if (r === g && g === b) return { l: Math.cbrt(srgbToLinear([r, g, b])[0]), c: 0, h: 0 };
    return oklabToOklch(linearToOklab(srgbToLinear([r, g, b])));
  }
  const match = oklchPattern.exec(value);
  if (match) {
    const l = Number(match[1]) / (match[2] === "%" ? 100 : 1);
    const c = Number(match[3]);
    const h = Number(match[4]);
    if (l >= 0 && l <= 1 && Number.isFinite(c) && c >= 0 && Number.isFinite(h)) {
      return { l, c, h: normalizeHue(h) };
    }
  }
  throw error.usage("Expected a color in #RGB, #RRGGBB, or oklch(L C H) format.");
}

const channels = (color: Oklch) => oklabToLinear(oklchToOklab(color));
const inGamut = (rgb: Rgb) => rgb.every((channel) => channel >= -1e-7 && channel <= 1 + 1e-7);

/** Reduces chroma to fit sRGB while keeping OKLCH lightness and hue fixed. */
export function clipGamut(color: Oklch): Oklch {
  if (color.l === 0 || color.l === 1) return { ...color, c: 0 };
  if (inGamut(channels(color))) return color;
  let low = 0;
  // No sRGB color exceeds this chroma. It also bounds the search for arbitrary inputs.
  let high = Math.min(color.c, 0.5);
  for (let iteration = 0; iteration < 28; iteration++) {
    const c = (high + low) / 2;
    if (inGamut(channels({ ...color, c }))) low = c;
    else high = c;
  }
  return { ...color, c: low };
}

function linearChannels(input: ColorInput): Rgb {
  const color = typeof input === "string" ? parseColor(input) : input;
  if (color.c === 0) {
    const gray = color.l ** 3;
    return [gray, gray, gray];
  }
  const [r, g, b] = channels(clipGamut(color));
  return [clamp(r), clamp(g), clamp(b)];
}

/** Formats a color as lowercase six-digit sRGB hex. */
export function toHex(color: ColorInput): string {
  return "#" + linearToSrgb(linearChannels(color))
    .map((channel) => Math.round(channel * 255).toString(16).padStart(2, "0")).join("");
}

/** Formats OKLCH coordinates for CSS without exponent notation. */
export function formatOklch(color: Oklch): string {
  const decimal = (value: number) => value.toFixed(8).replace(/\.?0+$/, "");
  const hue = decimal(normalizeHue(color.h));
  return `oklch(${decimal(color.l)} ${decimal(color.c)} ${hue === "360" ? "0" : hue})`;
}

const curve = [
  [50, 0.985, 0.12], [100, 0.955, 0.26], [200, 0.900, 0.43],
  [300, 0.830, 0.64], [400, 0.745, 0.85], [500, 0.655, 1],
  [600, 0.565, 0.92], [700, 0.475, 0.80], [800, 0.385, 0.65],
  [900, 0.295, 0.45], [950, 0.200, 0.25],
] as const;

export type ScaleStep = (typeof curve)[number][0];
export type ColorScale = Record<ScaleStep, Oklch>;

/** Builds a fixed-lightness, hue-preserving 50–950 scale with tapered chroma. */
export function scale(base: ColorInput): ColorScale {
  const { c, h } = clipGamut(typeof base === "string" ? parseColor(base) : base);
  return Object.fromEntries(curve.map(([step, l, factor]) => [step, clipGamut({ l, c: c * factor, h })])) as ColorScale;
}

const rotations = {
  complementary: [180],
  analogous: [-30, 30],
  triadic: [120, 240],
  "split-complementary": [150, 210],
  tetradic: [60, 180, 240],
  monochromatic: [],
} as const;

export type Harmony = keyof typeof rotations;
/** Color-wheel harmonies accepted by palette generation. */
export const harmonyNames = Object.keys(rotations) as Harmony[];

/** Returns each harmony's companion colors, excluding the base color. */
export function harmonies(base: ColorInput): Record<Harmony, Oklch[]> {
  const color = typeof base === "string" ? parseColor(base) : base;
  return {
    complementary: rotate(rotations.complementary),
    analogous: rotate(rotations.analogous),
    triadic: rotate(rotations.triadic),
    "split-complementary": rotate(rotations["split-complementary"]),
    tetradic: rotate(rotations.tetradic),
    monochromatic: ([[0.35, 0.65], [0.82, 0.35]] as const).map(([l, factor]) =>
      clipGamut({ ...color, l, c: Math.min(color.c, 0.5) * factor }),
    ),
  };

  function rotate(offsets: readonly number[]): Oklch[] {
    return offsets.map((offset) => clipGamut({ ...color, h: normalizeHue(color.h + offset) }));
  }
}

/** Returns the WCAG 2.2 contrast ratio, from 1 to 21. */
export function wcagContrast(foreground: ColorInput, background: ColorInput): number {
  const luminance = (input: ColorInput) => {
    const [r, g, b] = linearChannels(input);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const fg = luminance(foreground);
  const bg = luminance(background);
  return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
}

/** Returns signed APCA Lc using the 0.0.98G-4g reference equations. */
export function apcaContrast(foreground: ColorInput, background: ColorInput): number {
  // https://apcaw3.myndex.com/docs/APCA-W3-LaTeX.html
  const luminance = (input: ColorInput) => {
    const [r, g, b] = linearToSrgb(linearChannels(input));
    const y = 0.2126729 * r ** 2.4 + 0.7151522 * g ** 2.4 + 0.0721750 * b ** 2.4;
    return y < 0.022 ? y + (0.022 - y) ** 1.414 : y;
  };
  const fg = luminance(foreground);
  const bg = luminance(background);
  if (Math.abs(bg - fg) < 0.0005) return 0;
  const darkText = bg > fg;
  const perceptual = darkText
    ? (bg ** 0.56 - fg ** 0.57) * 1.14
    : (bg ** 0.65 - fg ** 0.62) * 1.14;
  if (Math.abs(perceptual) < 0.1) return 0;
  return (perceptual + (darkText ? -0.027 : 0.027)) * 100;
}

/** Evaluates WCAG text and non-text thresholds. Non-text contrast has no AAA criterion. */
export function verdicts(ratio: number) {
  return {
    normalText: { aa: ratio >= 4.5, aaa: ratio >= 7 },
    largeText: { aa: ratio >= 3, aaa: ratio >= 4.5 },
    uiComponent: { aa: ratio >= 3, aaa: null },
  };
}

/** Formats a color for the CLI and MCP tool results. */
export function describeColor(color: Oklch) {
  return { hex: toHex(color), oklch: formatOklch(color) };
}

/** Describes the base color and its wheel harmonies in hex and OKLCH. */
export function describeWheel(input: string) {
  const base = clipGamut(parseColor(input));
  const harmoniesByName = harmonies(base);
  return {
    base: describeColor(base),
    harmonies: Object.fromEntries(harmonyNames.map((name) => [name, harmoniesByName[name].map(describeColor)])),
  };
}

/** Measures a color pair and reports its WCAG verdicts. */
export function describeContrast(foreground: string, background: string) {
  const fg = clipGamut(parseColor(foreground));
  const bg = clipGamut(parseColor(background));
  const ratio = wcagContrast(fg, bg);
  return { foreground: describeColor(fg), background: describeColor(bg), ratio, apca: apcaContrast(fg, bg), verdicts: verdicts(ratio) };
}

type Mode = "light" | "dark";
type Token =
  | "background" | "foreground" | "card" | "muted" | "border" | "primary"
  | "primary-foreground" | "accent" | "ring" | "destructive" | "success" | "warning" | "info";
type Semantic = Record<Token, Oklch>;
interface ContrastPair { mode: Mode; foreground: Token; background: Token; ratio: number }
export interface Palette {
  scales: Record<string, ColorScale> & { primary: ColorScale; neutral: ColorScale };
  semantic: Record<Mode, Semantic>;
  contrast: ContrastPair[];
}

const statusScales = {
  destructive: scale("#dc2626"),
  success: scale("#16a34a"),
  warning: scale("#d97706"),
  info: scale("#0284c7"),
};

const semanticPairs: ReadonlyArray<readonly [Token, Token]> = [
  ["foreground", "background"], ["foreground", "card"], ["foreground", "muted"], ["foreground", "accent"],
  ["primary-foreground", "primary"], ["primary", "background"], ["primary", "card"],
  ...(["border", "ring", "destructive", "success", "warning", "info"] as const)
    .flatMap((token) => [[token, "background"], [token, "card"]] as const),
];

function semanticTokens(mode: Mode, { primary, neutral, accent = primary }: Palette["scales"]): Semantic {
  const light = mode === "light";
  const background = neutral[light ? 50 : 950];
  const card = neutral[light ? 100 : 900];
  const foreground = neutral[light ? 950 : 50];
  const muted = neutral[light ? 200 : 800];
  const accentSurface = accent[light ? 200 : 800];
  const steps = curve.map(([step]) => step);
  const againstSurfaces = (colors: ColorScale, targets: Oklch[] = [background, card]) => {
    const order = light ? steps : [...steps].reverse();
    const cssTargets = targets.map(formatOklch);
    const match = order.map((step) => colors[step]).find((color) => {
      if (!targets.every((surface) => wcagContrast(color, surface) >= 4.5)) return false;
      const cssColor = formatOklch(color);
      return cssTargets.every((surface) => wcagContrast(cssColor, surface) >= 4.5);
    });
    if (!match) throw new Error("No scale step meets the required semantic contrast.");
    return match;
  };
  const primaryForeground = neutral[light ? 50 : 950];
  return {
    background, foreground, card, muted,
    border: againstSurfaces(neutral),
    primary: againstSurfaces(primary, [background, card, primaryForeground]),
    "primary-foreground": primaryForeground,
    accent: accentSurface,
    ring: againstSurfaces(accent),
    destructive: againstSurfaces(statusScales.destructive),
    success: againstSurfaces(statusScales.success),
    warning: againstSurfaces(statusScales.warning),
    info: againstSurfaces(statusScales.info),
  };
}

/** Builds primary, neutral, and optional accent scales plus audited semantic tokens. */
export function generatePalette({ base, harmony }: { base: ColorInput; harmony?: Harmony }): Palette {
  const color = clipGamut(typeof base === "string" ? parseColor(base) : base);
  const primary = scale(color);
  const neutral = scale({ ...color, c: Math.min(color.c, 0.018) });
  const scales: Palette["scales"] = { primary, neutral };
  if (harmony) {
    harmonies(color)[harmony].forEach((companion, index) => {
      scales[index === 0 ? "accent" : `accent-${index + 1}`] = scale(companion);
    });
  }
  const semantic = { light: semanticTokens("light", scales), dark: semanticTokens("dark", scales) };
  const contrast = (["light", "dark"] as const).flatMap((mode) =>
    semanticPairs.map(([foreground, background]) => ({
      mode, foreground, background, ratio: wcagContrast(semantic[mode][foreground], semantic[mode][background]),
    })),
  );
  return { scales, semantic, contrast };
}

function scaleVariables(palette: Palette): string[] {
  return Object.entries(palette.scales).flatMap(([name, colors]) =>
    curve.map(([step]) => `  --color-${name}-${step}: ${formatOklch(colors[step])};`),
  );
}

/** Formats shadcn light and dark variables and a Tailwind inline theme. */
export function toCss(palette: Palette): string {
  const rules = (selector: string, tokens: Semantic) =>
    [`${selector} {`, ...Object.entries(tokens).map(([name, color]) => `  --${name}: ${formatOklch(color)};`), "}"];
  const aliases = Object.keys(palette.semantic.light).map((name) => `  --color-${name}: var(--${name});`);
  return [
    ...rules(":root", palette.semantic.light), "", ...rules(".dark", palette.semantic.dark), "",
    "@theme inline {", ...aliases, ...scaleVariables(palette), "}", "",
  ].join("\n");
}

/** Formats only the numeric scales as a Tailwind theme block. */
export function toTailwindTheme(palette: Palette): string {
  return ["@theme {", ...scaleVariables(palette), "}", ""].join("\n");
}

/** Formats the structured palette as indented JSON. */
export function toJson(palette: Palette): string {
  return JSON.stringify(palette, null, 2) + "\n";
}
