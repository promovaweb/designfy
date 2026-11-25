/** Reads and validates Designfy screen specifications and the root interface guide. */
import { readFileSync, readdirSync, realpathSync, statSync, type Dirent } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { z } from "zod";
import { detectSpecsfy, specStates } from "./integrations.ts";
import { resolveProject } from "./project.ts";

const filename = "VIEWSPEC.md";
const viewId = /^[0-9]{4}$/;
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const directoryName = /^([0-9]{4})-([a-z0-9]+(?:-[a-z0-9]+)*)$/;

export const viewStatuses = ["draft", "in_progress", "blocked", "done", "archived"] as const;
const siteKinds = ["landing-page", "home", "site-page", "blog-index", "blog-post", "docs-page"] as const;
const webappKinds = ["dashboard", "table", "form", "crud", "detail", "settings", "auth"] as const;
export const viewKinds = [...siteKinds, ...webappKinds, "other"] as const;

const viewSections = [
  "Objetivo", "Conteúdo", "Estrutura", "Estados", "Responsivo",
  "Movimento", "Acessibilidade", "Checklist", "Notas",
] as const;
const guideSections = [
  ["Visão geral", "v"], ["Cores", "c"], ["Tipografia", "y"], ["Layout", "l"],
  ["Fundos e profundidade", "f"], ["Formas", "s"], ["Movimento", "m"],
  ["Voz e conteúdo", "w"], ["Componentes", "k"], ["Padrões de tela", "t"],
  ["Responsivo", "r"], ["Acessibilidade", "a"], ["Faça e não faça", "d"],
  ["Aprendizados", null],
] as const;
const origins = ["@pessoa", "@agente", "@revisão"] as const;
type Origin = (typeof origins)[number];
type GuideSection = (typeof guideSections)[number][0];

const text = z.string().trim().min(1);
const dateTime = z.iso.datetime({ offset: true });
const surface = z.enum(["site", "webapp"]);
const framework = z.enum(["astro", "react", "react-vite", "next", "other"]);
const commonFields = { schemaVersion: z.literal("1.0.0"), createdAt: dateTime, updatedAt: dateTime };
export const viewFrontMatterSchema = z.strictObject({
  ...commonFields,
  scope: z.literal("view"),
  id: z.string().regex(viewId, "Use exactly four digits for the id."),
  slug: z.string().regex(slug, "Use a lowercase kebab-case slug."),
  title: text,
  summary: text,
  status: z.enum(viewStatuses),
  kind: z.enum(viewKinds),
  surface,
  framework,
  route: text,
  skills: z.array(text.regex(/^designfy/, "Start the skill name with designfy.")).min(1),
  components: z.array(text),
  relatedFiles: z.array(text),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dependsOn: z.array(z.string().regex(viewId, "Use four-digit viewspec ids.")).optional(),
  trackedBy: z.array(z.strictObject({ system: z.enum(["astrofy", "specsfy", "other"]), id: text, path: text })).optional(),
  source: text.optional(),
  blockedReason: text.optional(),
  archivedReason: text.optional(),
  captures: z.array(text).optional(),
  guideRules: z.array(text).optional(),
  deviations: z.array(text).optional(),
});
export const guideFrontMatterSchema = z.strictObject({
  ...commonFields,
  scope: z.literal("project"),
  name: text,
  description: text,
  surfaces: z.array(surface).min(1),
  frameworks: z.array(framework).min(1),
  tokensFile: text,
  themes: z.array(z.enum(["light", "dark"])).min(1),
});

