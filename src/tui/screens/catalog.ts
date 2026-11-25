/** Browses interface patterns by category, surface, kind and search text. */
import {
  interfaceKinds, listEntries, loadInterfaceCatalog,
  type InterfaceEntry, type InterfaceKind, type InterfaceSurface,
} from "../../design/interface-catalog.ts";
import { projectScreen, shortcut } from "./project-screen.ts";

const surfaces = ["all", "site", "system"] as const;

/** Creates the interface catalog screen. */
export function createCatalogScreen() {
  let surface = 0;
  let kind: InterfaceKind | undefined;
  let categories = new Map<string, string>();
  return projectScreen<InterfaceEntry>({
    id: "catalog", title: "Catalog", icon: "list", description: "Browse patterns and their implementation sources",
    empty: "No patterns match the current filters",
    summary: () => `Surface: ${surfaces[surface]} · Kind: ${kind ?? "all"}`,
    load() {
      const catalog = loadInterfaceCatalog();
      categories = new Map(catalog.categories.map(({ id, title }) => [id, title]));
      const activeSurface = surfaces[surface];
      return listEntries({ surface: activeSurface === "all" ? undefined : activeSurface as InterfaceSurface, kind })
        .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    },
    label: (entry) => ({ content: entry.name, detail: `${entry.surface} · ${entry.kinds.join(", ")}`, group: categories.get(entry.category) ?? entry.category }),
    filterText: (entry) => [entry.purpose, ...entry.useWhen, ...entry.variants].join(" "),
    detail(entry, view) {
      view.heading(entry.name);
      view.field("Surface", entry.surface);
      view.field("Kinds", entry.kinds.join(", "));
      for (const [label, content] of [
        ["Purpose", entry.purpose], ["Use when", entry.useWhen], ["Avoid when", entry.avoidWhen], ["Anatomy", entry.anatomy],
        ["Variants", entry.variants], ["States", entry.states], ["Responsive", entry.responsive], ["Motion", entry.motion],
        ["Accessibility", entry.accessibility], ["Tokens", entry.tokens], ["Sources", entry.sources],
      ] as const) view.section(label, content);
    },
    actions: [
      shortcut("s", "next surface", (view) => { surface = (surface + 1) % surfaces.length; return view.reload(); }),
      shortcut("k", "filter by kind", async (view) => {
        const index = await view.ctx.choose({ title: "Viewspec kind", items: ["all", ...interfaceKinds], initial: kind ? interfaceKinds.indexOf(kind) + 1 : 0 });
        if (index === undefined) return;
        kind = interfaceKinds[index - 1];
        await view.reload();
      }),
      shortcut("return", "focus details", (view) => view.focusDetail(), "Enter"),
    ],
  });
}
