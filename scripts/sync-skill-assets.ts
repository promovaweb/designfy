/**
 * Generates the files that the designfy skills carry inside themselves.
 *
 * A skill installed from another repository has to work without the
 * repository around it, so the three documents it quotes most are written
 * next to it: the VIEWSPEC contract, the initial theme and the interface and
 * dependency catalogs. Every target is generated from a single source of
 * truth in the repository:
 *
 *   docs/viewspec.md                       -> skills/designfy-viewspec/references/contrato.md
 *   registry/shared/styles/designfy-theme.css -> skills/designfy-design-system/assets/tema-inicial.css
 *   catalog/interface.json                 -> skills/designfy-components/references/catalogo-de-interface.md
 *   catalog/dependencies.json              -> skills/designfy-components/references/bibliotecas-catalogo.md
 *
 * Run `bun scripts/sync-skill-assets.ts` to write the files. With `--check`,
 * nothing is written: the script lists the targets that differ from their
 * source and exits 1.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, posix } from "node:path";
import dependenciesCatalog from "../catalog/dependencies.json";
import interfaceCatalog from "../catalog/interface.json";

/** First line of every Markdown file that is generated in full. */
export const GENERATED_COMMENT = "<!-- Gerado por scripts/sync-skill-assets.ts. Não edite à mão. -->";

/** Screen kinds of the interface catalog, in the order of the index table. */
export const KINDS = [
  "landing-page",
  "home",
  "site-page",
  "blog-index",
  "blog-post",
  "docs-page",
  "dashboard",
  "table",
  "form",
  "crud",
  "detail",
  "settings",
  "auth",
] as const;

/** Surface of a catalog category, written in Portuguese in the section title. */
const SURFACES: Record<string, string> = {
  both: "site e webapp",
  site: "site",
  webapp: "webapp",
};

type Entry = (typeof interfaceCatalog.entries)[number];
type Group = (typeof dependenciesCatalog.groups)[number];
type Package = Group["packages"][number];

/** Wraps every value in backticks and joins with a comma. */
function codeList(values: readonly string[]): string {
  return values.map((value) => `\`${value}\``).join(", ");
}

/** Joins full sentences that already carry their own period. */
function sentences(values: readonly string[] | undefined): string | undefined {
  if (!values?.length) return undefined;
  return values.map((value) => `${value.replace(/\.+$/u, "")}.`).join(" ");
}

/** Joins short fragments with a semicolon and closes with a period. */
function fragments(values: readonly string[] | undefined): string | undefined {
  if (!values?.length) return undefined;
  return `${values.join("; ").replace(/\.+$/u, "")}.`;
}

/** Joins single words with a comma and closes with a period. */
function words(values: readonly string[] | undefined): string | undefined {
  if (!values?.length) return undefined;
  return `${values.join(", ").replace(/\.+$/u, "")}.`;
}

/** Joins full sentences kept as they are in the catalog. */
function paragraph(values: readonly string[] | undefined): string | undefined {
  if (!values?.length) return undefined;
  return values.join(" ");
}

/** Renders one `### \`id\` · Name` block of the interface catalog. */
function renderEntry(entry: Entry): string {
  const lines: string[] = [`### \`${entry.id}\` · ${entry.name}`, "", entry.purpose, ""];
  const bullets: ReadonlyArray<readonly [string, string | undefined]> = [
    ["Use when", sentences(entry.useWhen)],
    ["Avoid when", sentences(entry.avoidWhen)],
    ["Anatomy", fragments(entry.anatomy)],
    ["Variants", fragments(entry.variants)],
    ["States", words(entry.states)],
    ["Responsive", entry.responsive],
    ["Motion", entry.motion],
    ["Accessibility", paragraph(entry.accessibility)],
    ["Tokens", words(entry.tokens?.map((token) => `\`${token}\``))],
  ];
  for (const [label, value] of bullets) {
    if (value) lines.push(`- **${label}:** ${value}`);
  }
  const tail: string[] = [];
  if (entry.sources?.length) tail.push(`**Sources:** ${codeList(entry.sources)}.`);
  if (entry.related?.length) tail.push(`**Related:** ${codeList(entry.related)}.`);
  if (tail.length) lines.push(`- ${tail.join(" ")}`);
  return lines.join("\n");
}

/**
 * Renders `skills/designfy-components/references/catalogo-de-interface.md`
 * from `catalog/interface.json`. The body below the generated comment is
 * byte-identical to the file that existed before the script.
 */
