/** Exercises Designfy modules through the shell with a local project and fake process runner. */
import { tmpdir } from "node:os";
import { expect, test } from "bun:test";
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ScrollBoxRenderable, type Renderable } from "@opentui/core";
import type { TestRendererSetup } from "@opentui/core/testing";
import { resetRunner, setRunner } from "../src/design/exec.ts";
import { planAdd } from "../src/design/registry.ts";
import { screens } from "../src/tui/screens/index.ts";
import { tuiCommand } from "../src/cli/commands/tui.ts";
import { parse } from "../src/cli/parser.ts";
import { convertValue } from "../src/config/settings.ts";
import { withTui } from "./tui-fixture.ts";

const fixtures = join(import.meta.dir, "fixtures");

async function withProject(run: (dir: string) => Promise<void>): Promise<void> {
  const cwd = process.cwd();
  const work = mkdtempSync(join(tmpdir(), "tui-designfy-"));
  const dir = join(work, "fixture-project");
  const previousGlobal = process.env.DESIGNFY_HOME_DIR;
  process.env.DESIGNFY_HOME_DIR = join(work, "user");
  const capture = join(dir, ".designfy", "captures", "2026-11-24-test");
  try {
    mkdirSync(join(dir, "src", "styles"), { recursive: true });
    mkdirSync(capture, { recursive: true });
    writeFileSync(join(dir, "package.json"), JSON.stringify({
      dependencies: { react: "^19.0.0", vite: "^7.0.0", tailwindcss: "^4.0.0" },
    }));
    writeFileSync(join(dir, "designfy.json"), JSON.stringify({ paths: { components: "src/ui", styles: "src/styles" } }));
    writeFileSync(join(dir, "skills-lock.json"), JSON.stringify({ skills: { designfy: { source: "promovaweb/designfy" } } }));
    writeFileSync(join(dir, "src", "styles", "globals.css"), `
@import "tailwindcss";
@theme {
  --color-background: #ffffff;
  --color-foreground: #111111;
  --font-sans: Inter, sans-serif;
  --text-small: 0.75rem;
  --text-small--line-height: 1.25rem;
  --radius-control: 0.5rem;
  --spacing-example: 0.75rem;
}
.dark { --color-background: #111111; --color-foreground: #ffffff; }
`);
    copyFileSync(join(fixtures, "viewspec", "guide-valid", "VIEWSPEC.md"), join(dir, "VIEWSPEC.md"));
    cpSync(join(fixtures, "viewspec", "screen-valid", "viewspec"), join(dir, "viewspec"), { recursive: true });
    writeFileSync(join(capture, "manifest.json"), JSON.stringify({
      name: "2026-11-24-test", createdAt: "2026-11-24T19:00:00Z", outDir: capture,
      theme: "light", fullPage: true, reducedMotion: true, waitMs: 0,
      urls: ["http://localhost:4321/"],
      viewports: [{ name: "phone", width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true }],
      shots: [{
        url: "http://localhost:4321/", viewport: "phone", file: "home--phone.png",
        documentWidth: 422, documentHeight: 844, overflowX: true, consoleErrors: ["Test console error"], pageErrors: [],
      }],
      errors: [],
    }));
    writeFileSync(join(capture, "home--phone.png"), "fake capture");
    process.chdir(dir);
    await run(dir);
  } finally {
    process.chdir(cwd);
    if (previousGlobal === undefined) delete process.env.DESIGNFY_HOME_DIR;
    else process.env.DESIGNFY_HOME_DIR = previousGlobal;
    rmSync(work, { force: true, recursive: true });
  }
}

async function frameWith(setup: TestRendererSetup, expected: string): Promise<string> {
  for (let attempt = 0; attempt < 450; attempt++) {
    await setup.renderOnce();
    const frame = setup.captureCharFrame();
    if (frame.includes(expected)) return frame;
    await Bun.sleep(4);
  }
  const frame = setup.captureCharFrame();
  expect(frame).toContain(expected);
  return frame;
}

async function key(setup: TestRendererSetup, name: string): Promise<void> {
  if (name === "return") setup.mockInput.pressEnter();
  else if (name === "tab") setup.mockInput.pressTab();
  else if (name === "down" || name === "up") setup.mockInput.pressArrow(name);
  else if (name === "escape") {
    setup.mockInput.pressEscape();
    await Bun.sleep(45);
  }
  else setup.mockInput.pressKey(name === "space" ? " " : name);
  await setup.renderOnce();
}

