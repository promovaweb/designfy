/**
 * Visual components shared by the screens.
 *
 * `panel` creates a rounded card with a title in its border. `keyValueRow` builds "label  value" with a dimmed label. `list`
 * stacks items with a marker. `button` and `listPanel` are clickable and
 * show hover; each one runs the same function as its keyboard shortcut.
 * Components inherit the screen's layout constraints in wide, medium and
 * compact mode; they do not choose breakpoints or watch files themselves.
 * Lists handle Up/k, Down/j and Enter. Tables also handle Home/End and
 * PageUp/PageDown; header clicks sort, row clicks select and a second click
 * activates. Buttons display their screen action key, and links copy on click.
 * Everything receives the theme so screens never hard-code colors.
 */
import {
  ScrollBoxRenderable,
  parseColor,
  BoxRenderable,
  TextRenderable,
  TextAttributes,
  type CliRenderer,
  type ColorInput,
  type KeyEvent,
  LinearScrollAccel,
  StyledText,
  link as styledLink,
} from "@opentui/core";
import { spacingFor, controlSpacing } from "./spacing.ts";
import { clickable } from "./pointer.ts";
import { glyphs, type Theme } from "./theme.ts";
import {
  withIcon,
  currentIcons,
  iconSets,
  type IconName,
  type IconSet,
} from "./icons.ts";

/** Optional icon for a panel title: the set and the role. */
export interface TitleIcon {
  icons: IconSet;
  name: IconName;
}

/** A rounded panel owns its border and the viewport inside. */
class Card<T extends BoxRenderable> extends BoxRenderable {
  /** The bordered box or scroll viewport that owns the card content. */
  readonly body: T;
  private fullTitle = "";

  constructor(renderer: CliRenderer, theme: Theme, options: PanelOptions, body: T) {
    super(renderer, {
      flexDirection: "column", minWidth: 0, minHeight: 0,
      flexGrow: options.flexGrow ?? 1,
      flexBasis: options.width === undefined && options.flexGrow ? 0 : "auto",
      width: options.width, height: options.height, overflow: "hidden",
    });
    this.body = body;
    body.onSizeChange = () => this.updateTitle();
    const label = options.icon ? withIcon(options.icon.icons, options.icon.name, options.title) : options.title;
    const title = options.focusKey ? `${options.focusKey} · ${label}` : label;
    this.appearance(theme, title, options.active ?? false);
    if (options.focusKey) {
      const update = () => {
        if (!renderer.isDestroyed && !body.isDestroyed) this.appearance(theme, title, body.focused);
      };
      body.on("focused", update);
      body.on("blurred", update);
    }
    super.add(body);
  }

  /** Updates the border title and colors for focus or an operation phase. */
  appearance(theme: Theme, title: string, active = false, tone?: ColorInput): void {
    this.fullTitle = title;
    this.updateTitle();
    this.body.titleColor = tone ?? (active ? theme.accent : theme.textDim);
    this.body.borderColor = tone ?? (active ? theme.borderActive : theme.border);
    this.body.backgroundColor = active ? theme.surfaceHigh : theme.surface;
  }

  private updateTitle(): void {
    const width = this.body.width;
    const title = width > 0 ? fitText(this.fullTitle, width - 6) : this.fullTitle;
    this.body.title = title ? ` ${title} ` : undefined;
  }

  /** Adds a decoration after the card body without entering its scroll content. */
  addDecoration(node: BoxRenderable): void { super.add(node); }

  /** Focuses the native viewport so keyboard scrolling remains available. */
  override focus(): void { this.body.focus(); }

  /** Adds screen content inside the bordered viewport. */
  override add(child: Parameters<BoxRenderable["add"]>[0], index?: number): number {
    return this.body.add(child, index);
  }
}

/** Layout and identity of a titled card. */
interface PanelOptions {
  title: string;
  icon?: TitleIcon;
  flexGrow?: number;
  width?: number | "auto" | `${number}%`;
  height?: number | "auto" | `${number}%`;
  active?: boolean;
  focusKey?: string;
}

/** Creates a card with a title inside its rounded border. */
export function panel(renderer: CliRenderer, theme: Theme, options: PanelOptions): Card<BoxRenderable> {
  const space = spacingFor(renderer.width);
  const body = new BoxRenderable(renderer, {
    flexDirection: "column", flexGrow: 1, minHeight: 0, minWidth: 0,
    borderStyle: "rounded", focusedBorderColor: theme.borderActive, borderColor: options.active ? theme.borderActive : theme.border,
    backgroundColor: theme.surface,
    paddingLeft: space.cardPadX, paddingRight: space.cardPadX,
    paddingTop: space.cardPadY, paddingBottom: space.cardPadY,
  });
  return new Card(renderer, theme, options, body);
}

