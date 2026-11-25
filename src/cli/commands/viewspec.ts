/** Exposes the read-only project guide and screen viewspec commands. */
import { error } from "../../app/errors.ts";
import { ExitCode } from "../../app/exit-codes.ts";
import { manifest } from "../../app/manifest.ts";
import {
  listViewspecSummaries, readGuide, readViewspec, readViewspecProgress, validateProjectViewspecs,
  viewKinds, viewStatuses, type Viewspec, type ViewKind, type ViewspecError, type ViewStatus,
} from "../../design/viewspec.ts";
import { blocks, section, table } from "../format.ts";
import type { Command } from "../registry.ts";

const projectCodes = [ExitCode.CONFIG, ExitCode.PERMISSION, ExitCode.CHECK_FAILED] as const;
const fileCodes = [...projectCodes, ExitCode.NOT_FOUND];
const idArgument = { name: "id", description: "Four-digit viewspec id, including leading zeros." };

function checkedId(id: string): string {
  if (!/^[0-9]{4}$/.test(id)) throw error.usage("Provide a four-digit viewspec id, such as 0002.");
  return id;
}

function diagnostics(errors: ViewspecError[]): string {
  return errors.map(({ file, line, field, message }) =>
    [line ? file + ":" + line : file, field ? "[" + field + "]" : "", message].filter(Boolean).join(" ")
  ).join("\n");
}

function linkText(link: NonNullable<Viewspec["frontMatter"]["trackedBy"]>[number]): string {
  return link.system + " " + link.id + " (" + link.path + ")";
}

function frontMatterText(frontMatter: object | null): string {
  return frontMatter ? table(Object.entries(frontMatter).map(([key, value]) => [
    key, Array.isArray(value) ? (key === "trackedBy" ? value.map(linkText) : value).join(", ") : String(value),
  ])) : "";
}

const guide: Command = {
  name: "guide",
  description: "Read the project guide, its rules by section and origin, and pending proposals.",
  examples: [manifest.bin + " viewspec guide", manifest.bin + " viewspec guide --json"],
  exitCodes: fileCodes,
  run: () => {
    const data = readGuide(process.cwd());
    if (!data.exists) throw error.notFound("Project guide VIEWSPEC.md is missing from the project root.", { file: data.file });
    return {
      data,
      code: data.errors.length ? ExitCode.CHECK_FAILED : ExitCode.SUCCESS,
      text: () => blocks(
        frontMatterText(data.frontMatter),
        section("Sections and rules"),
        table(data.sections.map(({ title }) => [title, String(data.bySection[title as keyof typeof data.bySection] ?? 0)])),
        section("Rules by origin"),
        table(Object.entries(data.byOrigin).map(([origin, count]) => [origin, String(count)])),
        section("Pending proposals"),
        data.pendingProposals.map(({ date, origin, text }) => [date, origin, text].join(" ")).join("\n") || "No pending proposals.",
        diagnostics(data.errors),
      ),
    };
  },
};

const list: Command = {
  name: "list",
  description: "List screen viewspecs and show their checklist progress.",
  options: [
    { name: "--status", argument: { name: "status", values: viewStatuses }, description: "Filter by status. By default, include every status." },
    { name: "--kind", argument: { name: "kind", values: viewKinds }, description: "Filter by screen kind. By default, include every kind." },
  ],
  examples: [manifest.bin + " viewspec list", manifest.bin + " viewspec list --status in_progress --kind dashboard --json"],
  exitCodes: projectCodes,
  run: (ctx) => {
    const data = listViewspecSummaries(process.cwd(), {
      status: ctx.options.status as ViewStatus | undefined,
      kind: ctx.options.kind as ViewKind | undefined,
    });
    return {
      data,
      code: data.errors.length ? ExitCode.CHECK_FAILED : ExitCode.SUCCESS,
      text: () => blocks(
        data.items.length ? table(
          data.items.map(({ id, title, kind, status, progress, trackedBy }) => [
            id, [title, kind, status, progress.done + "/" + progress.total, ...(trackedBy ?? []).map(linkText)].join("  |  "),
          ]),
        ) : "No matching screen viewspecs.",
        diagnostics(data.errors),
      ),
    };
  },
};

const show: Command = {
  name: "show",
  description: "Read the front matter, sections, and checklist of one screen viewspec.",
  arguments: [{ ...idArgument, required: true }],
  examples: [manifest.bin + " viewspec show 0002", manifest.bin + " viewspec show 0002 --json"],
  exitCodes: fileCodes,
  run: (ctx) => {
    const id = checkedId(ctx.args[0]!);
    const { item, errors, found } = readViewspec(process.cwd(), id);
    if (!found && !errors.length) throw error.notFound('No screen viewspec uses id "' + id + '".', { id });
    return {
      data: { item, errors },
      code: errors.length ? ExitCode.CHECK_FAILED : ExitCode.SUCCESS,
      text: () => item ? blocks(
        frontMatterText(item.frontMatter),
        ...item.sections.map(({ title, text }) => "## " + title + "\n" + text.trimEnd()),
      ) : diagnostics(errors),
    };
  },
};

const progress: Command = {
  name: "progress",
  description: "Summarize screen viewspec counts, checklist progress, and the first available id.",
  examples: [manifest.bin + " viewspec progress", manifest.bin + " viewspec progress --json"],
  exitCodes: projectCodes,
  run: () => {
    const data = readViewspecProgress(process.cwd());
    return {
      data,
      code: data.errors.length ? ExitCode.CHECK_FAILED : ExitCode.SUCCESS,
      text: () => blocks(table([
        ...viewStatuses.map((status): [string, string] => [status, String(data.byStatus[status])]),
        ["Checklist", data.done + "/" + data.total],
        ["Next id", data.nextId ?? "none available"],
      ]), diagnostics(data.errors)),
    };
  },
};

const validate: Command = {
  name: "validate",
  description: "Check screen viewspecs and the project guide against their contract.",
  arguments: [{ ...idArgument, description: idArgument.description + " With no id, check every screen." }],
  examples: [manifest.bin + " viewspec validate", manifest.bin + " viewspec validate 0002 --json"],
  exitCodes: projectCodes,
  run: (ctx) => {
    const id = ctx.args[0] === undefined ? undefined : checkedId(ctx.args[0]);
    const data = validateProjectViewspecs(process.cwd(), id);
    if (data.guide === "missing") ctx.stderr("guide: missing");
    return {
      data,
      code: data.valid ? ExitCode.SUCCESS : ExitCode.CHECK_FAILED,
      text: () => data.valid ? "Viewspec validation passed." : diagnostics(data.errors),
    };
  },
};

export const viewspecCommand: Command = {
  name: "viewspec",
  description: "Read and validate screen viewspecs and the project interface guide.",
  subcommands: [guide, list, show, progress, validate],
  examples: [manifest.bin + " viewspec list", manifest.bin + " viewspec validate --json"],
  exitCodes: fileCodes,
};
