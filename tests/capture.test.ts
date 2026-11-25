/** Tests capture planning, manifest compatibility, and the optional browser integration. */
import { afterEach, beforeEach, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ExitCode } from "../src/app/exit-codes.ts";
import { HOME_VARIABLE } from "../src/config/paths.ts";
import { listCaptures, parseViewport, parseViewports, planCapture, runCapture } from "../src/design/capture.ts";
import { resetRunner, setRunner } from "../src/design/exec.ts";

let cwd: string;
let previousHome: string | undefined;
const url = "https://example.test";

beforeEach(() => {
  cwd = mkdtempSync(join(tmpdir(), "designfy-capture-test-"));
  previousHome = process.env[HOME_VARIABLE];
  process.env[HOME_VARIABLE] = join(cwd, "settings");
});

afterEach(() => {
  resetRunner();
  if (previousHome === undefined) delete process.env[HOME_VARIABLE];
  else process.env[HOME_VARIABLE] = previousHome;
  rmSync(cwd, { recursive: true, force: true });
});

test("parses named, comma-separated and repeated viewports", () => {
  expect(parseViewport("mobile")).toEqual({
    name: "mobile", width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
  });
  expect(parseViewport("tablet")).toMatchObject({ width: 820, height: 1180, deviceScaleFactor: 2, hasTouch: true });
  expect(parseViewport("wide")).toMatchObject({ width: 1920, height: 1080 });
  expect(parseViewport("600X300")).toMatchObject({ name: "600x300", width: 600, height: 300, isMobile: false });
  expect(parseViewports(["mobile, tablet", "desktop", "mobile"]).map(({ name }) => name)).toEqual(["mobile", "tablet", "desktop"]);
  expect(() => parseViewport("0x300")).toThrow(expect.objectContaining({ code: ExitCode.USAGE }));
  expect(() => parseViewports("mobile,")).toThrow(expect.objectContaining({ code: ExitCode.USAGE }));
});

test("plans captures with a stable UTC run name, defaults and explicit overrides", () => {
  const now = new Date("2026-11-24T09:08:07Z");
  const defaults = planCapture(cwd, [url], {}, now);
  expect(defaults).toMatchObject({
    cwd, name: "20261124-090807", outDir: join(cwd, ".designfy/captures/20261124-090807"),
    urls: [url], theme: "light", themes: ["light"], fullPage: true, scroll: true,
    scrollBudgetMs: 15_000, showDevOverlays: false, hide: [], reducedMotion: false, waitMs: 0,
  });
  expect(defaults.viewports.map(({ name }) => name)).toEqual(["mobile", "desktop"]);
  expect(planCapture(cwd, [url], {
    name: "review", outDir: "shots", theme: "dark", fullPage: false, reducedMotion: true,
    viewports: "wide", waitMs: 25, selector: "main",
  }, now)).toMatchObject({
    outDir: join(cwd, "shots/review"), theme: "dark", fullPage: false, reducedMotion: true,
    viewports: [{ name: "wide" }], waitMs: 25, selector: "main",
  });
  expect(() => planCapture(cwd, [url], { name: "../outside" })).toThrow();
  expect(() => planCapture(cwd, ["file:///etc/passwd"])).toThrow();
  expect(() => planCapture(cwd, [url], { waitMs: -1 })).toThrow();
  expect(() => planCapture(cwd, [url], { scrollBudgetMs: 1.5 })).toThrow();
  expect(() => planCapture(cwd, [url], { theme: "light,system" })).toThrow();
  expect(() => planCapture(cwd, [url], { theme: [] })).toThrow();
  expect(listCaptures(cwd)).toEqual([]);
});

test("plans a deduplicated theme matrix and preserves CSS selector groups", () => {
  const hide = ['[title="a,b"]', ".one:is(.two,.three)"];
  expect(planCapture(cwd, [url], {
    theme: ["dark, light", "dark"], scroll: false, scrollBudgetMs: 0, showDevOverlays: true, hide,
  })).toMatchObject({
    theme: "dark", themes: ["dark", "light"], scroll: false, scrollBudgetMs: 0, showDevOverlays: true, hide,
  });
});