/** Paints a narrow track and thumb while preserving native scrollbar input. */
export function thinScrollbar(renderer: CliRenderer, box: ScrollBoxRenderable, theme: Theme, host: BoxRenderable): void {
  box.verticalScrollBar.resetVisibilityControl();
  const track = parseColor(theme.border);
  const thumbColor = parseColor(theme.textDim);
  const background = parseColor(theme.surface);
  const overlay = new BoxRenderable(renderer, { position: "absolute", right: host instanceof Card ? 1 : spacingFor(renderer.width).cardPadX + 1, top: 0, width: 1, height: "100%", zIndex: 1 });
  overlay.onMouse = (event) => { box.processMouseEvent(event); event.stopPropagation(); };
  overlay.renderAfter = (buffer) => {
    const bar = box.verticalScrollBar;
    if (!bar.visible || bar.scrollSize <= bar.viewportSize || bar.height <= 0) return;
    const thumb = Math.max(1, Math.floor(bar.height * bar.viewportSize / bar.scrollSize));
    const offset = Math.round((bar.height - thumb) * bar.scrollPosition / Math.max(1, bar.scrollSize - bar.viewportSize));
    for (let y = 0; y < bar.height; y++) {
      const selected = y >= offset && y < offset + thumb;
      buffer.drawText(selected ? "┃" : "│", bar.x, bar.y + y, selected ? thumbColor : track, background);
    }
  };
  if (host instanceof Card) host.addDecoration(overlay);
  else host.add(overlay);
}

/** Creates a titled card with a keyboard- and wheel-scrollable body. */
export function scrollPanel(renderer: CliRenderer, theme: Theme, options: PanelOptions): Card<ScrollBoxRenderable> {
  const space = spacingFor(renderer.width);
  const body = new ScrollBoxRenderable(renderer, {
    flexGrow: 1, minWidth: 0, minHeight: 0,
    borderStyle: "rounded", focusedBorderColor: theme.borderActive, borderColor: options.active ? theme.borderActive : theme.border,
    backgroundColor: theme.surface,
    paddingLeft: space.cardPadX, paddingRight: space.cardPadX,
    paddingTop: space.cardPadY, paddingBottom: space.cardPadY,
    scrollY: true, scrollX: false, scrollAcceleration: new LinearScrollAccel(),
    scrollbarOptions: { trackOptions: { backgroundColor: theme.border, foregroundColor: theme.textDim } },
    contentOptions: { flexDirection: "column" },
  });
  const card = new Card(renderer, theme, options, body);
  thinScrollbar(renderer, body, theme, card);
  return card;
}

/** Fits terminal cells with an ellipsis, optionally preserving the path suffix. */
export function fitText(text: string, width: number, middle = false): string {
  if (width <= 0) return "";
  if (Bun.stringWidth(text) <= width) return text;
  const chars = Array.from(text);
  const suffix: string[] = [];
  if (middle) {
    while (chars.length && Bun.stringWidth(suffix.join("")) < Math.floor((width - 1) * 0.75)) {
      suffix.unshift(chars.pop()!);
    }
  }
  while (chars.length && Bun.stringWidth(chars.join("") + suffix.join("")) > width - 1) chars.pop();
  return `${chars.join("")}…${suffix.join("")}`;
}

/** Creates one aligned key/value row. */
export function keyValueRow(
  renderer: CliRenderer,
  theme: Theme,
  key: string,
  value: string,
  keyWidth: number,
  valueColor?: ColorInput,
): BoxRenderable {
  const row = new BoxRenderable(renderer, { flexDirection: "row", flexShrink: 0, minWidth: 0 });
  row.add(
    new TextRenderable(renderer, {
      content: key, width: keyWidth, wrapMode: "none",
      fg: theme.textDim,
      selectable: false,
      flexShrink: 0,
    }),
  );
  row.add(new TextRenderable(renderer, { content: " ".repeat(spacingFor(renderer.width).labelGap), flexShrink: 0 }));
  row.add(
    new TextRenderable(renderer, {
      content: value,
      fg: valueColor ?? theme.text,
      wrapMode: "word",
      flexShrink: 1,
      minWidth: 0,
    }),
  );
  return row;
}

