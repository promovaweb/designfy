/** Implements project detection and the init command's write and preview modes. */
import { lstatSync } from "node:fs";
import { join } from "node:path";
import { classifyFsError, error } from "../../app/errors.ts";
import { ExitCode } from "../../app/exit-codes.ts";
import { manifest } from "../../app/manifest.ts";
import {
  defaultProjectConfig,
  detectProject,
  frameworks,
  writeProjectConfig,
} from "../../design/project.ts";
import type { Command } from "../registry.ts";

export const initCommand: Command = {
  name: "init",
  description: "Detect the web project and write designfy.json in its root.",
  options: [
    { name: "--force", description: "Overwrite an existing designfy.json." },
    { name: "--dry-run", description: "Print the proposed designfy.json without writing it." },
    {
      name: "--components-path",
      argument: { name: "path" },
      default: "src/components/designfy",
      description: "Set the project path for Designfy components.",
    },
    {
      name: "--styles-path",
      argument: { name: "path" },
      default: "src/styles",
      description: "Set the project path for styles.",
    },
    {
      name: "--framework",
      argument: { name: "framework", values: frameworks },
      description: "Override the detected framework (astro, next, react-vite, react or unknown).",
    },
  ],
  examples: [`${manifest.bin} init`, `${manifest.bin} init --framework astro --dry-run`],
  exitCodes: [ExitCode.CONFIG, ExitCode.NOT_FOUND, ExitCode.PERMISSION],
  run: ({ options }) => {
    const cwd = process.cwd();
    const config = defaultProjectConfig(detectProject(cwd, { requirePackage: true }));

    const path = join(cwd, "designfy.json");
    const dryRun = options["dry-run"] === true;
    const force = options.force === true;
    if (!force && dryRun) {
      try {
        lstatSync(path);
        throw error.usage("designfy.json already exists. Use --force to overwrite it.", { path });
      } catch (cause) {
        if ((cause as NodeJS.ErrnoException).code !== "ENOENT") {
          throw classifyFsError(cause, ExitCode.CONFIG, `Failed to inspect ${path}`);
        }
      }
    }

    if (typeof options["components-path"] === "string") config.paths.components = options["components-path"];
    if (typeof options["styles-path"] === "string") config.paths.styles = options["styles-path"];
    if (!config.paths.components.trim() || !config.paths.styles.trim()) throw error.usage("Project paths cannot be empty.");
    if (options.framework !== undefined) {
      const framework = frameworks.find((value) => value === options.framework);
      if (!framework) throw error.usage("Unknown framework.");
      config.framework = framework;
    }

    if (!dryRun) writeProjectConfig(cwd, config, { exclusive: !force });
    return {
      data: { path, config, dryRun },
      text: () => dryRun ? JSON.stringify(config, null, 2) : `Wrote ${path} (${config.framework}).`,
    };
  },
};
