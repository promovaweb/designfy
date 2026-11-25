/** Exposes registry browsing and component copying as CLI subcommands. */
import { ExitCode } from "../../app/exit-codes.ts";
import { manifest } from "../../app/manifest.ts";
import { detectProject, frameworks, resolveProject, type Framework } from "../../design/project.ts";
import { applyAdd, getItem, listItems, planAdd, tailwindRegistryNote, type ItemFilters } from "../../design/registry.ts";
import { blocks, table } from "../format.ts";
import type { Command, OptionDefinition } from "../registry.ts";

const frameworkOption: OptionDefinition = {
  name: "--framework",
  description: "Select astro, next, react-vite, react, or unknown. Defaults to the project framework.",
  argument: { name: "framework", values: frameworks },
};
const codes = [ExitCode.CONFIG, ExitCode.NOT_FOUND, ExitCode.PERMISSION];

const list: Command = {
  name: "list",
  description: "List available components for the selected framework, category and surface.",
  options: [
    frameworkOption,
    { name: "--category", argument: { name: "category" }, description: "Filter by registry category." },
    {
      name: "--surface",
      argument: { name: "surface", values: ["site", "system", "both"] },
      description: "Filter by site, system, or both. Shared items match site and system.",
    },
  ],
  examples: [`${manifest.bin} components list --framework astro`],
  exitCodes: codes,
  run: ({ options, stderr }) => {
    const cwd = process.cwd();
    const framework = (options.framework as Framework | undefined) ?? resolveProject(cwd).framework;
    const warning = tailwindRegistryNote(detectProject(cwd).tailwind);
    if (warning) stderr(`Note: ${warning}`);
    const items = listItems({
      framework,
      category: options.category as string | undefined,
      surface: options.surface as ItemFilters["surface"],
    }).map(({ files, ...item }) => ({ ...item, files: files.map(({ content: _content, ...file }) => file) }));
    return {
      data: { framework, ...(warning ? { warning } : {}), items },
      text: () => items.length ? table(items.map((item) => [item.name, item.description])) : "No components matched.",
    };
  },
};

const show: Command = {
  name: "show",
  description: "Show one component's files and requirements, with optional source.",
  arguments: [{ name: "name", description: "Registry item name.", required: true }],
  options: [
    frameworkOption,
    { name: "--source", description: "Include the source content for each registry file." },
  ],
  examples: [`${manifest.bin} components show cn --framework react --source`],
  exitCodes: codes,
  run: ({ args, options, stderr }) => {
    const cwd = process.cwd();
    const framework = (options.framework as Framework | undefined) ?? resolveProject(cwd).framework;
    const warning = tailwindRegistryNote(detectProject(cwd).tailwind);
    if (warning) stderr(`Note: ${warning}`);
    const item = getItem(args[0]!, framework);
    const files = item.files.map(({ content, ...file }) => options.source ? { ...file, content } : file);
    return {
      data: { framework, ...(warning ? { warning } : {}), item: { ...item, files } },
      text: () => blocks(
        `${item.title}\n${item.description}`,
        table([
          ["Category", item.categories.join(", ") || "None"],
          ["Surface", item.meta.surface],
          ["Motion", item.meta.motion ? "Yes" : "No"],
          ["Files", files.map((file) => file.target).join(", ") || "None"],
          ["Dependencies", item.dependencies.join(", ") || "None"],
          ["Dev dependencies", item.devDependencies.join(", ") || "None"],
          ["Registry dependencies", item.registryDependencies.join(", ") || "None"],
        ]),
        ...(options.source ? item.files.map((file) => `${file.target}\n${file.content}`) : []),
      ),
    };
  },
};

const add: Command = {
  name: "add",
  description: "Copy registry components and their Designfy dependencies into the project.",
  arguments: [{ name: "names", description: "One or more registry item names.", required: true, variadic: true }],
  options: [
    frameworkOption,
    { name: "--path", argument: { name: "dir" }, description: "Copy files under this directory instead of the configured roots." },
    { name: "--overwrite", description: "Replace existing files whose content differs." },
    { name: "--allow-tailwind3", description: "Copy Tailwind 4 registry files into a Tailwind 3 project with a warning." },
    { name: "--dry-run", description: "Report planned file changes without writing them." },
  ],
  examples: [`${manifest.bin} components add cn --framework react --dry-run`],
  exitCodes: [...codes, ExitCode.CHECK_FAILED],
  run: (ctx) => {
    const plan = planAdd(process.cwd(), ctx.args, {
      framework: ctx.options.framework as Framework | undefined,
      path: ctx.options.path as string | undefined,
      overwrite: ctx.options.overwrite === true,
      allowTailwind3: ctx.options["allow-tailwind3"] === true,
    });
    if (plan.warning) ctx.stderr(`Warning: ${plan.warning}`);
    if (!plan.configured) ctx.stderr("Warning: designfy.json is missing. Using the default paths and alias.");
    const data = applyAdd(plan, { dryRun: ctx.options["dry-run"] === true });
    if (data.skipped.length) ctx.stderr("Warning: files with different content were skipped. Use --overwrite to replace them.");
    return {
      data,
      text: () => table([
        [data.dryRun ? "Would write" : "Written", data.written.join("\n") || "None"],
        ["Unchanged", data.unchanged.join("\n") || "None"],
        ["Skipped", data.skipped.join("\n") || "None"],
        ["Missing npm packages", data.missingDependencies.join(", ") || "None"],
        ["Missing dev packages", data.missingDevDependencies.join(", ") || "None"],
        ["Install shadcn items", data.shadcnItems.length ? `npx shadcn@latest add ${data.shadcnItems.join(" ")}` : "None"],
      ]),
    };
  },
};

/** Command group for listing, showing and copying registry items. */
export const componentsCommand: Command = {
  name: "components",
  description: "Browse and copy Designfy registry components.",
  examples: [`${manifest.bin} components list`],
  exitCodes: add.exitCodes,
  subcommands: [list, show, add],
};