/** Creates aligned key/value rows. */
export function keyValueTable(
  renderer: CliRenderer,
  theme: Theme,
  pairs: Array<[string, string, ColorInput?]>,
): BoxRenderable {
  const box = new BoxRenderable(renderer, { flexDirection: "column", flexShrink: 0 });
  const width = Math.max(...pairs.map(([k]) => k.length));
  for (const [k, v, c] of pairs) box.add(keyValueRow(renderer, theme, k, v, width, c));
  return box;
}

/** Creates a strong heading. */
export function heading(
  renderer: CliRenderer,
  theme: Theme,
  text: string,
): TextRenderable {
  return new TextRenderable(renderer, {
    content: text,
    fg: theme.textStrong,
    attributes: TextAttributes.BOLD,
  });
}

/** Creates secondary text. */
export function dim(renderer: CliRenderer, theme: Theme, text: string): TextRenderable {
  return new TextRenderable(renderer, { content: text, fg: theme.textDim });
}

/** Creates a static bulleted list. */
export function list(
  renderer: CliRenderer,
  theme: Theme,
  items: string[],
  marker = glyphs.bullet,
): BoxRenderable {
  const box = new BoxRenderable(renderer, { flexDirection: "column" });
  for (const item of items) {
    const row = new BoxRenderable(renderer, { flexDirection: "row" });
    row.add(new TextRenderable(renderer, { content: `${marker} `, fg: theme.accent }));
    row.add(new TextRenderable(renderer, { content: item, fg: theme.text }));
    box.add(row);
  }
  return box;
}

/**
 * Creates a one-line clickable button: `[key] label`. A left click runs
 * `onPress`; the screen also lists the same function in `actions` with
 * `key`, so the button and the shortcut stay the same command.
 */
export function button(
  renderer: CliRenderer,
  theme: Theme,
  options: {
    key: string;
    label: string;
    icon?: TitleIcon;
    onPress: () => void;
  },
): BoxRenderable {
  const label = options.icon
    ? withIcon(options.icon.icons, options.icon.name, options.label)
    : options.label;
  const text = new TextRenderable(renderer, {
    content: ` ${label}`,
    fg: theme.text,
    selectable: false,
  });
  const box = new BoxRenderable(renderer, {
    flexDirection: "row",
    height: 1,
    flexShrink: 0,
  });
  box.add(
    new TextRenderable(renderer, {
      content: `[${options.key}]`,
      fg: theme.accent,
      attributes: TextAttributes.BOLD,
      selectable: false,
    }),
  );
  box.add(text);

  function updateHover(inside: boolean): void {
    text.fg = inside ? theme.accent : theme.text;
  }

  clickable(renderer, box, {
    onClick: options.onPress,
    onHover: updateHover,
  });
  return box;
}

/** Creates vertical spacing. */
export function spacer(renderer: CliRenderer, height = 1): BoxRenderable {
  return new BoxRenderable(renderer, { height });
}

/** A list label with optional styled content and a nonselectable group heading. */
export interface TuiListItem {
  content: string | StyledText;
  group?: string;
  detail?: string;
  state?: StatusKind;
  stateLabel?: string;
  checked?: boolean;
}

