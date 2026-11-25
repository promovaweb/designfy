/**
 * Root of the command registry.
 *
 * Imports each command from `commands/` and builds the tree. To add a new
 * command, import it and append it to `subcommands`. The order defines the
 * display order in `--help` and in the OpenCLI description.
 */
import { manifest } from "../app/manifest.ts";
import { aboutCommand } from "./commands/about.ts";
import { configCommand } from "./commands/config.ts";
import { credentialsCommand } from "./commands/credentials.ts";
import { mcpCommand } from "./commands/mcp.ts";
import { createSkillCommand } from "./commands/skill.ts";
import { tuiCommand } from "./commands/tui.ts";
import { doctorCommand } from "./commands/doctor.ts";
import { createCompletionCommand } from "./commands/completion.ts";
import { initCommand } from "./commands/init.ts";
import { statusCommand } from "./commands/status.ts";
import { skillsCommand } from "./commands/skills.ts";
import { depsCommand } from "./commands/deps.ts";
import { componentsCommand } from "./commands/components.ts";
import { catalogCommand } from "./commands/catalog.ts";
import { themeCommand } from "./commands/theme.ts";
import { paletteCommand } from "./commands/palette.ts";
import { captureCommand } from "./commands/capture.ts";
import { viewspecCommand } from "./commands/viewspec.ts";
import type { Command } from "./registry.ts";

export const root: Command = {
  name: manifest.bin,
  description: manifest.description,
  subcommands: [
    initCommand,
    statusCommand,
    skillsCommand,
    depsCommand,
    catalogCommand,
    componentsCommand,
    themeCommand,
    paletteCommand,
    viewspecCommand,
    captureCommand,
    tuiCommand,
    aboutCommand,
    configCommand,
    credentialsCommand,
    mcpCommand,
    createSkillCommand(() => root),
    doctorCommand,
    createCompletionCommand(() => root),
  ],
  examples: [
    `${manifest.bin}`,
    `${manifest.bin} init`,
    `${manifest.bin} skills install`,
    `${manifest.bin} catalog list --kind dashboard`,
    `${manifest.bin} components add cn --framework react --dry-run`,
    `${manifest.bin} theme show`,
    `${manifest.bin} capture run http://localhost:4321/ --viewport mobile,desktop`,
    `${manifest.bin} viewspec list --json`,
    `${manifest.bin} mcp`,
    `${manifest.bin} --skill`,
  ],
};
