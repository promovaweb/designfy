/** Reads the project guide and screen viewspecs with checklist progress. */
import { join } from "node:path";
import { barChart, meter } from "../components.ts";
import { readGuide, readViewspecProgress, readViewspecs, viewStatuses, type ProjectGuide, type Viewspec } from "../../design/viewspec.ts";
import { projectScreen, shortcut } from "./project-screen.ts";

type GuideRow = { id: string; type: "guide"; document: ProjectGuide };
type ScreenRow = { id: string; type: "screen"; document: Viewspec };
type ViewspecRow = GuideRow | ScreenRow;

function guideSummary(guide: ProjectGuide): string {
  if (!guide.exists) return "No VIEWSPEC.md guide";
  const origins = Object.entries(guide.byOrigin).map(([origin, count]) => `${origin}: ${count}`);
  return `${guide.frontMatter?.name ?? "Project guide"} · Rules: ${origins.join(", ")} · ${guide.pendingProposals.length} pending proposals`;
}

/** Creates a read-only view of the guide and screen viewspecs. */
export function createViewspecsScreen() {
  let guide: ProjectGuide | undefined;
  let mode: "guide" | "screens" = "screens";
  let filter = 0;
  let progressTotals: ReturnType<typeof readViewspecProgress> | undefined;
  let validation: ReturnType<typeof readViewspecs>["errors"] = [];

  return projectScreen<ViewspecRow>({
    id: "viewspecs", title: "Viewspecs", icon: "docs", description: "Read the project guide, viewspecs and checklist progress",
    listTitle: "Viewspecs", empty: "No viewspecs in this view",
    watch: (cwd) => [join(cwd, "VIEWSPEC.md"), join(cwd, "viewspec")],
    summary: () => [guide ? guideSummary(guide) : "", `${mode}${mode === "screens" ? ` · Status: ${viewStatuses[filter - 1] ?? "all"}` : ""}`,
      validation.length ? `${validation.length} validation messages` : ""].filter(Boolean).join("\n"),
    load(cwd) {
      guide = readGuide(cwd);
      progressTotals = readViewspecProgress(cwd);
      if (mode === "guide") {
        validation = guide.errors;
        return guide.exists ? [{ id: "guide", type: "guide", document: guide }] : [];
      }
      const { items, errors } = readViewspecs(cwd, { status: viewStatuses[filter - 1] });
      validation = [...guide.errors, ...errors];
      if (!items.length && errors.length) throw new Error(errors.map(({ file, line, message }) => `${file}${line ? `:${line}` : ""}: ${message}`).join("\n"));
      return items.map((document) => ({ id: document.frontMatter.id, type: "screen", document }));
    },
    label(row) {
      if (row.type === "guide") return { content: row.document.frontMatter?.name ?? "VIEWSPEC.md",
        detail: `${row.document.rules.length} rules`, state: "ok" };
      const { frontMatter, progress } = row.document;
      const state = frontMatter.status === "done" ? "ok" : frontMatter.status === "in_progress" ? "working"
        : frontMatter.status === "blocked" ? "pending" : "available";
      return { content: `${row.id} ${frontMatter.title}`, detail: `${frontMatter.kind} · ${progress.done}/${progress.total} checks`,
        group: frontMatter.status, state, stateLabel: frontMatter.status.replaceAll("_", " ") };
    },
    detail(row, view) {
      const { renderer, theme } = view.ctx;
      if (row.type === "guide") {
        view.heading(row.document.frontMatter?.name ?? "Project guide");
        view.field("Rules", String(row.document.rules.length));
        view.field("Proposals", String(row.document.pendingProposals.length));
        for (const section of row.document.sections) view.section(section.title, section.text.trim());
        if (row.document.pendingProposals.length) view.section("Pending proposals", row.document.pendingProposals.map(({ text }) => text));
      } else {
        const { frontMatter, progress, sections, checklist } = row.document;
        view.heading(`${row.id} ${frontMatter.title}`);
        view.field("Kind", frontMatter.kind);
        view.field("Status", frontMatter.status);
        view.add(meter(renderer, theme, progress.done, progress.total, { label: "Checklist" }));
        if (progressTotals && !view.ctx.short?.()) {
          view.heading("By status");
          view.add(barChart(renderer, theme, Object.entries(progressTotals.byStatus).map(([name, count]) => [name.replaceAll("_", " "), count]), 12));
        }
        view.section("Checklist", checklist.map(({ id, text, done }) => `[${done ? "x" : " "}] ${id} ${text}`));
        for (const section of sections) view.section(section.title, section.text.trim());
      }
      if (validation.length) view.section("Validation", validation.map(({ file, line, message }) => `${file}${line ? `:${line}` : ""}: ${message}`));
    },
    actions: [
      shortcut("return", "read full file", (view) => {
        const file = view.selected?.document.file;
        if (file) return view.read(file, () => Bun.file(file).text());
      }, "Enter"),
      shortcut("s", "next status", (view) => { filter = (filter + 1) % (viewStatuses.length + 1); return view.reload(); }),
      shortcut("v", "guide / screens", (view) => { mode = mode === "guide" ? "screens" : "guide"; return view.reload(); }),
    ],
  });
}