/** Creates a selectable list with group counts, semantic rows and focus styling. */
export function listPanel(
  renderer: CliRenderer,
  theme: Theme,
  options: {
    title: string;
    items: readonly (string | TuiListItem)[];
    empty?: string;
    onSelect?: (index: number) => void;
    icons?: IconSet;
    width?: number;
    active?: boolean;
  },
) {
  const card = scrollPanel(renderer, theme, { title: options.title, width: options.width, active: options.active ?? true });
  const box = card.body;
  const icons = options.icons ?? currentIcons();
  let index = -1;
  let hovered = -1;
  let rows: { box: BoxRenderable; edge: TextRenderable; name: TextRenderable; detail: TextRenderable }[] = [];
  let items: readonly TuiListItem[] | undefined;
  let title = options.title;
  let focused = options.active ?? true;

  function paint(): void {
    if (renderer.isDestroyed || box.isDestroyed) return;
    for (const [i, row] of rows.entries()) {
      if (row.edge.isDestroyed) continue;
      const item = items![i]!;
      const active = i === index;
      const fg = active ? (focused ? theme.selectionText : theme.accent) : i === hovered ? theme.textStrong : theme.text;
      row.box.backgroundColor = active ? (focused ? theme.selection : theme.surfaceHigh) : i % 2 ? theme.surfaceHigh : theme.surface;
      row.edge.content = active ? "> " : (item.state ? `${icons.designfy === "*" ? "|" : "▏"} ` : "  ");
      row.edge.fg = active ? theme.accent : item.state ? theme[statusStyles[item.state].color] : theme.border;
      row.name.fg = fg;
      row.name.attributes = active || item.detail ? TextAttributes.BOLD : TextAttributes.NONE;
      const checked = item.checked === undefined ? "" : icons.designfy === "*" ? (item.checked ? "[x] " : "[ ] ") : item.checked ? "■ " : "□ ";
      row.name.content = typeof item.content === "string" ? checked + item.content : new StyledText([{ __isChunk: true, text: checked }, ...item.content.chunks]);
      row.detail.content = item.detail ? `  ${item.detail}` : "";
    }
  }

  function highlight(next: number): void {
    if (!rows.length || !Number.isFinite(next)) return;
    index = Math.max(0, Math.min(rows.length - 1, Math.trunc(next)));
    paint();
    box.scrollChildIntoView(rows[index]!.box);
  }

  function select(next: number): void {
    if (!rows.length || !Number.isFinite(next)) return;
    highlight(next);
    options.onSelect?.(index);
  }

  function move(delta: number): void {
    highlight(index + delta);
  }

  function refreshTitle(next = title, active = focused): void {
    if (renderer.isDestroyed || box.isDestroyed) return;
    title = next;
    focused = active;
    card.appearance(theme, title, focused);
    paint();
  }

  function setItems(next: readonly (string | TuiListItem)[], selected = index): void {
    const normalized = next.map((item) => typeof item === "string" ? { content: item } : item);
    const rebuild = items?.length !== normalized.length || normalized.some((item, i) =>
      item.group !== items?.[i]?.group || Boolean(item.detail) !== Boolean(items?.[i]?.detail)
      || item.state !== items?.[i]?.state || item.stateLabel !== items?.[i]?.stateLabel);
    items = normalized;
    if (rebuild) {
      for (const child of box.getChildren()) child.destroyRecursively();
      const counts = new Map<string, number>();
      for (const { group } of items) if (group) counts.set(group, (counts.get(group) ?? 0) + 1);
      let group: string | undefined;
      hovered = -1;
      rows = items.map((item, i) => {
        if (item.group && item.group !== group) {
          box.add(new TextRenderable(renderer, {
            content: `${item.group} · ${counts.get(item.group)}`, attributes: TextAttributes.BOLD,
            height: 1, flexShrink: 0, wrapMode: "none", fg: theme.textDim, truncate: true,
          }));
        }
        group = item.group;
        const row = new BoxRenderable(renderer, { height: item.detail ? 2 : 1, flexDirection: "column", flexShrink: 0, minWidth: 0, overflow: "hidden" });
        const first = new BoxRenderable(renderer, { height: 1, flexDirection: "row", flexShrink: 0, minWidth: 0 });
        const edge = new TextRenderable(renderer, { width: 2, flexShrink: 0, wrapMode: "none", selectable: false });
        const name = new TextRenderable(renderer, { flexGrow: 1, minWidth: 0, truncate: true, wrapMode: "none", selectable: false });
        const detail = new TextRenderable(renderer, { height: 1, flexShrink: 0, fg: theme.textDim, truncate: true, wrapMode: "none", selectable: false });
        first.add(edge);
        first.add(name);
        if (item.state) first.add(statusTag(renderer, theme, icons, item.state, item.stateLabel));
        row.add(first);
        row.add(detail);
        detail.visible = Boolean(item.detail);
        clickable(renderer, row, {
          onClick: () => { card.focus(); select(i); },
          onHover: (inside) => {
            hovered = inside ? i : hovered === i ? -1 : hovered;
            paint();
          },
        });
        box.add(row);
        return { box: row, edge, name, detail };
      });
    }
    if (rebuild && !rows.length) box.add(dim(renderer, theme, options.empty ?? "No items"));
    if (!rows.length) index = -1;
    else highlight(selected);
  }

  function handleKeyPress(key: KeyEvent): boolean {
    if (key.name === "up" || key.name === "k") {
      move(-1);
      return true;
    }
    if (key.name === "down" || key.name === "j") {
      move(1);
      return true;
    }
    if (key.name === "return" || key.name === "enter") {
      select(index);
      return true;
    }
    return false;
  }

  box.handleKeyPress = handleKeyPress;
  card.handleKeyPress = handleKeyPress;
  box.on("focused", () => refreshTitle(title, true));
  box.on("blurred", () => refreshTitle(title, false));
  setItems(options.items);
  return { box: card, select, selected: () => index, move, setItems, title: refreshTitle };
}

