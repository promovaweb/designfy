/** Validates embedded Designfy catalogs and optional runtime replacements. */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import skillsJson from "../../catalog/skills.json";
import dependenciesJson from "../../catalog/dependencies.json";
import mcpJson from "../../catalog/mcp.json";
import { classifyFsError, error } from "../app/errors.ts";
import { ExitCode } from "../app/exit-codes.ts";
import { frameworks } from "./project.ts";

const text = z.string().min(1);
const frameworkList = z.array(z.enum(frameworks));
export const skillSchema = z.object({
  name: text,
  title: text,
  kind: z.enum(["internal", "external"]),
  source: text,
  description: text,
  group: text,
  frameworks: frameworkList,
  default: z.boolean(),
  all: z.boolean().optional(),
});
export const dependencyPackageSchema = z.object({
  name: z.string().regex(/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/i),
  version: text,
  dev: z.boolean(),
  purpose: text,
  url: z.url(),
});
export const dependencyGroupSchema = z.object({
  id: text,
  title: text,
  description: text,
  frameworks: frameworkList,
  default: z.boolean(),
  packages: z.array(dependencyPackageSchema),
});
const mcpServerSchema = z.object({
  id: text,
  title: text,
  description: text,
  command: text,
  args: z.array(z.string()),
  url: z.url(),
  default: z.boolean(),
});

const skillsSchema = z.object({ schemaVersion: z.literal(1), skills: z.array(skillSchema) });
const dependenciesSchema = z.object({
  schemaVersion: z.literal(1),
  checkedAt: z.iso.date().optional(),
  groups: z.array(dependencyGroupSchema),
});
const mcpSchema = z.object({ schemaVersion: z.literal(1), servers: z.array(mcpServerSchema) });

export type CatalogSkill = z.infer<typeof skillSchema>;
export type DependencyPackage = z.infer<typeof dependencyPackageSchema>;
export type DependencyGroup = z.infer<typeof dependencyGroupSchema>;
export type McpServerEntry = z.infer<typeof mcpServerSchema>;
export type SkillsCatalog = z.infer<typeof skillsSchema>;
export type DependenciesCatalog = z.infer<typeof dependenciesSchema>;
export type McpCatalog = z.infer<typeof mcpSchema>;

function load<T>(file: string, embedded: unknown, schema: z.ZodType<T>): T {
  const directory = process.env.DESIGNFY_CATALOG_DIR;
  const path = directory ? join(directory, file) : `catalog/${file}`;
  let data = embedded;
  if (directory) {
    let raw: string;
    try {
      raw = readFileSync(path, "utf8");
    } catch (cause) {
      throw classifyFsError(cause, ExitCode.CONFIG, `Failed to read ${path}`);
    }
    try {
      data = JSON.parse(raw);
    } catch {
      throw error.config(`${path} does not contain valid JSON.`, { path });
    }
  }
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw error.config(`Invalid catalog in ${path}.`, {
      path,
      issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
    });
  }
  return parsed.data;
}

/** Loads and validates the skills catalog. */
export function loadSkillsCatalog(): SkillsCatalog {
  return load("skills.json", skillsJson, skillsSchema);
}

/** Loads and validates the dependencies catalog. */
export function loadDependenciesCatalog(): DependenciesCatalog {
  return load("dependencies.json", dependenciesJson, dependenciesSchema);
}

/** Loads and validates the MCP server catalog. */
export function loadMcpCatalog(): McpCatalog {
  return load("mcp.json", mcpJson, mcpSchema);
}