export type ViewStatus = (typeof viewStatuses)[number];
export type ViewKind = (typeof viewKinds)[number];
export type ViewspecFilter = { status?: ViewStatus; kind?: ViewKind };
export type ViewspecError = { file: string; line?: number; field?: string; message: string };
export type ViewspecSection = { title: string; line: number; text: string };
export type ChecklistItem = { id: string; text: string; done: boolean; skill: string; line: number };
export type ChecklistProgress = { done: number; total: number };
export type Viewspec = {
  file: string;
  frontMatter: z.infer<typeof viewFrontMatterSchema>;
  sections: ViewspecSection[];
  checklist: ChecklistItem[];
  progress: ChecklistProgress;
};
export type GuideRule = { id: string; section: GuideSection; origin: Origin; text: string; line: number };
export type GuideLearning = { date: string; origin: Origin; text: string; destination: string; line: number };
export type ProjectGuide = {
  file: string;
  exists: boolean;
  frontMatter: z.infer<typeof guideFrontMatterSchema> | null;
  sections: ViewspecSection[];
  rules: GuideRule[];
  learnings: GuideLearning[];
  bySection: Record<GuideSection, number>;
  byOrigin: Record<Origin, number>;
  pendingProposals: GuideLearning[];
  errors: ViewspecError[];
};
export type ViewspecList = { items: Viewspec[]; errors: ViewspecError[]; nextId: string | null };
type ViewspecSummary = Pick<Viewspec["frontMatter"], "id" | "title" | "summary" | "kind" | "status" | "trackedBy">
  & Pick<Viewspec, "file" | "progress">;
export type ViewspecSummaryList = Omit<ViewspecList, "items"> & { items: ViewspecSummary[] };
export type ViewspecRead = { item: Viewspec | null; found: boolean; errors: ViewspecError[] };
export type ViewspecProgress = ChecklistProgress & {
  byStatus: Record<ViewStatus, number>;
  nextId: string | null;
  errors: ViewspecError[];
};
export type ViewspecValidation = { warnings: ViewspecError[]; valid: boolean; guide: "missing" | "valid" | "invalid"; errors: ViewspecError[] };

type Scalar = string | number | boolean | null;
type ParsedDocument = {
  file: string;
  frontMatter: Record<string, unknown>;
  fieldLines: Record<string, number>;
  sections: ViewspecSection[];
  errors: ViewspecError[];
};

function parseScalar(value: string): Scalar {
  const first = value[0];
  if (!first) throw new Error("Provide a value.");
  if (first === '"') {
    try {
      const parsed: unknown = JSON.parse(value);
      if (typeof parsed === "string") return parsed;
    } catch {
      // The caller attaches the field and source line.
    }
    throw new Error("Close the double-quoted string and use valid escapes.");
  }
  if (first === "'") {
    if (!/^'(?:[^']|'')*'$/.test(value)) throw new Error("Close the single-quoted string and double embedded apostrophes.");
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (value === "true" || value === "false") return value === "true";
  if (value === "null" || value === "~") return null;
  if (/^[-+]?(?:0|[1-9]\d*)(?:\.\d+)?(?:e[-+]?\d+)?$/i.test(value)) return Number(value);
  if (/^[[\]{|>&*!]/.test(value)) throw new Error("Use a scalar or a flat list of scalars.");
  return value;
}

function parseValue(value: string): Scalar | Scalar[] {
  if (!value.startsWith("[")) return parseScalar(value);
  if (!value.endsWith("]")) throw new Error("Close the inline list with ].");
  const contents = value.slice(1, -1).trim();
  if (!contents) return [];
  const tokens = contents.match(/"(?:\\.|[^"\\])*"|'(?:''|[^'])*'|[^,'"]+|,/g) ?? [];
  if (tokens.join("") !== contents) throw new Error("Close quoted items in the inline list.");
  const items: Scalar[] = [];
  let item = "";
  for (const token of tokens) {
    if (token !== ",") {
      item += token;
      continue;
    }
    items.push(parseScalar(item.trim()));
    item = "";
  }
  if (item.trim()) items.push(parseScalar(item.trim()));
  return items;
}

function withoutComment(value: string): string {
  const tokens = /"(?:\\.|[^"\\])*"|'(?:''|[^'])*'|(?:^|[ \t])#/g;
  for (const token of value.matchAll(tokens)) {
    if (token[0].endsWith("#")) return value.slice(0, token.index).trimEnd();
  }
  return value.trimEnd();
}

function fenceAt(line: string): string | undefined {
  return /^ {0,3}(\x60{3,}|~{3,})/.exec(line)?.[1];
}