/** Matches a case- and accent-insensitive query against a list row. */
export function matchesFilter(text: string, query: string): boolean {
  const fold = (value: string) => value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  return fold(text).includes(fold(query.trim()));
}

/** A sortable table column, measured in terminal cells. */
export interface TableColumn {
  key: string;
  title: string;
  width?: number;
  align?: "left" | "right" | "center";
}

/** Builds a sortable, scrollable table with selection and activation. */
export function table(
  renderer: CliRenderer,
  theme: Theme,
  options: {
    columns: TableColumn[];
    rows: Record<string, string>[];
    empty?: string;
    onSelect?: (index: number) => void;
    onActivate?: (index: number) => void;
  },
) {
  const box = new BoxRenderable(renderer, {
    flexDirection: "column",
    flexGrow: 1,
    minHeight: 0,
  });
  const header = new BoxRenderable(renderer, {
    flexDirection: "row",
    height: 1,
    flexShrink: 0,
    paddingLeft: 2,
  });
  const body = new ScrollBoxRenderable(renderer, {
    flexGrow: 1,
    minHeight: 0,
    scrollY: true,
    scrollX: false,
    scrollAcceleration: new LinearScrollAccel(),
    scrollbarOptions: { trackOptions: { backgroundColor: theme.border, foregroundColor: theme.textDim } },
  });
  box.add(header);
  box.add(body);
  let rows = [...options.rows];
  let index = rows.length ? 0 : -1;
  let lastClicked = -1;
  let sortKey = "";
  let descending = false;
  let rowNodes: BoxRenderable[] = [];
  const headers: TextRenderable[] = [];
  /** Creates a cell whose width is assigned from the shared column measurements. */
  function cell(text: string, column: TableColumn): TextRenderable {
    return new TextRenderable(renderer, {
      content: text,
      width: 1,
      flexShrink: 0,
      height: 1,
      wrapMode: "none",
      selectable: false,
      fg: theme.text,
    });
  }
  /** Measures once per column and applies identical widths to headers and rows. */
  function layoutColumns(): void {
    const available = Math.max(0, Math.min(header.width, body.viewport.width || header.width));
    const widths = options.columns.map((column) => column.width ?? Math.max(
      Bun.stringWidth(column.title) + 2,
      ...rows.map((row) => Bun.stringWidth(row[column.key] ?? "")),
    ));
    const gap = controlSpacing.gap;
    const budget = Math.max(0, available - 2 - gap * (widths.length - 1));
    while (widths.reduce((sum, width) => sum + width, 0) > budget) {
      const candidates = widths.map((width, i) => options.columns[i]!.width === undefined ? width : 0);
      const largest = Math.max(...candidates) > 1 ? candidates.indexOf(Math.max(...candidates)) : widths.indexOf(Math.max(...widths));
      widths[largest] = Math.max(0, widths[largest]! - 1);
    }
    /** Aligns a clipped string without depending on intrinsic text layout. */
    function place(node: TextRenderable, text: string, i: number): void {
      const column = options.columns[i]!;
      const width = widths[i]!;
      const clipped = fitText(text, width);
      const padding = Math.max(0, width - Bun.stringWidth(clipped));
      const left = column.align === "right" ? padding : column.align === "center" ? Math.floor(padding / 2) : 0;
      node.width = width + (i < widths.length - 1 ? gap : 0);
      node.content = " ".repeat(left) + clipped + " ".repeat(padding - left);
    }
    headers.forEach((node, i) => {
      const column = options.columns[i]!;
      place(node, column.title.toUpperCase() + (column.key === sortKey ? (descending ? " ▼" : " ▲") : ""), i);
    });
    rowNodes.forEach((node, row) => node.getChildren().forEach((child, i) => {
      if (i > 0) place(child as TextRenderable, rows[row]?.[options.columns[i - 1]!.key] ?? "", i - 1);
    }));
  }
  header.onSizeChange = layoutColumns;
  body.onSizeChange = layoutColumns;
  /** Applies the selection marker, background and text treatment to the table cells. */
  function paint(): void {
    if (renderer.isDestroyed || body.isDestroyed) return;
    for (const [i, node] of rowNodes.entries()) {
      if (node.isDestroyed) continue;
      const selected = i === index;
      (node.getChildren()[0] as TextRenderable).content = selected ? "› " : "  ";
      node.backgroundColor = selected ? (body.focused ? theme.selection : theme.surfaceHigh) : i % 2 ? theme.surfaceHigh : theme.surface;
      for (const child of node.getChildren()) {
        (child as TextRenderable).fg = selected ? (body.focused ? theme.selectionText : theme.accent) : theme.text;
        (child as TextRenderable).attributes = selected ? TextAttributes.BOLD : TextAttributes.NONE;
      }
    }
  }
  body.on("focused", paint);
  body.on("blurred", paint);
  /** Reports a clamped display index without activating the selected row. */
  function select(next: number): void {
    if (!rows.length || !Number.isFinite(next)) return;
    index = Math.max(0, Math.min(rows.length - 1, Math.trunc(next)));
    paint();
    body.scrollChildIntoView(rowNodes[index]!);
    options.onSelect?.(index);
  }
  /** Replaces table rows after sorting or data replacement, retaining selection. */
  function rebuild(): void {
    for (const node of body.getChildren()) {
      body.remove(node);
      node.destroyRecursively();
    }
    function createRow(row: Record<string, string>, i: number): BoxRenderable {
      const node = new BoxRenderable(renderer, {
        flexDirection: "row",
        height: 1,
        flexShrink: 0,
      });
      node.add(new TextRenderable(renderer, { content: "  ", width: 2, height: 1, flexShrink: 0 }));
      for (const column of options.columns) node.add(cell(row[column.key] ?? "", column));
      /** A second click on the same selected row activates it. */
      function clickRow(): void {
        body.focus();
        const activate = lastClicked === i && index === i;
        select(i);
        lastClicked = i;
        if (activate) options.onActivate?.(i);
      }

      function updateHover(inside: boolean): void {
        node.backgroundColor = inside || index === i ? theme.surfaceHigh : theme.surface;
      }

      clickable(renderer, node, {
        onClick: clickRow,
        onHover: updateHover,
      });
      body.add(node);
      return node;
    }

    rowNodes = rows.map(createRow);
    if (!rows.length) body.add(dim(renderer, theme, options.empty ?? "No items"));
    paint();
    layoutColumns();
  }
  /** Toggles sort direction and preserves selection by row identity. */
  function sortBy(key: string): void {
    const selectedRow = rows[index];
    lastClicked = -1;
    descending = sortKey === key ? !descending : false;
    sortKey = key;
    rows.sort(
      (a, b) => (a[key] ?? "").localeCompare(b[key] ?? "") * (descending ? -1 : 1),
    );
    // Keep the caller's array in display order so callback indices stay meaningful.
    options.rows.splice(0, options.rows.length, ...rows);
    index = selectedRow ? rows.indexOf(selectedRow) : -1;
    for (const [i, node] of headers.entries()) {
      const col = options.columns[i]!;
      node.content = `${col.title}${col.key === key ? (descending ? " ▼" : " ▲") : ""}`;
    }
    rebuild();
    if (index >= 0) options.onSelect?.(index);
  }
  for (const column of options.columns) {
    const node = cell(column.title, column);
    node.fg = theme.textDim;
    node.attributes = TextAttributes.BOLD;
    clickable(renderer, node, {
      onClick: () => sortBy(column.key),
      onHover: (inside) => {
        node.fg = inside ? theme.accent : theme.textDim;
      },
    });
    headers.push(node);
    header.add(node);
  }
  function move(delta: number): void {
    select(index + delta);
  }

  function handleKeyPress(key: KeyEvent): boolean {
    switch (key.name) {
      case "up":
      case "k":
        move(-1);
        return true;
      case "down":
      case "j":
        move(1);
        return true;
      case "home":
        select(0);
        return true;
      case "end":
        select(rows.length - 1);
        return true;
      case "pageup":
        move(-Math.max(1, body.height - 1));
        return true;
      case "pagedown":
        move(Math.max(1, body.height - 1));
        return true;
      case "return":
      case "enter":
        if (index >= 0) options.onActivate?.(index);
        return true;
      default:
        return false;
    }
  }

  body.handleKeyPress = handleKeyPress;
  box.handleKeyPress = (key) => body.handleKeyPress(key);
  rebuild();
  return {
    box,
    focusTarget: body,
    move,
    select,
    selected: () => index,
    sortBy,
    /** Replaces data without retaining a stale double-click activation. */
    setRows(next: Record<string, string>[]) {
      lastClicked = -1;
      rows = [...next];
      options.rows = next;
      index = rows.length ? Math.max(0, Math.min(index, rows.length - 1)) : -1;
      rebuild();
    },
  };
}

