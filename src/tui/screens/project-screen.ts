/** Shared lifecycle and layout for Designfy's project lists and detail views. */
import { BoxRenderable, MarkdownRenderable, SyntaxStyle, TextRenderable, type CliRenderer, type Renderable } from "@opentui/core";
import { fitText, heading, keyValueRow, listPanel, listWidth, matchesFilter, meter, scrollPanel, spinner, stateView, statusTag, type TuiListItem, type StatusKind } from "../components.ts";
import type { Screen, ScreenAction, ScreenContext } from "../screen.ts";
import { SHORT_HEIGHT } from "../spacing.ts";
import type { Theme } from "../theme.ts";

type Row = { id: string };
type Outcome = { summary: string; lines: string[] };
type ProgressStep = <T>(label: string, run: () => T | Promise<T>) => Promise<T>;
type ConfirmedPlan = { title: string; lines: string[]; steps?: number; apply: (step: ProgressStep) => Outcome | Promise<Outcome> };
type ViewAction<T extends Row> = Omit<ScreenAction, "run"> & { run: (view: ProjectView<T>) => void | Promise<void> };

interface ProjectOptions<T extends Row> {
  id: string;
  title: string;
  icon: Screen["icon"];
  description: string;
  empty: string | (() => string);
  emptyHint?: string | (() => string | undefined);
  listTitle?: string;
  detailTitle?: string;
  multiple?: boolean;
  load: (cwd: string) => T[] | Promise<T[]>;
  label: (row: T) => string | TuiListItem;
  detail: (row: T, view: ProjectView<T>) => void;
  summary?: () => string;
  filterText?: (row: T) => string;
  watch?: (cwd: string) => readonly string[];
  actions?: readonly ViewAction<T>[];
}