function closesFence(line: string, fence: string): boolean {
  return new RegExp("^ {0,3}" + fence[0] + "{" + fence.length + ",}\\s*$").test(line);
}

function readSections(lines: string[], start: number): ViewspecSection[] {
  const sections: ViewspecSection[] = [];
  let fence: string | undefined;
  for (let index = start; index < lines.length; index++) {
    const line = lines[index]!;
    if (fence) {
      if (closesFence(line, fence)) fence = undefined;
      continue;
    }
    fence = fenceAt(line);
    if (fence) continue;
    const match = /^ {0,3}##(?:[ \t]+(.*)|$)/.exec(line);
    if (match) sections.push({ title: (match[1] ?? "").trim(), line: index + 1, text: "" });
  }
  for (const [index, section] of sections.entries()) {
    const nextHeading = sections[index + 1];
    section.text = lines.slice(section.line, nextHeading ? nextHeading.line - 1 : undefined).join("\n");
  }
  return sections;
}

/** Parses restricted YAML and Markdown sections with one-based source locations. */
export function parseViewspec(file: string, markdown: string, warnings?: ViewspecError[]): ParsedDocument {
  const frontMatter: ParsedDocument["frontMatter"] = Object.create(null);
  const fieldLines: ParsedDocument["fieldLines"] = Object.create(null);
  const errors: ViewspecError[] = [];
  const lines = markdown.replace(/^\uFEFF/, "").split(/\r?\n/);
  const end = lines.indexOf("---", 1);
  if (lines[0] !== "---" || end === -1) {
    errors.push({ file, line: 1, message: "Start the file with YAML front matter between two --- lines." });
    return { file, frontMatter, fieldLines, sections: [], errors };
  }

  let listField: string | undefined;
  for (let index = 1; index < end; index++) {
    const raw = lines[index]!;
    const line = index + 1;
    if (!raw.trim() || /^\s*#/.test(raw)) continue;
    const entry = /^([A-Za-z][\w-]*):(?:[ \t]*(.*))$/.exec(raw);
    const item = /^[ \t]*-[ \t]+(.*)$/.exec(raw);
    try {
      if (entry) {
        const field = entry[1]!;
        listField = undefined;
        if (Object.hasOwn(fieldLines, field)) {
          errors.push({ file, line, field, message: "Declare this front matter field only once." });
          continue;
        }
        fieldLines[field] = line;
        const value = withoutComment(entry[2]!).trim();
        if (field === "trackedBy") {
          let next = index + 1;
          while (next < end && !/^[^\s#-]/.test(lines[next]!)) next++;
          const mapping = Bun.YAML.parse(lines.slice(index, next).join("\n")) as Record<string, unknown>;
          frontMatter[field] = mapping[field];
          index = next - 1;
          continue;
        }
        frontMatter[field] = value ? parseValue(value) : null;
        if (!value) listField = field;
      } else if (item && listField !== undefined) {
        const value = parseScalar(withoutComment(item[1]!).trim());
        const list = frontMatter[listField];
        if (Array.isArray(list)) list.push(value);
        else frontMatter[listField] = [value];
      } else {
        errors.push({ file, line, message: "Use a field in the form key: value or a list item under a field." });
      }
    } catch (cause) {
      const field = entry?.[1] ?? listField;
      errors.push({ file, line, field, message: (cause as Error).message });
    }
  }

  for (const field of ["surface", "surfaces"]) {
    const value = frontMatter[field];
    if (field === "surface" && value === "system") frontMatter[field] = "webapp";
    else if (field === "surfaces" && Array.isArray(value) && value.includes("system")) {
      frontMatter[field] = value.map((entry) => entry === "system" ? "webapp" : entry);
    } else continue;
    warnings?.push({ file, line: fieldLines[field], field, message: 'The "system" surface is deprecated. Use "webapp".' });
  }
  return { file, frontMatter, fieldLines, sections: readSections(lines, end + 1), errors };
}

function fieldError(parsed: ParsedDocument, field: string, message: string): ViewspecError {
  return { file: parsed.file, line: parsed.fieldLines[field] ?? 1, field, message };
}

function validateFrontMatter<T>(parsed: ParsedDocument, schema: z.ZodType<T>, errors: ViewspecError[]): T | null {
  const result = schema.safeParse(parsed.frontMatter);
  if (result.success) return result.data;
  for (const issue of result.error.issues) {
    if (issue.code === "unrecognized_keys") {
      for (const key of issue.keys) errors.push(fieldError(parsed, key, "Remove this unknown front matter field."));
    } else {
      const field = String(issue.path[0]);
      const item = issue.path[1];
      const message = item === undefined ? issue.message : 'Item ' + (Number(item) + 1) + ': ' + issue.message;
      errors.push(fieldError(parsed, field, message));
    }
  }
  return null;
}

function validateSections(parsed: ParsedDocument, expected: readonly string[], errors: ViewspecError[]): void {
  const remaining = new Set(expected);
  let last = -1;
  for (const section of parsed.sections) {
    const position = expected.indexOf(section.title);
    const location = { file: parsed.file, line: section.line, field: section.title };
    if (position < 0) {
      errors.push({ ...location, message: 'Unknown section "' + section.title + '". Use the exact heading from the contract.' });
    } else if (!remaining.delete(section.title)) {
      errors.push({ ...location, message: "Keep only one copy of this section." });
    } else if (position < last) {
      errors.push({ ...location, message: 'Move this section before "' + expected[last] + '".' });
    } else {
      last = position;
    }
    const content = section.text.trim();
    if ((!content && section.title !== "Notas") || content === "Não se aplica.") {
      errors.push({ ...location, message: "Add content or explain why the section does not apply after “Não se aplica.”" });
    }
  }
  for (const title of remaining) {
    errors.push({ file: parsed.file, field: title, message: 'Add the required heading "## ' + title + '".' });
  }
}

function sectionLines(section: ViewspecSection): { raw: string; line: number }[] {
  const result: { raw: string; line: number }[] = [];
  let fence: string | undefined;
  for (const [index, raw] of section.text.split("\n").entries()) {
    if (fence) {
      if (closesFence(raw, fence)) fence = undefined;
      continue;
    }
    fence = fenceAt(raw);
    if (!fence && raw.trim()) result.push({ raw, line: section.line + index + 1 });
  }
  return result;
}

function readChecklist(parsed: ParsedDocument, errors: ViewspecError[], firstSkill: string): ChecklistItem[] {
  const section = parsed.sections.find(({ title }) => title === "Checklist");
  if (!section) return [];
  const checklist: ChecklistItem[] = [];
  const ids = new Set<string>();
  const lines = sectionLines(section);
  if (/^Não se aplica\.(?:\s|$)/.test(lines[0]?.raw.trim() ?? "")
    && !lines.some(({ raw }) => /^\s*(?:[-+*]|\d+[.)])\s+/.test(raw))) return checklist;
  for (const { raw, line } of lines) {
    const location = { file: parsed.file, line, field: "Checklist" };
    const item = /^-\s+\[([ x])\]\s+(.+?)\s+\{#([a-z0-9]{4})\}\s*$/.exec(raw.trim());
    if (!item) {
      errors.push({ ...location, message: "Use a GFM checkbox and end the task with a four-character lowercase {#id}." });
      continue;
    }
    const id = item[3]!;
    const task = item[2]!;
    const annotation = /(?:^|\s)\x60(#designfy[^\x60]*)\x60\s*$/.exec(task);
    const taskText = annotation ? task.slice(0, annotation.index).trimEnd() : task;
    const skill = annotation ? annotation[1]!.slice(1) : firstSkill;
    if (!taskText || (annotation && !/^designfy-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skill))) {
      errors.push({ ...location, message: "Write the task text and use #designfy-<skill> for an optional skill annotation." });
      continue;
    }
    if (ids.has(id)) {
      errors.push({ ...location, message: 'Use a unique checklist id. {#' + id + '} was already used.' });
      continue;
    }
    ids.add(id);
    checklist.push({ id, text: taskText, done: item[1] === "x", skill, line });
  }
  return checklist;
}

type TrackingLink = NonNullable<Viewspec["frontMatter"]["trackedBy"]>[number];

function contained(root: string, file: string): boolean {
  const path = relative(root, file);
  return path !== ".." && !path.startsWith(".." + sep) && !isAbsolute(path);
}

function findSpecById(root: string, id: string): string | undefined {
  for (const state of specStates) {
    const dir = join(root, state);
    if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) continue;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || !entry.name.startsWith(id + "-")) continue;
      const candidate = join(dir, entry.name, "spec.md");
      if (statSync(candidate, { throwIfNoEntry: false })?.isFile()) return candidate;
    }
  }
}