/** Builds a centered loading, empty or error message with an optional action. */
export function stateView(
  renderer: CliRenderer,
  theme: Theme,
  icons: IconSet,
  options: {
    kind: "loading" | "empty" | "error";
    title: string;
    message?: string;
    action?: { key: string; label: string; onPress: () => void };
  },
): BoxRenderable {
  const box = new BoxRenderable(renderer, {
    flexDirection: "column",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  });
  const icon =
    icons[
      options.kind === "error" ? "error" : options.kind === "loading" ? "refresh" : "list"
    ];
  box.add(
    new TextRenderable(renderer, {
      content: `${icon} ${options.title}`,
      fg: options.kind === "error" ? theme.error : theme.textStrong,
    }),
  );
  if (options.message) box.add(dim(renderer, theme, options.message));
  if (options.action) box.add(button(renderer, theme, options.action));
  return box;
}

/** Creates an explicitly started spinner and releases its timer on destruction. */
export function spinner(
  renderer: CliRenderer,
  theme: Theme,
  options: { label: string; ascii?: boolean },
) {
  const frames =
    (options.ascii ?? currentIcons() === iconSets.ascii)
      ? ["|", "/", "-", "\\"]
      : ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let label = options.label;
  let frame = 0;
  let timer: ReturnType<typeof setInterval> | undefined;
  const box = new TextRenderable(renderer, {
    content: `${frames[0]} ${label}`,
    fg: theme.accent,
    height: 1,
  });
  function paint(): void {
    box.content = `${frames[frame]} ${label}`;
  }
  function stop(): void {
    if (timer) clearInterval(timer);
    timer = undefined;
  }
  /** Releases the interval on node or renderer destruction. */
  function cleanup(): void {
    stop();
    renderer.off("destroy", cleanup);
  }
  function advanceFrame(): void {
    frame = (frame + 1) % frames.length;
    paint();
  }

  renderer.once("destroy", cleanup);
  box.once("destroyed", cleanup);
  return {
    box,
    start() {
      if (!timer && !box.isDestroyed && !renderer.isDestroyed)
        timer = setInterval(advanceFrame, 80);
    },
    stop,
    setLabel(text: string) {
      label = text;
      paint();
    },
  };
}

