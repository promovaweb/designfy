/** Tests capture planning and runner integration without launching a browser by default. */
import { afterEach, beforeEach, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
    urls: [url], theme: "light", fullPage: true, reducedMotion: false, waitMs: 0,
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
  expect(listCaptures(cwd)).toEqual([]);
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