function trackingError(project: string, link: TrackingLink): string | undefined {
  const { system, id, path } = link;
  if (isAbsolute(path)) return "Use a project-relative path: " + path;
  if (system !== "other" && !viewId.test(id)) return "Use a four-digit " + system + " id.";
  const file = resolve(project, path);
  let root = project;
  if (system === "specsfy") {
    root = resolve(project, detectSpecsfy(project).specsDir ?? "specs");
    const [state, folder, name, ...extra] = relative(root, file).split(sep);
    if (!specStates.some(value => value === state) || !folder?.startsWith(id + "-") || folder.length <= 5
      || name !== "spec.md" || extra.length) return "Use specs/<state>/" + id + "-<slug>/spec.md.";
  } else if (system === "astrofy") {
    root = join(project, ".sitespec");
    if (!new RegExp("^" + id + "-[^/]+/SITEPEC\\.md$").test(relative(root, file).split(sep).join("/"))) {
      return "Use .sitespec/" + id + "-<slug>/SITEPEC.md.";
    }
  }
  if (!contained(root, file)) return "Path is outside the project: " + path;
  try {
    if (!statSync(file, { throwIfNoEntry: false })?.isFile()) {
      if (system === "specsfy") {
        const moved = findSpecById(root, id);
        if (moved) return "Tracked file is missing. Update path to " + relative(project, moved) + ".";
      }
      return "Tracked file is missing: " + path;
    }
    if (!contained(realpathSync(root), realpathSync(file))) return "Tracked file resolves outside its root: " + path;
    if (system === "astrofy") {
      const header = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(readFileSync(file, "utf8"));
      const metadata = header && Bun.YAML.parse(header[1]!);
      if (!metadata || typeof metadata !== "object" || !("id" in metadata) || metadata.id !== id) return "SITEPEC.md front matter must declare id " + id + ".";
    }
  } catch {
    return "Could not read the tracked file or its front matter: " + path;
  }
}

