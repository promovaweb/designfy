/** Home menu and live Designfy dashboard. */
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join, resolve } from "node:path";
import { BoxRenderable, ScrollBoxRenderable, TextRenderable, TextAttributes, type Renderable } from "@opentui/core";
import { AppError } from "../../app/errors.ts";
import { ExitCode } from "../../app/exit-codes.ts";
import { manifest } from "../../app/manifest.ts";
import { vaultStatus } from "../../config/credentials.ts";
import { paths } from "../../config/paths.ts";
import { SETTINGS_SCHEMA, getPath, readSettings } from "../../config/settings.ts";
import { listCaptures } from "../../design/capture.ts";
import { parseColor, toHex, wcagContrast } from "../../design/color.ts";
import { listDependencies } from "../../design/deps.ts";
import { interfaceSurfaces, listEntries } from "../../design/interface-catalog.ts";
import { listMcpServers, mcpClients } from "../../design/mcp-clients.ts";
import { detectProject, resolveProject } from "../../design/project.ts";
import { countCopiedComponents, listItems } from "../../design/registry.ts";
import { listSkills } from "../../design/skills.ts";
import { findThemeFile, readTheme } from "../../design/theme.ts";
import { listViewspecSummaries, readGuide, readViewspecProgress } from "../../design/viewspec.ts";
import { SKILL_TOPICS } from "../../skill/index.ts";
import { barChart, meter, panel, segments, sparkline, statusTag } from "../components.ts";
import { withIcon } from "../icons.ts";
import { clickable } from "../pointer.ts";
import { SHORT_HEIGHT } from "../spacing.ts";
import type { Screen, ScreenContext } from "../screen.ts";
import { screens } from "./index.ts";
import { moduleKey } from "./ids.ts";

type Card = ReturnType<typeof panel>;
type Recommendation = { text: string; id?: string };
type HomeDetails = { next: Recommendation; totals: Array<readonly [string, ScreenContext["theme"]["text"]]> };

function homeLayout(ctx: ScreenContext) {
  const width = ctx.layout();
  return { columns: width === "wide" ? 3 : width === "medium" ? 2 : 1, short: ctx.short?.() ?? ctx.renderer.height < SHORT_HEIGHT };
}

