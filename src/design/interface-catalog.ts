/** Validates the embedded interface catalog and exposes its lookup and search operations. */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import interfaceJson from "../../catalog/interface.json";
import { classifyFsError, error } from "../app/errors.ts";
import { ExitCode } from "../app/exit-codes.ts";

export const interfaceSurfaces = ["site", "system", "both"] as const;
export const interfaceKinds = [
  "landing-page", "home", "site-page", "blog-index", "blog-post", "docs-page", "dashboard",
  "table", "form", "crud", "detail", "settings", "auth", "other",
] as const;

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const text = z.string().min(1);
const strings = z.array(z.string());
const surface = z.enum(interfaceSurfaces);

export const interfaceEntrySchema = z.strictObject({
  id,
  name: text,
  surface,
  category: text,
  purpose: text,
  useWhen: strings,
  avoidWhen: strings,
  anatomy: strings,
  variants: strings,
  states: strings,
  responsive: z.string(),
  motion: z.string(),
  accessibility: strings,
  tokens: strings,
  kinds: z.array(z.enum(interfaceKinds)),
  related: z.array(id),
  sources: z.array(z.string().regex(/^(?:(?:designfy|shadcn|reui):\S+|custom)$/)),
});

const catalogShape = z.strictObject({
  schemaVersion: z.literal(1),
  categories: z.array(z.strictObject({ id: text, title: text, surface })),
  entries: z.array(interfaceEntrySchema),
});

function collectIds(items: readonly { id: string }[], collection: "categories" | "entries", ctx: z.RefinementCtx) {
  const ids = new Set<string>();
  for (const [index, item] of items.entries()) {
    if (ids.has(item.id)) {
      ctx.addIssue({ code: "custom", path: [collection, index, "id"], message: `Duplicate id "${item.id}".` });
    }
    ids.add(item.id);
  }
  return ids;
}

export const interfaceCatalogSchema = catalogShape.superRefine((data, ctx) => {
  const categories = collectIds(data.categories, "categories", ctx);
  const entries = collectIds(data.entries, "entries", ctx);
  for (const [index, entry] of data.entries.entries()) {
    if (!categories.has(entry.category)) {
      ctx.addIssue({ code: "custom", path: ["entries", index, "category"], message: `Unknown category "${entry.category}".` });
    }
    for (const [relatedIndex, related] of entry.related.entries()) {
      if (!entries.has(related)) {
        ctx.addIssue({ code: "custom", path: ["entries", index, "related", relatedIndex], message: `Unknown related id "${related}".` });
      }
    }
  }
});

export type InterfaceEntry = z.infer<typeof interfaceEntrySchema>;
export type InterfaceCatalog = z.infer<typeof interfaceCatalogSchema>;
export type InterfaceSurface = InterfaceEntry["surface"];
export type InterfaceKind = InterfaceEntry["kinds"][number];

export interface InterfaceFilters {
  surface?: InterfaceSurface;
  category?: string;
  kind?: InterfaceKind;
}

/** Validates the catalog schema, unique identifiers, category assignments and related links. */
export function validateCatalog(data?: unknown, path = "catalog/interface.json"): InterfaceCatalog {
  if (data === undefined) return loadInterfaceCatalog();
  const parsed = interfaceCatalogSchema.safeParse(data);
  if (!parsed.success) {
    throw error.config(`Invalid catalog in ${path}.`, {
      path,
      issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
    });
  }
  return parsed.data;
}

/** Loads the catalog embedded in the binary or the runtime fixture override. */
export function loadInterfaceCatalog(): InterfaceCatalog {
  const directory = process.env.DESIGNFY_CATALOG_DIR;
  if (!directory) return validateCatalog(interfaceJson);

  const path = join(directory, "interface.json");
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch (cause) {
    throw classifyFsError(cause, ExitCode.CONFIG, `Failed to read ${path}`);
  }
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw error.config(`${path} does not contain valid JSON.`, { path });
  }
  return validateCatalog(data, path);
}

/** Lists fragments matching all selected filters, including shared entries for either surface. */
export function listEntries({ surface, category, kind }: InterfaceFilters = {}): InterfaceEntry[] {
  return loadInterfaceCatalog().entries.filter((entry) =>
    (!surface || entry.surface === surface || entry.surface === "both") &&
    (!category || entry.category === category) &&
    (!kind || entry.kinds.includes(kind)),
  );
}

/** Returns the requested fragment or reports the catalog's available identifiers. */
export function getEntry(id: string): InterfaceEntry {
  const { entries } = loadInterfaceCatalog();
  const entry = entries.find((item) => item.id === id);
  if (!entry) throw error.notFound(`Unknown interface entry "${id}".`, { known: entries.map((item) => item.id) });
  return entry;
}

function normalized(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

/** Searches names, purposes, use cases and anatomy without case or accent sensitivity. */
export function searchEntries(text: string): InterfaceEntry[] {
  const needle = normalized(text.trim());
  if (!needle) throw error.usage("Enter text to search the interface catalog.");
  return loadInterfaceCatalog().entries.filter(({ name, purpose, useWhen, anatomy }) =>
    [name, purpose, ...useWhen, ...anatomy].some((field) => normalized(field).includes(needle)),
  );
}
