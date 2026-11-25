/** Shows the project, Designfy installation state, and suggested next steps. */
import { BoxRenderable, ScrollBoxRenderable } from "@opentui/core";
import { join, relative } from "node:path";
import { AppError } from "../../app/errors.ts";
import { ExitCode } from "../../app/exit-codes.ts";
import { listDependencies } from "../../design/deps.ts";
import { detectProject, readProjectConfig, resolveProject } from "../../design/project.ts";
import { countCopiedComponents } from "../../design/registry.ts";
import { listSkills } from "../../design/skills.ts";
import { findThemeFile } from "../../design/theme.ts";
import { readGuide, readViewspecProgress } from "../../design/viewspec.ts";
import { manifest } from "../../app/manifest.ts";
import { paths, exists } from "../../config/paths.ts";
import { vaultStatus } from "../../config/credentials.ts";
import {
  scrollPanel,
  panel,
  thinScrollbar,
  heading,
  list,
  dim,
  keyValueTable,
  button,
  stateView,

} from "../components.ts";
import { controlSpacing, SHORT_HEIGHT } from "../spacing.ts";
import { glyphs } from "../theme.ts";
import type { CliRenderer } from "@opentui/core";
import type { Screen, ScreenAction, ScreenContext } from "../screen.ts";

/** MCP client configuration suggested to agents. */
export function mcpClientConfig(): string {
  return `{ "command": "${manifest.bin}", "args": ["mcp"] }`;
}

/** Copies the public MCP command configuration through OSC 52. */
function copyMcpConfig(ctx: ScreenContext): void {
  let copied = false;
  try {
    copied = ctx.renderer.copyToClipboardOSC52(mcpClientConfig());
  } catch (error) {
    ctx.notify(
      error instanceof Error
        ? `OSC 52: ${error.message}`
        : "Clipboard unavailable (OSC 52)",
      "error",
    );
    return;
  }
  if (copied) ctx.notify("MCP config copied", "ok");
  else ctx.notify("This terminal does not accept clipboard writes (OSC 52)", "warn");
}

/** Refreshes data from disk and reports completion as a toast. */
function reload(ctx: ScreenContext): void {
  ctx.refresh();
  ctx.notify("Reloaded", "ok");
}

const actions: ScreenAction[] = [
  { keys: ["r"], description: "reload", icon: "refresh", run: reload },
  { keys: ["c"], description: "copy MCP config", icon: "copy", run: copyMcpConfig },
];

function projectSummary(cwd: string) {
  const project = detectProject(cwd);
  const configured = readProjectConfig(cwd) !== null;
  const framework = resolveProject(cwd).framework;
  let themeFile: string | undefined;
  try {
    themeFile = findThemeFile(cwd);
  } catch (error) {
    if (!(error instanceof AppError) || error.code !== ExitCode.NOT_FOUND) throw error;
  }
  const guide = readGuide(cwd);
  const skills = listSkills(cwd);
  const installed = skills.filter(({ installed }) => installed !== "no").length;
  const missing = new Set(listDependencies(cwd)
    .filter((group) => group.default && (!group.frameworks.length || group.frameworks.includes(framework)))
    .flatMap(({ packages }) => packages.filter(({ state }) => state === "missing").map(({ name }) => name))).size;
  const components = countCopiedComponents(cwd);
  const views = readViewspecProgress(cwd);
  const next = [
    !configured || project.framework === "unknown" ? "designfy init" : undefined,
    missing ? "designfy deps install" : undefined,
    !themeFile ? "designfy components add designfy-theme" : undefined,
    !guide.exists ? "Create the VIEWSPEC.md guide with the designfy skill" : undefined,
    !installed ? "designfy skills install" : undefined,
  ].filter((step): step is string => Boolean(step));
  return { project, themeFile, guide, installed, catalog: skills.length, missing, components, views, next };
}

function projectLayout(ctx: ScreenContext) {
  return { compact: ctx.layout() === "compact", tall: !(ctx.short?.() ?? ctx.renderer.height < SHORT_HEIGHT) };
}

const overviewLoads = new WeakMap<CliRenderer, { start: () => void; stop: () => void }>();