/** Checks a parsed screen specification and exposes an item only when valid. */
export function validateViewspec(parsed: ParsedDocument, project = resolve(dirname(parsed.file), "../..")): ViewspecRead {
  const errors = [...parsed.errors];
  const data = validateFrontMatter(parsed, viewFrontMatterSchema, errors);
  for (const link of data?.trackedBy ?? []) {
    const message = trackingError(project, link);
    if (message) errors.push(fieldError(parsed, "trackedBy", message));
  }
  validateSections(parsed, viewSections, errors);
  const checklist = readChecklist(parsed, errors, data?.skills[0] ?? "");
  const folder = basename(dirname(parsed.file));
  const match = directoryName.exec(folder);
  const front = parsed.frontMatter;
  if (!match) {
    errors.push({ file: parsed.file, message: 'Rename directory "' + folder + '" to <four-digit id>-<kebab-case slug>.' });
  } else {
    for (const [field, expected] of [["id", match[1]], ["slug", match[2]]] as const) {
      if (typeof front[field] === "string" && front[field] !== expected) {
        errors.push(fieldError(parsed, field, 'Use "' + expected + '" to match the directory name.'));
      }
    }
  }

  const expectedSurface = [...siteKinds].some((kind) => kind === front.kind) ? "site"
    : [...webappKinds].some((kind) => kind === front.kind) ? "webapp" : undefined;
  if (expectedSurface && surface.safeParse(front.surface).success && front.surface !== expectedSurface) {
    errors.push(fieldError(parsed, "surface", 'Use "' + expectedSurface + '" for kind "' + front.kind + '".'));
  }
  for (const [status, field] of [["blocked", "blockedReason"], ["archived", "archivedReason"]] as const) {
    if (front.status === status && !text.safeParse(front[field]).success) {
      errors.push(fieldError(parsed, field, 'Provide a reason when status is "' + status + '".'));
    } else if (front.status !== status && Object.hasOwn(front, field)) {
      errors.push(fieldError(parsed, field, 'Remove this reason unless status is "' + status + '".'));
    }
  }
  if (front.status === "done") {
    const pending = checklist.find((item) => !item.done);
    if (pending) {
      errors.push({
        file: parsed.file, field: "Checklist", line: pending.line,
        message: "Complete every checklist item before setting status to done.",
      });
    }
    if (!Array.isArray(front.captures) || !front.captures.length) {
      errors.push(fieldError(parsed, "captures", "Record at least one reviewed capture when status is done."));
    }
  }
  if (Array.isArray(front.deviations) && front.deviations.length
    && !parsed.sections.some(({ title, text }) => title === "Notas" && text.trim())) {
    errors.push(fieldError(parsed, "deviations", 'Explain the listed deviations in "## Notas".'));
  }

  const item = data && !errors.length ? {
    file: parsed.file,
    frontMatter: data,
    sections: parsed.sections,
    checklist,
    progress: { done: checklist.filter((entry) => entry.done).length, total: checklist.length },
  } : null;
  return { item, found: true, errors };
}

