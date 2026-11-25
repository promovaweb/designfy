/**
 * TUI screen registry, in Home menu order.
 * Register project modules before tool modules to preserve the numeric shortcuts.
 */
import { aboutScreen } from "./about.ts";
import { createHomeScreen } from "./overview.ts";
import { projectOverviewScreen } from "./project.ts";
import { settingsScreen } from "./settings.ts";
import { credentialsScreen } from "./credentials.ts";
import { docsScreen } from "./docs.ts";
import { createThemeScreen } from "./theme.ts";
import { createCatalogScreen } from "./catalog.ts";
import { createComponentsScreen } from "./components.ts";
import { createSkillsScreen } from "./skills.ts";
import { createDepsScreen } from "./deps.ts";
import { createMcpScreen } from "./mcp.ts";
import { createViewspecsScreen } from "./viewspecs.ts";
import { createCapturesScreen } from "./captures.ts";
import { scopedScreen } from "./project-screen.ts";
import type { Screen } from "../screen.ts";

import { screenIds, type ScreenId } from "./ids.ts";

const byId = {
  overview: scopedScreen(createHomeScreen),
  theme: scopedScreen(createThemeScreen),
  catalog: scopedScreen(createCatalogScreen),
  components: scopedScreen(createComponentsScreen),
  skills: scopedScreen(createSkillsScreen),
  deps: scopedScreen(createDepsScreen),
  mcp: scopedScreen(createMcpScreen),
  viewspecs: scopedScreen(createViewspecsScreen),
  captures: scopedScreen(createCapturesScreen),
  project: projectOverviewScreen,
  settings: settingsScreen,
  credentials: credentialsScreen,
  docs: docsScreen,
  about: aboutScreen,
} satisfies Record<ScreenId, Screen>;

/** The Home followed by the screens in card and shortcut order. */
export const screens: readonly Screen[] = screenIds.map((id) => ({ ...byId[id], id }));