test("invokes the project runner, writes a manifest, and lists runs newest first", async () => {
  const plans = [
    planCapture(cwd, [url], { name: "baseline", viewports: "mobile" }, new Date("2026-11-23T13:00:00Z")),
    planCapture(cwd, [url], { name: "review", viewports: "mobile" }, new Date("2026-11-24T13:00:00Z")),
  ];
  const shot = {
    url, viewport: "mobile", file: "example-test--mobile.png", title: "Preview",
    documentWidth: 420, documentHeight: 844, viewportWidth: 390, overflowX: true,
    consoleErrors: ["missing image"], pageErrors: ["example error"],
  };
  const temporaryFiles: string[] = [];
  setRunner(async (command, args, options) => {
    expect(command).toBe("node");
    expect(options.cwd).toBe(cwd);
    const [script, plan] = args as [string, string];
    expect(readFileSync(script, "utf8")).toContain('require.resolve("playwright")');
    expect(JSON.parse(readFileSync(plan, "utf8"))).toMatchObject({ urls: [url], viewports: [{ name: "mobile" }] });
    temporaryFiles.push(script, plan);
    return { code: 0, stdout: JSON.stringify({ shots: [shot], errors: [] }), stderr: "" };
  });

  for (const plan of plans) {
    const manifest = await runCapture(plan);
    expect(manifest.shots).toEqual([shot]);
    expect(JSON.parse(readFileSync(join(plan.outDir, "manifest.json"), "utf8"))).toMatchObject({ name: plan.name, shots: [shot] });
  }
  expect(temporaryFiles.every((path) => !existsSync(path))).toBe(true);
  expect(listCaptures(cwd).map(({ name }) => name)).toEqual(["review", "baseline"]);
  await expect(runCapture(plans[0]!)).rejects.toMatchObject({ code: ExitCode.USAGE });
  expect(existsSync(join(plans[0]!.outDir, "manifest.json"))).toBe(true);
});

test("maps missing Playwright and persists a partial browser failure", async () => {
  const plan = planCapture(cwd, [url], { name: "errors", viewports: "mobile,desktop" });
  setRunner(async () => ({ code: 3, stdout: "{}", stderr: "" }));
  await expect(runCapture(plan)).rejects.toMatchObject({
    code: ExitCode.CHECK_FAILED,
    details: { hint: "designfy deps install testing" },
  });
  expect(existsSync(plan.outDir)).toBe(false);

  const errors = [{ url, viewport: "mobile", error: "Navigation failed." }];
  const shots = [
    { ...errors[0], consoleErrors: [], pageErrors: [] },
    { url, viewport: "desktop", file: "example-test--desktop.png", consoleErrors: [], pageErrors: [] },
  ];
  setRunner(async () => ({ code: 4, stdout: JSON.stringify({ shots, errors }), stderr: "" }));
  const manifestPath = join(plan.outDir, "manifest.json");
  await expect(runCapture(plan)).rejects.toMatchObject({
    code: ExitCode.NETWORK_OR_API,
    details: { manifestPath, errors },
  });
  expect(JSON.parse(readFileSync(manifestPath, "utf8"))).toMatchObject({ shots, errors });
});

test.skipIf(process.env.DESIGNFY_E2E !== "1")("captures a local page with the project's Playwright", async () => {
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch: () => new Response(
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>Local capture</title><main style="width:700px;height:100px">Preview</main>' +
      '<script>console.error("capture error");throw new Error("page error");</script>',
      { headers: { "content-type": "text/html" } },
    ),
  });
  try {
    const plan = planCapture(join(import.meta.dir, ".."), [server.url.toString()], {
      outDir: cwd, viewports: "mobile", selector: "main",
    });
    const manifest = await runCapture(plan);
    const screenshot = manifest.shots[0]?.file;
    expect(manifest.shots[0]).toMatchObject({
      file: expect.stringMatching(/--mobile\.png$/), title: "Local capture", overflowX: true,
      consoleErrors: ["capture error"], pageErrors: ["page error"],
    });
    expect(screenshot && existsSync(join(plan.outDir, screenshot))).toBe(true);
  } finally {
    server.stop(true);
  }
}, 60_000);

