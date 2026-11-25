/**
 * Covers the pure functions behind scripts/check-designfy-skills.ts and
 * scripts/sync-skill-assets.ts: anchors, link extraction, vetoed text,
 * command extraction and the orphan detection, each with a temp fixture.
 */
import { afterEach, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  acceptedOptions,
  collectAnchors,
  extractCommands,
  extractLinks,
  findBannedText,
  findOrphanAssets,
  isPlaceholder,
  parseCommandLine,
  parseFrontmatter,
  resolveCommand,
  slugifyHeading,
  splitFrontmatter,
  stripComment,
  tokenizeCommand,
  toolMentions,
} from "../scripts/check-designfy-skills.ts";
import { GENERATED_COMMENT, renderInterfaceCatalog, renderLibraries } from "../scripts/sync-skill-assets.ts";

const temporary: string[] = [];

/** Creates a temp folder that the test removes afterwards. */
function fixture(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "designfy-skill-scripts-"));
  temporary.push(root);
  for (const [path, content] of Object.entries(files)) {
    const file = join(root, path);
    mkdirSync(join(file, ".."), { recursive: true });
    writeFileSync(file, content);
  }
  return root;
}

afterEach(() => {
  for (const dir of temporary.splice(0)) rmSync(dir, { force: true, recursive: true });
});

test("slugs headings with the GitHub rules", () => {
  expect(slugifyHeading("Leitura prévia")).toBe("leitura-prévia");
  expect(slugifyHeading("Modo criação")).toBe("modo-criação");
  expect(slugifyHeading("Passos: 1. Ler o projeto")).toBe("passos-1-ler-o-projeto");
  expect(slugifyHeading("`designfy` no terminal")).toBe("designfy-no-terminal");
  expect(slugifyHeading("**Regras** e [links](https://x.test)")).toBe("regras-e-links");
  expect(slugifyHeading("  Espaços   demais  ")).toBe("espaços-demais");
  expect(slugifyHeading("Catálogo (site e sistema)")).toBe("catálogo-site-e-sistema");
});

test("collects anchors with the duplicate suffixes", () => {
  const anchors = collectAnchors("# Guia\n\n## Notas\n\n## Notas\n\n```bash\n## não é heading\n```\n");
  expect([...anchors]).toEqual(["guia", "notas", "notas-1"]);
});

test("extracts relative links and skips the rest", () => {
  const markdown = [
    "Veja [o contrato](references/contrato.md) e [a seção](references/contrato.md#modo-guia).",
    "Fora: [site](https://promovaweb.com), [email](mailto:a@b.test), [âncora](#topo), [raiz](/docs).",
    "Inline `[falso](nao-existe.md)` não conta.",
    "```md",
    "[código](dentro-do-bloco.md)",
    "```",
  ].join("\n");
  const links = extractLinks(markdown);
  expect(links.map((link) => link.raw)).toEqual(["references/contrato.md", "references/contrato.md#modo-guia"]);
  expect(links[1]?.anchor).toBe("modo-guia");
  expect(links[1]?.line).toBe(1);
});

test("keeps the em dash only in a heading with a subtitle", () => {
  const allowed = "## Título — subtítulo\n\nTexto sem travessão.\n";
  expect(findBannedText(allowed)).toEqual([]);
  const prose = "O binário — quando existe — valida.\n";
  expect(findBannedText(prose).map((hit) => hit.term)).toEqual(["em dash"]);
  const plainHeading = "## Título — subtítulo sem par\n\n";
  expect(findBannedText(plainHeading)).toEqual([]);
  expect(findBannedText("### Sem subtítulo —\n")).toHaveLength(1);
});

test("finds the vetoed word families as whole words", () => {
  const text = [
    "O risco existe e os riscos também.",
    "A decisão e as decisões.",
    "Uma evidência, duas evidências.",
    "O critério e os critérios.",
    "O inventário, os inventários, inventariar.",
    "Sem atrito, sem atritos.",
    "O bloqueio, os bloqueios, bloquear, bloqueia, bloqueiam, bloqueado, bloqueada, bloqueados, bloqueadas, bloqueando.",
    "O dia em que apareceu.",
  ].join("\n");
  const terms = findBannedText(text).map((hit) => `${hit.line}:${hit.term}`);
  expect(terms).toContain("1:risco");
  expect(terms).toContain("2:decisão");
  expect(terms).toContain("3:evidência");
  expect(terms).toContain("4:critério");
  expect(terms).toContain("5:inventário");
  expect(terms).toContain("6:atrito");
  expect(terms).toContain("7:bloqueio");
  expect(terms).toContain("8:em que");
});

test("ignores code, blockquotes and the words inside other words", () => {
  const text = [
    "Use `risco` e `em que` no código inline.",
    "```ts",
    "const risco = 'decisão';",
    "```",
    "> risco em citação",
    "Ricochete e bloqueiozinho não são as famílias vetadas.",
  ].join("\n");
  expect(findBannedText(text)).toEqual([]);
});

test("strips bash comments without touching quoted hashes", () => {
  expect(stripComment("designfy capture run http://x/ --fold   # só a dobra")).toBe("designfy capture run http://x/ --fold   ");
  expect(stripComment('designfy palette generate --base "oklch(0.7 0.16 60)"')).toBe(
    'designfy palette generate --base "oklch(0.7 0.16 60)"',
  );
  expect(stripComment("designfy capture run http://x/#topo")).toBe("designfy capture run http://x/#topo");
});