function scrollBoxes(node: Renderable): ScrollBoxRenderable[] {
  return [...(node instanceof ScrollBoxRenderable ? [node] : []), ...node.getChildren().flatMap(scrollBoxes)];
}

const projectModules = [
  ["overview", "Install dependencies"],
  ["theme", "background"],
  ["catalog", "Purpose"],
  ["components", "Framework: react"],
  ["skills", "internal · project"],
  ["deps", "Tab · Groups"],
  ["mcp", "claude · absent"],
  ["viewspecs", "Dashboard de vendas"],
  ["captures", "2026-11-24-test"],
  ["project", "Project environment"],
  ["settings", "Setting details"],
  ["credentials", "No credentials"],
  ["docs", "Convenções"],
  ["about", "Credits"],
] as const;

for (const [width, height] of [[80, 24], [100, 30], [130, 40], [200, 60]] as const) {
  for (const [id, content] of projectModules) {
    test(`${id} renders its content at ${width}×${height}`, async () => {
      await withProject(async () => withTui(async (setup) => {
        const frame = await frameWith(setup, content);
        expect(frame.split("\n").every((line) => Bun.stringWidth(line) <= width)).toBe(true);
        expect(frame.split("\n").at(-2)).toMatch(/\? +help +q +quit/);
        expect(frame.split("\n")[0]).toContain(id === "overview" ? "⌂ Home" : screens.find((screen) => screen.id === id)!.title);
      }, id, { width, height }));
    });
  }
}

test("theme toggles modes, exposes color details, and cycles groups", async () => {
  await withProject(async () => withTui(async (setup) => {
    await frameWith(setup, "light · colors");
    await key(setup, "t");
    await frameWith(setup, "dark · colors");
    await key(setup, "return");
    const detail = await frameWith(setup, "Against foreground");
    expect(detail).toContain("OKLCH");
    expect(detail).toContain("18.88:1 pass");
    expect(detail).toContain("Hex: #111111");
    await key(setup, "tab");
    await key(setup, "g");
    await frameWith(setup, "Aa Bb Cc 0123");
  }, "theme"));
});

test("catalog filters surface, kind and text live in the key bar", async () => {
  await withProject(async () => withTui(async (setup) => {
    await frameWith(setup, "Purpose");
    await key(setup, "s");
    await frameWith(setup, "Surface: site");
    await key(setup, "k");
    await frameWith(setup, "Viewspec kind");
    await key(setup, "down");
    await key(setup, "return");
    await frameWith(setup, "Kind: landing-page");
    await key(setup, "/");
    await setup.mockInput.typeText("phrase-that-does-not-match");
    const empty = await frameWith(setup, "No results match the filter");
    expect(empty.split("\n").at(-2)).toContain("phrase-that-does-not-match");
    await key(setup, "return");
    await frameWith(setup, "No results match the filter");
    expect(setup.captureCharFrame().split("\n").at(-2)).toMatch(/\? +help/);
  }, "catalog"));
});

test("components change framework, mark and clear, and copy only after confirmation", async () => {
  await withProject(async (dir) => withTui(async (setup) => {
    await frameWith(setup, "0 marked");
    await key(setup, "f");
    await frameWith(setup, "Framework: astro");
    await key(setup, "f");
    await frameWith(setup, "Framework: react");
    const first = setup.captureCharFrame().match(/>\s+□\s+([a-z0-9-]+)/)?.[1];
    expect(first).toBeDefined();
    const plan = planAdd(dir, [first!], { framework: "react" });
    expect(plan.files.every(({ path }) => !existsSync(path))).toBe(true);
    await key(setup, "a");
    expect(setup.captureCharFrame()).toMatch(/[1-9]\d* marked/);
    await key(setup, "n");
    await frameWith(setup, "0 marked");
    await key(setup, "space");
    await frameWith(setup, "1 marked");
    await key(setup, "i");
    await frameWith(setup, "Copy components");
    expect(setup.captureCharFrame()).toContain("PLAN");
    expect(plan.files.every(({ path }) => !existsSync(path))).toBe(true);
    await key(setup, "n");
    expect(plan.files.every(({ path }) => !existsSync(path))).toBe(true);
    await key(setup, "i");
    await frameWith(setup, "Copy components");
    expect(setup.captureCharFrame()).toContain("PLAN");
    await key(setup, "i");
    await frameWith(setup, "files written");
    expect(setup.captureCharFrame()).toContain("RESULT");
    expect(plan.files.every(({ path }) => existsSync(path))).toBe(true);
  }, "components"));
});

