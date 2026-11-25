/** Browses and copies components using the embedded framework registries. */
import { join } from "node:path";
import { resolveProject } from "../../design/project.ts";
import { applyAdd, listItems, planAdd, type RegistryItem } from "../../design/registry.ts";
import { projectScreen, shortcut } from "./project-screen.ts";

type ComponentRow = RegistryItem & { id: string };

/** Creates the component browser and copy workflow. */
export function createComponentsScreen() {
  let framework: "react" | "astro" | undefined;
  return projectScreen<ComponentRow>({
    id: "components", title: "Components", icon: "code", description: "Browse and copy components from the registry",
    empty: "No components in this registry", multiple: true,
    watch: (cwd) => [join(cwd, "designfy.json"), join(cwd, "package.json")],
    summary: () => `Framework: ${framework ?? "detecting"}`,
    load(cwd) {
      framework ??= resolveProject(cwd).framework === "astro" ? "astro" : "react";
      return listItems({ framework }).map((item) => ({ ...item, id: item.name }))
        .sort((a, b) => (a.categories[0] ?? "").localeCompare(b.categories[0] ?? "") || a.name.localeCompare(b.name));
    },
    label: (item) => ({ content: item.name, detail: item.description, group: item.categories[0] ?? "Other" }),
    detail(item, view) {
      view.heading(item.title);
      view.text(item.description);
      view.field("Type", item.type);
      view.section("Files", item.files.map(({ target }) => target));
      view.section("Dependencies", [...item.dependencies, ...item.devDependencies.map((name) => `${name} (dev)`)]);
      view.section("Required items", item.registryDependencies);
    },
    actions: [
      shortcut("f", "switch framework", (view) => { framework = framework === "react" ? "astro" : "react"; view.clearMarks(); return view.reload(); }),
      shortcut("return", "show files and dependencies", (view) => view.focusDetail(), "Enter"),
      shortcut("i", "copy marked", (view) => view.confirmPlan("i", "Copying components…", () => {
        const names = view.visibleMarks.map(({ name }) => name);
        if (!names.length) { view.ctx.notify("Mark at least one component", "warn"); return; }
        const plan = planAdd(view.cwd, names, { framework });
        return {
          title: "Copy components",
          lines: plan.files.map(({ path, action }) => `${action}: ${path}`),
          apply() {
            const result = applyAdd(plan);
            const groups = [
              ["Written", result.written], ["Unchanged", result.unchanged], ["Skipped", result.skipped],
              ["Missing npm packages", [...result.missingDependencies, ...result.missingDevDependencies]],
              ["shadcn items to install", result.shadcnItems],
            ] as const;
            return {
              summary: `${result.written.length} files written`,
              lines: groups.flatMap(([label, files]) => [`${label} (${files.length})`, ...files]),
            };
          },
        };
      })),
    ],
  });
}
