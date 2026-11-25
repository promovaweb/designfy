/**
 * Designfy shell: project header, Home menu, module navigation, key bar,
 * overlays and active-screen lifecycle on the same terminal renderer.
 */
import { watch as watchFile, existsSync, statSync, type FSWatcher } from "node:fs";
import { basename, dirname } from "node:path";
import {
  BoxRenderable,
  TextRenderable,
  TextAttributes,
  InputRenderable,
  createCliRenderer,
  type CliRenderer,
  type KeyEvent,
  type PasteEvent,
  type Renderable,
} from "@opentui/core";
import { manifest } from "../app/manifest.ts";
import { readSettings, getPath, setPath, writeSettings } from "../config/settings.ts";
import { glyphs, currentTheme, resolveTheme, terminalTheme, themes, THEME_NAMES, type Theme, type ThemeName } from "./theme.ts";
import { currentIcons, withIcon, type IconSet } from "./icons.ts";
import { clickable } from "./pointer.ts";
import { Overlays, type HelpSection, type PaletteEntry } from "./overlays.ts";
import { screens } from "./screens/index.ts";
import { moduleKey, moduleKeys } from "./screens/ids.ts";
import { spacing, controlSpacing, widthLayout, MEDIUM_WIDTH, SHORT_HEIGHT } from "./spacing.ts";
import { fitText } from "./components.ts";
import { detectProject } from "../design/project.ts";
import type { Layout, NotifyTone, ScreenAction, ScreenContext, Screen } from "./screen.ts";

export interface TuiOptions {
  initialTab?: string;
  /** Icon set; defaults to `tui.icons` and terminal detection. */
  icons?: IconSet;
  /** Short animations; defaults to `tui.motion`. */
  motion?: boolean;
}

/** Smallest terminal the shell lays screens out in. */
export const MIN_WIDTH = 60;
export const MIN_HEIGHT = 16;

/** Width class for a terminal width. */
export function layoutFor(width: number): Layout {
  return widthLayout(width);
}

function setting(key: string): unknown {
  try {
    return getPath(readSettings(), key);
  } catch {
    return undefined;
  }
}

function defaultInitialTab(): string {
  const value = setting("tui.initialTab");
  return typeof value === "string" ? value : (screens[0]?.id ?? "overview");
}

/** Reads `tui.mouse`. Any failure keeps the mouse on. */
export function mouseEnabled(): boolean {
  return setting("tui.mouse") !== false;
}

/** Reads `tui.motion`. Any failure keeps animations on. */
export function motionEnabled(): boolean {
  return setting("tui.motion") !== false;
}

/** Label of an action key: explicit label or the first key name. */
function keyLabel(action: ScreenAction): string {
  return action.label ?? action.keys[0] ?? "";
}

/** True when the focused renderable edits text and must receive letters. */
function editsText(node: Renderable | null): boolean {
  const name = node?.constructor?.name ?? "";
  return name === "InputRenderable" || name === "TextareaRenderable";
}

/** Focusable descendants of `root`, in tree order. */
function focusables(root: Renderable): Renderable[] {
  const found: Renderable[] = [];
  const visit = (node: Renderable) => {
    if (!node.visible) return;
    if (node.focusable) found.push(node);
    for (const child of node.getChildren()) visit(child);
  };
  visit(root);
  return found;
}

/**
 * Opens the TUI on a real terminal and returns only when the user quits.
 * With the `terminal` theme, the palette query runs before mounting so the
 * first frame already uses the slots chosen for the terminal colors.
 */
export async function startTui(options: TuiOptions = {}): Promise<void> {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
    backgroundColor: currentTheme().background,
    targetFps: 30,
    useMouse: mouseEnabled(),
    useKittyKeyboard: {},
  });
  const theme = await resolveTheme(renderer);
  await mountTui(renderer, options, theme);
}

/**
 * Mounts the interface on an existing renderer and returns when it is
 * destroyed. Separated from `startTui` so tests can use the renderer from
 * `@opentui/core/testing` and capture frames without a real terminal.
 */
