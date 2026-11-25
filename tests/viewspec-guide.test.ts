/** Verifies the project guide template, rule format, and learning destinations. */
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseViewspec, readGuide, validateGuide } from "../src/design/viewspec.ts";

const project = join(import.meta.dir, "fixtures/viewspec/guide-valid");
const file = join(project, "VIEWSPEC.md");
const sample = readFileSync(file, "utf8");

function validate(markdown: string) {
  return validateGuide(parseViewspec(file, markdown));
}

test("the order management sample includes 14 sections, 33 rules and six learnings", () => {
  const guide = readGuide(project);
  expect(guide.errors).toEqual([]);
  expect(guide.exists).toBe(true);
  expect(guide.frontMatter).toMatchObject({ scope: "project", surfaces: ["system"], themes: ["light", "dark"] });
  expect(guide.sections).toHaveLength(14);
  expect(guide.rules).toHaveLength(33);
  expect(guide.rules[0]).toMatchObject({ id: "v001", section: "Visão geral", origin: "@pessoa", line: 19 });
  expect(guide.learnings).toHaveLength(6);
  expect(guide.learnings[0]).toMatchObject({ date: "2026-11-21", origin: "@pessoa", destination: "{#r002}" });
  expect(guide.pendingProposals).toHaveLength(2);
  expect(guide.bySection).toMatchObject({ Tipografia: 3, Layout: 2, Aprendizados: 0 });
  expect(Object.values(guide.byOrigin).reduce((total, count) => total + count, 0)).toBe(33);
});

test("retains the documented rule and learning examples in their corresponding sections", () => {
  const contract = readFileSync(join(import.meta.dir, "../docs/viewspec.md"), "utf8");
  const rules = /Uma regra é um item de lista.*:\n\n\x60\x60\x60markdown\n([\s\S]*?)\x60\x60\x60/.exec(contract)?.[1];
  const learnings = /Cada entrada tem data.*:\n\n\x60\x60\x60markdown\n([\s\S]*?)\x60\x60\x60/.exec(contract)?.[1];
  expect(rules).toBeDefined();
  expect(learnings).toBeDefined();
  const [colors, patterns] = rules!.trimEnd().split("\n");
  const guide = validate(sample.replace("{#t003}", "{#t004}").replace("## Cores\n", "## Cores\n\n" + colors + "\n")
    .replace("## Padrões de tela\n", "## Padrões de tela\n\n" + patterns + "\n")
    .replace(/## Aprendizados[\s\S]*$/, "## Aprendizados\n\n" + learnings)
    .replace("{#r003}", "{#r007}"));
  expect(guide.errors).toEqual([]);
  expect(guide.rules).toHaveLength(35);
  expect(guide.learnings).toHaveLength(3);
});

test("does not interpret context items, paragraphs or fenced YAML as rules", () => {
  const context = [
    "- Context without an identifier.",
    "See the token guidance {#c999}.",
    "\x60\x60\x60yaml",
    "## Duplicate heading in an example",
    "- Fake rule {#z999}",
    "\x60\x60\x60",
    "",
  ].join("\n");
  const guide = validate(sample.replace("## Cores\n", "## Cores\n\n" + context));
  expect(guide.errors).toEqual([]);
  expect(guide.rules).toHaveLength(33);
});

const guideRejections: Array<[string, (value: string) => string, string, RegExp]> = [
  ["unknown front matter field", (value) => value.replace("name: Mesa de Pedidos", "name: Mesa de Pedidos\nunexpected: true"), "unexpected", /unknown/],
  ["wrong scope", (value) => value.replace("scope: project", "scope: view"), "scope", /expected "project"/],
  ["wrong enum value", (value) => value.replace("themes: [light, dark]", "themes: [light, sepia]"), "themes", /Invalid option/],
  ["missing heading", (value) => value.replace("## Tipografia", "### Tipografia"), "Tipografia", /required heading/],
  ["incorrect section order", (value) => value.replace("## Cores", "## Tipografia").replace("## Tipografia\n\n-", "## Cores\n\n-"), "Cores", /Move/],
  ["wrong rule id letter", (value) => value.replace("{#c001}", "{#q001}"), "Cores", /letter for this section/],
  ["malformed rule id", (value) => value.replace("{#c001}", "{#c01}"), "Cores", /form/],
  ["duplicate rule id", (value) => value.replace("{#c002}", "{#c001}"), "Cores", /unique rule id/],
  ["rule without origin", (value) => value.replace(" \x60@pessoa\x60 {#c001}", " {#c001}"), "Cores", /put @pessoa/],
  ["rule with unknown origin", (value) => value.replace("\x60@pessoa\x60 {#c001}", "\x60@editor\x60 {#c001}"), "Cores", /put @pessoa/],
  ["learning without destination", (value) => value.replace(/ → proposta/, ""), "Aprendizados", /learning destination/],
  ["learning pointing to a missing rule", (value) => value.replace("→ {#r002}", "→ {#r999}"), "Aprendizados", /no matching rule/],
  ["learning without date", (value) => value.replace("- 2026-11-21", "-"), "Aprendizados", /YYYY-MM-DD/],
  ["learning with invalid date", (value) => value.replace("- 2026-11-21", "- 2026-11-31"), "Aprendizados", /YYYY-MM-DD/],
  ["learning without origin", (value) => value.replace("- 2026-11-21 \x60@pessoa\x60", "- 2026-11-21"), "Aprendizados", /valid origin/],
  ["discarded learning without reason", (value) => value.replace(/descartado: .*/, "descartado"), "Aprendizados", /Give the reason/],
];
test.each(guideRejections)("rejects %s", (_name, change, field, message) => {
  expect(validate(change(sample)).errors).toContainEqual(
    expect.objectContaining({ file, field, message: expect.stringMatching(message) }),
  );
});
