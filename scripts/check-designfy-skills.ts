/**
 * Checks the designfy skills for structure, links, editorial rules and the
 * commands and tools they quote.
 *
 * The skills in `skills/` are instruction files for AI agents. They ship to
 * other repositories, so the rules have to hold inside this one: the front
 * matter names the folder, every skill carries the same sections, every
 * relative link resolves (anchors included), no reference or asset file is
 * left orphan, the instruction text avoids the vetoed words and the em dash,
 * and every `designfy` command, option, MCP tool and catalog item the text
 * quotes exists in the binary.
 *
 * Run `bun scripts/check-designfy-skills.ts`. It exits 1 with the problems in
 * the form `<file>:<line>: <message>`. With `--json` it prints
 * `{ ok, problems, warnings }`.
 *
 * The pure functions below are exported for `tests/skill-scripts.test.ts`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import dependenciesCatalog from "../catalog/dependencies.json";
import interfaceCatalog from "../catalog/interface.json";
import skillsCatalog from "../catalog/skills.json";
import { root as commandRoot } from "../src/cli/commands.ts";
import { GLOBAL_OPTIONS, findSubcommand, type Command, type OptionDefinition } from "../src/cli/registry.ts";
import { REGISTRY } from "../src/generated/registry.ts";
import { describeServer } from "../src/mcp/server.ts";
import { GENERATED_COMMENT } from "./sync-skill-assets.ts";

/** Sections every SKILL.md carries, in the order the author writes them. */
export const REQUIRED_SECTIONS = ["Leitura prévia", "Regras", "Passos", "Marcos", "Saída"] as const;

/**
 * Components that `catalog/interface.json` already names as `designfy:<item>`
 * sources but the embedded registry does not ship yet. They are reported as
 * warnings so a skill may plan around them without failing the check.
 */
export const PLANNED_ITEMS: readonly string[] = [
  "activity-feed",
  "announcement-bar",
  "app-shell",
  "article-header",
  "auth-card",
  "author-box",
  "background",
  "bento-grid",
  "callout",
  "card",
  "chart-card",
  "code-block",
  "comparison-table",
  "counter",
  "cta-band",
  "data-table",
  "description-list",
  "empty-state",
  "error-state",
  "faq",
  "feature-grid",
  "feature-split",
  "figure",
  "file-upload",
  "filter-bar",
  "form-layout",
  "hero-centered",
  "hero-media",
  "hero-split",
  "logo-marquee",
  "marquee",
  "newsletter-form",
  "page-header",
  "post-card",
  "post-list",
  "pricing-table",
  "prose",
  "reading-progress",
  "reveal",
  "section",
  "settings-layout",
  "settings-section",
  "site-footer",
  "site-header",
  "stat-card",
  "stats-band",
  "stepper",
  "steps",
  "table-of-contents",
  "testimonial",
  "theme-toggle",
  "video-embed",
];

/** Word families the editorial rules veto, as whole words. */
const BANNED_TERMS: ReadonlyArray<readonly [string, RegExp]> = [
  ["risco", /\briscos?\b/iu],
  ["decisão", /\bdecis(ão|ões)\b/iu],
  ["evidência", /\bevidências?\b/iu],
  ["critério", /\bcritérios?\b/iu],
  ["inventário", /\binventári(o|os|ar)\b/iu],
  ["atrito", /\batritos?\b/iu],
  ["bloqueio", /\bbloque(io|ios|ar|ia|iam|ou|ado|ada|ados|adas|ando)\b/iu],
  ["em que", /\bem que\b/iu],
];

/** A finding tied to the file and the line it comes from. */
export interface Problem {
  file: string;
  line: number;
  message: string;
}

/** A relative link found in a Markdown file. */
export interface LinkRef {
  line: number;
  /** Target as written, without the anchor. */
  target: string;
  /** Anchor without `#`, when the link has one. */
  anchor?: string;
  /** Whole target, anchor included. */
  raw: string;
}

