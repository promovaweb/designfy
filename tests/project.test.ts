/** Exercises project detection, configuration writes and the lot's read-only tools. */
import { afterEach, beforeEach, expect, test } from "bun:test";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ExitCode } from "../src/app/exit-codes.ts";
import { initCommand } from "../src/cli/commands/init.ts";
import { getProjectStatus } from "../src/cli/commands/status.ts";
import type { Context } from "../src/cli/registry.ts";
import {
  defaultProjectConfig,
  detectProject,
  readProjectConfig,
  resolveProject,
  writeProjectConfig,
} from "../src/design/project.ts";
import { HOME_VARIABLE } from "../src/config/paths.ts";

const source = (path: string) => JSON.stringify(resolve(import.meta.dir, "../", path));

let dir: string;
let originalCwd: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "designfy-project-"));
  originalCwd = process.cwd();
});

afterEach(() => {
  process.chdir(originalCwd);
  rmSync(dir, { recursive: true, force: true });
});

function put(file: string, data: unknown): void {
  writeFileSync(join(dir, file), JSON.stringify(data));
}

test("detects frameworks, a Tailwind major, shadcn, TypeScript and lockfile precedence", () => {
  put("package.json", { dependencies: { react: "^19", astro: "^5" }, devDependencies: { tailwindcss: "^4.3.5" } });
  for (const file of ["components.json", "tsconfig.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb"]) {
    put(file, {});
  }
  expect(detectProject(dir)).toEqual({ framework: "astro", typescript: true, tailwind: 4, shadcn: true, packageManager: "bun" });

  put("package.json", { dependencies: { react: "^19", next: "^15" }, devDependencies: { vite: "^7" } });
  expect(detectProject(dir).framework).toBe("next");
  put("package.json", { dependencies: { react: "^19" }, devDependencies: { vite: "^7" } });
  expect(detectProject(dir).framework).toBe("react-vite");
  put("package.json", { dependencies: { react: "^19" } });
  expect(detectProject(dir).framework).toBe("react");
  rmSync(join(dir, "bun.lockb"));
  expect(detectProject(dir).packageManager).toBe("pnpm");
});

test("merges saved project overrides over detection, including nested defaults", () => {
  put("package.json", { dependencies: { astro: "^5" } });
  expect(readProjectConfig(dir)).toBeNull();
  expect(resolveProject(dir)).toEqual(defaultProjectConfig(detectProject(dir)));
  put("designfy.json", { schemaVersion: 1, framework: "react", paths: { viewspec: "design/views" } });
  expect(resolveProject(dir)).toMatchObject({
    framework: "react",
    paths: { viewspec: "design/views", components: "src/components/designfy", styles: "src/styles" },
    aliases: { components: "@/components/designfy" },
  });

  const path = writeProjectConfig(dir, resolveProject(dir));
  expect(JSON.parse(readFileSync(path, "utf8"))).toEqual(resolveProject(dir));
  put("designfy.json", { schemaVersion: 2 });
  expect(() => readProjectConfig(dir)).toThrow("Invalid configuration");
});

test("init returns 6 for missing package.json, previews overrides and requires force to overwrite", async () => {
  process.chdir(dir);
  const run = (options: Context["options"] = {}) => initCommand.run!({
    args: [], options, json: false, path: ["init"], stdout() {}, stderr() {}, interactive: false,
  });
  expect(() => run()).toThrow(expect.objectContaining({ code: ExitCode.NOT_FOUND }));
  put("package.json", { dependencies: { astro: "^5" } });
  const preview = await run({ "dry-run": true, framework: "react", "components-path": "ui", "theme-path": "theme.css" });
  expect(preview.data).toMatchObject({
    dryRun: true, config: { framework: "react", paths: { components: "ui", theme: "theme.css" } },
  });
  expect(existsSync(join(dir, "designfy.json"))).toBe(false);

  await run();
  expect(() => run()).toThrow(expect.objectContaining({ code: ExitCode.USAGE }));
  expect(readProjectConfig(dir)?.framework).toBe("astro");
  await run({ force: true, framework: "react", "theme-path": "src/styles/theme.css" });
  expect(readProjectConfig(dir)).toMatchObject({ framework: "react", paths: { theme: "src/styles/theme.css" } });
});