export const projectOverviewScreen: Screen = {
  id: "project",
  title: "Project",
  icon: "overview",
  description: "Detected project, installation status, and next steps",
  actions,
  watch: () => [
    paths.settings(), paths.credentials(), paths.masterKey(),
    ...["package.json", "components.json", "designfy.json", "skills-lock.json", "VIEWSPEC.md", "viewspec"].map((file) => join(process.cwd(), file)),
  ],
  onEnter: ({ renderer }) => overviewLoads.get(renderer)?.start(),
  onLeave: ({ renderer }) => overviewLoads.get(renderer)?.stop(),
  mount(ctx) {
    const { renderer, theme, space } = ctx;
    const { compact, tall } = projectLayout(ctx);
    const root = new BoxRenderable(renderer, { flexDirection: "column", flexGrow: 1, gap: space.gapY, minHeight: 0 });
    const row = new BoxRenderable(renderer, {
      flexDirection: "row", gap: space.gapX, height: compact ? 6 : tall ? 11 : 8, flexShrink: 0,
    });
    const project = scrollPanel(renderer, theme, { title: "Project environment", focusKey: "Tab", flexGrow: 1, active: true });
    const state = scrollPanel(renderer, theme, { title: "Designfy state", focusKey: "Tab", flexGrow: 1 });
    row.add(project);
    row.add(state);
    root.add(row);

    const vault = vaultStatus();
    const settings = exists(paths.settings()) ? "saved" : "defaults";
    ctx.status(`${vault.count} credential${vault.count === 1 ? "" : "s"} · ${settings}`);

    const next = panel(renderer, theme, { title: "Next steps", height: compact ? 7 : 12, flexGrow: 0 });
    next.flexShrink = 1;
    const reading = new ScrollBoxRenderable(renderer, {
      flexGrow: 1, minHeight: 0, scrollY: true, scrollX: false,
      contentOptions: { flexDirection: "column" },
      scrollbarOptions: { trackOptions: { backgroundColor: theme.border, foregroundColor: theme.textDim } },
    });
    const columns = new BoxRenderable(renderer, {
      flexDirection: compact ? "column" : "row", gap: compact ? space.gapY : space.gapX, flexShrink: 0,
    });
    const terminal = new BoxRenderable(renderer, { flexDirection: "column", flexGrow: 1, flexBasis: 0, minWidth: 0 });
    if (!compact && tall) terminal.add(heading(renderer, theme, "IN THE TERMINAL"));
    terminal.add(list(renderer, theme, [`${manifest.bin} --help`, `${manifest.bin} credentials set <name>`, `${manifest.bin} --skill`], glyphs.arrow));
    columns.add(terminal);
    if (!compact) {
      const agents = new BoxRenderable(renderer, { flexDirection: "column", flexGrow: 1, flexBasis: 0, minWidth: 0 });
      if (tall) agents.add(heading(renderer, theme, "FOR AGENTS"));
      agents.add(dim(renderer, theme, `{ "command": "${manifest.bin}",
  "args": ["mcp"] }`));
      columns.add(agents);
    }
    reading.add(columns);
    next.add(reading);
    const updateReadingFocus = () => {
      if (!renderer.isDestroyed && !next.body.isDestroyed) next.appearance(theme, "Tab · Next steps", reading.focused);
    };
    reading.on("focused", updateReadingFocus);
    reading.on("blurred", updateReadingFocus);
    updateReadingFocus();
    const controls = new BoxRenderable(renderer, {
      flexDirection: "row", gap: compact ? controlSpacing.gap : space.gapX, flexShrink: 0,
      height: 1, marginTop: tall ? space.gapY : 0,
    });
    controls.add(button(renderer, theme, { key: "c", label: "copy MCP config", onPress: () => copyMcpConfig(ctx) }));
    controls.add(button(renderer, theme, { key: "r", label: "reload", onPress: () => reload(ctx) }));
    next.add(controls);
    thinScrollbar(renderer, reading, theme, next.body);
    root.add(next);

    const cwd = process.cwd();
    let task: ReturnType<typeof setImmediate> | undefined;
    let suggestions: BoxRenderable | undefined;

    function load(): void {
      task = undefined;
      for (const child of project.body.getChildren()) child.destroyRecursively();
      for (const child of state.body.getChildren()) child.destroyRecursively();
      suggestions?.destroyRecursively();
      suggestions = undefined;
      try {
        const summary = projectSummary(cwd);
        const { project: detected, themeFile, guide, installed, catalog, missing, components, views } = summary;
        project.add(keyValueTable(renderer, theme, [
          ["Framework", detected.framework],
          ["Package manager", detected.packageManager],
          ["Tailwind / shadcn", `${detected.tailwind ?? "none"} / ${detected.shadcn ? "yes" : "no"}`],
          ["Theme file", themeFile ? relative(cwd, themeFile) : "Not found"],
          ["Guide", guide.exists ? `${guide.rules.length} rules` : "VIEWSPEC.md missing"],
          ...(guide.exists ? [["Pending proposals", String(guide.pendingProposals.length)] as [string, string]] : []),
        ]));
        if (guide.errors.length) project.add(dim(renderer, theme, `${guide.errors.length} guide validation messages`));
        state.add(keyValueTable(renderer, theme, [
          ["Skills", `${installed}/${catalog} installed`],
          ["Missing packages", String(missing)],
          ["Components", String(components)],
        ]));
        const byStatus = Object.entries(views.byStatus).map(([status, count]) => `${status}: ${count}`).join(" · ");
        state.add(heading(renderer, theme, "Viewspecs by status"));
        state.add(dim(renderer, theme, byStatus));
        if (views.errors.length) state.add(dim(renderer, theme, `${views.errors.length} viewspec validation messages`));
        if (detected.framework === "unknown") project.add(dim(renderer, theme, "No Astro or React project detected"));
        suggestions = list(renderer, theme, summary.next.length ? summary.next : ["Project setup is up to date"], glyphs.arrow);
        terminal.add(suggestions, !compact && tall ? 1 : 0);
      } catch (error) {
        project.add(stateView(renderer, theme, ctx.icons, {
          kind: "error", title: "Unable to read project",
          message: error instanceof Error ? error.message : String(error),
          action: { key: "r", label: "reload", onPress: () => reload(ctx) },
        }));
        state.add(stateView(renderer, theme, ctx.icons, {
          kind: "error", title: "Project summary unavailable",
          action: { key: "r", label: "reload", onPress: () => reload(ctx) },
        }));
      }
    }

    function start(): void {
      if (task) return;
      if (!project.body.getChildren().length) {
        project.add(stateView(renderer, theme, ctx.icons, { kind: "loading", title: "Reading project…" }));
        state.add(stateView(renderer, theme, ctx.icons, { kind: "loading", title: "Reading project state…" }));
      }
      task = setImmediate(load);
    }

    function stop(): void {
      if (task) clearImmediate(task);
      task = undefined;
    }

    overviewLoads.set(renderer, { start, stop });
    start();
    root.once("destroyed", () => {
      stop();
      overviewLoads.delete(renderer);
    });
    return root;
  },
};