/** Creates a clamped progress indicator. */
export function progressBar(
  renderer: CliRenderer,
  theme: Theme,
  options: { label: string; value: number; width?: number },
) {
  let label = options.label;
  const box = new TextRenderable(renderer, { fg: theme.accent, height: 1 });
  /** Clamps progress to the supported range before drawing filled cells. */
  function set(value: number, text?: string): void {
    if (text !== undefined) label = text;
    const clamped = Number.isNaN(value) ? 0 : Math.max(0, Math.min(1, value));
    const width = Math.max(1, Math.floor(options.width ?? 20));
    const filled = Math.round(clamped * width);
    box.content = `${label} [${"█".repeat(filled)}${"░".repeat(width - filled)}] ${Math.round(clamped * 100)}%`;
  }

  set(options.value);
  return { box, set };
}

/** Creates an OSC 8 hyperlink; a plain click copies its URL through OSC 52. */
export function link(
  renderer: CliRenderer,
  theme: Theme,
  options: {
    url: string;
    text?: string;
    notify?: (message: string, tone?: "ok" | "warn") => void;
  },
): TextRenderable {
  const box = new TextRenderable(renderer, {
    content: new StyledText([styledLink(options.url)(options.text ?? options.url)]),
    fg: theme.accentSecondary,
    attributes: TextAttributes.UNDERLINE,
  });
  /** Copies the public URL through the terminal's optional clipboard protocol. */
  function copyUrl(): void {
    let copied = false;
    try {
      copied = renderer.copyToClipboardOSC52(options.url);
    } catch (error) {
      options.notify?.(
        error instanceof Error ? error.message : "Clipboard unavailable",
        "warn",
      );
      return;
    }
    options.notify?.(
      copied ? "URL copied" : "Clipboard unavailable",
      copied ? "ok" : "warn",
    );
  }

  function updateHover(inside: boolean): void {
    box.fg = inside ? theme.accent : theme.accentSecondary;
  }

  clickable(renderer, box, {
    onClick: copyUrl,
    onHover: updateHover,
  });
  return box;
}