test("reports copied components, viewspec counts, guide rules and the detected stylesheet", () => {
  put("package.json", { dependencies: { react: "^19", tailwindcss: "^4" } });
  const fixtures = join(import.meta.dir, "fixtures/viewspec");
  cpSync(join(fixtures, "screen-valid", "viewspec"), join(dir, "viewspec"), { recursive: true });
  cpSync(join(fixtures, "guide-valid", "VIEWSPEC.md"), join(dir, "VIEWSPEC.md"));
  mkdirSync(join(dir, "src/styles"), { recursive: true });
  const theme = join(dir, "src/styles/global.css");
  writeFileSync(theme, '@import "tailwindcss";');
  mkdirSync(join(dir, "src/components/designfy/lib"), { recursive: true });
  writeFileSync(join(dir, "src/components/designfy/lib/cn.ts"), "export {};");

  expect(getProjectStatus(dir)).toMatchObject({
    componentsCopied: 1,
    viewspecs: { byStatus: { in_progress: 1 }, total: 1, nextId: "0001" },
    guide: { exists: true, rules: 33, pendingProposals: 2 },
    theme: { found: true, file: theme },
  });
});

test("registers read-only MCP tools and returns matching structured and text data over stdio", async () => {
  put("package.json", { dependencies: { react: "^19" } });
  const serverSource = `
    import { McpServer } from ${JSON.stringify(import.meta.resolve("@modelcontextprotocol/sdk/server/mcp.js"))};
    import { StdioServerTransport } from ${JSON.stringify(import.meta.resolve("@modelcontextprotocol/sdk/server/stdio.js"))};
    import { registerProjectTools } from ${source("src/mcp/tools/project.ts")};
    const server = new McpServer({ name: "designfy-test", version: "0.0.0" });
    const catalog = { name: "designfy-test", version: "0.0.0", tools: [], resources: [], prompts: [] };
    registerProjectTools({ server, catalog });
    if (catalog.tools.length !== 4) process.exit(1);
    await server.connect(new StdioServerTransport());
  `;
  const client = new Client({ name: "test", version: "0.0.0" });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["--eval", serverSource],
    cwd: dir,
    env: { [HOME_VARIABLE]: dir, DESIGNFY_HOME_DIR: dir, DESIGNFY_CATALOG_DIR: "", DESIGNFY_REGISTRY_FILE: "" },
    stderr: "pipe",
  });
  try {
    await client.connect(transport);
    const names = (await client.listTools()).tools.map(({ name, annotations }) => {
      expect(annotations?.readOnlyHint).toBe(true);
      return name;
    });
    expect(names).toEqual(["project_status", "skills_list", "deps_list", "deps_check"]);

    const status = await client.callTool({ name: "project_status", arguments: {} });
    expect(status.structuredContent).toMatchObject({
      detected: { framework: "react" },
      skillsInstalled: 0,
      componentsCopied: 0,
      viewspecs: { byStatus: { draft: 0, in_progress: 0, blocked: 0, done: 0, archived: 0 }, total: 0, nextId: "0001" },
      guide: { exists: false, rules: 0, pendingProposals: 0 },
      theme: { found: false, file: null },
    });
    const content = status.content as Array<{ type: "text"; text: string }>;
    expect(JSON.parse(content[0]!.text)).toEqual(status.structuredContent);

    const check = await client.callTool({ name: "deps_check", arguments: { group: "motion" } });
    expect(check.isError).toBe(true);
    expect(check.structuredContent).toEqual({ ok: false, missing: ["motion"], outdated: [] });
  } finally {
    await transport.close();
    await client.close();
  }
});

test("streams both child outputs to stderr in inherit mode and still returns separate streams", async () => {
  const childSource = `
    import { run } from ${source("src/design/exec.ts")};
    const script = 'console.log(process.env.DESIGNFY_TEST_MARKER); console.error("child-error"); process.exit(17);';
    const result = await run(process.execPath, ["--eval", script], {
      cwd: process.cwd(),
      env: { DESIGNFY_TEST_MARKER: "child-output" },
      inherit: true,
    });
    console.log(JSON.stringify(result));
  `;
  const child = Bun.spawn([process.execPath, "--eval", childSource], { cwd: dir, stdout: "pipe", stderr: "pipe" });
  const [code, stdout, stderr] = await Promise.all([
    child.exited, new Response(child.stdout).text(), new Response(child.stderr).text(),
  ]);
  expect(code).toBe(0);
  expect(JSON.parse(stdout)).toEqual({ code: 17, stdout: "child-output\n", stderr: "child-error\n" });
  expect(stderr.trim().split("\n").sort()).toEqual(["child-error", "child-output"]);
});

