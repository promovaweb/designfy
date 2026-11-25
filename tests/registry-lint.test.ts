/** Exercises registry catalog references and source token linting. */
import { expect, test } from "bun:test";
import { checkRegistryCatalog, checkRegistryTheme } from "../src/design/registry-lint.ts";

test("requires existing catalog IDs on components and checks explicit IDs on exempt item types", () => {
  const path = "registry/react/registry.json";
  const issues = checkRegistryCatalog([
    { path, name: "hero", type: "registry:block", meta: { catalog: "hero" } },
    { path, name: "missing", type: "registry:component" },
    { path, name: "blank", type: "registry:component", meta: { catalog: "" } },
    { path, name: "cn", type: "registry:lib" },
    { path, name: "tokens", type: "registry:style" },
    { path, name: "bad-style", type: "registry:style", meta: { catalog: "unknown" } },
  ], new Set(["hero"]));
  expect(issues).toEqual([
    `${path}: missing: meta.catalog must contain a catalog ID.`,
    `${path}: blank: meta.catalog must contain a catalog ID.`,
    `${path}: bad-style: unknown meta.catalog ID "unknown".`,
  ]);
});

test("rejects bare and arbitrary colors, fixed palettes and literal fonts with locations", () => {
  const path = "registry/react/hero.tsx";
  const content = [
    "/* Use a token instead of #abcdef. */",
    '<div className="dark:hover:bg-slate-950/70 text-indigo-500 ring-rose-50! bg-[#fff] text-[rgb(12_34_56)]" />',
    "div { color: #aabbccdd; border-color: RGBA(0, 1, 2, .2); }",
    "div { color: hsl(20 50% 70%); background: hsla(20, 50%, 70%, .5); }",
    "div { color: oklch(.4 .1 90); background: oklab(.4 .1 0); }",
    "div { color: color-mix(in oklch, var(--primary) 65%, #aabbcc); }",
    'div { font-family: var(--font-body), "Inter"; }',
    "div { color: white; }",
    '<div className="fill-[red] text-[color:rebeccapurple]" />',
    '<div className="bg-[linear-gradient(_#fff_20%,_rgb(2_3_4)_50%)]" />',
  ].join("\n");
  const issues = checkRegistryTheme([{ path, content }]);
  expect(issues).toHaveLength(18);
  expect(issues.filter((issue) => issue.includes(`${path}:2:`))).toHaveLength(5);
  expect(issues.some((issue) => issue.startsWith(`${path}:7: Use var(--font-*)`))).toBe(true);
});

test("accepts theme roles, percentage mixes, var fallbacks and mask colors", () => {
  const content = [
    '<div className="bg-background text-foreground/75 border-[color:var(--border)] text-transparent" />',
    "div { color: var(--link, #abcf); background: var(--bg, rgb(1 2 3)); }",
    "div { color: color-mix(in oklch, var(--primary) 65%, transparent); }",
    "div { border-color: currentColor; fill: inherit; color: var(--text, white); }",
    '<div className="bg-[transparent] fill-[currentColor]" />',
    "div { mask-image: linear-gradient(white, transparent, black); font-family: var(--font-sans); }",
  ].join("\n");
  expect(checkRegistryTheme([{ path: "registry/react/hero.tsx", content }])).toEqual([]);
});

test("allows internal font tokens and literal colors only in the theme stylesheet", () => {
  const content = ":root { --color-primary: #fff; font-family: Arial; }";
  const path = "registry/shared/styles/designfy-theme.css";
  expect(checkRegistryTheme([{ path, content }])).toEqual([`${path}:1: Use var(--font-*) or var(--df-font-*) for font-family: Arial.`]);
  expect(checkRegistryTheme([{ path: "registry/react/designfy-theme.css", content }])).toHaveLength(2);
  const tokenStack = "body { font-family: var(--df-font-sans), var(--font-heading); }";
  expect(checkRegistryTheme([{ path, content: tokenStack }])).toEqual([]);
  expect(checkRegistryTheme([{ path: "registry/react/designfy-theme.css", content: tokenStack }])).toHaveLength(1);
});