function readDocument(file: string, warnings?: ViewspecError[]): ParsedDocument | { missing: boolean; error: ViewspecError } {
  try {
    return parseViewspec(file, readFileSync(file, "utf8"), warnings);
  } catch (cause) {
    const code = (cause as NodeJS.ErrnoException).code;
    return {
      missing: code === "ENOENT",
      error: {
        file,
        message: code === "ENOENT"
          ? "Create VIEWSPEC.md in this directory."
          : 'Could not read VIEWSPEC.md. Check the file and its permissions (' + (code ?? "read failed") + ').',
      },
    };
  }
}

function readCandidates(cwd: string): { files: { file: string; id: string | undefined }[]; errors: ViewspecError[] } {
  const folder = resolve(cwd, resolveProject(cwd).paths.viewspec);
  let entries: Dirent[];
  try {
    entries = readdirSync(folder, { withFileTypes: true });
  } catch (cause) {
    const code = (cause as NodeJS.ErrnoException).code;
    return {
      files: [],
      errors: code === "ENOENT" ? [] : [{
        file: folder, message: 'Could not list the viewspec directory. Check the path and its permissions (' + (code ?? "read failed") + ').',
      }],
    };
  }

  const files = entries.filter((entry) => entry.isDirectory()).map(({ name }) => ({
    file: join(folder, name, filename), id: /^([0-9]{4})(?:-|$)/.exec(name)?.[1],
  })).sort((left, right) => left.file.localeCompare(right.file, "en"));
  return { files, errors: [] };
}

function loadCandidates(project: string, files: ReturnType<typeof readCandidates>["files"], errors: ViewspecError[], warnings?: ViewspecError[]): Viewspec[] {
  const items: Viewspec[] = [];
  const used = new Map<string, string>();
  const duplicates = new Set<string>();
  for (const { file, id } of files) {
    if (id !== undefined) {
      const first = used.get(id);
      if (first) {
        duplicates.add(id);
        errors.push({ file, field: "id", message: 'Choose a unique id. "' + id + '" is already used in ' + first + "." });
      } else {
        used.set(id, file);
      }
    }
    const parsed = readDocument(file, warnings);
    if ("error" in parsed) {
      if (id !== undefined || !parsed.missing) errors.push(parsed.error);
      continue;
    }
    const result = validateViewspec(parsed, project);
    errors.push(...result.errors);
    if (result.item) items.push(result.item);
  }
  return items.filter(({ frontMatter }) => !duplicates.has(frontMatter.id));
}