test("skills confirm exact command, keep the UI responsive and surface process failure", async () => {
  await withProject(async () => {
    const calls: string[][] = [];
    let finish: ((code: number) => void) | undefined;
    setRunner(async (command, args) => {
      calls.push([command, ...args]);
      const code = await new Promise<number>((resolve) => { finish = resolve; });
      return { code, stdout: "", stderr: "test runner output" };
    });
    try {
      await withTui(async (setup) => {
        await frameWith(setup, "internal · project");
        await key(setup, "tab");
        await frameWith(setup, "Kind");
        await key(setup, "space");
        await frameWith(setup, "1 marked");
        await key(setup, "space");
        await frameWith(setup, "0 marked");
        await key(setup, "space");
        await key(setup, "i");
        await frameWith(setup, "npx -y skills add");
        expect(calls).toHaveLength(0);
        await key(setup, "i");
        const progress = await frameWith(setup, "Installing skills");
        expect(progress).toContain("PROGRESS");
        expect(progress).toContain("0/1 0%");
        expect(progress).toContain("s elapsed");
        expect(calls).toHaveLength(1);
        expect(calls[0]).toContain("designfy");
        await key(setup, "?");
        await frameWith(setup, "Keys");
        await key(setup, "escape");
        finish?.(23);
        const failed = await frameWith(setup, "exited with code 23");
        expect(failed).toContain("RESULT");
        expect(failed).toContain("✗ Operation failed");
      }, "skills");
    } finally {
      finish?.(0);
      resetRunner();
    }
  });
});

test("dependency check and MCP writes use their project plans and confirmations", async () => {
  await withProject(async (dir) => {
    const calls: string[][] = [];
    setRunner(async (command, args) => {
      calls.push([command, ...args]);
      return { code: 0, stdout: "", stderr: "" };
    });
    try {
      await withTui(async (setup) => {
        await frameWith(setup, "0 marked");
        await key(setup, "c");
        await frameWith(setup, "Dependency check");
        await key(setup, "space");
        await key(setup, "i");
        await frameWith(setup, "Install dependency groups");
        expect(calls).toHaveLength(0);
        await key(setup, "i");
        await frameWith(setup, "Dependency installation completed");
        expect(calls[0]?.slice(0, 2)).toEqual(["npm", "install"]);
      }, "deps");
      await withTui(async (setup) => {
        const file = join(dir, ".mcp.json");
        await frameWith(setup, "claude · absent");
        await key(setup, "c");
        await frameWith(setup, "Client: claude");
        await key(setup, "space");
        await key(setup, "i");
        await frameWith(setup, "Write MCP configuration");
        expect(existsSync(file)).toBe(false);
        await key(setup, "i");
        await frameWith(setup, "1 MCP files written");
        expect(JSON.parse(await Bun.file(file).text()).mcpServers.designfy.command).toBe("designfy");
      }, "mcp");
    } finally {
      resetRunner();
    }
  });
});

test("viewspecs switch between guide and status filters and open the complete file", async () => {
  await withProject(async () => withTui(async (setup) => {
    await frameWith(setup, "Dashboard de vendas");
    await key(setup, "s");
    await frameWith(setup, "No viewspecs in this view");
    await key(setup, "v");
    await frameWith(setup, "Mesa de Pedidos");
    await key(setup, "return");
    await frameWith(setup, 'schemaVersion: "1.0.0"');
    await key(setup, "tab");
    await frameWith(setup, "Details");
  }, "viewspecs"));
});

test("capture details report horizontal overflow and copy the selected path", async () => {
  await withProject(async (dir) => withTui(async (setup) => {
    await frameWith(setup, "overflowX: true");
    expect(setup.captureCharFrame()).toContain("Test console error");
    const copy = setup.renderer.copyToClipboardOSC52;
    let path: string | undefined;
    setup.renderer.copyToClipboardOSC52 = (value) => { path = value; return true; };
    try {
      await key(setup, "return");
      await frameWith(setup, "Select a screenshot");
      await key(setup, "return");
      await key(setup, "o");
      expect(path).toBe(join(dir, ".designfy", "captures", "2026-11-24-test", "home--phone.png"));
      expect(scrollBoxes(setup.renderer.root).length).toBeGreaterThan(0);
    } finally {
      setup.renderer.copyToClipboardOSC52 = copy;
    }
  }, "captures"));
});

