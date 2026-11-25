/**
 * Settings tab: schema-driven preferences with a selection table and details.
 * Wide and medium layouts put details on the right; compact stacks them below.
 * Enter/e edits, x/Delete restores the default, r reloads, and Up/k or Down/j
 * changes selection. Enum values use choose, booleans toggle, and other types
 * use a validated prompt. Watches settings.json for changes made outside the TUI.
 */
import { BoxRenderable, TextRenderable } from "@opentui/core";
import {
  SETTINGS_SCHEMA,
  convertValue,
  flatten,
  getPath,
  readSettings,
  removePath,
  setPath,
  writeSettings,
  definitionOf,
} from "../../config/settings.ts";
import { paths } from "../../config/paths.ts";
import { table, panel, scrollPanel, listWidth, keyValueTable, stateView } from "../components.ts";
import type { Screen, ScreenContext } from "../screen.ts";

function settingsLayout(ctx: ScreenContext, rows: number) {
  const compact = ctx.layout() === "compact";
  return {
    compact,
    width: compact ? undefined : listWidth(ctx.renderer.width, 46),
    height: Math.min(ctx.renderer.height - (compact ? 4 : 8), compact ? 17 : rows + 6),
  };
}

/** Creates an independent settings table and editor. */
export function createSettingsScreen(): Screen {
  let grid: ReturnType<typeof table> | undefined;
  let rows: Record<string, string>[] = [];
  let current = "";

  /** Rebuilds the table and explains when a saved preference takes effect. */
  function saved(ctx: ScreenContext, key: string): void {
    ctx.refresh();
    const message = key.startsWith("tui.")
      ? "Applies the next time the TUI opens"
      : "Settings saved";
    ctx.notify(message, "ok");
  }

  /** Edits the selected key using the dialog appropriate to its schema type. */
  async function edit(ctx: ScreenContext): Promise<void> {
    const key = current;
    if (!key) return;

    try {
      const settings = readSettings();
      const def = definitionOf(key);
      const previous = getPath(settings, key);
      let value: unknown;

      if (def?.type === "boolean") {
        value = !previous;
      } else if (def?.type === "enum" && def.values) {
        const index = await ctx.choose({
          title: key,
          items: def.values,
          initial: def.values.indexOf(String(previous)),
        });
        if (index === undefined) return;
        value = def.values[index];
      } else {
        /** Returns a schema error so the shell keeps the editor open. */
        function validate(input: string): string | undefined {
          try {
            convertValue(key, input);
          } catch (error) {
            return error instanceof Error ? error.message : "Invalid value";
          }
        }

        const text = await ctx.prompt({
          title: `Edit ${key}`,
          label: "Value",
          initial: String(previous ?? ""),
          validate,
        });
        if (text === undefined) return;
        value = convertValue(key, text);
      }

      setPath(settings, key, value);
      writeSettings(settings);
      saved(ctx, key);
    } catch (error) {
      ctx.notify(
        error instanceof Error ? error.message : "Could not save settings",
        "error",
      );
    }
  }

  /** Removes the override only after the user confirms restoring its default. */
  async function reset(ctx: ScreenContext): Promise<void> {
    const key = current;
    if (!key) return;

    try {
      const confirmed = await ctx.confirm({
        title: "Reset setting",
        message: `Restore ${key} to its default?`,
      });
      if (!confirmed) return;

      const settings = readSettings();
      removePath(settings, key);
      writeSettings(settings);
      saved(ctx, key);
    } catch (error) {
      ctx.notify(
        error instanceof Error ? error.message : "Could not reset setting",
        "error",
      );
    }
  }

  return {
    id: "settings",
    title: "Settings",
    icon: "settings",
    description: "Inspect and edit preferences",
    watch: () => [paths.settings()],
    actions: [
      {
        keys: ["return", "enter", "e"],
        label: "Enter/e",
        description: "edit",
        icon: "settings",
        run: edit,
      },
      {
        keys: ["x", "delete"],
        description: "reset to default",
        icon: "settings",
        run: reset,
      },
      {
        keys: ["r"],
        description: "reload",
        icon: "refresh",
        run: (ctx) => ctx.refresh(),
      },
      {
        keys: ["up", "k"],
        description: "previous setting",
        icon: "select",
        hidden: true,
        run: () => grid?.move(-1),
      },
      {
        keys: ["down", "j"],
        description: "next setting",
        icon: "select",
        hidden: true,
        run: () => grid?.move(1),
      },
    ],
    mount(ctx) {
      const { renderer, theme, icons } = ctx;
      try {
        rows = flatten(readSettings()).map(([key, value]) => ({
          key,
          value: String(value),
          default: String(definitionOf(key)?.default ?? "—"),
        }));
        const { compact, width, height } = settingsLayout(ctx, rows.length);
        const root = new BoxRenderable(renderer, {
          flexDirection: compact ? "column" : "row",
          gap: compact ? ctx.space.gapY : ctx.space.gapX,
          height,
          flexGrow: 0,
          minHeight: 0,
        });
        const details = scrollPanel(renderer, theme, {
          title: "Setting details", focusKey: "Tab",
          height: compact ? 6 : undefined,
          flexGrow: compact ? 0 : 1,
        });
        /** Keeps details and shell status aligned with the displayed row. */
        function show(index: number): void {
          const row = rows[index];
          current = row?.key ?? "";
          const def = SETTINGS_SCHEMA.find((entry) => entry.key === current);
          for (const child of details.body.getChildren()) child.destroyRecursively();
          details.add(new TextRenderable(renderer, { content: current, fg: theme.textStrong, wrapMode: "word" }));
          details.add(new TextRenderable(renderer, { content: def?.description ?? "Custom setting", fg: theme.textDim, wrapMode: "word" }));
          details.add(keyValueTable(renderer, theme, [
            ["Value", row?.value ?? "—"], ["Default", row?.default ?? "—"], ["Type", def?.type ?? "string"],
            ...(def?.values ? [["Accepted", def.values.join(", ")] as [string, string]] : []),
          ]));
          ctx.status(`${rows.length} settings · ${current}`);
        }

        function activate(): void {
          void edit(ctx);
        }

        grid = table(renderer, theme, {
          columns: [
            { key: "key", title: "Key", width: Math.max(...rows.map((row) => Bun.stringWidth(row.key!))) },
            ...(ctx.layout() === "medium" ? [] : [{ key: "value", title: "Value" }, { key: "default", title: "Default" }]),
          ],
          rows,
          onSelect: show,
          onActivate: activate,
        });
        const collection = panel(renderer, theme, { title: "Tab · Settings", width, flexGrow: compact ? 1 : 0, active: true });
        const focusTarget = grid.focusTarget;
        const updateFocus = () => {
          if (!renderer.isDestroyed && !collection.body.isDestroyed) collection.appearance(theme, "Tab · Settings", focusTarget.focused);
        };
        focusTarget.on("focused", updateFocus);
        focusTarget.on("blurred", updateFocus);
        if (!compact) root.onSizeChange = () => { collection.width = listWidth(renderer.width, 46); };
        collection.add(grid.box);
        root.add(collection);
        root.add(details);
        grid.select(
          Math.max(
            0,
            rows.findIndex((row) => row.key === current),
          ),
        );
        return root;
      } catch (error) {
        grid = undefined;
        current = "";
        ctx.status("Settings unavailable");
        ctx.notify(error instanceof Error ? error.message : "Read failed", "error");
        return stateView(renderer, theme, icons, {
          kind: "error",
          title: "Unable to load settings",
          message: error instanceof Error ? error.message : "Read failed",
          action: { key: "r", label: "reload", onPress: ctx.refresh },
        });
      }
    },
  };
}

/** Default settings tab registered by the shell. */
export const settingsScreen = createSettingsScreen();
