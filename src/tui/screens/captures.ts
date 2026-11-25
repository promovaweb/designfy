/** Reviews capture runs, screenshot diagnostics, and local screenshot paths. */
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { getPath, readSettings } from "../../config/settings.ts";
import { paths } from "../../config/paths.ts";
import { listCaptures, type CaptureManifest } from "../../design/capture.ts";
import { projectScreen, shortcut } from "./project-screen.ts";

type Shot = CaptureManifest["shots"][number];
type CaptureRow = CaptureManifest & { id: string; sizes: Map<string, number> };

function shotPath(run: CaptureManifest, shot: Shot): string | undefined {
  return shot.file ? resolve(run.outDir, shot.file) : undefined;
}

/** Creates the capture history and clipboard actions. */
export function createCapturesScreen() {
  const selectedShots = new Map<string, number>();
  return projectScreen<CaptureRow>({
    id: "captures", title: "Captures", icon: "terminal", description: "Review screenshots and console errors from past runs",
    empty: "No capture runs", emptyHint: "designfy capture run <url>", listTitle: "Capture runs",
    watch(cwd) {
      const files = [paths.settings()];
      try {
        const output = getPath(readSettings(), "capture.outDir");
        if (typeof output === "string") files.push(resolve(cwd, output));
      } catch { /* The load reports invalid settings. */ }
      return files;
    },
    async load(cwd) {
      return Promise.all(listCaptures(cwd).map(async (run) => {
        const sizes = new Map<string, number>();
        for (const shot of run.shots) {
          const file = shotPath(run, shot);
          if (!file) continue;
          const info = await stat(file).catch(() => undefined);
          if (info) sizes.set(file, info.size);
        }
        return { ...run, id: run.outDir, sizes };
      }));
    },
    label: (run) => ({ content: run.name, detail: `${run.createdAt.slice(0, 10)} · ${run.shots.length} shots`,
      state: run.errors.length || run.shots.some((shot) => shot.overflowX || shot.error) ? "error" : "ok" }),
    detail(run, view) {
      view.heading(run.name);
      view.field("Created", run.createdAt);
      view.section("URLs", run.urls);
      view.section("Viewports", run.viewports.map(({ name, width, height }) => `${name} ${width}×${height}`));
      const current = selectedShots.get(run.id) ?? 0;
      for (const [index, shot] of run.shots.entries()) {
        view.heading(`${index === current ? "> " : ""}${shot.viewport} · ${shot.url}`);
        const file = shotPath(run, shot);
        view.text(file ?? "No screenshot file");
        const size = file ? run.sizes.get(file) : undefined;
        if (size !== undefined) view.field("File size", `${size.toLocaleString("en-US")} bytes`);
        if (shot.documentWidth && shot.documentHeight) view.text(`Document size: ${shot.documentWidth}×${shot.documentHeight}`);
        view.tag(shot.overflowX ? "error" : shot.overflowX === false ? "ok" : "available", `overflowX: ${shot.overflowX ?? "unknown"}`, shot.overflowX === true);
        if (shot.consoleErrors.length) view.section("Console errors", shot.consoleErrors);
        if (shot.pageErrors.length) view.section("Page errors", shot.pageErrors);
        if (shot.error) view.text(shot.error, view.ctx.theme.error);
      }
      if (run.errors.length) view.section("Run errors", run.errors.map(({ error }) => error));
    },
    actions: [
      shortcut("return", "select screenshot", async (view) => {
        const run = view.selected;
        if (!run?.shots.length) return;
        const index = await view.ctx.choose({
          title: "Select a screenshot",
          items: run.shots.map((shot) => `${shot.viewport} · ${shot.file ?? shot.url}`),
          initial: selectedShots.get(run.id),
        });
        if (index === undefined) return;
        selectedShots.set(run.id, index);
        view.report({ summary: "Selected screenshot", lines: [shotPath(run, run.shots[index]!) ?? "No screenshot file"] });
      }, "Enter"),
      shortcut("o", "copy screenshot path", (view) => {
        const run = view.selected;
        const shot = run?.shots[selectedShots.get(run.id) ?? 0];
        const path = run && shot ? shotPath(run, shot) : undefined;
        if (!path) { view.ctx.notify("No screenshot file selected", "warn"); return; }
        const copied = view.ctx.renderer.copyToClipboardOSC52(path);
        view.ctx.notify(copied ? "Screenshot path copied" : "Clipboard unavailable (OSC 52)", copied ? "ok" : "warn");
      }),
    ],
  });
}