test("missing theme and malformed project settings expose reloadable states", async () => {
  await withProject(async (dir) => {
    rmSync(join(dir, "src", "styles", "globals.css"));
    await withTui(async (setup) => {
      await frameWith(setup, "designfy components add designfy-theme");
      writeFileSync(join(dir, "designfy.json"), "{invalid");
      await key(setup, "r");
      await frameWith(setup, "Unable to load theme");
    }, "theme");
  });
});

test("the live list filter ignores case and accents and Escape restores it", async () => {
  await withProject(async () => withTui(async (setup) => {
    await frameWith(setup, "Dashboard de vendas");
    await key(setup, "/");
    await setup.mockInput.typeText("DÁSHBOARD");
    const filtered = await frameWith(setup, "/DÁSHBOARD");
    expect(filtered).toMatch(/\d+\/\d+ · \/DÁSHBOARD/);
    expect(filtered).toContain("Dashboard de vendas");
    await key(setup, "escape");
    expect(setup.captureCharFrame()).not.toContain("/DÁSHBOARD");
    expect(setup.captureCharFrame()).toContain("Dashboard de vendas");
  }, "viewspecs"));
});

test("multi-step Skills progress keeps completed steps while the next command runs", async () => {
  await withProject(async () => {
    const complete: Array<(code: number) => void> = [];
    setRunner(async () => ({
      code: await new Promise<number>((resolve) => { complete.push(resolve); }),
      stdout: "", stderr: "",
    }));
    try {
      await withTui(async (setup) => {
        await frameWith(setup, "internal · project");
        await key(setup, "a");
        await key(setup, "i");
        await frameWith(setup, "Press i again to run");
        expect(complete).toHaveLength(0);
        await key(setup, "i");
        await frameWith(setup, "PROGRESS");
        for (let i = 0; !complete.length && i < 600; i++) await Bun.sleep(5);
        expect(complete).toHaveLength(1);
        complete[0]!(0);
        const active = await frameWith(setup, "✓ npx");
        expect(active).toMatch(/Steps ━+ 1\/[2-9]|Steps ━+ 1\/\d{2}/);
        for (let i = 0; complete.length < 2 && i < 600; i++) await Bun.sleep(5);
        expect(complete).toHaveLength(2);
        complete[1]!(17);
        const result = await frameWith(setup, "exited with code 17");
        expect(result).toContain("✓ npx");
        expect(result).toContain("✗ npx");
      }, "skills");
    } finally {
      for (const resolve of complete) resolve(1);
      resetRunner();
    }
  });
});

test("CLI and settings accept exactly the registered Home and module IDs", () => {
  const ids = projectModules.map(([id]) => id);
  expect(screens.map(({ id }) => id)).toEqual(ids);
  for (const id of ids) {
    expect(parse(tuiCommand, ["--tab", id]).options.tab).toBe(id);
    expect(convertValue("tui.initialTab", id)).toBe(id);
  }
  expect(() => parse(tuiCommand, ["--tab", "unknown"])).toThrow("Invalid value");
  expect(() => convertValue("tui.initialTab", "unknown")).toThrow("accepts only");
});

const showcaseSubjects = [
  ["home", "overview", "Install dependencies"],
  ["theme", "theme", "light · colors"],
  ["catalog", "catalog", "Purpose"],
  ["components", "components", "Framework: react"],
  ["skills", "skills", "internal · project"],
  ["viewspecs", "viewspecs", "Dashboard de vendas"],
  ["help", "overview", "Keys"],
] as const;

for (const [width, height] of [[100, 30], [140, 40]] as const) {
  for (const [subject, id, ready] of showcaseSubjects) {
    test(`night showcase ${subject} at ${width}×${height}`, async () => {
      await withProject(async () => withTui(async (setup) => {
        if (subject === "help") {
          await frameWith(setup, "Install dependencies");
          await key(setup, "?");
        }
        await frameWith(setup, ready);
        const frame = setup.captureCharFrame().split("\n").map((line) => line.trimEnd()).join("\n")
          .replace(`${process.platform}-${process.arch} · Bun ${Bun.version}`, "linux-x64 · Bun 0.0.0");
        const path = join(import.meta.dir, "showcase-frames", `night-${subject}-${width}x${height}.txt`);
        if (process.env.UPDATE_SHOWCASE === "1") {
          mkdirSync(join(import.meta.dir, "showcase-frames"), { recursive: true });
          writeFileSync(path, frame);
        }
        expect(frame).toBe(readFileSync(path, "utf8"));
      }, id, { width, height }));
    });
  }
}
