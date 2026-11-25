/**
 * TUI theme.
 *
 * Three palettes, chosen by `tui.theme` in settings.json:
 *
 * - `terminal` (default): inherits the colors of the terminal theme. Every
 *   token is a reference to the terminal palette (ANSI index 0-15) or to the
 *   terminal default foreground and background, never a fixed RGB value. The
 *   terminal paints them with its own theme (Ghostty, Alacritty, Kitty,
 *   Omarchy, Termius, Herdr and any other), so the TUI follows a theme switch
 *   live and keeps the terminal transparency, because the background is the
 *   terminal default background (SGR 49).
 * - `night` and `day`: fixed RGB palettes, the same on every terminal.
 *
 * When the terminal answers the OSC 4/10/11 palette query, `terminalTheme`
 * receives the real colors and only chooses WHICH palette slot fills each
 * role (dim text readable on the background, a visible selection shade,
 * accents with contrast). The result is still made of palette references.
 *
 * Color names follow their role in the interface, not the hue, so switching
 * palettes never touches the screens. Colors exist only in this file.
 */
import { RGBA, type CliRenderer, type ColorInput, type TerminalColors } from "@opentui/core";
import { readSettings, getPath } from "../config/settings.ts";

/** Names accepted by `tui.theme`. */
export type ThemeName = "terminal" | "night" | "day";

/** Theme names, the first one is the default. */
export const THEME_NAMES: readonly ThemeName[] = ["terminal", "night", "day"];

export interface Theme {
  name: ThemeName;
  background: ColorInput;
  surface: ColorInput;
  surfaceHigh: ColorInput;
  border: ColorInput;
  borderActive: ColorInput;
  text: ColorInput;
  textDim: ColorInput;
  textStrong: ColorInput;
  accent: ColorInput;
  accentSecondary: ColorInput;
  ok: ColorInput;
  warn: ColorInput;
  error: ColorInput;
  barBackground: ColorInput;
  barText: ColorInput;
  keyBackground: ColorInput;
  keyText: ColorInput;
  selection: ColorInput;
  selectionText: ColorInput;
  primary: ColorInput;
  primaryText: ColorInput;
  brandBackground: ColorInput;
  brandText: ColorInput;
}

/** ANSI slots of the 16-color palette, by name. */
export const ANSI = {
  black: 0,
  red: 1,
  green: 2,
  yellow: 3,
  blue: 4,
  magenta: 5,
  cyan: 6,
  white: 7,
  brightBlack: 8,
  brightRed: 9,
  brightGreen: 10,
  brightYellow: 11,
  brightBlue: 12,
  brightMagenta: 13,
  brightCyan: 14,
  brightWhite: 15,
} as const;

/** Fixed RGB palettes. */
export const themes: Record<"night" | "day", Theme> = {
  night: {
    name: "night",
    background: "#00161E",
    surface: "#05232C",
    surfaceHigh: "#10333D",
    border: "#40656C",
    borderActive: "#2AD5BE",
    text: "#D7EDEA",
    textDim: "#9DBBB9",
    textStrong: "#F0FFFD",
    accent: "#C6F4ED",
    accentSecondary: "#FFB224",
    ok: "#72DBA0",
    warn: "#FFB224",
    error: "#FFA0A4",
    barBackground: "#082B34",
    barText: "#ABC7C6",
    keyBackground: "#C6F4ED",
    keyText: "#00161E",
    selection: "#19454F",
    selectionText: "#F0FFFD",
    primary: "#2AD5BE",
    primaryText: "#00161E",
    brandBackground: "#FFB224",
    brandText: "#00161E",
  },
  day: {
    name: "day",
    background: "#F4FCFA",
    surface: "#EAF7F4",
    surfaceHigh: "#D7F1EA",
    border: "#719992",
    borderActive: "#08796D",
    text: "#153C3D",
    textDim: "#466764",
    textStrong: "#00161E",
    accent: "#005A51",
    accentSecondary: "#855100",
    ok: "#17653C",
    warn: "#825000",
    error: "#9A273A",
    barBackground: "#DBF1EC",
    barText: "#2E5451",
    keyBackground: "#005A51",
    keyText: "#F4FCFA",
    selection: "#BCE8E0",
    selectionText: "#00161E",
    primary: "#005A51",
    primaryText: "#F4FCFA",
    brandBackground: "#FFB224",
    brandText: "#00161E",
  },
};

