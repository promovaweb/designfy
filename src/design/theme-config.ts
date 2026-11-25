/** Reads declarative theme tokens from a Tailwind 3 configuration module. */
import { dirname } from "node:path";
import { pathToFileURL } from "node:url";

interface ConfigTokens {
  declarations: Map<string, string>;
  keyframes: Set<string>;
}

type Dictionary = Record<string, unknown>;

function dictionary(value: unknown): Dictionary {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Dictionary : {};
}

function scalar(value: unknown): string | undefined {
  return typeof value === "string" || typeof value === "number" ? String(value) : undefined;
}

function flattenColors(colors: unknown, prefix: string, output: Map<string, string>): void {
  for (const [key, value] of Object.entries(dictionary(colors))) {
    const name = key === "DEFAULT" && prefix ? prefix : [prefix, key].filter(Boolean).join("-");
    const declared = scalar(value);
    if (declared !== undefined) output.set(`--color-${name}`, declared);
    else flattenColors(value, name, output);
  }
}

const sections = {
  fontFamily: "font",
  fontSize: "text",
  fontWeight: "font-weight",
  borderRadius: "radius",
  spacing: "spacing",
  boxShadow: "shadow",
  screens: "breakpoint",
  transitionTimingFunction: "ease",
  transitionDuration: "duration",
  animation: "animate",
} as const;

function collectSection(tokens: Map<string, string>, prefix: string, entries: unknown): void {
  for (const [key, value] of Object.entries(dictionary(entries))) {
    const name = key === "DEFAULT" ? `--${prefix}` : `--${prefix}-${key}`;
    let declared = scalar(value);
    if (prefix === "text") {
      tokens.delete(`${name}--line-height`);
      if (Array.isArray(value)) {
        declared = scalar(value[0]);
        const lineHeight = scalar(value[1]) ?? scalar(dictionary(value[1]).lineHeight);
        if (lineHeight !== undefined) tokens.set(`${name}--line-height`, lineHeight);
      }
    } else if (prefix === "font" || prefix === "shadow") {
      if (Array.isArray(value)) {
        const parts = prefix === "font" && Array.isArray(value[0]) ? value[0] : value;
        declared = parts.flatMap((part) => scalar(part) ?? []).join(", ");
      }
    } else if (prefix === "breakpoint" && value && typeof value === "object") {
      declared = JSON.stringify(value);
    }
    if (declared !== undefined) tokens.set(name, declared);
  }
}

// Import in the project's own process so its cwd, logs and module cache stay off the CLI and MCP server.
const loadConfig = `
  const imported = await import(process.argv[1]);
  const config = imported.default ?? imported;
  process.send(JSON.stringify(config?.theme ?? {}));
`;

/** Imports a project config and normalizes its explicit theme entries to token names. */
export async function readTailwindConfig(file: string): Promise<ConfigTokens> {
  let serialized: string | undefined;
  const child = Bun.spawn([process.execPath, "--no-install", "--no-env-file", "--eval", loadConfig, pathToFileURL(file).href], {
    cwd: dirname(file),
    // A compiled Designfy executable can run an eval using its embedded Bun runtime.
    env: { ...process.env, BUN_BE_BUN: "1" },
    stdin: "ignore", stdout: "ignore", stderr: "ignore",
    timeout: 5000,
    ipc(message: unknown) {
      if (typeof message === "string") serialized = message;
    },
  });
  if (await child.exited !== 0 || serialized === undefined) throw new Error("Tailwind config import failed.");
  const theme = dictionary(JSON.parse(serialized));
  const extend = dictionary(theme.extend);
  const declarations = new Map<string, string>();
  const keyframes = new Set<string>();
  for (const layer of [theme, extend]) {
    flattenColors(layer.colors, "", declarations);
    for (const [section, prefix] of Object.entries(sections)) {
      if (section !== "spacing" || layer === extend) collectSection(declarations, prefix, layer[section]);
    }
    for (const name of Object.keys(dictionary(layer.keyframes))) keyframes.add(name);
  }
  return { declarations, keyframes };
}