/** Semantic status names and their shared icon and color roles. */
export const statusStyles = {
  ok: { icon: "ok", color: "ok", label: "Done" },
  pending: { icon: "pending", color: "warn", label: "Pending" },
  error: { icon: "error", color: "error", label: "Failed" },
  available: { icon: "available", color: "textDim", label: "Available" },
  installed: { icon: "installed", color: "ok", label: "Installed" },
  outdated: { icon: "outdated", color: "warn", label: "Outdated" },
  working: { icon: "working", color: "accent", label: "In progress" },
  next: { icon: "next", color: "accent", label: "Next" },
} as const;

export type StatusKind = keyof typeof statusStyles;

/** Creates an inline status with an optional fill for a state that needs action. */
export function statusTag(renderer: CliRenderer, theme: Theme, icons: IconSet, state: StatusKind, label: string = statusStyles[state].label, fill = false): TextRenderable {
  const role = statusStyles[state];
  const color = theme[role.color];
  const text = withIcon(icons, role.icon, label);
  return new TextRenderable(renderer, {
    content: fill ? ` ${text} ` : text,
    fg: fill ? theme.primaryText : color, ...(fill ? { bg: color, width: Bun.stringWidth(text) + 2 } : {}),
    flexShrink: 0, wrapMode: "none", height: 1,
  });
}

/** Builds one line with independently colored text segments. */
export function segments(renderer: CliRenderer, parts: readonly (readonly [string, ColorInput])[]): TextRenderable {
  return new TextRenderable(renderer, {
    content: new StyledText(parts.map(([text, color]) => ({ __isChunk: true, text, fg: parseColor(color) }))),
    height: 1, flexShrink: 0, wrapMode: "none", truncate: true, minWidth: 0,
  });
}

/** Displays a thin progress track, count and percentage in a single line. */
export function meter(renderer: CliRenderer, theme: Theme, value: number, total: number, options: { width?: number; label?: string; usage?: boolean; color?: ColorInput } = {}): TextRenderable {
  const ratio = total > 0 ? Math.min(1, Math.max(0, value / total)) : 0;
  const percent = ratio === 1 ? 100 : Math.floor(ratio * 100);
  const width = options.width ?? 8;
  const full = Math.floor(ratio * width);
  const color = options.color ?? (options.usage && ratio > 0.9 ? theme.error : options.usage && ratio > 0.75 ? theme.warn : theme.primary);
  return segments(renderer, [
    [options.label ? `${options.label} ` : "", theme.textDim],
    ["━".repeat(full), color],
    ["━".repeat(width - full), theme.border],
    [` ${value}/${total} ${percent}%`, theme.textStrong],
  ]);
}

/** Draws horizontal bars on the same scale with a label and absolute count. */
export function barChart(renderer: CliRenderer, theme: Theme, values: readonly (readonly [string, number, ColorInput?])[], width = 8): BoxRenderable {
  const box = new BoxRenderable(renderer, { flexDirection: "column", flexShrink: 0, minWidth: 0 });
  const max = Math.max(1, ...values.map(([, value]) => value));
  const labelWidth = Math.max(0, ...values.map(([label]) => Bun.stringWidth(label)));
  for (const [label, value, color] of values) {
    const count = value > 0 ? Math.max(1, Math.round(value / max * width)) : 0;
    box.add(segments(renderer, [
      [label + " ".repeat(labelWidth - Bun.stringWidth(label) + 1), theme.textDim],
      ["━".repeat(count), color ?? theme.primary],
      [" ".repeat(width - count), theme.border],
      [` ${value}`, theme.textStrong],
    ]));
  }
  return box;
}

/** Scales a short history into one terminal-cell column per point. */
export function sparkline(values: readonly number[]): string {
  if (!values.length) return "";
  const min = Math.min(...values);
  const span = Math.max(1, Math.max(...values) - min);
  return values.map((value) => "▁▂▃▄▅▆▇█"[Math.round((value - min) / span * 7)]).join("");
}

/** Reserves a readable list width while leaving most room for the preview. */
export function listWidth(width: number, preferred: number): number {
  return Math.max(28, Math.min(preferred, Math.floor(width * 0.4)));
}