/** Reads and filters screen viewspecs, preserving diagnostics for the whole collection. */
export function readViewspecs(cwd: string, filter: ViewspecFilter = {}): ViewspecList {
  const { files, errors } = readCandidates(cwd);
  const items = loadCandidates(cwd, files, errors);
  const used = new Set(files.map(({ id }) => id));
  let nextId: string | null = null;
  for (let index = 1; index <= 9999; index++) {
    const id = String(index).padStart(4, "0");
    if (!used.has(id)) {
      nextId = id;
      break;
    }
  }
  return {
    items: items.filter(({ frontMatter }) => (!filter.status || frontMatter.status === filter.status)
      && (!filter.kind || frontMatter.kind === filter.kind)),
    errors,
    nextId,
  };
}

/** Lists just the public summary fields used by the CLI and MCP list surfaces. */
export function listViewspecSummaries(cwd: string, filter: ViewspecFilter = {}): ViewspecSummaryList {
  const { items, errors, nextId } = readViewspecs(cwd, filter);
  return {
    items: items.map(({ file, frontMatter: { id, title, summary, kind, status, trackedBy }, progress }) => ({
      file, id, title, summary, kind, status, progress, ...(trackedBy && { trackedBy }),
    })),
    errors,
    nextId,
  };
}

/** Reads a single screen by its four-digit id and checks its contract. */
export function readViewspec(cwd: string, id: string): ViewspecRead {
  const { files, errors } = readCandidates(cwd);
  const matching = files.filter((entry) => entry.id === id);
  const [item] = loadCandidates(cwd, matching, errors);
  return { item: item ?? null, found: matching.length > 0, errors };
}

/** Aggregates status counts and checklist progress across the valid screen viewspecs. */
export function readViewspecProgress(cwd: string): ViewspecProgress {
  const { items, errors, nextId } = readViewspecs(cwd);
  const byStatus: Record<ViewStatus, number> = { draft: 0, in_progress: 0, blocked: 0, done: 0, archived: 0 };
  let total = 0;
  let done = 0;
  for (const item of items) {
    byStatus[item.frontMatter.status]++;
    total += item.progress.total;
    done += item.progress.done;
  }
  return { byStatus, total, done, nextId, errors };
}

function emptyGuide(file: string, exists: boolean): ProjectGuide {
  const bySection = Object.fromEntries(guideSections.map(([title]) => [title, 0])) as ProjectGuide["bySection"];
  return {
    file, exists, frontMatter: null, sections: [], rules: [], learnings: [],
    bySection, byOrigin: { "@pessoa": 0, "@agente": 0, "@revisão": 0 }, pendingProposals: [], errors: [],
  };
}

function isOrigin(value: string): value is Origin {
  return origins.some((origin) => origin === value);
}

