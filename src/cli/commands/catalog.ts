/** Lists, reads, and searches interface fragments from the Designfy catalog. */
import { surfaceInputs } from "../../design/surfaces.ts";
import { ExitCode } from "../../app/exit-codes.ts";
import { manifest } from "../../app/manifest.ts";
import {
  getEntry, interfaceKinds, listEntries, searchEntries,
  type InterfaceEntry, type InterfaceFilters,
} from "../../design/interface-catalog.ts";
import { section, table } from "../format.ts";
import type { Command } from "../registry.ts";

const codes = [ExitCode.CONFIG, ExitCode.NOT_FOUND, ExitCode.PERMISSION];

function listText(entries: InterfaceEntry[]): string {
  if (!entries.length) return "No matching interface entries.";
  return table(entries.map(({ id, name, surface, category }) => [id, `${name} (${surface}, ${category})`]));
}

function entryText(entry: InterfaceEntry): string {
  const rows: [string, string | string[]][] = [
    ["ID", entry.id], ["Surface", entry.surface], ["Category", entry.category], ["Purpose", entry.purpose],
    ["Use when", entry.useWhen], ["Avoid when", entry.avoidWhen], ["Anatomy", entry.anatomy],
    ["Variants", entry.variants], ["States", entry.states], ["Responsive", entry.responsive],
    ["Motion", entry.motion], ["Accessibility", entry.accessibility], ["Tokens", entry.tokens],
    ["Viewspec kinds", entry.kinds], ["Related", entry.related], ["Sources", entry.sources],
  ];
  return `${section(entry.name)}\n${table(rows.map(([name, value]) => [name, Array.isArray(value) ? value.join("; ") : value]))}`;
}

const list: Command = {
  name: "list",
  description: "List interface fragments by surface, category, and viewspec kind.",
  options: [
    { name: "--surface", argument: { name: "surface", values: surfaceInputs }, description: "Filter by site, webapp, or both. The legacy system alias means webapp." },
    { name: "--category", argument: { name: "id" }, description: "Filter by category ID." },
    { name: "--kind", argument: { name: "kind", values: interfaceKinds }, description: "Filter by viewspec kind." },
  ],
  examples: [`${manifest.bin} catalog list --surface site --kind landing-page`],
  exitCodes: codes,
  run: ({ options }) => {
    const entries = listEntries(options as InterfaceFilters);
    return { data: { entries }, text: () => listText(entries) };
  },
};

const show: Command = {
  name: "show",
  description: "Show the full entry for one interface fragment.",
  arguments: [{ name: "id", description: "Interface entry ID.", required: true }],
  examples: [`${manifest.bin} catalog show hero --json`],
  exitCodes: codes,
  run: ({ args }) => {
    const entry = getEntry(args[0]!);
    return { data: entry, text: () => entryText(entry) };
  },
};

const search: Command = {
  name: "search",
  description: "Search interface fragments by name, purpose, use case, or anatomy.",
  arguments: [{ name: "text", description: "Search phrase.", required: true }],
  examples: [`${manifest.bin} catalog search "primary navigation"`],
  exitCodes: codes,
  run: ({ args }) => {
    const entries = searchEntries(args[0]!);
    return { data: { entries }, text: () => listText(entries) };
  },
};

/** Command family for the interface catalog. */
export const catalogCommand: Command = {
  name: "catalog",
  description: "Browse reusable interface fragments for websites and applications.",
  subcommands: [list, show, search],
  examples: [`${manifest.bin} catalog list`],
  exitCodes: codes,
};