/** A `designfy` command line quoted in the instruction text. */
export interface CommandRef {
  line: number;
  /** Command line as written, without a trailing comment. */
  text: string;
  /** Long options used in the line. */
  options: string[];
  /** Positional tokens after the binary name. */
  args: string[];
}

/** Splits a Markdown file into front matter and body. */
export function splitFrontmatter(text: string): { frontmatter?: string; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u.exec(text);
  if (!match) return { body: text };
  return { frontmatter: match[1] ?? "", body: text.slice(match[0].length) };
}

/** Reads the simple `key: value` pairs of a front matter block. */
export function parseFrontmatter(frontmatter: string | undefined): Record<string, string> {
  const fields: Record<string, string> = {};
  if (!frontmatter) return fields;
  for (const line of frontmatter.split(/\r?\n/u)) {
    const match = /^([A-Za-z][\w-]*):\s*(\S.*)$/u.exec(line);
    if (match?.[1]) fields[match[1]] = (match[2] ?? "").trim();
  }
  return fields;
}

/** Converts heading text to the anchor GitHub builds for it. */
export function slugifyHeading(heading: string): string {
  return heading
    .replace(/`([^`]*)`/gu, "$1")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/gu, "$1")
    .replace(/[*_~]/gu, "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/\s+/gu, "-");
}

/** Reads the heading lines of a Markdown file, skipping fenced code. */
export function collectHeadings(markdown: string): Array<{ line: number; level: number; text: string }> {
  const headings: Array<{ line: number; level: number; text: string }> = [];
  let fence: string | undefined;
  markdown.split(/\r?\n/u).forEach((line, index) => {
    const open = /^\s*(`{3,}|~{3,})/u.exec(line);
    if (open?.[1]) {
      if (fence === undefined) fence = open[1][0];
      else if (open[1][0] === fence) fence = undefined;
      return;
    }
    if (fence !== undefined) return;
    const heading = /^(#{1,6})\s+(.*)$/u.exec(line);
    if (heading?.[1] && heading[2] !== undefined) {
      headings.push({ line: index + 1, level: heading[1].length, text: heading[2].trim() });
    }
  });
  return headings;
}

/** Collects the anchors of a Markdown file, with GitHub's duplicate suffixes. */
export function collectAnchors(markdown: string): Set<string> {
  const anchors = new Set<string>();
  const seen = new Map<string, number>();
  for (const heading of collectHeadings(markdown)) {
    const base = slugifyHeading(heading.text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    anchors.add(count === 0 ? base : `${base}-${count}`);
  }
  return anchors;
}

/** Replaces the content of fenced code blocks with empty lines, keeping numbering. */
export function blankFences(markdown: string): string[] {
  const lines = markdown.split(/\r?\n/u);
  const output: string[] = [];
  let fence: string | undefined;
  for (const line of lines) {
    const open = /^\s*(`{3,}|~{3,})/u.exec(line);
    if (open?.[1]) {
      if (fence === undefined) fence = open[1][0];
      else if (open[1][0] === fence) fence = undefined;
      output.push("");
      continue;
    }
    output.push(fence === undefined ? line : "");
  }
  return output;
}

/** Reads the relative links of a Markdown file, skipping code. */
export function extractLinks(markdown: string): LinkRef[] {
  const links: LinkRef[] = [];
  blankFences(markdown).forEach((line, index) => {
    const text = line.replace(/`[^`]*`/gu, "");
    for (const match of text.matchAll(/!?\[[^\]]*\]\(\s*([^)\s]+)[^)]*\)/gu)) {
      const raw = match[1] ?? "";
      if (!raw) continue;
      if (/^[a-z][a-z0-9+.-]*:/iu.test(raw)) continue;
      if (raw.startsWith("/") || raw.startsWith("#")) continue;
      const hash = raw.indexOf("#");
      const target = hash >= 0 ? raw.slice(0, hash) : raw;
      const anchor = hash >= 0 ? raw.slice(hash + 1) : "";
      if (!target) continue;
      links.push({ line: index + 1, target, ...(anchor ? { anchor } : {}), raw });
    }
  });
  return links;
}