export function renderInterfaceCatalog(catalog = interfaceCatalog): string {
  const count = catalog.entries.length;
  const lines: string[] = [
    GENERATED_COMMENT,
    "",
    "# Catálogo de interface",
    "",
    `Os ${count} componentes comuns de interface de sites e de sistemas. É a fonte`,
    "para escolher os fragmentos de uma tela: leia a entrada antes de procurar",
    "uma implementação. O mesmo conteúdo sai do binário, sempre atualizado:",
    "",
    "```bash",
    "designfy catalog list --kind dashboard",
    "designfy catalog list --surface site --category hero",
    "designfy catalog show data-table",
    'designfy catalog search "contador"',
    "```",
    "",
    "Este arquivo é gerado de `catalog/interface.json`. Os textos das entradas",
    "estão em inglês, como no binário.",
    "",
    "Cada entrada informa: para que serve (`purpose`), quando usar e quando",
    "evitar, as partes (`anatomy`), variações, estados, o comportamento por",
    "largura, o movimento, o que conferir de acessibilidade, os papéis do tema",
    "usados e a fonte da implementação. Fontes: `designfy:<item>` copia com",
    "`designfy components add <item>`; `shadcn:<item>` instala com",
    "`npx shadcn@latest add <item>`; `reui:<item>` instala com",
    "`npx shadcn@latest add @reui/<item>`; `custom` é escrito no projeto.",
    "",
    "## Índice por tipo de tela",
    "",
    "| Tipo (`kind`) | Fragmentos |",
    "| --- | --- |",
  ];
  for (const kind of KINDS) {
    const ids = catalog.entries.filter((entry) => entry.kinds?.includes(kind)).map((entry) => `\`${entry.id}\``);
    lines.push(`| \`${kind}\` | ${ids.join(", ")} |`);
  }
  for (const category of catalog.categories) {
    const surface = SURFACES[category.surface] ?? category.surface;
    lines.push("", `## ${category.title} (${surface})`);
    for (const entry of catalog.entries.filter((item) => item.category === category.id)) {
      lines.push("", renderEntry(entry));
    }
  }
  return `${lines.join("\n")}\n`;
}

/** Escapes the characters that break a Markdown table cell. */
function cell(value: string): string {
  return value.replace(/\|/gu, "\\|").replace(/\n+/gu, " ");
}

/** Reads the host of a package URL for the link column. */
function host(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/** Renders one package row of the dependency table. */
function renderPackageRow(item: Package): string {
  const dev = item.dev ? "sim" : "não";
  return `| \`${cell(item.name)}\` | \`${cell(item.version)}\` | ${dev} | ${cell(item.purpose)} | [${host(item.url)}](${item.url}) |`;
}

/**
 * Renders `skills/designfy-components/references/bibliotecas-catalogo.md`
 * from `catalog/dependencies.json`: one table per group, with the versions,
 * the purpose kept in English and the link of every package.
 */
export function renderLibraries(catalog = dependenciesCatalog): string {
  const lines: string[] = [
    GENERATED_COMMENT,
    "",
    "# Bibliotecas do catálogo",
    "",
    "Grupos de dependências do catálogo, com a versão esperada, o motivo em inglês e",
    "o link de cada pacote. Sai de `catalog/dependencies.json`; liste com `designfy deps list`.",
  ];
  for (const group of catalog.groups) {
    const frameworks = group.frameworks.length ? group.frameworks.map((item) => `\`${item}\``).join(", ") : "todos";
    const isDefault = group.default ? "sim" : "não";
    lines.push(
      "",
      `## ${group.title} (\`${group.id}\`)`,
      "",
      `Instalado por padrão: ${isDefault}. Frameworks: ${frameworks}. ${group.description}`,
      "",
      "| Pacote | Versão | Dev | Para que serve | Link |",
      "| --- | --- | --- | --- | --- |",
    );
    for (const item of group.packages) lines.push(renderPackageRow(item));
  }
  return `${lines.join("\n")}\n`;
}

/** One generated file: where it comes from, where it goes and how it is built. */
export interface Asset {
  /** Repository path of the source, relative to the root. */
  source: string;
  /** Repository path of the generated file, relative to the root. */
  target: string;
  /** Builds the expected content of the target. */
  render: (root: string) => string;
}

/** Builds the list of generated assets, resolved against the given root. */
export function listAssets(): Asset[] {
  return [
    {
      source: "docs/viewspec.md",
      target: "skills/designfy-viewspec/references/contrato.md",
      render: (root) => readFileSync(join(root, "docs/viewspec.md"), "utf8").replaceAll("{{bin}}", "designfy"),
    },
    {
      source: "registry/shared/styles/designfy-theme.css",
      target: "skills/designfy-design-system/assets/tema-inicial.css",
      render: (root) => readFileSync(join(root, "registry/shared/styles/designfy-theme.css"), "utf8"),
    },
    {
      source: "catalog/interface.json",
      target: "skills/designfy-components/references/catalogo-de-interface.md",
      render: () => renderInterfaceCatalog(),
    },
    {
      source: "catalog/dependencies.json",
      target: "skills/designfy-components/references/bibliotecas-catalogo.md",
      render: () => renderLibraries(),
    },
  ];
}

/** Root of the repository, resolved from this script. */
export const root = join(import.meta.dir, "..");

if (import.meta.main) {
  const check = process.argv.includes("--check");
  const stale = listAssets().filter((asset) => {
    const target = join(root, asset.target);
    return !existsSync(target) || readFileSync(target, "utf8") !== asset.render(root);
  });
  if (check) {
    if (stale.length) {
      for (const asset of stale) process.stdout.write(`out of date: ${asset.target} (from ${asset.source})\n`);
      process.stderr.write("Skill assets are out of date. Run bun scripts/sync-skill-assets.ts.\n");
      process.exitCode = 1;
    } else {
      process.stdout.write(`ok: ${listAssets().length} skill assets match their sources\n`);
    }
  } else {
    for (const asset of listAssets()) {
      writeFileSync(join(root, asset.target), asset.render(root));
      process.stdout.write(`wrote ${posix.normalize(asset.target)}\n`);
    }
  }
}
