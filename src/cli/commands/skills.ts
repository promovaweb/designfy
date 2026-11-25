/** Defines the skills list, install, update and remove commands. */
import { manifest } from "../../app/manifest.ts";
import { ExitCode } from "../../app/exit-codes.ts";
import {
  executeSkillPlan,
  listSkills,
  planSkillInstall,
  planSkillRemove,
  planSkillUpdate,
} from "../../design/skills.ts";
import { table } from "../format.ts";
import type { Command, OptionDefinition } from "../registry.ts";

const kindOptions: readonly OptionDefinition[] = [
  { name: "--internal", description: "Include internal Designfy skills." },
  { name: "--external", description: "Include external skills." },
];
const globalOption = { name: "--global", description: "Use the global skill scope instead of the project." };
const readCodes = [ExitCode.CONFIG, ExitCode.NOT_FOUND, ExitCode.PERMISSION] as const;
const installCodes = [...readCodes, ExitCode.NETWORK_OR_API];

const list: Command = {
  name: "list",
  description: "List catalog skills and their project or global installation state.",
  options: kindOptions,
  examples: [`${manifest.bin} skills list --internal`, `${manifest.bin} skills list --json`],
  exitCodes: readCodes,
  run: ({ options }) => {
    const skills = listSkills(process.cwd(), { internal: options.internal === true, external: options.external === true });
    return {
      data: { skills },
      text: () => skills.length ? table(skills.map((skill) => [skill.name, `${skill.title} (${skill.kind}, ${skill.installed})`])) : "No skills matched.",
    };
  },
};

const install: Command = {
  name: "install",
  description: "Install named skills or the default skills for this project.",
  arguments: [{ name: "names", description: "Catalog skill names. Omit to use compatible defaults.", variadic: true }],
  options: [
    ...kindOptions,
    { name: "--all", description: "Include all catalog skills across frameworks when names are omitted." },
    {
      name: "--agent",
      argument: { name: "agents" },
      description: "Comma-separated agent names. Overrides skills.agents.",
    },
    globalOption,
    { name: "--dry-run", description: "Print the planned commands without invoking the Skills CLI." },
  ],
  examples: [`${manifest.bin} skills install`, `${manifest.bin} skills install astrofy --agent codex --dry-run`],
  exitCodes: installCodes,
  run: async ({ args, options }) => {
    const cwd = process.cwd();
    const dryRun = options["dry-run"] === true;
    const agents = typeof options.agent === "string" ? options.agent.split(",").map((agent) => agent.trim()).filter(Boolean) : undefined;
    const commands = planSkillInstall(cwd, {
      names: args,
      agents,
      all: options.all === true,
      internal: options.internal === true,
      external: options.external === true,
      global: options.global === true,
    });
    if (!dryRun) await executeSkillPlan(cwd, commands);
    return {
      data: { commands, dryRun },
      text: () => commands.length
        ? (dryRun ? formatProcessPlan(commands) : "Skill installation completed.")
        : "No skills matched.",
    };
  },
};

const update: Command = {
  name: "update",
  description: "Update installed skills in the selected scope.",
  arguments: [{ name: "names", description: "Installed skill names. Omit to update all in the selected scope.", variadic: true }],
  options: [globalOption],
  examples: [`${manifest.bin} skills update`, `${manifest.bin} skills update designfy --global`],
  exitCodes: [ExitCode.NETWORK_OR_API],
  run: async ({ args, options }) => {
    const commands = planSkillUpdate(args, options.global === true);
    await executeSkillPlan(process.cwd(), commands);
    return { data: { commands }, text: "Skill update completed." };
  },
};

const remove: Command = {
  name: "remove",
  description: "Remove named skills from the project.",
  arguments: [{ name: "names", description: "Installed project skill names to remove.", required: true, variadic: true }],
  examples: [`${manifest.bin} skills remove designfy-motion`],
  exitCodes: [ExitCode.NETWORK_OR_API],
  run: async ({ args }) => {
    const commands = planSkillRemove(args);
    await executeSkillPlan(process.cwd(), commands);
    return { data: { commands }, text: "Skill removal completed." };
  },
};

export const skillsCommand: Command = {
  name: "skills",
  description: "List, install, update or remove Designfy catalog skills.",
  subcommands: [list, install, update, remove],
  examples: [`${manifest.bin} skills list`],
  exitCodes: installCodes,
};

/** Formats planned argument vectors as copyable shell commands. */
export function formatProcessPlan(commands: readonly { command: string; args: string[] }[]): string {
  const quote = (value: string) => /^[\w@/.:+=,-]+$/.test(value) ? value : "'" + value.replaceAll("'", "'\"'\"'") + "'";
  return commands.map(({ command, args }) => [command, ...args].map(quote).join(" ")).join("\n");
}
