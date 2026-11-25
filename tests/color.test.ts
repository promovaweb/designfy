/** Color science reference values and generated palette invariants. */
import { expect, test } from "bun:test";
import {
  apcaContrast, clipGamut, formatOklch, generatePalette, harmonies, harmonyNames,
  oklabToLinear, oklchToOklab, parseColor, scale, toHex, verdicts, wcagContrast,
} from "../src/design/color.ts";

test("matches WCAG and both polarities of APCA reference contrast", () => {
  expect(wcagContrast("#fff", "#000")).toBe(21);
  expect(wcagContrast("#777", "#fff")).toBeCloseTo(4.48, 2);
  expect(apcaContrast("#000", "#fff")).toBeCloseTo(106.0, 0);
  expect(apcaContrast("#fff", "#000")).toBeCloseTo(-107.9, 0);
  expect(apcaContrast("#abc", "#abc")).toBe(0);
  expect(verdicts(wcagContrast("#777", "#fff"))).toEqual({
    normalText: { aa: false, aaa: false },
    largeText: { aa: true, aaa: false },
    uiComponent: { aa: true, aaa: null },
  });
  expect(verdicts(4.5).normalText.aa).toBe(true);
  expect(verdicts(7).normalText.aaa).toBe(true);
});

test("parses red to the OKLCH reference and accepts either lightness notation", () => {
  const red = parseColor("#ff0000");
  expect(red.l).toBeCloseTo(0.628, 3);
  expect(red.c).toBeCloseTo(0.2577, 4);
  expect(red.h).toBeCloseTo(29.23, 2);
  expect(parseColor("oklch(62.8% .2577 -330.77)")).toEqual(parseColor("oklch(.628 .2577 29.23)"));
  for (const invalid of ["red", "#0281", "oklch(1.01 .3 0)", "oklch(50% -.4 0)", "oklch(.5 .3 NaN)", "oklch(.5 .3 0 / 0.5)"]) {
    expect(() => parseColor(invalid)).toThrow("Expected a color");
  }
});

test("round-trips real sRGB colors through formatted OKLCH", () => {
  for (const hex of [
    "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff",
    "#6750a4", "#f09a32", "#123456", "#777777", "#000015", "#b6c3ac", "#9ac925", "#0267ac",
  ]) {
    expect(toHex(parseColor(formatOklch(parseColor(hex))))).toBe(hex);
  }
  expect(toHex("#aBc")).toBe("#aabbcc");
});

test("reduces chroma at fixed lightness and hue", () => {
  const input = parseColor("oklch(60% .7 75)");
  const clipped = clipGamut(input);
  expect(clipped.l).toBe(input.l);
  expect(clipped.h).toBe(input.h);
  expect(clipped.c).toBeLessThan(input.c);
  for (const channel of oklabToLinear(oklchToOklab(clipped))) {
    expect(channel).toBeGreaterThanOrEqual(-1e-7);
    expect(channel).toBeLessThanOrEqual(1 + 1e-7);
  }
});

test("scales keep the same hue and wheels yield the expected companions", () => {
  const base = parseColor("#6750a4");
  const colors = scale(base);
  expect(Object.keys(colors)).toEqual(["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"]);
  expect(Object.values(colors).every((color, index, steps) => color.h === base.h && (!index || color.l < steps[index - 1]!.l))).toBe(true);
  expect(colors[50].c).toBeLessThan(colors[500].c);
  expect(colors[950].c).toBeLessThan(colors[500].c);
  const wheel = harmonies(base);
  expect(Object.keys(wheel)).toEqual(harmonyNames);
  expect(wheel.complementary[0]!.h).toBeCloseTo((base.h + 180) % 360, 8);
  expect(wheel.triadic).toHaveLength(2);
  expect(wheel.tetradic).toHaveLength(3);
  expect(wheel.monochromatic.every((color) => color.h === base.h && color.l !== base.l)).toBe(true);
});

test("every semantic pair meets 4.5:1 in each mode and in emitted OKLCH", () => {
  for (const base of ["#fff", "#000", "#777", "#f00", "#0f0", "#00f", "#faf200", "#0284c7", "oklch(85% .7 25)"]) {
    for (const harmony of [undefined, ...harmonyNames]) {
      const { scales, semantic, contrast } = generatePalette({ base, harmony });
      expect(Object.keys(scales).length).toBe(harmony ? 2 + harmonies(base)[harmony].length : 2);
      expect(contrast).toHaveLength(38);
      expect(Object.keys(semantic.light)).toHaveLength(13);
      expect(Object.keys(semantic.dark)).toEqual(Object.keys(semantic.light));
      for (const { mode, foreground, background, ratio } of contrast) {
        const fg = semantic[mode][foreground];
        const bg = semantic[mode][background];
        expect(ratio).toBe(wcagContrast(fg, bg));
        expect(ratio).toBeGreaterThanOrEqual(4.5);
        expect(wcagContrast(formatOklch(fg), formatOklch(bg))).toBeGreaterThanOrEqual(4.5);
      }
    }
  }
});