/** Composes each card independently so a corrupt project file cannot hide the menu. */
function loadDashboard(ctx: ScreenContext, cards: ReadonlyMap<string, Card>, getTheme: () => Awaited<ReturnType<typeof readTheme>>): HomeDetails {
  const cwd = process.cwd();
  const { renderer, theme, icons } = ctx;
  const { short } = homeLayout(ctx);
  const tone = theme.textDim;
  let configIssue = false;
  let hasTheme = false;
  let hasGuide = false;
  let missing = 0;
  let skillsInstalled = 0;
  let skillsMissing = false;
  let copied = 0;
  let overflows = 0;
  let open = 0;
  let current: string | undefined;
  const line = (text: string, color = theme.text) => segments(renderer, [[text, color]]);
  const tag = (kind: Parameters<typeof statusTag>[3], text: string) => statusTag(renderer, theme, icons, kind, text);
  const render = (id: string, build: () => Renderable[]) => {
    const card = cards.get(id)!;
    for (const child of card.body.getChildren()) child.destroyRecursively();
    try {
      for (const node of build()) card.add(node);
    } catch (cause) {
      if (id === "project") configIssue = true;
      card.add(tag("error", "Unable to load"));
      card.add(line(cause instanceof Error ? cause.message : String(cause), tone));
    }
  };

  render("theme", () => {
    let tokens: ReturnType<typeof getTheme>;
    try { tokens = getTheme(); }
    catch (cause) {
      if (cause instanceof AppError && cause.code === ExitCode.NOT_FOUND) return [tag("available", "Theme missing"), line("Add designfy-theme", tone)];
      throw cause;
    }
    hasTheme = true;
    const names = ["background", "foreground", "primary", "accent", "muted", "border", "destructive"];
    const colors = names.map((name) => {
      const token = tokens.colors.find((token) => token.name === `--color-${name}`) ??
        tokens.colors.find((token) => token.name === `--${name}`);
      const resolved = token?.light?.resolved;
      return resolved ? parseColor(resolved) : undefined;
    });
    const contrast = colors[0] && colors[1] ? wcagContrast(colors[0], colors[1]) : undefined;
    const fonts = tokens.fonts.map((font) => font.light?.resolved ?? font.light?.declared ?? "").filter(Boolean);
    return [
      line(basename(tokens.file)),
      segments(renderer, colors.flatMap((color) => [[color ? "██" : "░░", color ? toHex(color) : theme.border], [" ", tone]] as const)),
      contrast === undefined ? tag("available", "Contrast unavailable") : tag(contrast >= 4.5 ? "ok" : "error", `${contrast.toFixed(2)}:1 FG / BG`),
      ...(short ? [] : [line(fonts.join(" · ") || "No font tokens", tone)]),
    ];
  });
  render("catalog", () => {
    const entries = listEntries();
    const counts = interfaceSurfaces.map((name) => [name, entries.filter(({ surface }) => surface === name).length] as const);
    return short
      ? [line(`${entries.length} patterns`), barChart(renderer, theme, counts, 6)]
      : [line(`${entries.length} patterns`), barChart(renderer, theme, counts, 12)];
  });
  render("components", () => {
    const { framework } = resolveProject(cwd);
    const total = listItems({ framework }).length;
    copied = countCopiedComponents(cwd);
    return [line(`Registry · ${framework}`), meter(renderer, theme, copied, total, { label: "Copied" })];
  });
  render("skills", () => {
    const skills = listSkills(cwd);
    skillsInstalled = skills.filter(({ installed }) => installed !== "no").length;
    skillsMissing = !skills.some(({ name, installed }) => name === "designfy" && installed !== "no");
    const internal = skills.filter(({ kind }) => kind === "internal").length;
    return [meter(renderer, theme, skillsInstalled, skills.length, { label: "Installed" }),
      line(`${internal} internal · ${skills.length - internal} external`, tone),
      tag(skillsMissing ? "pending" : "installed", skillsMissing ? "designfy missing" : "designfy installed")];
  });
  render("deps", () => {
    const { framework } = resolveProject(cwd);
    const defaults = listDependencies(cwd).filter((group) => group.default && (!group.frameworks.length || group.frameworks.includes(framework)));
    const pkgs = new Map(defaults.flatMap(({ packages }) => packages.map((pkg) => [pkg.name, pkg] as const)));
    missing = [...pkgs.values()].filter(({ state }) => state === "missing").length;
    return [meter(renderer, theme, pkgs.size - missing, pkgs.size, { label: "Present" }),
      tag(missing ? "pending" : "ok", missing ? `${missing} missing` : "Defaults present")];
  });
  render("mcp", () => {
    const { servers } = listMcpServers(cwd);
    const counts = mcpClients.map((client) => [client, servers.filter(({ states }) => states[client] !== "absent").length] as const);
    const clientRows = [counts.slice(0, 2), counts.slice(2, 4), counts.slice(4)];
    return [line(`${servers.length} servers in catalog`), ...clientRows.map((row) => segments(renderer,
      row.map(([client, count]) => [`${withIcon(icons, count ? "installed" : "available", `${client} ${count}`)}  `, count ? theme.ok : tone])))];
  });
  render("viewspecs", () => {
    const guide = readGuide(cwd);
    hasGuide = guide.exists;
    const progress = readViewspecProgress(cwd);
    const pending = listViewspecSummaries(cwd).items.filter(({ status }) => status !== "done" && status !== "archived");
    open = pending.length;
    current = pending.find(({ status }) => status === "in_progress")?.id ?? pending[0]?.id;
    const states = [["Draft", progress.byStatus.draft], ["Active", progress.byStatus.in_progress],
      ["Waiting", progress.byStatus.blocked], ["Done", progress.byStatus.done], ["Archive", progress.byStatus.archived]] as const;
    return [
      tag(hasGuide ? "ok" : "pending", hasGuide ? `Guide · ${guide.rules.length} rules` : "VIEWSPEC.md missing"),
      ...(short ? [barChart(renderer, theme, states.filter(([, count]) => count > 0).slice(0, 3), 6)]
        : [barChart(renderer, theme, states, 8)]),
      meter(renderer, theme, progress.done, progress.total, { label: "Checklist" }),
    ];
  });
  render("captures", () => {
    const runs = listCaptures(cwd);
    const [last] = runs;
    if (!last) return [tag("available", "No capture runs"), line("Run designfy capture run", tone)];
    overflows = last.shots.filter((shot) => shot.overflowX).length;
    return [line(last.name), line(`${last.createdAt.slice(0, 10)} · ${last.shots.length} shots`, tone),
      tag(overflows ? "error" : "ok", `${overflows} overflowX`),
      ...(!short && runs.length > 1 ? [line(`Shot history ${sparkline(runs.slice(0, 12).reverse().map((run) => run.shots.length))}`, tone)] : [])];
  });
  render("project", () => {
    const project = detectProject(cwd);
    return [line(`${project.framework} · ${project.packageManager}`),
      line(`Tailwind ${project.tailwind ?? "missing"} · shadcn ${project.shadcn ? "yes" : "no"}`, tone)];
  });
  render("settings", () => [line(`${SETTINGS_SCHEMA.length} settings`), line(theme.name, tone)]);
  render("credentials", () => [line(`${vaultStatus().count} credentials`), line("Project and user vault", tone)]);
  render("docs", () => [line(`${SKILL_TOPICS.length} topics`), line("Built-in reference", tone)]);
  render("about", () => [line(`v${manifest.version}`), line(manifest.title, tone)]);

  const next: Recommendation = !existsSync(join(cwd, "designfy.json")) ? { text: "Run init", id: "project" }
    : !hasTheme ? { text: "Add the theme", id: "theme" }
    : !hasGuide ? { text: "Create the guide with the designfy skill", id: "viewspecs" }
    : missing ? { text: "Install dependencies", id: "deps" }
    : current ? { text: `Continue viewspec ${current}`, id: "viewspecs" }
    : { text: "All set" };
  return {
    next,
    totals: [
      [`${skillsInstalled} installed`, skillsMissing ? theme.warn : theme.ok],
      [`  ·  ${copied} copied`, tone],
      [`  ·  ${missing} missing deps`, missing ? theme.warn : tone],
      [`  ·  ${open} open viewspecs`, open ? theme.warn : tone],
      [`  ·  ${overflows} overflowX`, overflows ? theme.error : tone],
      ...(configIssue ? [["  ·  Project unavailable", theme.error] as const] : []),
    ],
  };
}