function nextTurn(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Creates key metadata used by the shell, help, and command palette. */
export function shortcut<T extends Row>(
  key: string, description: string, run: ViewAction<T>["run"], label?: string,
): ViewAction<T> {
  return { keys: key === "return" ? ["return", "enter"] : [key], description, label, run };
}

/** Adapts the static registry to a separate mutable screen per renderer. */
export function scopedScreen(create: () => Screen): Screen {
  const metadata = create();
  const instances = new WeakMap<CliRenderer, Screen>();
  function screen(ctx: ScreenContext): Screen {
    let instance = instances.get(ctx.renderer);
    if (!instance) {
      instance = create();
      instances.set(ctx.renderer, instance);
    }
    return instance;
  }
  return {
    ...metadata,
    actions: metadata.actions?.map((action, index) => ({
      ...action,
      run: (ctx) => screen(ctx).actions![index]!.run(ctx),
    })),
    mount: (ctx) => screen(ctx).mount(ctx),
    onEnter: (ctx) => screen(ctx).onEnter?.(ctx),
    onLeave: (ctx) => screen(ctx).onLeave?.(ctx),
    onPause: (ctx) => screen(ctx).onPause?.(ctx),
    onResume: (ctx) => screen(ctx).onResume?.(ctx),
    beforeKey: (key, ctx) => screen(ctx).beforeKey?.(key, ctx) ?? false,
    onKey: (key, ctx) => screen(ctx).onKey?.(key, ctx) ?? false,
  };
}

function projectViewLayout(ctx: ScreenContext) {
  const layout = ctx.layout();
  const compact = layout === "compact";
  const short = ctx.short?.() ?? ctx.renderer.height < SHORT_HEIGHT;
  const width = compact ? ctx.renderer.width - ctx.space.pageX * 2 : listWidth(ctx.renderer.width, layout === "wide" ? 42 : 35);
  return { compact, short, width };
}

/** Displays and operates a keyboard-accessible list with a scrollable detail pane. */
export class ProjectView<T extends Row> {
  ctx!: ScreenContext;
  cwd = process.cwd();
  readonly marked = new Set<string>();
  private rows: T[] = [];
  private filtered: T[] = [];
  private query = "";
  private selectedId?: string;
  private loadRequest?: AbortController;
  private readerRequest?: AbortController;
  private active = false;
  private running = false;
  private paused = false;
  private phase: "loading" | "ready" | "error" = "loading";
  private failure = "";
  private outcome?: Outcome;
  private result?: { kind: "ok" | "error"; outcome: Outcome };
  private pending?: { key: string; label: string; plan: ConfirmedPlan };
  private progress?: { start: number; done: number; total: number; log: Array<{ kind: "ok" | "error"; label: string }> };
  private progressTimer?: ReturnType<typeof setInterval>;
  private clock?: TextRenderable;
  private operation = "";
  private root!: BoxRenderable;
  private panels!: BoxRenderable;
  private summary!: TextRenderable;
  private list!: ReturnType<typeof listPanel>;
  private details!: ReturnType<typeof scrollPanel>;
  private state?: Renderable;
  private reading = false;
  private animation!: ReturnType<typeof spinner>;

  constructor(private readonly options: ProjectOptions<T>) {}

  get selected(): T | undefined { return this.filtered[this.list.selected()]; }
  get visibleMarks(): T[] { return this.filtered.filter(({ id }) => this.marked.has(id)); }

  mount(ctx: ScreenContext): Renderable {
    this.ctx = ctx;
    const { renderer, theme, space } = ctx;
    this.cwd = process.cwd();
    const { compact, short, width } = projectViewLayout(ctx);
    this.root = new BoxRenderable(renderer, { flexDirection: "column", flexGrow: 1, minHeight: 0, gap: short ? 0 : space.gapY });
    this.summary = new TextRenderable(renderer, { fg: theme.textDim, wrapMode: short ? "none" : "word", truncate: short, flexShrink: 0 });
    this.root.add(this.summary);
    this.animation = spinner(renderer, theme, { label: "" });
    this.animation.box.visible = false;
    this.root.add(this.animation.box);
    this.panels = new BoxRenderable(renderer, {
      flexDirection: compact ? "column" : "row", gap: compact ? space.gapY : space.gapX, flexGrow: 1, minHeight: 0,
    });
    this.list = listPanel(renderer, theme, {
      title: this.options.listTitle ?? this.options.title, items: [], empty: "No matching items", icons: ctx.icons,
      width: compact ? undefined : width,
      onSelect: () => this.select(), active: true,
    });
    if (!compact) {
      this.list.box.flexGrow = 0;
      this.list.box.flexShrink = 0;
      this.panels.onSizeChange = () => {
        this.list.box.width = projectViewLayout(ctx).width;
        this.updateListTitle();
      };
    }
    this.details = scrollPanel(renderer, theme, { title: this.options.detailTitle ?? "Details", flexGrow: 1 });
    this.details.body.on("focused", () => this.paintDetailAppearance());
    this.details.body.on("blurred", () => this.paintDetailAppearance());
    this.panels.add(this.list.box);
    this.panels.add(this.details);
    this.root.add(this.panels);
    this.panels.visible = false;
    return this.root;
  }

  enter(): void {
    this.active = true;
    this.paused = false;
    if (this.running) this.paint();
    else void this.reload();
    this.syncClock();
  }

  leave(): void {
    this.active = false;
    this.loadRequest?.abort();
    this.readerRequest?.abort();
    this.reading = false;
    this.animation?.stop();
    this.pending = undefined;
    this.syncClock();
  }

  pause(paused: boolean): void {
    this.paused = paused;
    this.paintActivity();
    this.syncClock();
  }

  async reload(): Promise<void> {
    if (!this.active) return;
    this.loadRequest?.abort();
    this.readerRequest?.abort();
    this.reading = false;
    const request = new AbortController();
    this.loadRequest = request;
    this.phase = "loading";
    this.paint();
    await nextTurn();
    if (request.signal.aborted) return;
    try {
      const rows = await this.options.load(this.cwd);
      if (request.signal.aborted) return;
      this.rows = rows;
      this.phase = "ready";
    } catch (error) {
      if (request.signal.aborted) return;
      this.rows = [];
      this.failure = message(error);
      this.phase = "error";
    }
    this.paint();
  }

  private paintActivity(): void {
    const busy = this.active && Boolean(this.operation);
    this.animation.box.visible = busy;
    if (busy) this.animation.setLabel(this.operation);
    if (busy && !this.paused && this.ctx.motion) this.animation.start();
    else this.animation.stop();
  }

  private paint(): void {
    const { renderer, theme, icons } = this.ctx;
    this.state?.destroyRecursively();
    this.state = undefined;
    const summary = this.options.summary?.() ?? "";
    this.summary.content = summary;
    this.summary.visible = Boolean(summary);
    this.paintActivity();
    this.panels.visible = this.phase === "ready" && Boolean(this.rows.length || this.outcome || this.pending || this.progress || this.result);
    if (this.panels.visible) {
      this.list.box.visible = !this.reading;
      this.paintList();
      if (!this.reading) this.paintDetail();
      if (!renderer.currentFocusedRenderable) {
        if (this.pending || this.progress || this.result) this.focusDetail();
        else this.list.box.focus();
      }
    } else {
      const kind = this.phase === "ready" ? "empty" : this.phase;
      const { empty, emptyHint } = this.options;
      const emptyTitle = typeof empty === "function" ? empty() : empty;
      const emptyMessage = typeof emptyHint === "function" ? emptyHint() : emptyHint;
      const title = kind === "loading" ? "Loading…" : kind === "error" ? `Unable to load ${this.options.title.toLowerCase()}` : emptyTitle;
      const detail = kind === "error" ? this.failure : kind === "empty" ? emptyMessage : undefined;
      this.state = stateView(renderer, theme, icons, {
        kind, title, message: detail,
        action: kind === "loading" ? undefined : { key: "r", label: "reload", onPress: () => { void this.reload(); } },
      });
      this.root.add(this.state);
    }
    this.status();
  }

  private status(): void {
    const status = this.operation || this.result?.outcome.summary
      || (this.phase === "loading" ? "Loading…" : this.phase === "error" ? "Load failed" :
        this.options.multiple ? `${this.visibleMarks.length} marked` : `${this.filtered.length} ${this.filtered.length === 1 ? "item" : "items"}`);
    const kind = this.result?.kind;
    this.ctx.status(kind ? `${this.ctx.icons[kind]} ${status}` : status, kind);
  }

  private paintList(): void {
    const labeled = this.rows.map((row) => {
      const value = this.options.label(row);
      return { row, label: typeof value === "string" ? { content: value } : value };
    });
    const filtered = this.query ? labeled.filter(({ row, label }) => {
      const title = typeof label.content === "string" ? label.content : label.content.chunks.map(({ text }) => text).join("");
      return matchesFilter([title, label.group, label.detail, row.id, this.options.filterText?.(row)].join(" "), this.query);
    }) : labeled;
    this.filtered = filtered.map(({ row }) => row);
    const index = this.filtered.findIndex(({ id }) => id === this.selectedId);
    this.list.setItems(filtered.map(({ row, label }) =>
      this.options.multiple ? { ...label, checked: this.marked.has(row.id) } : label), Math.max(0, index));
    this.updateListTitle();
    if (this.selected) this.selectedId = this.selected.id;
  }

  private updateListTitle(): void {
    const { width } = projectViewLayout(this.ctx);
    const marked = this.options.multiple ? ` · ${this.marked.size} marked` : "";
    const label = this.query ? `Tab${marked} · ${this.filtered.length}/${this.rows.length} · /${this.query}`
      : `Tab · ${this.options.listTitle ?? this.options.title}${marked}`;
    this.list.title(fitText(label, width - 4));
  }

  /** Opens the host filter field and updates the visible rows on each edit. */
  filter(): void {
    if (this.phase !== "ready") return;
    this.ctx.filter?.(this.query, (query) => {
      this.query = query;
      this.paintList();
      this.paintDetail();
      this.status();
    });
  }

  private clearDetail(): void {
    for (const child of this.details.body.getChildren()) child.destroyRecursively();
    this.details.body.scrollTo(0);
  }

  private paintDetailAppearance(): void {
    if (this.ctx.renderer.isDestroyed || this.details.body.isDestroyed) return;
    const { theme } = this.ctx;
    const state = this.pending ? ["PLAN", theme.warn] as const
      : this.progress ? ["PROGRESS", theme.accent] as const
      : this.result ? ["RESULT", theme[this.result.kind]] as const
      : [this.options.detailTitle ?? "Details", undefined] as const;
    this.details.appearance(theme, `Tab · ${state[0]}`, this.details.body.focused, state[1]);
  }

  private paintDetail(): void {
    this.clearDetail();
    this.paintDetailAppearance();
    const { renderer, theme, icons } = this.ctx;
    if (this.pending) {
      const { plan, key } = this.pending;
      this.heading(plan.title);
      this.add(statusTag(renderer, theme, icons, "pending", `Press ${key} again to run`));
      this.text("Any other key cancels", theme.textDim);
      this.lines(plan.lines);
      return;
    }
    if (this.progress) {
      this.heading(this.operation);
      this.add(meter(renderer, theme, this.progress.done, this.progress.total, { label: "Steps" }));
      this.clock = new TextRenderable(renderer, { fg: theme.textDim, height: 1 });
      this.add(this.clock);
      this.tickClock();
      for (const step of this.progress.log.slice(-4)) this.tag(step.kind, step.label);
      return;
    }
    if (this.result) {
      this.tag(this.result.kind, this.result.outcome.summary);
      this.lines(this.result.outcome.lines);
      return;
    }
    if (this.outcome) {
      this.heading(this.outcome.summary);
      this.lines(this.outcome.lines);
    }
    if (this.selected) this.options.detail(this.selected, this);
    else if (this.query) this.text("No results match the filter", theme.textDim);
  }

  private select(): void {
    this.cancelPlan();
    this.selectedId = this.selected?.id;
    this.outcome = undefined;
    this.result = undefined;
    this.paintDetail();
    this.status();
  }

  private tickClock(): void {
    if (this.progress && this.clock && !this.clock.isDestroyed) {
      this.clock.content = `${Math.floor((Date.now() - this.progress.start) / 1000)} s elapsed`;
    }
  }

  private syncClock(): void {
    clearInterval(this.progressTimer);
    this.progressTimer = undefined;
    if (this.active && !this.paused && this.progress) {
      this.progressTimer = setInterval(() => this.tickClock(), 250);
    }
  }

  /** Adds a semantic status label to the detail panel. */
  tag(kind: StatusKind, content: string, fill = false): void {
    this.add(statusTag(this.ctx.renderer, this.ctx.theme, this.ctx.icons, kind, content, fill));
  }

  /** Adds one fixed-width label and its aligned value to the preview. */
  field(label: string, value: string): void {
    this.add(keyValueRow(this.ctx.renderer, this.ctx.theme, label, value, 15));
  }

  heading(text: string): void { this.details.add(heading(this.ctx.renderer, this.ctx.theme, text)); }

  text(content: string, fg: Theme["text"] = this.ctx.theme.text): void {
    this.details.add(new TextRenderable(this.ctx.renderer, { content, fg, wrapMode: "word", flexShrink: 0 }));
  }

  lines(lines: readonly string[]): void {
    for (const line of lines) this.text(line);
  }

  section(label: string, content: string | readonly string[]): void {
    this.heading(label);
    if (typeof content === "string") this.text(content || "None");
    else this.lines(content.length ? content : ["None"]);
  }

  add(node: Renderable): void { this.details.add(node); }

  focusDetail(): void { if (this.panels.visible) this.details.focus(); }

  report(outcome: Outcome): void {
    this.outcome = outcome;
    this.paintDetail();
    this.focusDetail();
  }

  toggle(): void {
    const id = this.selected?.id;
    if (!id || this.phase !== "ready") return;
    if (this.marked.has(id)) this.marked.delete(id);
    else this.marked.add(id);
    this.paintList();
    this.status();
  }

  markAll(): void {
    if (this.phase !== "ready") return;
    for (const row of this.filtered) this.marked.add(row.id);
    this.paintList();
    this.status();
  }

  clearMarks(): void {
    this.marked.clear();
    if (this.phase === "ready") this.paintList();
    this.status();
  }

  async read(title: string, load: () => string | Promise<string>): Promise<void> {
    if (this.phase !== "ready") return;
    this.readerRequest?.abort();
    const request = new AbortController();
    this.readerRequest = request;
    this.reading = true;
    this.list.box.body.blur();
    this.list.box.visible = false;
    this.clearDetail();
    this.heading(title);
    this.text("Loading…");
    this.focusDetail();
    await nextTurn();
    if (request.signal.aborted) return;
    try {
      const content = await load();
      if (request.signal.aborted) return;
      this.clearDetail();
      this.heading(title);
      const { renderer, theme } = this.ctx;
      const style = SyntaxStyle.fromStyles({
        default: { fg: theme.text },
        "markup.heading": { fg: theme.accent, bold: true },
        "markup.link": { fg: theme.accentSecondary, underline: true },
        "markup.raw": { fg: theme.textStrong },
      }, renderer.nativeScene);
      const markdown = new MarkdownRenderable(renderer, {
        content, syntaxStyle: style, internalBlockMode: "top-level", fg: theme.text, width: "100%",
      });
      markdown.once("destroyed", () => style.destroy());
      this.add(markdown);
    } catch (error) {
      if (request.signal.aborted) return;
      this.clearDetail();
      this.heading(title);
      this.text(message(error), this.ctx.theme.error);
    }
  }

  /** Shows the exact plan; pressing its shortcut again starts the operation. */
  confirmPlan(key: string, label: string, prepare: () => ConfirmedPlan | undefined): void | Promise<void> {
    if (this.pending?.key === key) return this.runPlan();
    if (this.running || !this.active || this.phase !== "ready") return;
    this.cancelPlan();
    const plan = prepare();
    if (!plan) return;
    this.result = undefined;
    this.outcome = undefined;
    this.pending = { key, label, plan };
    this.paintDetail();
    this.focusDetail();
  }

  private cancelPlan(): boolean {
    if (!this.pending) return false;
    this.pending = undefined;
    this.ctx.notify("Plan canceled", "info");
    return true;
  }

  /** Handles keyboard confirmation before the shell can navigate away. */
  confirmKey(key: string): boolean {
    if (!this.pending) return false;
    if (this.pending.key === key) void this.runPlan();
    else if (this.cancelPlan()) this.paintDetail();
    return true;
  }

  private async runPlan(): Promise<void> {
    const pending = this.pending;
    if (!pending || this.running) return;
    const { plan, label } = pending;
    this.pending = undefined;
    this.running = true;
    this.operation = label;
    this.progress = { start: Date.now(), done: 0, total: plan.steps ?? 1, log: [] };
    if (this.active) {
      this.paint();
      this.syncClock();
    }
    const step: ProgressStep = async (stepLabel, run) => {
      try {
        const result = await run();
        this.progress!.done++;
        this.progress!.log.push({ kind: "ok", label: stepLabel });
        return result;
      } catch (error) {
        this.progress!.log.push({ kind: "error", label: stepLabel });
        throw error;
      } finally {
        if (this.active) this.paintDetail();
      }
    };
    try {
      // Yield once so the progress panel can paint before dispatching a process or a local write.
      await nextTurn();
      if (this.ctx.renderer.isDestroyed) return;
      const outcome = plan.steps === undefined
        ? await step(plan.title, () => plan.apply(step))
        : await plan.apply(step);
      this.result = { kind: "ok", outcome: { ...outcome, lines: [
        ...this.progress.log.slice(-4).map(({ label: item }) => `${this.ctx.icons.ok} ${item}`), ...outcome.lines,
      ] } };
    } catch (error) {
      this.result = { kind: "error", outcome: { summary: "Operation failed", lines: [
        ...this.progress.log.slice(-4).map(({ kind, label: item }) => `${this.ctx.icons[kind]} ${item}`), message(error),
      ] } };
    } finally {
      this.running = false;
      this.operation = "";
      this.progress = undefined;
      this.syncClock();
      if (this.active && !this.ctx.renderer.isDestroyed) {
        if (this.result) this.ctx.notify(this.result.outcome.summary, this.result.kind);
        this.paint();
        await this.reload();
      }
    }
  }

  key(name: string): boolean {
    const { renderer } = this.ctx;
    const detailFocused = renderer.currentFocusedRenderable === this.details.body;
    if (name === "tab" && this.reading) {
      this.readerRequest?.abort();
      this.reading = false;
      this.list.box.visible = true;
      this.list.box.focus();
      this.paintDetail();
      return true;
    }
    if (this.phase !== "ready") return false;
    const delta = { up: -1, k: -1, down: 1, j: 1, pageup: -5, pagedown: 5 }[name];
    if (this.options.actions?.some(({ keys }) => keys.includes(name))) return false;
    if (delta === undefined && name !== "home" && name !== "end") return false;
    if (this.reading || detailFocused) {
      if (delta !== undefined) this.details.body.scrollBy(delta);
      else this.details.body.scrollTo(name === "home" ? 0 : Infinity);
    } else if (this.filtered.length) {
      if (delta !== undefined) this.list.move(delta);
      else this.list.select(name === "home" ? 0 : this.filtered.length - 1);
      this.select();
    }
    return true;
  }
}

/** Registers a project view with standard selection, loading and cleanup actions. */
export function projectScreen<T extends Row>(options: ProjectOptions<T>): Screen {
  const view = new ProjectView(options);
  const marks = options.multiple ? [
    shortcut<T>("space", "toggle mark", (view) => view.toggle(), "Space"),
    shortcut<T>("a", "mark all", (view) => view.markAll()),
    shortcut<T>("n", "clear marks", (view) => view.clearMarks()),
  ] : [];
  const navigation = [
    ["up", "↑", "previous row or scroll up"],
    ["down", "↓", "next row or scroll down"],
    ["pageup", "PgUp", "previous page"],
    ["pagedown", "PgDn", "next page"],
    ["home", "Home", "go to the start"],
    ["end", "End", "go to the end"],
  ] as const;
  const navigationActions = navigation.map(([key, label, description]) => ({
    ...shortcut<T>(key, description, (view) => { view.key(key); }, label),
    hidden: true,
  }));
  const actions = [...(options.actions ?? []), ...marks, shortcut<T>("/", "filter", (view) => view.filter()), shortcut<T>("r", "reload", (view) => view.reload()), ...navigationActions];
  return {
    id: options.id, title: options.title, icon: options.icon, description: options.description,
    actions: actions.map((action) => ({ ...action, run: () => action.run(view) })),
    watch: options.watch && (() => options.watch!(process.cwd())),
    mount: (ctx) => view.mount(ctx),
    onEnter: () => view.enter(),
    onLeave: () => view.leave(),
    onPause: () => view.pause(true),
    onResume: () => view.pause(false),
    beforeKey: (key) => view.confirmKey(key),
    onKey: (key) => view.key(key),
  };
}

/** Formats a command plan for display, preserving each argument as a single shell word. */
export function commandLine({ command, args }: { command: string; args: string[] }): string {
  return [command, ...args].map((part) => /^[\w@./:=+-]+$/.test(part) ? part : "'" + part.replaceAll("'", "'\\''") + "'").join(" ");
}