/** Which slot fills each role of the `terminal` theme. `"bg"` and `"fg"` are the terminal defaults. */
export interface TerminalSlots {
  surfaceHigh: number | "bg";
  border: number;
  textDim: number | "fg";
  accent: number;
  accentSecondary: number;
  ok: number;
  warn: number;
  error: number;
  /** Text over the accent block of the key bar. */
  keyText: number | "fg";
}

/**
 * Slots of the `terminal` theme. They are the brand of the binary in this
 * theme: `termfy-brand` changes `accent` to another ANSI slot (cyan, for
 * example) instead of a fixed color, so the TUI keeps inheriting the
 * terminal theme. Used as they are when the terminal does not report its
 * colors.
 */
export const DEFAULT_TERMINAL_SLOTS: Readonly<TerminalSlots> = Object.freeze({
  surfaceHigh: "bg",
  border: ANSI.brightBlack,
  textDim: ANSI.brightBlack,
  accent: ANSI.blue,
  accentSecondary: ANSI.magenta,
  ok: ANSI.green,
  warn: ANSI.yellow,
  error: ANSI.red,
  keyText: "fg",
});

/** Parses `#rrggbb` (or `#rgb`) into 0-255 channels; `null` for anything else. */
function parseHex(hex: string | null | undefined): [number, number, number] | null {
  if (!hex) return null;
  let value = hex.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(value)) value = value.replace(/./g, (c) => c + c);
  if (!/^[0-9a-f]{6}$/i.test(value)) return null;
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16)) as [number, number, number];
}

/** WCAG relative luminance of an sRGB color. */
function luminance([r, g, b]: [number, number, number]): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio between two colors, from 1 to 21. */
export function contrast(a: [number, number, number], b: [number, number, number]): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Chooses the palette slots from the colors the terminal reported.
 * Without a usable background, foreground and all 16 slots it returns the defaults, so a
 * terminal that ignores the query still gets a correct theme.
 */
export function chooseTerminalSlots(colors?: TerminalColors | null): TerminalSlots {
  const slots: TerminalSlots = { ...DEFAULT_TERMINAL_SLOTS };
  const bg = parseHex(colors?.defaultBackground);
  const fg = parseHex(colors?.defaultForeground);
  if (!colors || !bg || !fg) return slots;
  // A partial response cannot establish contrast for every role. Keep the
  // fallback intact instead of selecting slots whose colors are unknown.
  if (colors.palette.length < 16 || Array.from({ length: 16 }, (_, i) => parseHex(colors.palette[i])).some((color) => !color)) return slots;
  const slot = (index: number) => parseHex(colors.palette[index]);
  const vsBg = (index: number) => {
    const color = slot(index);
    return color ? contrast(color, bg) : 0;
  };

  // Dim text: the first gray readable on the background but quieter than the
  // foreground. Some themes paint bright black equal to the background.
  const fgContrast = contrast(fg, bg);
  const dim = [ANSI.brightBlack, ANSI.white].find((i) => vsBg(i) >= 2.2 && vsBg(i) < fgContrast);
  slots.textDim = dim ?? "fg";

  // Borders may be fainter than dim text, but never invisible.
  slots.border = [ANSI.brightBlack, ANSI.black, ANSI.white].find((i) => vsBg(i) >= 1.35) ?? ANSI.white;

  // Selection shade: close to the background, with the foreground readable on it.
  const shade = [ANSI.black, ANSI.brightBlack].find((i) => {
    const color = slot(i);
    if (!color) return false;
    const c = contrast(color, bg);
    return c >= 1.08 && c <= 2.6 && contrast(fg, color) >= 4;
  });
  slots.surfaceHigh = shade ?? "bg";

  // Accents: keep the configured slot, switch between its normal and bright
  // variant (index ± 8) when the configured one almost disappears here.
  const readable = (configured: number) => {
    const other = configured < 8 ? configured + 8 : configured - 8;
    return vsBg(configured) >= 2.5 || vsBg(other) <= vsBg(configured) ? configured : other;
  };
  slots.accent = readable(DEFAULT_TERMINAL_SLOTS.accent);
  slots.accentSecondary = readable(DEFAULT_TERMINAL_SLOTS.accentSecondary);
  slots.ok = readable(DEFAULT_TERMINAL_SLOTS.ok);
  slots.warn = readable(DEFAULT_TERMINAL_SLOTS.warn);
  slots.error = readable(DEFAULT_TERMINAL_SLOTS.error);

  // Key bar text: the candidate with the most contrast over the accent block.
  // ANSI has no "default background" foreground, so the terminal background
  // color itself is not a candidate.
  const accent = slot(slots.accent);
  if (accent) {
    const candidates: Array<[number | "fg", [number, number, number] | null]> = [
      ["fg", fg],
      [ANSI.black, slot(ANSI.black)],
      [ANSI.brightWhite, slot(ANSI.brightWhite)],
    ];
    let best: [number | "fg", number] = ["fg", contrast(fg, accent)];
    for (const [name, color] of candidates) {
      if (color && contrast(color, accent) > best[1]) best = [name, contrast(color, accent)];
    }
    slots.keyText = best[0];
  }
  return slots;
}