test("CLI dry runs print executable plans and dependency checks return code 10 with missing packages", async () => {
  put("package.json", { dependencies: { react: "^19" } });
  const cliSource = `
    import { runCli } from ${source("src/cli/index.ts")};
    import { root } from ${source("src/cli/commands.ts")};
    import { depsCommand } from ${source("src/cli/commands/deps.ts")};
    import { skillsCommand } from ${source("src/cli/commands/skills.ts")};
    const extra = [depsCommand, skillsCommand].filter((command) => !root.subcommands.some(({ name }) => name === command.name));
    root.subcommands = [...root.subcommands, ...extra];
    process.exitCode = await runCli(process.argv.slice(1));
  `;
  async function cli(args: string[]) {
    const child = Bun.spawn([process.execPath, "--eval", cliSource, "--", ...args], {
      cwd: dir,
      env: { ...process.env, [HOME_VARIABLE]: dir, DESIGNFY_HOME_DIR: dir, DESIGNFY_CATALOG_DIR: "", DESIGNFY_REGISTRY_FILE: "" },
      stdin: "ignore",
      stdout: "pipe",
      stderr: "pipe",
    });
    const [code, stdout, stderr] = await Promise.all([
      child.exited, new Response(child.stdout).text(), new Response(child.stderr).text(),
    ]);
    return { code, stdout, stderr };
  }
  const install = await cli(["skills", "install", "astrofy", "--agent", "codex", "--dry-run"]);
  expect(install.code).toBe(ExitCode.SUCCESS);
  expect(install.stdout.trim()).toBe("npx -y skills add promovaweb/astrofy --skill '*' -a codex -y");
  expect(install.stderr).toBe("");

  const check = await cli(["deps", "check", "--group", "motion", "--json"]);
  expect(check.code).toBe(ExitCode.CHECK_FAILED);
  expect(JSON.parse(check.stdout)).toMatchObject({
    ok: false, error: { name: "CHECK_FAILED", details: { missing: ["motion"], outdated: [] } },
  });
});

const tailwind3Fixture = join(import.meta.dir, "fixtures/theme-tw3/shadcn");
const entry = resolve(import.meta.dir, "../src/main.ts");

async function runProjectCli(args: string[], project?: string) {
  const env = { ...process.env, [HOME_VARIABLE]: dir, DESIGNFY_PROJECT: project, NO_COLOR: "1" };
  const child = Bun.spawn([process.execPath, "run", entry, ...args], {
    cwd: dir, env, stdin: "ignore", stdout: "pipe", stderr: "pipe", timeout: 8000,
  });
  const [code, stdout, stderr] = await Promise.all([
    child.exited, new Response(child.stdout).text(), new Response(child.stderr).text(),
  ]);
  return { code, stdout, stderr };
}

test("selects the project with the global option, alias and environment", async () => {
  put("package.json", { dependencies: { astro: "^5", tailwindcss: "^4" } });
  const project = join(dir, "website");
  cpSync(tailwind3Fixture, project, { recursive: true });
  const theme = { found: true, file: join(project, "src/styles/global.css") };
  const expected = { ok: true, data: { detected: { framework: "react", tailwind: 3 }, theme } };
  for (const result of await Promise.all([
    runProjectCli(["--project", "website", "status", "--json"], "."),
    runProjectCli(["status", "-C", project, "--json"]),
    runProjectCli(["status", "--json"], "website"),
  ])) {
    expect(result.code).toBe(ExitCode.SUCCESS);
    expect(JSON.parse(result.stdout)).toMatchObject(expected);
  }

  for (const project of ["missing", "package.json"]) {
    const result = await runProjectCli(["--project", project, "status", "--json"]);
    expect(result.code).toBe(ExitCode.NOT_FOUND);
    expect(JSON.parse(result.stdout)).toMatchObject({ error: { code: ExitCode.NOT_FOUND } });
  }

  const doctor = await runProjectCli(["-C", "website", "doctor", "--json"]);
  expect(doctor.code).toBe(ExitCode.SUCCESS);
  expect(JSON.parse(doctor.stdout).data.checks).toContainEqual({
    name: "tailwind", status: "warn", detail: expect.stringMatching(/Tailwind 3.*Tailwind 4/),
  });
}, 15_000);

