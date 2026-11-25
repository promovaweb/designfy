/** Discovers the Astrofy and Specsfy artifacts that belong to a project. */
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { z } from "zod";
import { readProjectPackages } from "./project.ts";

export const specStates = ["draft", "defined", "planned", "in-progress", "review", "completed"] as const;
const pathField = z.string().nullable();
export const integrationsSchema = z.object({
  astrofy: z.object({
    present: z.boolean(), sitespecDir: pathField, astrofyDir: pathField,
    designSystemJson: pathField, generatedTokensCss: pathField, dependency: pathField,
  }),
  specsfy: z.object({
    present: z.boolean(), specsDir: pathField, specsfyDir: pathField,
    designSystemMd: pathField, interfaceMd: pathField, stackMd: pathField,
  }),
});

function artifact(project: string, root: string, name: string, directory = false) {
  const path = resolve(root, name);
  const stat = statSync(path, { throwIfNoEntry: false });
  return (directory ? stat?.isDirectory() : stat?.isFile()) ? relative(project, path) : null;
}

/** Reads the token build destination used by Astrofy. */
export function astrofyTokensPath(project: string): string {
  try {
    const { designSystemCss } = JSON.parse(readFileSync(join(project, ".astrofy/config/paths.json"), "utf8"));
    if (typeof designSystemCss === "string" && designSystemCss.endsWith(".css") && !isAbsolute(designSystemCss)) {
      const path = relative(project, resolve(project, designSystemCss));
      if (!path.startsWith(".." + sep) && !isAbsolute(path)) return path;
    }
  } catch { /* Projects without Astrofy path settings use its default. */ }
  return "designsystem.css";
}

function inspectSpecs(project: string, root: string) {
  const specsDir = artifact(project, root, "specs", true);
  const specsfyDir = artifact(project, root, ".specsfy", true);
  const designSystemMd = artifact(project, root, "DESIGNSYSTEM.MD");
  return {
    present: Boolean(specsfyDir || designSystemMd || (specsDir && specStates.some(state =>
      artifact(project, root, join("specs", state), true)))),
    specsDir, specsfyDir, designSystemMd,
    interfaceMd: artifact(project, root, "INTERFACE.md"), stackMd: artifact(project, root, ".specsfy/STACK.md"),
  };
}

/** Looks for Specsfy metadata locally, then for shared specs within the same Git checkout. */
export function detectSpecsfy(project: string) {
  const local = inspectSpecs(project, project);
  if (local.specsDir) return local;
  let boundary = resolve(project);
  while (!existsSync(join(boundary, ".git"))) {
    if (dirname(boundary) === boundary) return local;
    boundary = dirname(boundary);
  }
  let root = resolve(project);
  while (root !== boundary) {
    root = dirname(root);
    const parent = inspectSpecs(project, root);
    if (!parent.present) continue;
    local.present = true;
    local.specsfyDir ??= parent.specsfyDir;
    local.designSystemMd ??= parent.designSystemMd;
    local.interfaceMd ??= parent.interfaceMd;
    local.stackMd ??= parent.stackMd;
    local.specsDir = parent.specsDir;
    if (local.specsDir) break;
  }
  return local;
}

/** Returns detected integration paths relative to the requested project directory. */
export function detectIntegrations(project: string): z.infer<typeof integrationsSchema> {
  const sitespecDir = artifact(project, project, ".sitespec", true);
  const astrofyDir = artifact(project, project, ".astrofy", true);
  const dependency = readProjectPackages(project)?.["@promovaweb/astrofy"] ?? null;
  const present = Boolean(sitespecDir || astrofyDir || dependency !== null);
  return {
    astrofy: {
      present, sitespecDir, astrofyDir, dependency,
      designSystemJson: artifact(project, project, ".astrofy/design/design-system.json"),
      generatedTokensCss: present ? artifact(project, project, astrofyTokensPath(project)) : null,
    },
    specsfy: detectSpecsfy(project),
  };
}
