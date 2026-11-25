/** Shows dependency groups and installs selected packages after confirmation. */
import { join } from "node:path";
import { checkDependencies, executeDependencyPlan, listDependencies, planDependencyInstall, type DependencyGroupState } from "../../design/deps.ts";
import { commandLine, projectScreen, shortcut } from "./project-screen.ts";

/** Creates the dependency checklist and installation workflow. */
export function createDepsScreen() {
  return projectScreen<DependencyGroupState>({
    id: "deps", title: "Deps", icon: "state", description: "Check and install dependency groups",
    empty: "No dependency groups", multiple: true, listTitle: "Groups",
    watch: (cwd) => [join(cwd, "package.json"), join(cwd, "designfy.json")],
    load: (cwd) => listDependencies(cwd),
    label: ({ title, default: isDefault, packages }) => {
      const missing = packages.filter(({ state }) => state === "missing").length;
      const outdated = packages.filter(({ state }) => state === "outdated").length;
      return { content: title, detail: `${packages.length} packages`, group: isDefault ? "Default" : "Optional",
        state: missing ? "pending" : outdated ? "outdated" : "ok",
        stateLabel: missing ? `${missing} missing` : outdated ? `${outdated} outdated` : "Current" };
    },
    detail(group, view) {
      view.heading(group.title);
      view.text(group.description);
      for (const pkg of group.packages) {
        view.tag(pkg.state === "ok" ? "ok" : pkg.state === "missing" ? "pending" : "outdated", `${pkg.name} · ${pkg.state}`);
        view.field("Catalog", pkg.version);
        view.field("Installed", pkg.installed ?? "none");
      }
    },
    actions: [
      shortcut("return", "focus packages", (view) => view.focusDetail(), "Enter"),
      shortcut("c", "check dependencies", (view) => {
        const result = checkDependencies(view.cwd);
        view.report({
          summary: result.ok ? "Dependencies are up to date" : "Dependency check",
          lines: [`Missing (${result.missing.length})`, ...result.missing, `Outdated (${result.outdated.length})`, ...result.outdated],
        });
      }),
      shortcut("i", "install groups", (view) => view.confirmPlan("i", "Installing dependencies…", () => {
        const names = view.visibleMarks.map(({ id }) => id);
        if (!names.length) { view.ctx.notify("Mark at least one dependency group", "warn"); return; }
        const plan = planDependencyInstall(view.cwd, { names });
        if (!plan.length) { view.ctx.notify("No packages to install", "info"); return; }
        return {
          title: "Install dependency groups", lines: plan.map(commandLine),
          steps: plan.length,
          async apply(step) {
            for (const command of plan) await step(commandLine(command), () => executeDependencyPlan(view.cwd, [command], false));
            return { summary: "Dependency installation completed", lines: plan.map(commandLine) };
          },
        };
      })),
    ],
  });
}
