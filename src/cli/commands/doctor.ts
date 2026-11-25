/** Read-only environment diagnostics shared by CLI and MCP. */
import { statSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { manifest } from "../../app/manifest.ts";
import { ExitCode } from "../../app/exit-codes.ts";
import { paths } from "../../config/paths.ts";
import { getMasterKey, masterKeySource } from "../../config/crypto.ts";
import { readVault } from "../../config/credentials.ts";
import { astrofyTokensPath, detectIntegrations } from "../../design/integrations.ts";
import { parseViewspec } from "../../design/viewspec.ts";
import { integrationsText } from "./status.ts";
import { detectProject } from "../../design/project.ts";
import { tailwindRegistryNote } from "../../design/registry.ts";
import { findThemeFile } from "../../design/theme.ts";
import type { Command } from "../registry.ts";

export interface DoctorCheck {
  name: string;
  status: "ok" | "warn" | "fail";
  detail: string;
}

/** Collects independent checks without writing files or exposing secrets. */
export function collectDoctorChecks(runtime = { version: Bun.version, stdin: Boolean(process.stdin.isTTY), stdout: Boolean(process.stdout.isTTY) }, cwd = process.cwd()) {
  const checks: DoctorCheck[] = [];
  const add = (name: string, status: DoctorCheck["status"], detail: string) => checks.push({ name, status, detail });
  add("bun", Bun.semver.satisfies(runtime.version, ">=1.4.4") ? "ok" : "fail", `${runtime.version}; minimum 1.4.4`);
  for (const stream of ["stdin", "stdout"] as const) add(stream, runtime[stream] ? "ok" : "warn", runtime[stream] ? "TTY available" : "Not a TTY");
  const inspect = (name: string, path: string, check: () => void, detail: string) => {
    try {
      statSync(path);
    } catch (e) {
      add(name, (e as NodeJS.ErrnoException).code === "ENOENT" ? "warn" : "fail", (e as NodeJS.ErrnoException).code === "ENOENT" ? "Not created" : "Cannot access file");
      return;
    }
    try { check(); add(name, "ok", detail); }
    catch { add(name, "fail", "Unreadable, invalid or incorrectly configured"); }
  };
  inspect("directory", paths.base(), () => {
    const stat = statSync(paths.base());
    if (!stat.isDirectory() || (stat.mode & 0o777) !== 0o700) throw new Error("Invalid directory mode");
  }, "Directory exists; mode 0700");
  inspect("settings", paths.settings(), () => {
    const data: unknown = JSON.parse(readFileSync(paths.settings(), "utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Expected object");
  }, "Readable JSON object");
  const source = masterKeySource();
  try {
    if (source !== "none") getMasterKey(false);
    add("master-key", source === "none" ? "warn" : "ok", source);
  } catch { add("master-key", "fail", `${source}; unavailable or invalid`); }
  inspect("credentials", paths.credentials(), () => { readVault(); }, "Vault decrypted successfully");
  for (const program of ["node", "npx"]) {
    const executable = Bun.which(program);
    add(program, executable ? "ok" : "warn", executable ?? "Not found on PATH");
  }
  for (const file of ["designfy.json", "VIEWSPEC.md"]) {
    try {
      const present = statSync(join(cwd, file)).isFile();
      add(file, present ? "ok" : "warn", present ? "Project file exists" : "Not a regular file");
    } catch (cause) {
      add(file, "warn", (cause as NodeJS.ErrnoException).code === "ENOENT" ? "Not created" : "Cannot access file");
    }
  }
  try {
    const major = detectProject(cwd).tailwind;
    const note = tailwindRegistryNote(major);
    add("tailwind", major === null || note ? "warn" : "ok",
      major === null ? "Tailwind major not detected" : `Tailwind ${major}${note ? `. ${note}` : ""}`);
  } catch (cause) {
    add("tailwind", "warn", cause instanceof Error ? cause.message : "Cannot detect Tailwind major");
  }
  try {
    add("tailwind-theme", "ok", findThemeFile(cwd));
  } catch (cause) {
    add("tailwind-theme", "warn", cause instanceof Error ? cause.message : "Cannot locate theme stylesheet");
  }
  let integrations;
  try {
    integrations = detectIntegrations(cwd);
    const { astrofy, specsfy } = integrations;
    const hasGuide = statSync(join(cwd, "VIEWSPEC.md"), { throwIfNoEntry: false })?.isFile();
    if (astrofy.present && !hasGuide) add("astrofy-guide", "warn", "Create the project guide VIEWSPEC.md.");
    if (astrofy.designSystemJson || specsfy.designSystemMd) {
      const file = join(cwd, "VIEWSPEC.md");
      const guide = hasGuide ? readFileSync(file, "utf8") : "";
      const body = guide.replace(/^\uFEFF?---\r?\n(?:[\s\S]*?\r?\n)?---(?:\r?\n|$)/, "");
      if (specsfy.designSystemMd && !body.includes("DESIGNSYSTEM.MD")) {
        add("specsfy-guide", "warn", "Cite DESIGNSYSTEM.MD in the body of the project guide.");
      }
      const tokens = parseViewspec(file, guide).frontMatter.tokensFile;
      const expected = astrofyTokensPath(cwd);
      if (astrofy.designSystemJson && typeof tokens === "string" && resolve(cwd, tokens) !== resolve(cwd, expected)) {
        add("astrofy-tokens", "warn", "Set tokensFile to the Astrofy build output: " + expected);
      }
    }
  } catch (cause) {
    add("integrations", "warn", cause instanceof Error ? cause.message : "Cannot inspect project integrations");
  }
  add("binary", "ok", `${manifest.bin} ${manifest.version}`);
  add("platform", "ok", `${process.platform}-${process.arch}`);
  return { checks, integrations: integrations ?? null, ok: checks.every((check) => check.status !== "fail") };
}

export const doctorCommand: Command = {
  name: "doctor",
  description: "Check runtime, terminal, settings, credentials and project setup without changing files.",
  exitCodes: [ExitCode.CONFIG],
  run: () => {
    const data = collectDoctorChecks();
    const marks = { ok: "✓", warn: "!", fail: "✗" };
    return { data, text: data.checks.map((c) => `${marks[c.status]} ${c.name}: ${c.detail}`).join("\n") + "\n\n" + (data.integrations ? integrationsText(data.integrations) : "Integrations unavailable"), code: data.ok ? ExitCode.SUCCESS : ExitCode.CONFIG };
  },
};