test("tokenizes quoted values as one token", () => {
  expect(tokenizeCommand('designfy palette generate --base "oklch(0.7 0.16 60)" --harmony triadic')).toEqual([
    "designfy",
    "palette",
    "generate",
    "--base",
    "oklch(0.7 0.16 60)",
    "--harmony",
    "triadic",
  ]);
});

test("extracts commands from inline code, bash blocks and continuations", () => {
  const markdown = [
    "Rode `designfy status --json` antes.",
    "",
    "```bash",
    "designfy capture run http://localhost:4321/ \\",
    "  --viewport mobile,desktop --name revisao-1",
    "designfy viewspec list --status in_progress   # abertos",
    "```",
    "",
    "```ts",
    "designfy nao-e-um-comando",
    "```",
    "",
    "`designfy.json` e `designfy:card` não são comandos.",
  ].join("\n");
  const commands = extractCommands(markdown);
  expect(commands.map((command) => command.text)).toEqual([
    "designfy status --json",
    "designfy capture run http://localhost:4321/   --viewport mobile,desktop --name revisao-1",
    "designfy viewspec list --status in_progress",
  ]);
  expect(commands[0]?.line).toBe(1);
  expect(commands[1]?.line).toBe(4);
  expect(commands[1]?.options).toEqual(["--viewport", "--name"]);
  expect(commands[2]?.line).toBe(6);
});

test("parses only lines that call the binary", () => {
  expect(parseCommandLine("designfy components add cn --dry-run", 3)).toEqual({
    line: 3,
    text: "designfy components add cn --dry-run",
    options: ["--dry-run"],
    args: ["components", "add", "cn", "--dry-run"],
  });
  expect(parseCommandLine("npx shadcn@latest add button", 4)).toBeUndefined();
  expect(parseCommandLine("designfy:card", 5)).toBeUndefined();
});

test("tells placeholders from values", () => {
  expect(isPlaceholder("<id>")).toBe(true);
  expect(isPlaceholder("<nomes...>")).toBe(true);
  expect(isPlaceholder("[grupos]")).toBe(true);
  expect(isPlaceholder("data-table")).toBe(false);
});

test("walks the registry and drops the option values", () => {
  const add = resolveCommand("designfy components add data-table --framework react --dry-run");
  expect(add.path).toEqual(["components", "add"]);
  expect(add.rest).toEqual(["data-table"]);

  const list = resolveCommand("designfy catalog list --kind dashboard --json");
  expect(list.path).toEqual(["catalog", "list"]);
  expect(list.rest).toEqual([]);

  const unknown = resolveCommand("designfy catalogo list");
  expect(unknown.path).toEqual([]);
  expect(unknown.rest).toEqual(["catalogo", "list"]);

  expect(acceptedOptions(resolveCommand("designfy components add cn").command).has("--framework")).toBe(true);
  expect(acceptedOptions(resolveCommand("designfy components add cn").command).has("--json")).toBe(true);
  expect(acceptedOptions(resolveCommand("designfy components add cn").command).has("--harmony")).toBe(false);
});

test("reads snake_case tool names from a line", () => {
  expect(toolMentions("existem como tools: `project_status`, `capture_run` e `designfy.json`")).toEqual([
    "project_status",
    "capture_run",
  ]);
});

test("reports a reference file that no Markdown links", () => {
  const skill = fixture({
    "SKILL.md": "# Skill\n\nLeia [a](references/a.md) e [o catálogo](references/backgrounds/catalogo.md).\n",
    "references/a.md": "# A\n\nVolte ao [início](../SKILL.md) e veja [o asset](../assets/c.md).\n",
    "references/b.md": "# B\n\nNinguém cita este arquivo.\n",
    "references/backgrounds/catalogo.md": "# Catálogo\n",
    "references/backgrounds/dados.json": "{}\n",
    "assets/c.md": "# C\n",
  });
  const orphans = findOrphanAssets(skill).map((file) => file.slice(skill.length + 1));
  expect(orphans).toEqual(["references/b.md"]);
});

test("keeps the generated catalogs deterministic", () => {
  const catalog = renderInterfaceCatalog();
  expect(catalog.startsWith(`${GENERATED_COMMENT}\n`)).toBe(true);
  expect(catalog.endsWith("\n")).toBe(true);
  expect(catalog).toBe(renderInterfaceCatalog());
  expect(catalog).toContain("### `button` · Button");
  expect(catalog).toContain("| `auth` | `button`, `background-pattern`,");

  const libraries = renderLibraries();
  expect(libraries.startsWith(`${GENERATED_COMMENT}\n`)).toBe(true);
  expect(libraries).toBe(renderLibraries());
  expect(libraries).toContain("designfy deps list");
  expect(libraries.split("\n").filter((line) => /^\| `[^`]+` \| `\^?/u.test(line))).toHaveLength(45);
});

test("reads the front matter of a skill", () => {
  const text = "---\nname: designfy\nmetadata:\n  owner: x\ndescription: Uma skill.\n---\n\n# Corpo\n";
  const { frontmatter, body } = splitFrontmatter(text);
  expect(parseFrontmatter(frontmatter)).toEqual({ name: "designfy", description: "Uma skill." });
  expect(body.trim()).toBe("# Corpo");
  expect(splitFrontmatter("# Sem front matter").frontmatter).toBeUndefined();
});