/** Finds the vetoed words and the em dash in the instruction text. */
export function findBannedText(markdown: string): Array<{ line: number; term: string; text: string }> {
  const hits: Array<{ line: number; term: string; text: string }> = [];
  blankFences(markdown).forEach((line, index) => {
    if (/^\s*>/u.test(line)) return;
    const text = line.replace(/`[^`]*`/gu, (span) => " ".repeat(span.length));
    // A heading in the form `## Title — subtitle` may use the em dash.
    const allowedDash = /^#{1,6}\s+\S.*\s—\s.*\S\s*$/u.test(line.trim());
    if (!allowedDash && text.includes("—")) hits.push({ line: index + 1, term: "em dash", text: line.trim() });
    for (const [name, pattern] of BANNED_TERMS) {
      if (pattern.test(text)) hits.push({ line: index + 1, term: name, text: line.trim() });
    }
  });
  return hits;
}

/** Cuts a bash comment that starts after a space, outside quotes. */
export function stripComment(line: string): string {
  let quote: string | undefined;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (quote) {
      if (char === quote) quote = undefined;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === "#" && index > 0 && /\s/u.test(line[index - 1] ?? "")) return line.slice(0, index);
  }
  return line;
}

/** Splits a command line into tokens, keeping quoted values together. */
export function tokenizeCommand(line: string): string[] {
  const tokens: string[] = [];
  for (const match of line.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/gu)) {
    tokens.push(match[1] ?? match[2] ?? match[3] ?? "");
  }
  return tokens;
}

/** Tells placeholders such as `<id>`, `<nomes...>` and `[grupos]` apart from values. */
export function isPlaceholder(token: string): boolean {
  return /^<.*>$|^\[.*\]$/u.test(token) || /[<>[\]]/u.test(token);
}

/** Parses one `designfy ...` line, returning `undefined` for any other line. */
export function parseCommandLine(line: string, lineNumber: number): CommandRef | undefined {
  const text = stripComment(line).trim();
  const tokens = tokenizeCommand(text);
  if (tokens[0] !== "designfy") return undefined;
  const args = tokens.slice(1);
  return {
    line: lineNumber,
    text,
    options: args.filter((token) => token.startsWith("--")).map((token) => token.split("=")[0] ?? token),
    args,
  };
}

/** Reads the `designfy` command lines of the inline code and the bash blocks. */
export function extractCommands(markdown: string): CommandRef[] {
  const references: CommandRef[] = [];
  const lines = markdown.split(/\r?\n/u);
  let fence: string | undefined;
  let language = "";
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    const open = /^\s*(`{3,}|~{3,})\s*([\w-]*)/u.exec(line);
    if (open?.[1]) {
      if (fence === undefined) {
        fence = open[1][0];
        language = (open[2] ?? "").toLowerCase();
      } else if (open[1][0] === fence) {
        fence = undefined;
        language = "";
      }
      continue;
    }
    if (fence !== undefined) {
      if (language && !["bash", "sh", "shell", "console", "zsh"].includes(language)) continue;
      let command = line;
      let next = index;
      while (/\\\s*$/u.test(command) && next + 1 < lines.length) {
        next += 1;
        command = `${command.replace(/\\\s*$/u, "").trimEnd()} ${lines[next] ?? ""}`;
      }
      const reference = parseCommandLine(command, index + 1);
      if (reference) references.push(reference);
      continue;
    }
    for (const match of line.matchAll(/`([^`\n]+)`/gu)) {
      const reference = parseCommandLine(match[1] ?? "", index + 1);
      if (reference) references.push(reference);
    }
  }
  return references;
}

/** Result of walking the registry with a command line. */
export interface ResolvedCommand {
  /** Deepest command found. */
  command: Command;
  /** Names walked from the root, without the binary name. */
  path: string[];
  /** Positional arguments left after the command and its option values. */
  rest: string[];
}