/** Creates the Home grid, preserving its selection when returning from a module. */
export function createHomeScreen(): Screen {
  let selected = -1;
  let preferred = 0;
  let load: ReturnType<typeof setImmediate> | undefined;
  let start = () => {};
  let navigate = (_key: string) => false;
  let open = () => {};
  let loadVersion = 0;
  const stop = () => {
    loadVersion++;
    if (load !== undefined) clearImmediate(load);
    load = undefined;
  };
  return {
    id: "overview", title: "Home", icon: "overview", description: "Project dashboard and module menu",
    watch: () => {
      const cwd = process.cwd();
      const names = ["package.json", "components.json", "designfy.json", "skills-lock.json", "VIEWSPEC.md",
        "viewspec", "src/styles", ".mcp.json", ".codex", "opencode.json", ".cursor", ".gemini"];
      const files = names.map((file) => join(cwd, file));
      files.push(paths.settings(), paths.credentials(), paths.masterKey(),
        join(process.env.DESIGNFY_HOME_DIR || homedir(), ".agents", ".skill-lock.json"));
      try {
        files.push(findThemeFile(cwd));
      } catch { /* The dashboard reports missing or invalid theme files. */ }
      try {
        const outDir = getPath(readSettings(), "capture.outDir");
        if (typeof outDir === "string") files.push(resolve(cwd, outDir));
        const [last] = listCaptures(cwd);
        if (last) files.push(join(last.outDir, "manifest.json"));
      } catch { /* The capture card reports invalid data. */ }
      return files;
    },
    actions: [
      { keys: ["return", "enter", "space"], label: "Enter", description: "open", run: () => open() },
      { keys: ["r"], icon: "refresh", description: "reload", run: () => start() },
      { keys: ["up", "down", "left", "right", "h", "j", "k", "l"], label: "Arrows / hjkl", description: "move across cards", hidden: true, run: () => {} },
      { keys: ["c"], description: "Credentials", icon: "vault", hidden: true, run: (ctx) => ctx.goTo("credentials") },
      { keys: ["d"], description: "Docs", icon: "docs", hidden: true, run: (ctx) => ctx.goTo("docs") },
      { keys: ["a"], description: "About", icon: "about", hidden: true, run: (ctx) => ctx.goTo("about") },
    ],
    mount(ctx) {
      const { renderer, theme, icons } = ctx;
      const { columns, short } = homeLayout(ctx);
      const modules = screens.slice(1);
      const cards = new Map<string, Card>();
      const titles = modules.map((screen, index) => `${moduleKey(index + 1) ?? ""} ${withIcon(icons, screen.icon ?? "list", screen.title)}`.trim());
      const root = new BoxRenderable(renderer, { flexDirection: "column", flexGrow: 1, minHeight: 0, gap: 0 });
      const banner = new TextRenderable(renderer, { height: 1, flexShrink: 0, truncate: true, wrapMode: "none",
        attributes: TextAttributes.BOLD, fg: theme.primaryText, bg: theme.primary, content: " Loading project…" });
      root.add(banner);
      const grid = new ScrollBoxRenderable(renderer, { marginTop: short ? 0 : 1, flexGrow: 1, minHeight: 0, scrollY: true, scrollX: false,
        scrollAcceleration: { tick: () => 3, reset: () => {} },
        contentOptions: { flexDirection: "column", gap: short ? 0 : 1 } });
      grid.horizontalScrollBar.visible = false;
      root.add(grid);
      const totals = new BoxRenderable(renderer, { height: 1, minWidth: 0, flexShrink: 0 });
      root.add(totals);

      let next: Recommendation = { text: "Loading project…" };
      const paintSelection = () => {
        banner.bg = selected < 0 ? theme.primary : theme.surfaceHigh;
        banner.fg = selected < 0 ? theme.primaryText : theme.accent;
        modules.forEach(({ id }, index) => cards.get(id)?.appearance(theme, titles[index]!, index === selected));
      };
      open = () => {
        const id = selected < 0 ? next.id : modules[selected]?.id;
        if (id) ctx.goTo(id);
      };
      clickable(renderer, banner, { onClick: () => { selected = -1; paintSelection(); open(); } });

      const rows: Array<{ start: number; end: number }> = [];
      const mainCount = modules.findIndex(({ id }) => id === "project");
      for (const [start, end] of [[0, mainCount], [mainCount, modules.length]] as const) {
        for (let i = start; i < end; i += columns) rows.push({ start: i, end: Math.min(i + columns, end) });
      }
      for (const { start, end } of rows) {
        const rowModules = modules.slice(start, end);
        const rowHeight = start >= mainCount ? 4 : short ? 7 : end >= 7 ? 9 : 6;
        const row = new BoxRenderable(renderer, { flexDirection: "row", gap: 2, height: rowHeight, flexShrink: 0 });
        grid.add(row);
        rowModules.forEach((screen, offset) => {
          const index = start + offset;
          const card = panel(renderer, theme, { title: titles[index]!, flexGrow: 1, active: index === selected });
          card.add(new TextRenderable(renderer, { content: "Loading…", fg: theme.textDim }));
          clickable(renderer, card, {
            onClick: () => { selected = index; preferred = offset; paintSelection(); open(); },
          });
          cards.set(screen.id, card);
          row.add(card);
        });
        for (let cell = rowModules.length; cell < columns; cell++) row.add(new BoxRenderable(renderer, { flexGrow: 1, flexBasis: 0 }));
      }
      paintSelection();
      const reveal = () => {
        if (selected < 0) grid.scrollTo(0);
        else grid.scrollChildIntoView(cards.get(modules[selected]!.id)!);
      };
      if (selected >= 0) reveal();
      navigate = (key) => {
        if (!["up", "down", "left", "right", "h", "j", "k", "l"].includes(key)) return false;
        if (selected < 0) { selected = 0; preferred = 0; }
        else if (key === "left" || key === "h" || key === "right" || key === "l") {
          const change = key === "left" || key === "h" ? -1 : 1;
          selected = Math.max(0, Math.min(modules.length - 1, selected + change));
          const current = rows.find(({ end }) => selected < end)!;
          preferred = selected - current.start;
        } else {
          const current = rows.findIndex(({ end }) => selected < end);
          const row = current + (key === "up" || key === "k" ? -1 : 1);
          const target = rows[Math.min(row, rows.length - 1)];
          selected = target ? Math.min(target.start + preferred, target.end - 1) : -1;
        }
        paintSelection();
        reveal();
        return true;
      };
      start = () => {
        stop();
        const version = loadVersion;
        load = setImmediate(async () => {
          load = undefined;
          const getTheme = await readTheme(process.cwd()).then(
            (theme) => () => theme,
            (cause) => () => { throw cause; },
          );
          if (version !== loadVersion || root.isDestroyed || renderer.isDestroyed) return;
          const details = loadDashboard(ctx, cards, getTheme);
          next = details.next;
          banner.content = ` ${withIcon(icons, next.id ? "next" : "ok", next.text)}${next.id ? "   [Enter]" : ""} `;
          for (const node of totals.getChildren()) node.destroyRecursively();
          totals.add(segments(renderer, details.totals));
        });
      };
      return root;
    },
    onEnter: () => start(), onLeave: stop, onPause: stop, onResume: () => start(),
    onKey: (key) => navigate(key),
  };
}