test("CLI notes Tailwind 3 compatibility and guards copying until explicitly allowed", async () => {
  put("package.json", { dependencies: { react: "^19", tailwindcss: "^3.4" } });
  for (const args of [["list"], ["show", "cn"]]) {
    const result = await runProjectCli(["components", ...args]);
    expect(result.code).toBe(ExitCode.SUCCESS);
    expect(result.stderr).toContain("registry items use Tailwind 4 syntax");
  }

  const target = join(dir, "src/components/designfy/lib/cn.ts");
  const refused = await runProjectCli(["components", "add", "cn", "--json"]);
  expect(refused.code).toBe(ExitCode.CHECK_FAILED);
  expect(JSON.parse(refused.stdout)).toMatchObject({ error: { code: 10, message: expect.stringContaining("--allow-tailwind3") } });
  expect(existsSync(target)).toBe(false);

  const copied = await runProjectCli(["components", "add", "cn", "--allow-tailwind3", "--json"]);
  expect(copied.code).toBe(ExitCode.SUCCESS);
  expect(copied.stderr).toContain("registry items use Tailwind 4 syntax");
  expect(JSON.parse(copied.stdout).data.written).toEqual([target]);
  expect(existsSync(target)).toBe(true);
}, 15_000);

test("MCP resolves project per call, guards component copies and preserves read-only mode", async () => {
  put("package.json", { dependencies: { astro: "^5", tailwindcss: "^4" } });
  const project = join(dir, "website");
  cpSync(tailwind3Fixture, project, { recursive: true });
  const server = async (readOnly: boolean, verify: (client: Client) => Promise<void>) => {
    const client = new Client({ name: "project-test", version: "1.0.0" });
    const transport = new StdioClientTransport({
      command: process.execPath, args: ["run", entry, "mcp", "--project", dir, ...(readOnly ? ["--read-only"] : [])],
      cwd: import.meta.dir, env: { [HOME_VARIABLE]: dir }, stderr: "pipe",
    });
    try {
      await client.connect(transport);
      await verify(client);
    } finally {
      await client.close();
      await transport.close();
    }
  };

  await server(false, async (client) => {
    const [selected, current, theme] = await Promise.all([
      client.callTool({ name: "project_status", arguments: { project: "website" } }),
      client.callTool({ name: "project_status", arguments: {} }),
      client.callTool({ name: "theme_show", arguments: { project, group: "colors" } }),
    ]);
    expect(selected.structuredContent).toMatchObject({ detected: { framework: "react", tailwind: 3 } });
    expect(current.structuredContent).toMatchObject({ detected: { framework: "astro", tailwind: 4 } });
    expect(theme.structuredContent).toMatchObject({ tailwind: 3, warnings: [], configFile: join(project, "tailwind.config.ts") });

    const args = { project, names: ["cn"] };
    const target = join(project, "src/components/designfy/lib/cn.ts");
    const refused = await client.callTool({ name: "components_add", arguments: args });
    expect(refused.isError).toBe(true);
    expect(refused.content).toEqual([{ type: "text", text: expect.stringContaining('"code": 10') }]);
    expect(existsSync(target)).toBe(false);

    const copied = await client.callTool({ name: "components_add", arguments: { ...args, allowTailwind3: true } });
    expect(copied.structuredContent).toMatchObject({ warning: expect.stringContaining("Tailwind 4"), written: [target] });
    expect(existsSync(target)).toBe(true);
    expect(existsSync(join(dir, "src"))).toBe(false);
  });

  await server(true, async (client) => {
    const names = (await client.listTools()).tools.map(({ name }) => name);
    expect(names).not.toContain("components_add");
    expect(names).not.toContain("capture_run");
    const list = await client.callTool({ name: "components_list", arguments: { project } });
    expect(list.structuredContent).toMatchObject({ warning: expect.stringContaining("Tailwind 4") });
  });
}, 15_000);
