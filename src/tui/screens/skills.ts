/** Selects skills and runs approved Skills CLI plans without taking over the terminal. */
import { join } from "node:path";
import { paths } from "../../config/paths.ts";
import {
  executeSkillPlan, listSkills, planSkillInstall, planSkillRemove, planSkillUpdate, type SkillState,
} from "../../design/skills.ts";
import { commandLine, projectScreen, shortcut, type ProjectView } from "./project-screen.ts";

type SkillRow = SkillState & { id: string };
const filters = ["all", "internal", "external"] as const;

/** Creates a skills list with install, update and removal actions. */
export function createSkillsScreen() {
  let filter = 0;

  function operate(view: ProjectView<SkillRow>, action: "Install" | "Update" | "Remove") {
    return view.confirmPlan(action === "Remove" ? "d" : action[0]!.toLowerCase(), `${action === "Remove" ? "Removing" : action === "Update" ? "Updating" : "Installing"} skills…`, () => {
      const marked = view.visibleMarks;
      const applicable = marked.filter((skill) => action === "Install" ||
        (action === "Remove" ? skill.installed === "project" : skill.installed !== "no"));
      if (!applicable.length) {
        view.ctx.notify(action === "Install" ? "Mark at least one skill" : "Mark an installed skill in the applicable scope", "warn");
        return;
      }
      const names = applicable.map(({ name }) => name);
      const project = applicable.filter(({ installed }) => installed === "project").map(({ name }) => name);
      const global = applicable.filter(({ installed }) => installed === "global").map(({ name }) => name);
      const plan = action === "Install" ? planSkillInstall(view.cwd, { names }) :
        action === "Remove" ? planSkillRemove(names) : [
          ...(project.length ? planSkillUpdate(project) : []),
          ...(global.length ? planSkillUpdate(global, true) : []),
        ];
      return {
        title: `${action} skills`,
        lines: plan.map(commandLine),
        steps: plan.length,
        async apply(step) {
          for (const command of plan) await step(commandLine(command), () => executeSkillPlan(view.cwd, [command], false));
          return { summary: `${action} completed · ${names.length} skills`, lines: plan.map(commandLine) };
        },
      };
    });
  }

  return projectScreen<SkillRow>({
    id: "skills", title: "Skills", icon: "agent", description: "Install, update and remove selected skills",
    empty: "No skills match this filter", multiple: true,
    summary: () => `Kind: ${filters[filter]}`,
    watch: (cwd) => [join(cwd, "skills-lock.json"), paths.settings()],
    load: (cwd) => listSkills(cwd, { internal: filter === 1, external: filter === 2 })
      .map((skill) => ({ ...skill, id: skill.name })),
    label: (skill) => ({
      content: skill.name, detail: `${skill.kind} · ${skill.installed}`, group: skill.kind === "internal" ? "Internal" : "External",
      state: skill.installed === "no" ? "available" : "installed",
    }),
    detail(skill, view) {
      view.heading(skill.title);
      view.text(skill.description);
      view.field("Source", skill.source);
      view.field("Kind", skill.kind);
      view.field("Scope", skill.installed);
      view.tag(skill.installed === "no" ? "available" : "installed", skill.installed === "no" ? "Available" : "Installed");
    },
    actions: [
      shortcut("g", "next kind", (view) => { filter = (filter + 1) % filters.length; return view.reload(); }),
      shortcut("i", "install marked", (view) => operate(view, "Install")),
      shortcut("u", "update marked", (view) => operate(view, "Update")),
      shortcut("d", "remove marked", (view) => operate(view, "Remove")),
    ],
  });
}