/** Walks the registry with the tokens of a `designfy` command line. */
export function resolveCommand(line: string): ResolvedCommand {
  const tokens = tokenizeCommand(stripComment(line).trim());
  let command: Command = commandRoot;
  const path: string[] = [];
  if (tokens[0] !== "designfy") return { command, path, rest: [] };
  let index = 1;
  while (index < tokens.length) {
    const token = tokens[index] ?? "";
    if (token.startsWith("-") || isPlaceholder(token)) break;
    const child = findSubcommand(command, token);
    if (!child) break;
    command = child;
    path.push(token);
    index += 1;
  }
  const options = new Map<string, OptionDefinition>();
  for (const option of command.options ?? []) options.set(option.name, option);
  const rest: string[] = [];
  while (index < tokens.length) {
    const token = tokens[index] ?? "";
    index += 1;
    if (token.startsWith("--")) {
      const name = token.split("=")[0] ?? token;
      const owner = options.get(name) ?? GLOBAL_OPTIONS.find((option) => option.name === name);
      const takesValue = owner?.argument !== undefined;
      const inline = token.includes("=");
      if (takesValue && !inline && index < tokens.length && !(tokens[index] ?? "").startsWith("--")) index += 1;
      continue;
    }
    rest.push(token);
  }
  return { command, path, rest };
}

/** Lists the long options accepted by a command, global ones included. */
export function acceptedOptions(command: Command): Set<string> {
  return new Set([...(command.options ?? []).map((option) => option.name), ...GLOBAL_OPTIONS.map((option) => option.name)]);
}

/** Names of the items in the embedded registry, both frameworks merged. */
export function registryItemNames(): Set<string> {
  const names = new Set<string>();
  for (const registry of Object.values(REGISTRY)) {
    for (const item of registry.items) names.add(item.name);
  }
  return names;
}

/** Names of the MCP tools the server registers. */
export function mcpToolNames(): Set<string> {
  return new Set(describeServer().tools.map((tool) => tool.name));
}

/** Backticked snake_case identifiers of a line, the shape of an MCP tool name. */
export function toolMentions(line: string): string[] {
  return [...line.matchAll(/`([a-z][a-z0-9]*(?:_[a-z0-9]+)+)`/gu)].map((match) => match[1] ?? "");
}

/** Lists the files of a folder recursively, skipping hidden folders. */
function listFiles(dir: string, filter: (name: string) => boolean): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
    if (item.name === "node_modules" || item.name.startsWith(".")) return [];
    const path = join(dir, item.name);
    if (item.isDirectory()) return listFiles(path, filter);
    return filter(item.name) ? [path] : [];
  });
}

/** Reads a file as text. */
function read(file: string): string {
  return readFileSync(file, "utf8");
}

/**
 * Lists the files of a skill's `references/` and `assets/` that no Markdown
 * of the same skill links to. Files under `references/backgrounds/` stay out
 * of the check, except `catalogo.md` and `NOTICE.md`, which the skill quotes.
 */
export function findOrphanAssets(skillDir: string): string[] {
  const markdowns = listFiles(skillDir, (item) => item.endsWith(".md"));
  const linked = new Set<string>();
  for (const file of markdowns) {
    for (const link of extractLinks(read(file))) {
      linked.add(resolve(dirname(file), link.target).split("\\").join("/"));
    }
  }
  const candidates = [
    ...listFiles(join(skillDir, "references"), () => true),
    ...listFiles(join(skillDir, "assets"), () => true),
  ];
  return candidates.filter((asset) => {
    const normalized = asset.split("\\").join("/");
    if (normalized.includes("/references/backgrounds/") && !/\/(catalogo|NOTICE)\.md$/u.test(normalized)) return false;
    return !linked.has(normalized);
  });
}

/** Repository path with forward slashes, for messages. */
function label(root: string, file: string): string {
  return relative(root, file).split("\\").join("/") || ".";
}

/** Line of a text where a fragment sits, for messages about JSON files. */
function lineOf(text: string, needle: string): number {
  const index = text.split(/\r?\n/u).findIndex((line) => line.includes(needle));
  return index >= 0 ? index + 1 : 1;
}

