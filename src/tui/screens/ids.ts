/** Ordered screen IDs shared by the CLI, settings schema and TUI registry. */
export const screenIds = [
  "overview",
  "theme", "catalog", "components", "skills", "deps", "mcp", "viewspecs", "captures", "project",
  "settings", "credentials", "docs", "about",
] as const;

export type ScreenId = (typeof screenIds)[number];

/** Global digits followed by the Home-only letter shortcuts. */
export const moduleKeys = "1234567890cda";

/** Returns the shortcut printed on the card for a registered module index. */
export function moduleKey(index: number): string | undefined {
  return moduleKeys[index - 1];
}