export async function mountTui(renderer: CliRenderer, options: TuiOptions = {}, theme: Theme = currentTheme()): Promise<void> {
  await new Promise<void>((resolve) => {
    const terminal = theme.name === "terminal" ? theme : terminalTheme();
    const attach = (id: string, palette: Theme) => {
      if (renderer.isDestroyed) { resolve(); return; }
      renderer.setBackgroundColor(palette.background);
      mountShell(renderer, { ...options, initialTab: id }, palette, (nextId, name) =>
        attach(nextId, name === "terminal" ? terminal : themes[name]), resolve);
    };
    attach(options.initialTab ?? defaultInitialTab(), theme);
  });
}

/** Mounts one themed shell and detaches it before a theme change or renderer shutdown. */
function mountShell(
  renderer: CliRenderer, options: TuiOptions, theme: Theme,
  changeTheme: (id: string, theme: ThemeName) => void, close: () => void,
): void {
  const initialSpace = spacing(layoutFor(renderer.width));
  const icons = options.icons ?? currentIcons();
  const motion = options.motion ?? motionEnabled();
  const overlays = new Overlays(renderer, theme, icons, motion);
  const quit = () => {
    if (!renderer.isDestroyed) renderer.destroy();
  };

  const app = new BoxRenderable(renderer, {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    backgroundColor: theme.background,
  });

  const header = new BoxRenderable(renderer, {
    height: 1, flexDirection: "row", paddingLeft: initialSpace.pageX, paddingRight: initialSpace.pageX,
    gap: controlSpacing.gap, flexShrink: 0, backgroundColor: theme.barBackground,
  });
  const brand = new TextRenderable(renderer, {
    content: ` ${withIcon(icons, "designfy", manifest.title)} `, fg: theme.brandText, bg: theme.brandBackground,
    attributes: TextAttributes.BOLD, flexShrink: 0, selectable: false, wrapMode: "none",
  });
  clickable(renderer, brand, { onClick: () => goHome() });
  header.add(brand);
  header.add(new TextRenderable(renderer, { content: `v${manifest.version}`, fg: theme.barText, flexShrink: 0, wrapMode: "none" }));
  const breadcrumb = new TextRenderable(renderer, { fg: theme.accent, flexShrink: 0, wrapMode: "none" });
  header.add(breadcrumb);
  const projectHint = new TextRenderable(renderer, { fg: theme.barText, flexGrow: 1, minWidth: 0, truncate: true, wrapMode: "none" });
  header.add(projectHint);
  const themeToggle = new TextRenderable(renderer, { content: ` T ${theme.name} `, fg: theme.keyText, bg: theme.keyBackground, flexShrink: 0, selectable: false });
  clickable(renderer, themeToggle, { onClick: () => { if (!active()?.beforeKey?.("T", context)) switchTheme(); } });
  header.add(themeToggle);
  const platform = new TextRenderable(renderer, { content: `${process.platform}-${process.arch} · Bun ${Bun.version}`, fg: theme.barText, flexShrink: 0, wrapMode: "none" });
  header.add(platform);
  app.add(header);

  const moduleBar = new BoxRenderable(renderer, {
    height: 1, flexDirection: "row", gap: controlSpacing.gap, flexShrink: 0,
    paddingLeft: initialSpace.pageX, paddingRight: initialSpace.pageX, visible: false,
  });
  const back = new TextRenderable(renderer, { content: ` ${withIcon(icons, "back", "Back")} `, fg: theme.keyText, bg: theme.keyBackground, flexShrink: 0, selectable: false });
  clickable(renderer, back, { onClick: () => goHome() });
  moduleBar.add(back);
  const moduleTitle = new TextRenderable(renderer, { fg: theme.textStrong, attributes: TextAttributes.BOLD, flexShrink: 0, wrapMode: "none" });
  const moduleSubtitle = new TextRenderable(renderer, { fg: theme.textDim, minWidth: 0, truncate: true, wrapMode: "none" });
  moduleBar.add(moduleTitle);
  moduleBar.add(moduleSubtitle);
  app.add(moduleBar);

  const content = new BoxRenderable(renderer, { flexGrow: 1, flexDirection: "column", paddingLeft: initialSpace.pageX, paddingRight: initialSpace.pageX, minHeight: 0 });
  app.add(content);
  const tooSmall = new BoxRenderable(renderer, { flexGrow: 1, alignItems: "center", justifyContent: "center", flexDirection: "column" });
  const tooSmallText = new TextRenderable(renderer, { content: "", fg: theme.warn, selectable: false });
  tooSmall.add(tooSmallText);
  tooSmall.add(new TextRenderable(renderer, { content: "Enlarge the window or press q to quit.", fg: theme.textDim, selectable: false }));

  const bar = new BoxRenderable(renderer, {
    height: 1, flexDirection: "row", paddingLeft: initialSpace.pageX, paddingRight: initialSpace.pageX,
    gap: controlSpacing.gap, flexShrink: 0, backgroundColor: theme.barBackground,
  });
  let barItems = new BoxRenderable(renderer, { flexDirection: "row", gap: controlSpacing.gap, flexShrink: 0 });
  const filterInput = new InputRenderable(renderer, {
    placeholder: "Filter", flexGrow: 1, visible: false, textColor: theme.textStrong,
    backgroundColor: theme.barBackground, focusedBackgroundColor: theme.barBackground,
  });
  const filterLabel = new TextRenderable(renderer, { content: " / ", fg: theme.keyText, bg: theme.keyBackground, visible: false, flexShrink: 0 });
  bar.add(barItems);
  bar.add(filterLabel);
  bar.add(filterInput);
  app.add(bar);
  renderer.root.add(app);

  const mounted = new Map<string, Renderable>();
  const stale = new Set<string>();
  const screenStatuses = new Map<string, { text: string; tone: NotifyTone }>();
  let activeIndex = -1;
  let currentLayout: Layout = layoutFor(renderer.width);
  let small = false;
  let short = renderer.height < SHORT_HEIGHT;
  let filter: { initial: string; change: (query: string) => void; focus: Renderable | null } | undefined;
  let switching = false;

  const showFilter = (initial: string, change: (query: string) => void) => {
    if (filter) return;
    filter = { initial, change, focus: renderer.currentFocusedRenderable };
    barItems.visible = false;
    filterInput.value = initial;
    filterLabel.visible = filterInput.visible = true;
    filterInput.focus();
  };

  const closeFilter = (cancel: boolean) => {
    const editing = filter;
    if (!editing) return;
    filter = undefined;
    if (cancel) editing.change(editing.initial);
    filterInput.blur();
    filterLabel.visible = filterInput.visible = false;
    barItems.visible = true;
    if (editing.focus && !editing.focus.isDestroyed) editing.focus.focus();
  };

  filterInput.on("input", (value: string) => filter?.change(value));
  const active = (): Screen | undefined => screens[activeIndex];

  const context: ScreenContext = {
    renderer,
    theme,
    icons,
    motion,
    layout: () => currentLayout,
    short: () => short,
    filter: showFilter,
    get space() { return spacing(currentLayout); },
    goTo: (id) => {
      const index = screens.findIndex((s) => s.id === id);
      if (index >= 0) show(index);
    },
    refresh: () => remount(),
    notify: (message, tone = "info") => overlays.toast(message, tone),
    status: (text, tone = "info") => {
      const screen = active();
      if (screen) screenStatuses.set(screen.id, { text: text.replace(/[\r\n\t]+/g, " "), tone });
      if (activeIndex >= 0) refreshBar();
    },
    confirm: (opts) => overlays.confirm(opts),
    prompt: (opts) => overlays.prompt(opts),
    choose: (opts) => overlays.choose(opts),
    quit,
  };

  /** Runs an action, reporting a thrown or rejected error as a toast. */
  const runAction = (action: ScreenAction) => {
    try {
      const result = action.run(context);
      if (result instanceof Promise) result.catch((error) => context.notify(error instanceof Error ? error.message : String(error), "error"));
    } catch (error) {
      context.notify(error instanceof Error ? error.message : String(error), "error");
    }
  };

  /** Global commands, shown after the screen actions. Help gets a reserved slot. */
  const helpAction: ScreenAction = { keys: ["?"], description: "help", icon: "help", run: () => openHelp() };
  const quitAction: ScreenAction = { keys: ["q", "escape"], description: "quit", icon: "quit", run: quit };
  const paletteAction: ScreenAction = { keys: [], label: "^K", description: "commands", icon: "keyboard", run: () => openPalette() };
  const themeAction: ScreenAction = { keys: ["T"], description: "theme", icon: "theme", run: () => switchTheme() };
  const backAction: ScreenAction = { keys: ["escape", "backspace"], label: "Esc", description: "back", icon: "back", run: () => show(0) };

  const goHome = () => {
    if (!active()?.beforeKey?.("escape", context)) show(0);
  };

  const switchTheme = () => {
    if (switching) return;
    switching = true;
    const next = THEME_NAMES[(THEME_NAMES.indexOf(theme.name) + 1) % THEME_NAMES.length]!;
    try {
      const settings = readSettings();
      setPath(settings, "tui.theme", next);
      writeSettings(settings);
    } catch {
      // The selected palette still applies for the current session.
    }
    const id = active()?.id ?? "overview";
    cleanup();
    changeTheme(id, next);
  };

  /** Actions of the active screen, legacy key hints included as display-only entries. */
  const screenActions = (): ScreenAction[] => {
    const screen = active();
    if (!screen) return [];
    const hints: ScreenAction[] = (screen.keys ?? []).map((hint) => ({ keys: [], label: hint.key, description: hint.action, run: () => undefined }));
    return [...(screen.actions ?? []), ...hints];
  };

  const setTitle = () => {
    try {
      renderer.setTerminalTitle(`${manifest.title}${active() ? ` · ${active()!.title}` : ""}`);
    } catch {
      // Window titles are optional.
    }
  };

  /** Refreshes the header context after navigation, resize or a project file change. */
  const refreshHeader = () => {
    const screen = active();
    const onHome = !screen || screen.id === "overview";
    breadcrumb.content = onHome ? withIcon(icons, "overview", "Home") : withIcon(icons, "next", withIcon(icons, screen.icon ?? "list", screen.title));
    moduleBar.visible = !onHome && !small;
    moduleTitle.content = screen ? withIcon(icons, screen.icon ?? "list", screen.title) : "";
    moduleSubtitle.content = screen?.description ?? "";
    platform.visible = renderer.width >= MEDIUM_WIDTH;
    try {
      const project = detectProject(process.cwd());
      projectHint.content = `${basename(process.cwd())} · ${project.framework}`;
    } catch {
      projectHint.content = basename(process.cwd());
    }
  };

  /** Measures an inverted chip, a gap and its label in terminal cells. */
  const actionWidth = (action: ScreenAction) => Bun.stringWidth(keyLabel(action)) + Bun.stringWidth(action.description) + 3;

  const barItem = (action: ScreenAction) => {
    const item = new BoxRenderable(renderer, { flexDirection: "row", flexShrink: 0, width: actionWidth(action) });
    const text = new TextRenderable(renderer, { content: ` ${action.description}`, fg: theme.barText, selectable: false, wrapMode: "none" });
    item.add(new TextRenderable(renderer, {
      content: ` ${keyLabel(action)} `, fg: theme.keyText, bg: theme.keyBackground,
      attributes: TextAttributes.BOLD, selectable: false, wrapMode: "none", flexShrink: 0,
    }));
    item.add(text);
    if (action.keys.length || action === paletteAction) {
      clickable(renderer, item, {
        onClick: () => { if (!active()?.beforeKey?.(action.keys[0] ?? "ctrl+k", context)) runAction(action); },
        onHover: (inside) => { text.fg = inside ? theme.textStrong : theme.barText; },
      });
    }
    return item;
  };

  let previousBar = "";
  const refreshBar = () => {
    const gap = controlSpacing.gap;
    let budget = renderer.width - spacing(currentLayout).pageX * 2;
    const required = [helpAction, quitAction];
    budget -= required.reduce((width, action) => width + actionWidth(action) + gap, 0) - gap;
    const screenHints: ScreenAction[] = [];
    for (const action of screenActions().filter((action) => !action.hidden)) {
      const width = actionWidth(action) + gap + (screenHints.length ? 0 : 1 + gap);
      if (width > budget) break;
      screenHints.push(action);
      budget -= width;
    }
    const globals: ScreenAction[] = [];
    for (const action of [...(activeIndex > 0 ? [backAction] : []), themeAction, paletteAction]) {
      const width = actionWidth(action) + gap;
      if (width > budget) break;
      globals.push(action);
      budget -= width;
    }

    const status = screenStatuses.get(active()?.id ?? "");
    const shown = budget >= gap + 8 ? fitText(status?.text ?? "", budget - gap) : "";
    const statusColor = status?.tone && status.tone !== "info" ? theme[status.tone] : theme.barText;
    const signature = JSON.stringify([activeIndex, screenHints.length, globals.length, shown, status?.tone]);
    if (previousBar === signature) return;
    previousBar = signature;
    barItems.destroyRecursively();
    barItems = new BoxRenderable(renderer, { flexDirection: "row", gap, flexShrink: 0, visible: !filter });
    if (shown) barItems.add(new TextRenderable(renderer, { content: shown, fg: statusColor, flexShrink: 0, wrapMode: "none" }));
    for (const hint of screenHints) barItems.add(barItem(hint));
    if (screenHints.length) barItems.add(new TextRenderable(renderer, { content: glyphs.separator, fg: theme.border, flexShrink: 0 }));
    for (const hint of [...globals, ...required]) barItems.add(barItem(hint));
    bar.add(barItems, 0);
  };

  /** Detaches the content of the active screen, blurring a focused child. */
  const detach = (node: Renderable) => {
    const focused = renderer.currentFocusedRenderable;
    for (let parent: Renderable | null = focused; parent; parent = parent.parent) {
      if (parent === node) {
        focused?.blur();
        break;
      }
    }
    content.remove(node);
  };

  /** Rebuilds the active screen (onLeave, mount, onEnter). */
  const remount = () => {
    const screen = active();
    if (!screen) return;
    screen.onLeave?.(context);
    const previous = mounted.get(screen.id);
    if (previous) {
      detach(previous);
      previous.destroyRecursively();
    }
    stale.delete(screen.id);
    const node = screen.mount(context);
    mounted.set(screen.id, node);
    if (!small) content.add(node);
    screen.onEnter?.(context);
    refreshHeader();
    refreshBar();
  };

  const show = (index: number) => {
    const screen = screens[index];
    if (!screen || index === activeIndex) return;
    closeFilter(false);
    const previous = active();
    if (previous) {
      previous.onLeave?.(context);
      const node = mounted.get(previous.id);
      if (node && !small) detach(node);
    }
    activeIndex = index;
    let node = mounted.get(screen.id);
    if (node && stale.has(screen.id)) {
      node.destroyRecursively();
      node = undefined;
      stale.delete(screen.id);
    }
    if (!node) {
      node = screen.mount(context);
      mounted.set(screen.id, node);
    }
    if (!small) content.add(node);
    screen.onEnter?.(context);
    refreshHeader();
    refreshBar();
    setTitle();
    restartWatchers();
  };

  /** Moves the focus to the next (or previous) focusable panel of the screen. */
  const cycleFocus = (delta: number) => {
    const node = active() && mounted.get(active()!.id);
    if (!node || small) return;
    const list = focusables(node);
    if (!list.length) return;
    const current = list.findIndex((item) => item === renderer.currentFocusedRenderable);
    const nextIndex = current < 0 ? (delta > 0 ? 0 : list.length - 1) : (current + delta + list.length) % list.length;
    list[nextIndex]!.focus();
  };

  const openPalette = () => {
    const entries: PaletteEntry[] = [];
    const screen = active();
    if (screen) {
      for (const action of screenActions().filter((a) => a.keys.length)) {
        entries.push({ label: `${screen.title}: ${action.description}`, hint: keyLabel(action), icon: action.icon, run: () => runAction(action) });
      }
    }
    screens.forEach((target, index) => {
      if (index !== activeIndex) entries.push({ label: `Go to ${target.title}`, hint: moduleKey(index), icon: target.icon, run: () => show(index) });
    });
    screens.forEach((target, index) => {
      if (index === activeIndex) return;
      for (const action of target.actions ?? []) {
        entries.push({
          label: `${target.title}: ${action.description}`,
          icon: action.icon,
          run: () => {
            show(index);
            runAction(action);
          },
        });
      }
    });
    entries.push({ label: "Reload this screen", icon: "refresh", run: () => remount() });
    entries.push({ label: "Help: keys and mouse", hint: "?", icon: "help", run: () => openHelp() });
    entries.push({ label: "Quit", hint: "q", icon: "quit", run: () => quit() });
    overlays.palette(entries);
  };

  const openHelp = () => {
    const screen = active();
    const sections: HelpSection[] = [];
    const own = screenActions();
    if (screen && own.length) {
      sections.push({
        title: withIcon(icons, screen.icon ?? "list", screen.title),
        rows: own.map((action) => ({ key: keyLabel(action), description: action.description, icon: action.icon, run: action.keys.length ? () => runAction(action) : undefined })),
      });
    }
    sections.push({
      title: "Global",
      rows: [
        { key: "Ctrl+K  :", description: "command palette", icon: "keyboard", run: () => openPalette() },
        { key: "1 … 9  0", description: "open a numbered module" },
        { key: "T", description: "change theme", icon: "theme", run: () => switchTheme() },
        { key: "Tab  Shift+Tab", description: "next / previous panel" },
        { key: "Esc  Backspace", description: "back to Home; Esc on Home quits", icon: "back", run: () => show(0) },
        { key: "?  q  Ctrl+C", description: "help / quit" },
      ],
    });
    sections.push({
      title: "Mouse",
      rows: [
        { key: "click", description: "open a card or run an action" },
        { key: "wheel", description: "scroll a list or reading panel" },
        { key: "Shift+drag", description: "select text in most terminals" },
      ],
    });
    overlays.help(sections);
  };

  // Layout: recompose on width class change; replace the screen when too small.
  const applySize = () => {
    const space = spacing(layoutFor(renderer.width));
    closeFilter(false);
    for (const box of [header, moduleBar, content, bar]) {
      box.paddingLeft = space.pageX;
      box.paddingRight = space.pageX;
    }
    content.paddingTop = renderer.height >= SHORT_HEIGHT ? 1 : 0;
    content.paddingBottom = renderer.height >= SHORT_HEIGHT ? 1 : 0;
    const nextShort = renderer.height < SHORT_HEIGHT;
    const wasSmall = small;
    const nextSmall = renderer.width < MIN_WIDTH || renderer.height < MIN_HEIGHT;
    const nextLayout = layoutFor(renderer.width);
    const node = active() && mounted.get(active()!.id);
    if (nextSmall !== small) {
      small = nextSmall;
      if (small) {
        if (node) detach(node);
        content.add(tooSmall);
      } else {
        content.remove(tooSmall);
        if (node) content.add(node);
      }
    }
    tooSmallText.content = withIcon(icons, "warn", `Terminal too small: ${renderer.width}×${renderer.height}, needs ${MIN_WIDTH}×${MIN_HEIGHT}.`);
    if (nextLayout !== currentLayout || short !== nextShort) {
      short = nextShort;
      currentLayout = nextLayout;
      for (const screen of screens) if (screen !== active() && mounted.has(screen.id)) stale.add(screen.id);
      if (small && active()) stale.add(active()!.id);
      else remount();
    } else if (wasSmall && !small && active() && stale.has(active()!.id)) {
      remount();
    }
    refreshHeader();
    refreshBar();
  };
  const onResize = () => applySize();
  renderer.on("resize", onResize);

  // Files watched by the active screen: refresh on change (debounced).
  let watchers: FSWatcher[] = [];
  let watchTimer: ReturnType<typeof setTimeout> | undefined;
  const stopWatchers = () => {
    for (const watcher of watchers) watcher.close();
    watchers = [];
    clearTimeout(watchTimer);
  };
  const restartWatchers = () => {
    stopWatchers();
    const files = active()?.watch?.() ?? [];
    const byDir = new Map<string, Set<string>>();
    const directories = new Set<string>();
    for (const file of files) {
      try {
        if (statSync(file, { throwIfNoEntry: false })?.isDirectory()) {
          directories.add(file);
          if (!byDir.has(file)) byDir.set(file, new Set());
        }
      } catch {
        // The file may disappear while the project is being updated.
      }
      let target = file;
      let dir = dirname(target);
      while (!existsSync(dir) && dirname(dir) !== dir) {
        target = dir;
        dir = dirname(dir);
      }
      if (!byDir.has(dir)) byDir.set(dir, new Set());
      byDir.get(dir)!.add(basename(target));
    }
    for (const [dir, names] of byDir) {
      try {
        watchers.push(
          watchFile(dir, (_event, name) => {
            if (name && !directories.has(dir) && !names.has(String(name))) return;
            clearTimeout(watchTimer);
            const update = () => {
              if (renderer.isDestroyed) return;
              if (overlays.isOpen || filter) {
                watchTimer = setTimeout(update, 100);
                return;
              }
              restartWatchers();
              remount();
              context.notify("Updated from disk", "info");
            };
            watchTimer = setTimeout(update, 250);
          }),
        );
      } catch {
        // An ancestor can disappear between resolving its path and watching it.
      }
    }
  };

  // Terminal window focus: pause and resume the active screen.
  const onBlur = () => active()?.onPause?.(context);
  const onFocus = () => active()?.onResume?.(context);
  renderer.on("blur", onBlur);
  renderer.on("focus", onFocus);

  const onKey = (key: KeyEvent) => {
    const name = key.name;
    if (key.ctrl && name === "c") {
      key.preventDefault();
      return quit();
    }
    if (overlays.handleKey(key)) return;
    if (filter) {
      if (name === "escape" || name === "return" || name === "enter") {
        key.preventDefault();
        closeFilter(name === "escape");
      }
      return;
    }
    // A text field keeps letters, digits and arrows; Esc leaves it, Tab moves on.
    if (editsText(renderer.currentFocusedRenderable)) {
      if (key.ctrl && name === "k") { key.preventDefault(); openPalette(); return; }
      if (name === "escape") {
        key.preventDefault();
        renderer.currentFocusedRenderable?.blur();
      } else if (name === "tab") {
        key.preventDefault();
        cycleFocus(key.shift ? -1 : 1);
      }
      return;
    }
    const consume = (run: () => void) => {
      key.preventDefault();
      run();
    };
    if (small) {
      if (name === "q" || name === "escape") consume(quit);
      return;
    }
    const pressed = key.shift && name === "t" ? "T" : name;
    if (active()?.beforeKey?.(key.ctrl ? `ctrl+${pressed}` : pressed, context)) return consume(() => undefined);
    if (key.ctrl && name === "k") return consume(openPalette);
    if (key.ctrl || key.meta) return;
    if (pressed === "T") return consume(switchTheme);
    if (name === "q") return consume(quit);
    if (name === "?") return consume(openHelp);
    if (name === "escape" || name === "backspace") {
      if (activeIndex > 0) return consume(() => show(0));
      if (name === "escape") return consume(quit);
    }
    if (name === ":") return consume(openPalette);
    const module = moduleKeys.indexOf(name);
    if (module !== -1 && name.length === 1 && (module < 10 || activeIndex === 0)) {
      return consume(() => show(module + 1));
    }
    if (active()?.onKey?.(name, context)) return consume(() => undefined);
    const own = active()?.actions?.find((action) => action.keys.includes(name));
    if (own) return consume(() => runAction(own));
    if (name === "tab") return consume(() => cycleFocus(key.shift ? -1 : 1));
  };
  const onPaste = (event: PasteEvent) => {
    overlays.handlePaste(event);
  };
  renderer.keyInput.on("keypress", onKey);
  renderer.keyInput.on("paste", onPaste);
  const onDestroy = () => {
    cleanup();
    close();
  };
  const cleanup = () => {
    renderer.off("destroy", onDestroy);
    renderer.keyInput.off("keypress", onKey);
    renderer.keyInput.off("paste", onPaste);
    renderer.off("resize", onResize);
    renderer.off("blur", onBlur);
    renderer.off("focus", onFocus);
    stopWatchers();
    overlays.destroy();
    active()?.onLeave?.(context);
    // Hidden tabs are detached from the root, so the renderer cannot own their cleanup.
    for (const node of mounted.values()) node.destroyRecursively();
    mounted.clear();
    tooSmall.destroyRecursively();
    app.destroyRecursively();
  };
  renderer.once("destroy", onDestroy);

  applySize();
  const initial = options.initialTab ?? defaultInitialTab();
  show(Math.max(0, screens.findIndex((s) => s.id === initial)));

}