/** Runs every check against the repository at `root`. */
export function checkSkills(root = join(import.meta.dir, "..")): { problems: Problem[]; warnings: string[] } {
  const problems: Problem[] = [];
  const warnings: string[] = [];
  const fail = (file: string, line: number, message: string) => problems.push({ file: label(root, file), line, message });

  const skillsDir = join(root, "skills");
  const folders = existsSync(skillsDir)
    ? readdirSync(skillsDir, { withFileTypes: true })
        .filter((item) => item.isDirectory() && !item.name.startsWith("."))
        .map((item) => item.name)
        .sort()
    : [];
  if (folders.length === 0) fail(skillsDir, 1, "no skill folder found");

  // a. Front matter.
  for (const name of folders) {
    const file = join(skillsDir, name, "SKILL.md");
    if (!existsSync(file)) {
      fail(file, 1, "SKILL.md missing");
      continue;
    }
    const text = read(file);
    const { frontmatter } = splitFrontmatter(text);
    if (frontmatter === undefined) {
      fail(file, 1, "front matter missing");
      continue;
    }
    const fields = parseFrontmatter(frontmatter);
    if (fields.name !== name) fail(file, lineOf(text, "name:"), `front matter name must be "${name}"`);
    const description = fields.description ?? "";
    if (!description) fail(file, lineOf(text, "description:"), "front matter description missing");
    else if (description.length > 1024) {
      fail(file, lineOf(text, "description:"), `description has ${description.length} characters (limit 1024)`);
    }
  }

  // b. Sections.
  for (const name of folders) {
    const file = join(skillsDir, name, "SKILL.md");
    if (!existsSync(file)) continue;
    const sections = new Set(
      collectHeadings(read(file))
        .filter((heading) => heading.level === 2)
        .map((heading) => heading.text),
    );
    for (const section of REQUIRED_SECTIONS) {
      if (!sections.has(section)) fail(file, 1, `section "## ${section}" missing`);
    }
  }

  const markdowns = listFiles(skillsDir, (item) => item.endsWith(".md")).sort();

  // c. Relative links, anchors included.
  for (const file of markdowns) {
    for (const link of extractLinks(read(file))) {
      const target = resolve(dirname(file), link.target);
      if (!existsSync(target)) {
        fail(file, link.line, `broken link: ${link.raw}`);
        continue;
      }
      if (!link.anchor || !target.endsWith(".md") || !statSync(target).isFile()) continue;
      if (!collectAnchors(read(target)).has(link.anchor)) fail(file, link.line, `anchor not found: ${link.raw}`);
    }
  }

  // d. Reference and asset files reachable from inside the skill.
  for (const name of folders) {
    for (const asset of findOrphanAssets(join(skillsDir, name))) {
      fail(asset, 1, `file is not linked from any Markdown of the skill ${name}`);
    }
  }

  // e. Vetoed text.
  for (const file of markdowns) {
    const path = label(root, file);
    if (path.includes("/assets/examples/") || path.includes("/references/backgrounds/")) continue;
    const text = read(file);
    // Generated references are instruction text too: a hit points to the source (catalog JSON or docs) to fix.
    const generated = text.startsWith(GENERATED_COMMENT);
    for (const hit of findBannedText(text)) fail(file, hit.line, `vetoed text (${hit.term})${generated ? " in a generated file: fix the source and run bun run skills:sync" : ""}`);
  }

  // f. The catalog and the folders name the same skills.
  const catalogFile = join(root, "catalog/skills.json");
  const catalogText = read(catalogFile);
  const internal = skillsCatalog.skills.filter((skill) => skill.kind === "internal").map((skill) => skill.name);
  for (const name of internal) {
    if (!folders.includes(name)) fail(catalogFile, lineOf(catalogText, `"name": "${name}"`), `skill ${name} has no folder in skills/`);
  }
  for (const name of folders) {
    if (!internal.includes(name)) fail(join(skillsDir, name, "SKILL.md"), 1, `skill ${name} is not an internal skill in catalog/skills.json`);
  }

  // g. Commands, options and MCP tools quoted in the text.
  for (const file of markdowns) {
    for (const reference of extractCommands(read(file))) {
      const { command, path, rest } = resolveCommand(reference.text);
      const quoted = ["designfy", ...path].join(" ");
      const next = rest.find((token) => !isPlaceholder(token));
      if (command.subcommands?.length && next) {
        fail(file, reference.line, `unknown subcommand: ${quoted} ${next}`);
      } else if (path.length === 0 && next) {
        fail(file, reference.line, `unknown command: ${quoted} ${next}`);
      }
      const accepted = acceptedOptions(command);
      for (const option of reference.options) {
        if (!accepted.has(option)) fail(file, reference.line, `unknown option for ${quoted || "designfy"}: ${option}`);
      }
    }
  }
  const tools = mcpToolNames();
  for (const file of markdowns) {
    read(file)
      .split(/\r?\n/u)
      .forEach((line, index) => {
        if (!/\btools?\b/iu.test(line)) return;
        for (const name of toolMentions(line)) {
          if (!tools.has(name)) fail(file, index + 1, `unknown MCP tool: ${name}`);
        }
      });
  }

  // h. Components named by `designfy components add` and `designfy:<item>`.
  const items = registryItemNames();
  const planned = new Set(PLANNED_ITEMS);
  for (const file of markdowns) {
    const text = read(file);
    text.split(/\r?\n/u).forEach((line, index) => {
      for (const match of line.matchAll(/`designfy:([a-z0-9][a-z0-9-]*)`/gu)) {
        const name = match[1] ?? "";
        if (!items.has(name) && !planned.has(name)) fail(file, index + 1, `unknown component: designfy:${name}`);
      }
    });
    for (const reference of extractCommands(text)) {
      const { path, rest } = resolveCommand(reference.text);
      if (!(path.length === 2 && path[0] === "components" && path[1] === "add")) continue;
      for (const name of rest) {
        if (isPlaceholder(name)) continue;
        if (!items.has(name) && !planned.has(name)) fail(file, reference.line, `unknown component: ${name}`);
      }
    }
  }
  for (const name of PLANNED_ITEMS) {
    if (!items.has(name)) warnings.push(`planned component designfy:${name} is not in the embedded registry yet`);
  }

  // i. Interfaces named by `designfy catalog show`.
  const interfaces = new Set(interfaceCatalog.entries.map((entry) => entry.id));
  for (const file of markdowns) {
    for (const reference of extractCommands(read(file))) {
      const { path, rest } = resolveCommand(reference.text);
      if (!(path.length === 2 && path[0] === "catalog" && path[1] === "show")) continue;
      for (const id of rest) {
        if (isPlaceholder(id)) continue;
        if (!interfaces.has(id)) fail(file, reference.line, `unknown catalog item: ${id}`);
      }
    }
  }

  // The generated dependency document has to be there once the sync runs.
  const libraries = join(skillsDir, "designfy-components/references/bibliotecas-catalogo.md");
  if (!existsSync(libraries)) {
    warnings.push(`${label(root, libraries)} is missing. Run bun scripts/sync-skill-assets.ts`);
  } else if (dependenciesCatalog.groups.length === 0) {
    warnings.push("catalog/dependencies.json has no group");
  }

  return { problems, warnings };
}

if (import.meta.main) {
  const { problems, warnings } = checkSkills();
  if (process.argv.includes("--json")) {
    process.stdout.write(
      `${JSON.stringify(
        {
          ok: problems.length === 0,
          problems: problems.map((problem) => `${problem.file}:${problem.line}: ${problem.message}`),
          warnings,
        },
        null,
        2,
      )}\n`,
    );
  } else {
    for (const problem of problems) process.stdout.write(`${problem.file}:${problem.line}: ${problem.message}\n`);
    for (const warning of warnings) process.stderr.write(`warning: ${warning}\n`);
    process.stderr.write(problems.length ? `${problems.length} problem(s) in skills/.\n` : "ok: skills are consistent.\n");
  }
  if (problems.length > 0) process.exitCode = 1;
}
