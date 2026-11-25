/** Verifies the generated background catalog, theme roles, and motion rules. */
import { expect, test } from "bun:test";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const shared = join(root, "registry/shared/backgrounds");
const reference = join(root, "skills/designfy-design-system/references/backgrounds");
const source = await Bun.file(join(reference, "reactbd-bg.json")).json() as {
  patterns: { id: string; theme: string; animated: boolean }[];
};
const presets = await Bun.file(join(shared, "presets.json")).json() as {
  slug: string;
  sourceId: string;
  name: string;
  tone: string;
  roles: string[];
  animated: boolean;
  variantOf: string | null;
  variants?: string[];
  legibility: string;
}[];
const bySlug = new Map(presets.map((preset) => [preset.slug, preset]));
const css = await Bun.file(join(shared, "designfy-backgrounds.css")).text();
const rules = new Map([...css.matchAll(/\[data-df-bg="([^"]+)"\] \{([^{}]*)\}/g)]
  .map(([, slug, declarations]) => [slug, declarations]));

test("generates CSS and TypeScript for every source ID under a unique ASCII kebab-case slug", async () => {
  expect(presets).toHaveLength(314);
  expect(new Set(presets.map(({ slug }) => slug)).size).toBe(314);
  expect(rules.size).toBe(314);
  expect([...rules.keys()]).toEqual(presets.map(({ slug }) => slug));
  expect(presets.map(({ sourceId, tone, animated }) => ({ sourceId, tone, animated }))).toEqual(
    source.patterns.map(({ id, theme, animated }) => ({ sourceId: id, tone: theme, animated })),
  );
  for (const { slug } of presets) expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  expect(bySlug.get("diagonal-red-blue-glow")?.sourceId).toBe("diagonal-red/blue-glow");
  expect(bySlug.get("diagonal-fade-bottom-grid-left")?.sourceId).toBe("diagonal-fade-bottom-grid-Left");
  expect(bySlug.get("orchid-depths")?.sourceId).toBe("orchid -depths");
  const types = await Bun.file(join(root, "registry/react/background/presets.ts")).text();
  expect([...types.matchAll(/^  \| "([\w-]+)"/gm)].map(([, slug]) => slug)).toEqual([...rules.keys()]);
});

test("publishes 241 distinct presets and keeps the remaining 73 as equivalents", async () => {
  const canonical = presets.filter(({ variantOf }) => variantOf === null);
  expect(canonical).toHaveLength(241);
  const catalog = await Bun.file(join(reference, "catalogo.md")).text();
  expect([...catalog.matchAll(/^\| `([\w-]+)` \|/gm)].map(([, slug]) => slug).sort())
    .toEqual(canonical.map(({ slug }) => slug).sort());
  const normalize = (rule: string) => rule.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
  const seen = new Map<string, string>();
  for (const { slug, variantOf, variants, legibility } of presets) {
    const fingerprint = normalize(rules.get(slug)!);
    expect(variantOf).toBe(seen.get(fingerprint) ?? null);
    if (variantOf === null) {
      seen.set(fingerprint, slug);
      expect(variants).toEqual(presets.filter((entry) => entry.variantOf === slug).map((entry) => entry.slug));
      continue;
    }
    const first = bySlug.get(variantOf);
    expect(first?.variantOf).toBeNull();
    expect(first?.variants).toContain(slug);
    expect(first?.legibility).toBe(legibility);
    expect(variants).toBeUndefined();
  }
  expect(bySlug.get("cyan-radial-glow")?.variantOf).toBe("purple-radial-glow");
  expect(catalog).toContain("Cyan Radial Glow (`cyan-radial-glow`)");
});

test("assigns each pattern an estimated text legibility", () => {
  const allowed = ["text-safe", "needs-fade", "decorative-only"];
  for (const { legibility } of presets) expect(allowed).toContain(legibility);
  expect(bySlug.get("signal-grid")?.legibility).toBe("text-safe");
  expect(bySlug.get("purple-radial-glow")?.legibility).toBe("needs-fade");
  expect(bySlug.get("dusk-horizon")?.legibility).toBe("decorative-only");
});

test("uses only approved theme roles and transparent color stops", () => {
  const allowed = new Set([
    "background", "foreground", "card", "muted", "muted-foreground", "border",
    "primary", "primary-foreground", "secondary", "accent", "ring", "destructive",
    "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
  ]);
  const declarations = css.replace(/\/\*[\s\S]*?\*\//g, "");
  expect(declarations).not.toMatch(/#[\da-f]{3,8}\b|\b(?:rgba?|hsla?|oklch)\s*\(|(?<![\w-])(?:white|black)(?![\w-])/i);
  for (const [, variable] of declarations.matchAll(/var\(--([\w-]+)/g)) {
    if (variable === "df-bg-spotlight-x" || variable === "df-bg-spotlight-y") continue;
    expect(allowed.has(variable!)).toBe(true);
  }
  for (const { slug, roles } of presets) {
    expect(roles.every((role) => allowed.has(role))).toBe(true);
    const rule = rules.get(slug)!;
    const used = [...rule.matchAll(/var\(--([\w-]+)/g)]
      .map(([, role]) => role!).filter((role) => !role.startsWith("df-bg-spotlight-"));
    expect(new Set(roles)).toEqual(new Set(["background", ...used]));
  }
  expect(rules.get("signal-grid")).toContain("color-mix(in oklab, var(--primary) 8%, transparent)");
});

test("assigns keyframes to animated presets and disables motion on request", () => {
  const names = new Set<string>();
  const animated = presets.filter(({ animated }) => animated);
  expect(animated).toHaveLength(9);
  for (const { slug } of animated) {
    const name = rules.get(slug)?.match(/animation:\s*(df-bg-[\w-]+)/)?.[1];
    expect(name).toBeDefined();
    expect(css).toContain(`@keyframes ${name} {`);
    names.add(name!);
  }
  expect(names.size).toBe(7);
  expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{\s*\[data-df-bg\] \{ animation: none !important; \}/);
});

test("generated background files pass the reproducibility check", () => {
  const child = Bun.spawnSync([process.execPath, "run", "scripts/build-backgrounds.ts", "--check"], { cwd: root });
  expect(child.stderr.toString()).toBe("");
  expect(child.exitCode).toBe(0);
});