/** Validates a parsed project guide and gathers its rules, learnings and counts. */
export function validateGuide(parsed: ParsedDocument): ProjectGuide {
  const guide = emptyGuide(parsed.file, true);
  const { errors, rules, learnings } = guide;
  errors.push(...parsed.errors);
  guide.frontMatter = validateFrontMatter(parsed, guideFrontMatterSchema, errors);
  guide.sections = parsed.sections;
  validateSections(parsed, guideSections.map(([title]) => title), errors);

  const ids = new Set<string>();
  for (const section of parsed.sections) {
    const definition = guideSections.find(([title]) => title === section.title);
    if (!definition) continue;
    const [title, letter] = definition;
    for (const { raw, line } of sectionLines(section)) {
      const list = /^(?:[-+*]|\d+[.)])[ \t]+(.+)$/.exec(raw.trim());
      if (!list) continue;
      const entry = list[1]!;
      const location = { file: parsed.file, line, field: title };
      if (letter === null) {
        const learning = /^(\S+)\s+(?:\x60(@[^\x60\s]+)\x60|(@\S+))\s+(.+?)\s+→\s+(.+?)\s*$/.exec(entry);
        const date = learning?.[1] ?? "";
        const origin = learning?.[2] ?? learning?.[3] ?? "";
        const destination = learning?.[5] ?? "";
        if (!learning || !z.iso.date().safeParse(date).success || !isOrigin(origin)) {
          errors.push({ ...location, message: "Use YYYY-MM-DD, a valid origin, a description and → followed by the learning destination." });
        } else if (!/^(?:\{#[a-z][0-9]{3}\}|proposta|descartado\b.*)$/.test(destination)) {
          errors.push({ ...location, message: "Use an existing {#id}, proposta, or descartado with a reason as the learning destination." });
        } else if (destination.startsWith("descartado") && !destination.slice("descartado".length).replace(/^[\s:–—()-]+/, "").trim()) {
          errors.push({ ...location, message: "Give the reason after descartado." });
        } else {
          learnings.push({ date, origin, text: learning[4]!, destination, line });
        }
        continue;
      }

      if (!entry.includes("{#")) continue;
      const rule = /^(.*?)\s*\{#([^{}]*)\}\s*$/.exec(entry);
      const id = rule?.[2] ?? "";
      if (!rule || !/^[a-z][0-9]{3}$/.test(id) || !id.startsWith(letter)) {
        errors.push({ ...location, message: 'End the rule with an id in the form {#' + letter + '001}, using the letter for this section.' });
        continue;
      }
      if (ids.has(id)) {
        errors.push({ ...location, message: 'Use a unique rule id. {#' + id + '} was already used.' });
        continue;
      }
      ids.add(id);
      const content = /^(.+?)\s+(?:\x60(@[^\x60\s]+)\x60|(@\S+))$/.exec(rule[1]!.trim());
      const origin = content?.[2] ?? content?.[3] ?? "";
      if (!content || !isOrigin(origin)) {
        errors.push({ ...location, message: "Write the rule text and put @pessoa, @agente, or @revisão before the rule id." });
        continue;
      }
      rules.push({ id, section: title, origin, text: content[1]!, line });
      guide.bySection[title]++;
      guide.byOrigin[origin]++;
    }
  }

  for (const learning of learnings) {
    const id = /^\{#([a-z][0-9]{3})\}$/.exec(learning.destination)?.[1];
    if (id && !ids.has(id)) {
      errors.push({
        file: parsed.file, line: learning.line, field: "Aprendizados",
        message: 'Learning destination ' + learning.destination + ' has no matching rule. Add the rule or update the destination.',
      });
    }
  }
  guide.pendingProposals = learnings.filter(({ destination }) => destination === "proposta");
  return guide;
}

/** Reads the root VIEWSPEC.md and reports whether the guide exists. */
export function readGuide(cwd: string, warnings?: ViewspecError[]): ProjectGuide {
  const file = resolve(cwd, filename);
  const document = readDocument(file, warnings);
  if ("frontMatter" in document) return validateGuide(document);
  const guide = emptyGuide(file, !document.missing);
  if (!document.missing) guide.errors.push(document.error);
  return guide;
}

/** Checks selected screens and the root guide, treating an absent guide as a warning. */
export function validateProjectViewspecs(cwd: string, id?: string): ViewspecValidation {
  const warnings: ViewspecError[] = [];
  const guide = readGuide(cwd, warnings);
  const { files, errors: screenErrors } = readCandidates(cwd);
  const selected = id === undefined ? files : files.filter((entry) => entry.id === id);
  loadCandidates(cwd, selected, screenErrors, warnings);
  const errors = [...guide.errors, ...screenErrors];
  if (id !== undefined && !selected.length && !screenErrors.length) {
    errors.push({
      file: resolve(cwd, resolveProject(cwd).paths.viewspec), field: "id",
      message: 'No screen viewspec uses id "' + id + '". Run viewspec list to find an existing id.',
    });
  }
  return { warnings, valid: errors.length === 0, guide: !guide.exists ? "missing" : guide.errors.length ? "invalid" : "valid", errors };
}
