/** Defines the dependency list, check and install commands. */
import { error } from "../../app/errors.ts";
import { ExitCode } from "../../app/exit-codes.ts";
import { manifest } from "../../app/manifest.ts";
import { checkDependencies, executeDependencyPlan, listDependencies, planDependencyInstall } from "../../design/deps.ts";
import { packageManagers } from "../../design/project.ts";
import { table } from "../format.ts";
import type { Command, OptionDefinition } from "../registry.ts";
import { formatProcessPlan } from "./skills.ts";

const readCodes = [ExitCode.CONFIG, ExitCode.NOT_FOUND, ExitCode.PERMISSION] as const;
const groupOption: OptionDefinition = {
  name: "--group",
  argument: { name: "id" },
  description: "Limit the operation to this dependency group ID.",
};

const list: Command = {
  name: "list",
  description: "List the catalog version and installation state of suggested packages.",
  options: [groupOption],
  examples: [`${manifest.bin} deps list --group motion`, `${manifest.bin} deps list --json`],
  exitCodes: readCodes,
  run: ({ options }) => {
    const groups = listDependencies(process.cwd(), typeof options.group === "string" ? options.group : undefined);
    return {
      data: { groups },
      text: () => {
        const rows = groups.flatMap((group) => group.packages.map((pkg): [string, string] => [
          `${group.id} / ${pkg.name}`, `${pkg.version}  ${pkg.state}  ${pkg.installed ?? "—"}`,
        ]));
        return rows.length ? table(rows) : "No dependencies matched.";
      },
    };
  },
};

const check: Command = {
  name: "check",
  description: "Check the selected dependency group or the project's recommended defaults, plus copied component requirements.",
  options: [groupOption],
  examples: [`${manifest.bin} deps check`, `${manifest.bin} deps check --group motion --json`],
  exitCodes: [...readCodes, ExitCode.CHECK_FAILED],
  run: ({ options }) => {
    const data = checkDependencies(process.cwd(), typeof options.group === "string" ? options.group : undefined);
    if (!data.ok) {
      const problems = [
        data.missing.length ? `Missing: ${data.missing.join(", ")}.` : "",
        data.outdated.length ? `Outdated: ${data.outdated.join(", ")}.` : "",
      ].filter(Boolean);
      throw error.checkFailed(problems.join(" "), { ...data });
    }
    return { data, text: "Dependency check passed." };
  },
};

const install: Command = {
  name: "install",
  description: "Install named groups or packages, or the missing compatible defaults.",
  arguments: [{ name: "groups-or-packages", description: "Catalog group IDs or package names.", variadic: true }],
  options: [
    {
      name: "--pm",
      argument: { name: "manager", values: packageManagers },
      description: "Force npm, pnpm, bun or yarn instead of the configured package manager.",
    },
    { name: "--dry-run", description: "Print the planned commands without running the package manager." },
  ],
  examples: [`${manifest.bin} deps install`, `${manifest.bin} deps install motion --pm bun --dry-run`],
  exitCodes: [...readCodes, ExitCode.NETWORK_OR_API],
  run: async ({ args, options }) => {
    const cwd = process.cwd();
    const dryRun = options["dry-run"] === true;
    const packageManager = packageManagers.find((manager) => manager === options.pm);
    if (options.pm !== undefined && !packageManager) throw error.usage("Unknown package manager.");
    const commands = planDependencyInstall(cwd, { names: args, packageManager });
    if (!dryRun) await executeDependencyPlan(cwd, commands);
    return {
      data: { commands, dryRun },
      text: () => commands.length
        ? (dryRun ? formatProcessPlan(commands) : "Dependency installation completed.")
        : "No dependencies to install.",
    };
  },
};

export const depsCommand: Command = {
  name: "deps",
  description: "List, check or install the packages in the dependency catalog.",
  subcommands: [list, check, install],
  examples: [`${manifest.bin} deps list`],
  exitCodes: [...readCodes, ExitCode.CHECK_FAILED, ExitCode.NETWORK_OR_API],
};
