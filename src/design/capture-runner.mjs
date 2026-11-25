/** Captures browser screenshots using the Playwright installed in the current project. */
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";

function emit(result, code = 0) {
  process.stdout.write(JSON.stringify(result) + "\n");
  process.exitCode = code;
}

function slug(url) {
  const { host, pathname, search, hash } = new URL(url);
  return (host + pathname + search + hash).toLowerCase().replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "").slice(0, 120);
}

async function capture(browser, plan, url, viewport, file) {
  const shot = { url, viewport: viewport.name, consoleErrors: [], pageErrors: [] };
  const { width, height, deviceScaleFactor, isMobile, hasTouch } = viewport;
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor,
    isMobile,
    hasTouch,
    colorScheme: plan.theme,
    reducedMotion: plan.reducedMotion ? "reduce" : "no-preference",
  });
  try {
    const page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() === "error") shot.consoleErrors.push(message.text());
    });
    page.on("pageerror", (cause) => shot.pageErrors.push(cause.message));

    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15_000 });
    if (response?.status() >= 400) throw new Error(`Page returned HTTP ${response.status()}.`);
    try {
      await page.waitForLoadState("networkidle", { timeout: 15_000 });
    } catch (cause) {
      if (cause.name !== "TimeoutError") throw cause;
    }
    if (plan.waitMs > 0) await page.waitForTimeout(plan.waitMs);

    Object.assign(shot, await page.evaluate(() => {
      const documentWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0);
      const documentHeight = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0);
      const viewportWidth = document.documentElement.clientWidth;
      return {
        title: document.title,
        documentWidth,
        documentHeight,
        viewportWidth,
        overflowX: documentWidth > viewportWidth + 1,
      };
    }));

    const path = join(plan.outDir, file);
    if (plan.selector) await page.locator(plan.selector).screenshot({ path, timeout: 15_000 });
    else await page.screenshot({ path, fullPage: plan.fullPage, timeout: 15_000 });
    shot.file = file;
  } catch (cause) {
    shot.error = cause.message;
  } finally {
    await context.close();
  }
  return shot;
}

async function main() {
  const plan = JSON.parse(await readFile(process.argv[2], "utf8"));
  const require = createRequire(process.cwd() + "/");
  let playwrightEntry;
  try {
    playwrightEntry = require.resolve("playwright");
  } catch (cause) {
    if (cause.code !== "MODULE_NOT_FOUND") throw cause;
    emit({ shots: [], errors: [{ error: "Playwright is not installed in the current project." }] }, 3);
    return;
  }

  const { chromium } = require(playwrightEntry);
  const shots = [];
  const errors = [];
  const filenames = new Set();
  const browser = await chromium.launch();
  try {
    for (const url of plan.urls) {
      for (const viewport of plan.viewports) {
        const base = slug(url);
        let name = base;
        for (let suffix = 2; filenames.has(`${name}--${viewport.name}.png`); suffix++) {
          name = `${base}-${suffix}`;
        }
        const file = `${name}--${viewport.name}.png`;
        filenames.add(file);
        let shot;
        try {
          shot = await capture(browser, plan, url, viewport, file);
        } catch (cause) {
          shot = { url, viewport: viewport.name, consoleErrors: [], pageErrors: [], error: cause.message };
        }
        shots.push(shot);
        if (shot.error !== undefined) errors.push({ url, viewport: viewport.name, error: shot.error });
      }
    }
  } finally {
    await browser.close();
  }
  emit({ shots, errors }, errors.length ? 4 : 0);
}

try {
  await main();
} catch (cause) {
  emit({ shots: [], errors: [{ error: cause.message }] }, 4);
}