test.skipIf(process.env.DESIGNFY_E2E !== "1")("prepares full-page captures and reports their readiness", async () => {
  const html = `
    <!doctype html><meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      html { scroll-behavior: smooth; }
      body { margin: 0; }
      header { height: 3200px; }
      section { height: 260px; }
      section.pending { opacity: 0; }
      astro-dev-toolbar, vite-error-overlay, nextjs-portal, [data-nextjs-toast],
      #__next-build-watcher, [data-astro-dev-toolbar] { display: block; position: fixed; }
    </style>
    <header>Top</header>
    <section class="pending">Revealed content
      <img loading="lazy" src="/lazy.svg" width="40" height="40" alt="">
      <iframe title="Lazy frame" loading="lazy" src="/frame" height="80"></iframe>
    </section>
    <astro-dev-toolbar data-overlay></astro-dev-toolbar>
    <vite-error-overlay data-overlay></vite-error-overlay>
    <nextjs-portal data-overlay></nextjs-portal>
    <span data-nextjs-toast data-overlay></span>
    <span id="__next-build-watcher" data-overlay></span>
    <span data-astro-dev-toolbar data-overlay></span>
    <div data-widget title="chat,message">Chat</div>
    <div data-widget class="floating">Action</div>
    <script>
      const section = document.querySelector("section");
      const image = document.querySelector("img");
      const frame = document.querySelector("iframe");
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          section.classList.remove("pending");
          observer.disconnect();
        }
      });
      observer.observe(section);
      const visibleCount = (selector) => [...document.querySelectorAll(selector)]
        .filter((element) => getComputedStyle(element).display !== "none").length;
      function report() {
        const theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        document.title = [
          theme, scrollY, Number(!section.classList.contains("pending")),
          Number(image.complete && image.naturalWidth > 0),
          Number(frame.contentDocument?.body?.textContent === "Loaded"),
          visibleCount("[data-overlay]"), visibleCount("[data-widget]"),
        ].join("/");
        requestAnimationFrame(report);
      }
      report();
    </script>
  `;
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    async fetch(request) {
      const { pathname } = new URL(request.url);
      switch (pathname) {
        case "/lazy.svg":
          await Bun.sleep(800);
          return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"/>', {
            headers: { "content-type": "image/svg+xml" },
          });
        case "/frame":
          return new Response("Loaded", { headers: { "content-type": "text/html" } });
        default:
          return new Response(pathname === "/budget" ? html.replace('loading="lazy" src="/lazy.svg"', 'src="/lazy.svg"') : html, {
            headers: { "content-type": "text/html" },
          });
      }
    },
  });
  const project = join(import.meta.dir, "..");
  const url = server.url.toString();
  try {
    const child = Bun.spawn([
      process.execPath, "src/main.ts", "capture", "run", url, "--json",
      "--viewport", "400x300,450x350", "--theme=light", "--theme", "dark,light",
      "--hide", '[title="chat,message"]', "--hide", ".floating", "--out", cwd, "--name", "matrix",
    ], { cwd: project, stdout: "pipe", stderr: "pipe" });
    const [code, stdout, stderr] = await Promise.all([child.exited, child.stdout.text(), child.stderr.text()]);
    if (code !== 0) throw new Error(`Capture CLI exited with ${code}: ${stderr}\n${stdout}`);
    const { data } = JSON.parse(stdout);
    expect(data.shots.map(({ file }: { file: string }) => file.split("--").slice(1).join("--"))).toEqual([
      "400x300--light.png", "400x300--dark.png", "450x350--light.png", "450x350--dark.png",
    ]);
    for (const shot of data.shots) {
      expect(shot).toMatchObject({
        title: `${shot.theme}/0/1/1/1/0/0`, incompleteImages: [], scrollBudgetExhausted: false,
      });
      expect(shot.scrollSteps).toBeGreaterThan(0);
      expect(existsSync(join(data.outDir, shot.file))).toBe(true);
    }

    const base = { outDir: cwd, viewports: "400x300" };
    const [fold, exhausted] = await Promise.all([
      runCapture(planCapture(project, [url], { ...base, name: "fold", fullPage: false, showDevOverlays: true })),
      runCapture(planCapture(project, [new URL("/budget", url).href], { ...base, name: "budget", scrollBudgetMs: 0 })),
    ]);
    expect(fold.shots[0]).toMatchObject({
      file: expect.stringMatching(/--400x300\.png$/),
      title: expect.stringMatching(/^light\/0\/0\/[01]\/[01]\/6\/2$/),
      scrollSteps: 0, scrollBudgetExhausted: false,
    });
    expect(exhausted.shots[0]).toMatchObject({
      scrollSteps: 0, scrollBudgetExhausted: true, incompleteImages: [new URL("/lazy.svg", url).href],
    });

    const client = new Client({ name: "capture-test", version: "1.0.0" });
    try {
      await client.connect(new StdioClientTransport({
        command: process.execPath, args: ["src/main.ts", "mcp"], cwd: project,
        env: {
          [HOME_VARIABLE]: process.env[HOME_VARIABLE]!,
          ...(process.env.NODE_PATH ? { NODE_PATH: process.env.NODE_PATH } : {}),
          ...(process.env.TMPDIR ? { TMPDIR: process.env.TMPDIR } : {}),
        },
      }));
      const result = await client.callTool({
        name: "capture_run",
        arguments: {
          urls: [url], viewports: base.viewports, theme: ["dark", "light"], scroll: false,
          scrollBudgetMs: 0, showDevOverlays: true, hide: ['[title="chat,message"]', ".floating"],
          outDir: cwd, name: "no-scroll",
        },
      });
      expect(result.structuredContent).toMatchObject({
        themes: ["dark", "light"],
        shots: ["dark", "light"].map((theme) => ({
          theme, title: expect.stringMatching(new RegExp(`^${theme}/0/0/[01]/[01]/6/0$`)),
          scrollSteps: 0, scrollBudgetExhausted: false,
        })),
      });
    } finally {
      await client.close();
    }
  } finally {
    server.stop(true);
  }
}, 60_000);