/**
 * Builds the `terminal` theme. Every color is a palette reference, so the
 * terminal draws it with its current theme.
 */
export function terminalTheme(colors?: TerminalColors | null): Theme {
  const slots = chooseTerminalSlots(colors);
  const background = RGBA.defaultBackground();
  const foreground = RGBA.defaultForeground();
  const ref = (slot: number | "bg" | "fg") => (slot === "bg" ? RGBA.defaultBackground() : slot === "fg" ? RGBA.defaultForeground() : RGBA.fromIndex(slot));
  return {
    name: "terminal",
    background,
    surface: RGBA.defaultBackground(),
    surfaceHigh: ref(slots.surfaceHigh),
    border: ref(slots.border),
    borderActive: ref(slots.accent),
    text: foreground,
    textDim: ref(slots.textDim),
    textStrong: RGBA.defaultForeground(),
    accent: ref(slots.accent),
    accentSecondary: ref(slots.accentSecondary),
    ok: ref(slots.ok),
    warn: ref(slots.warn),
    error: ref(slots.error),
    barBackground: RGBA.defaultBackground(),
    barText: ref(slots.textDim),
    keyBackground: ref(slots.accent),
    keyText: ref(slots.keyText),
    selection: ref(slots.surfaceHigh),
    selectionText: foreground,
    primary: ref(slots.accent),
    primaryText: ref(slots.keyText),
    brandBackground: ref(slots.accent),
    brandText: ref(slots.keyText),
  };
}

/** Reads `tui.theme`. Any failure or unknown value gives `terminal`. */
export function themeName(): ThemeName {
  try {
    const name = getPath(readSettings(), "tui.theme");
    if (typeof name === "string" && (THEME_NAMES as readonly string[]).includes(name)) return name as ThemeName;
  } catch {
    // Without readable settings, keep the default theme.
  }
  return "terminal";
}

/** Returns the configured palette without asking the terminal anything. */
export function currentTheme(): Theme {
  const name = themeName();
  return name === "terminal" ? terminalTheme() : themes[name];
}

/**
 * Returns the configured palette, refined by the colors the terminal reports.
 * Only the `terminal` theme asks; the query has a short timeout and any
 * failure keeps the default slots, so a silent terminal never delays or
 * breaks the TUI.
 */
export async function resolveTheme(renderer: CliRenderer, timeoutMs = 300): Promise<Theme> {
  const name = themeName();
  if (name !== "terminal") return themes[name];
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    // getPalette may reuse an earlier detection with a longer timeout. Bound
    // our wait independently so that query cannot hold up the first frame;
    // the margin lets an answer that lands at the end of its own wait count.
    const colors = await Promise.race([
      renderer.getPalette({ size: 16, timeout: timeoutMs }),
      new Promise<null>((resolve) => { timer = setTimeout(() => resolve(null), timeoutMs + 100); }),
    ]);
    return terminalTheme(colors);
  } catch {
    return terminalTheme();
  } finally {
    clearTimeout(timer);
  }
}

/** Glyphs used by the screens; all fit in one cell. */
export const glyphs = {
  bullet: "•",
  arrow: "→",
  ok: "✓",
  warn: "!",
  error: "✗",
  separator: "│",
  block: "▌",
};
