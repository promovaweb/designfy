/** Captures browser screenshots using the Playwright installed in the current project. */
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";

const devOverlays = [
  "astro-dev-toolbar", "vite-error-overlay", "nextjs-portal",
  "[data-nextjs-toast]", "#__next-build-watcher", "[data-astro-dev-toolbar]",
];
const scrollSettleMs = 100;
const networkQuietMs = 500;
const maxDevicePixels = 64 * 1024 * 1024;

function emit(result, code = 0) {
  process.stdout.write(JSON.stringify(result) + "\n");
  process.exitCode = code;
}

function slug(url) {
  const { host, pathname, search, hash } = new URL(url);
  return (host + pathname + search + hash).toLowerCase().replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "").slice(0, 120);
}

function newShot(url, viewport, theme) {
  return {
    url, viewport: viewport.name, theme, consoleErrors: [], pageErrors: [],
    scrollSteps: 0, incompleteImages: [], scrollBudgetExhausted: false,
  };
}

function trackNetwork(page) {
  const pending = new Set();
  let lastActivity = performance.now();
  page.on("request", (request) => {
    pending.add(request);
    lastActivity = performance.now();
  });
  const finish = (request) => {
    pending.delete(request);
    lastActivity = performance.now();
  };
  page.on("requestfinished", finish);
  page.on("requestfailed", finish);
  return () => pending.size === 0 && performance.now() - lastActivity >= networkQuietMs;
}

function incompleteImages() {
  return Array.from(document.images)
    .filter((image) => !image.complete)
    .map((image) => image.currentSrc || image.src || image.srcset);
}

async function freezeOffscreenFrames(page, deadline) {
  const pageOrigin = new URL(page.url()).origin;
  for (const frame of page.mainFrame().childFrames()) {
    if (!/^https?:/.test(frame.url()) || new URL(frame.url()).origin === pageOrigin) continue;
    if (performance.now() >= deadline) return false;
    try {
      const element = await frame.frameElement();
      const belowFold = await element.evaluate((iframe) => {
        const bounds = iframe.getBoundingClientRect();
        return bounds.height > 0 && bounds.width > 0 && bounds.bottom + window.scrollY > window.innerHeight;
      });
      if (!belowFold || !(await element.isVisible())) continue;
      await element.scrollIntoViewIfNeeded({ timeout: Math.max(1, deadline - performance.now()) });
      // Give the embedded renderer time to paint after it enters the viewport.
      const settle = Math.min(250, deadline - performance.now());
      if (settle <= 0) return false;
      await page.waitForTimeout(settle);
      if (performance.now() >= deadline) return false;
      // Chromium can omit offscreen cross-origin surfaces. Keep their pixels in the same layout box.
      const pixels = await snapshotFrame(element, deadline);
      await element.evaluate((iframe, { png, remaining }) => new Promise((resolve) => {
        const timeout = setTimeout(resolve, remaining);
        iframe.addEventListener("load", () => {
          clearTimeout(timeout);
          resolve();
        }, { once: true });
        iframe.srcdoc = `<!doctype html><style>html,body{margin:0;height:100%;overflow:hidden}img{display:block;width:100%;height:100%}</style><img alt="" src="data:image/png;base64,${png}">`;
      }), { png: pixels.toString("base64"), remaining: Math.max(0, deadline - performance.now()) });
    } catch (cause) {
      if (cause.name === "TimeoutError") return false;
      if (!frame.isDetached()) throw cause;
    }
  }
  return performance.now() < deadline;
}

async function snapshotFrame(iframe, deadline) {
  const overlays = await iframe.evaluateHandle((frame) => {
    const bounds = frame.getBoundingClientRect();
    return [...document.body.querySelectorAll("*")].filter((element) => {
      const { position } = getComputedStyle(element);
      if ((position !== "fixed" && position !== "sticky") || element.contains(frame)) return false;
      const rect = element.getBoundingClientRect();
      return rect.left < bounds.right && rect.right > bounds.left &&
        rect.top < bounds.bottom && rect.bottom > bounds.top;
    }).map((element) => {
      const previous = element.style.getPropertyValue("opacity");
      const priority = element.style.getPropertyPriority("opacity");
      element.style.setProperty("opacity", "0", "important");
      return { element, previous, priority };
    });
  });
  try {
    return await iframe.screenshot({ timeout: Math.max(1, deadline - performance.now()) });
  } finally {
    // Keep fixed page controls in the full screenshot and out of the embedded bitmap.
    await overlays.evaluate((entries) => {
      for (const { element, previous, priority } of entries) {
        element.style.setProperty("opacity", previous, priority);
      }
    });
    await overlays.dispose();
  }
}

async function prepareFullPage(page, shot, budget, networkIsQuiet) {
  const deadline = performance.now() + budget;
  let lastScroll = performance.now();
  const move = (toTop) => page.evaluate((top) => {
    window.scrollTo({ top: top ? 0 : window.scrollY + window.innerHeight, left: 0, behavior: "instant" });
  }, toTop);
  await move(true);
  try {
    while (performance.now() < deadline) {
      const state = await page.evaluate(() => {
        const root = document.scrollingElement ?? document.documentElement;
        const canScroll = window.scrollY + root.clientHeight < root.scrollHeight - 1;
        if (!canScroll) {
          // Native lazy loading can miss resources inside horizontal carousels.
          for (const element of document.querySelectorAll('img[loading="lazy"], iframe[loading="lazy"]')) {
            element.loading = "eager";
          }
        }
        return {
          canScroll,
          imagesComplete: Array.from(document.images).every((image) => image.complete),
          fontsLoaded: document.fonts.status === "loaded",
        };
      });
      if (performance.now() >= deadline) break;
      if (state.canScroll) {
        await move(false);
        shot.scrollSteps++;
        lastScroll = performance.now();
      } else if (state.imagesComplete && state.fontsLoaded && networkIsQuiet() &&
          performance.now() - lastScroll >= networkQuietMs) {
        const fontsReady = await page.evaluate((remaining) => new Promise((resolve) => {
          const timeout = setTimeout(() => resolve(false), remaining);
          document.fonts.ready.then(() => {
            clearTimeout(timeout);
            resolve(true);
          });
        }), Math.max(0, deadline - performance.now()));
        if (fontsReady && performance.now() < deadline && networkIsQuiet()) {
          shot.scrollBudgetExhausted = !(await freezeOffscreenFrames(page, deadline));
          return;
        }
      }
      const remaining = deadline - performance.now();
      if (remaining > 0) await page.waitForTimeout(Math.min(scrollSettleMs, remaining));
    }
    shot.scrollBudgetExhausted = true;
  } finally {
    await move(true);
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => resolve())));
  }
}

async function hideOverlays(page, plan) {
  const groups = plan.showDevOverlays ? plan.hide : [...devOverlays, ...plan.hide];
  if (groups.length === 0) return;
  await page.evaluate((selectors) => {
    const sheet = new CSSStyleSheet();
    // The CLI joins repeatable values into a CSS selector list.
    for (const selector of selectors) {
      sheet.insertRule(`${selector} { display: none !important; }`, sheet.cssRules.length);
    }
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  }, groups);
}

async function capture(browser, plan, url, viewport, theme, file) {
  const shot = newShot(url, viewport, theme);
  const { width, height, deviceScaleFactor, isMobile, hasTouch } = viewport;
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor,
    isMobile,
    hasTouch,
    colorScheme: theme,
    reducedMotion: plan.reducedMotion ? "reduce" : "no-preference",
  });
  try {
    const page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() === "error") shot.consoleErrors.push(message.text());
    });
    page.on("pageerror", (cause) => shot.pageErrors.push(cause.message));
    const networkIsQuiet = trackNetwork(page);

    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15_000 });
    if (response?.status() >= 400) throw new Error(`Page returned HTTP ${response.status()}.`);
    await hideOverlays(page, plan);
    if (plan.fullPage && !plan.selector && plan.scroll) {
      await prepareFullPage(page, shot, plan.scrollBudgetMs, networkIsQuiet);
    } else {
      try {
        await page.waitForLoadState("networkidle", { timeout: 15_000 });
      } catch (cause) {
        if (cause.name !== "TimeoutError") throw cause;
      }
    }
    if (plan.waitMs > 0) await page.waitForTimeout(plan.waitMs);
    shot.incompleteImages = await page.evaluate(incompleteImages);

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
    else {
      // Large device-scale bitmaps can exhaust Chromium's compositor tile memory.
      const pixels = shot.documentWidth * shot.documentHeight * deviceScaleFactor ** 2;
      const scale = plan.fullPage && pixels > maxDevicePixels ? "css" : "device";
      await page.screenshot({ path, fullPage: plan.fullPage, scale, timeout: 15_000 });
    }
    shot.file = file;
  } catch (cause) {
    shot.error = cause.message;
  } finally {
    try {
      await context.close();
    } catch (cause) {
      shot.error ??= cause.message;
    }
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
  // The new screenshot surface can omit cross-origin iframes below the viewport.
  const browser = await chromium.launch({ ignoreDefaultArgs: ["--enable-features=CDPScreenshotNewSurface"] });
  try {
    for (const url of plan.urls) {
      for (const viewport of plan.viewports) {
        const base = slug(url);
        const themedFile = (name, theme) => `${name}--${viewport.name}${plan.themes.length > 1 ? `--${theme}` : ""}.png`;
        let name = base;
        for (let suffix = 2; plan.themes.some((theme) => filenames.has(themedFile(name, theme))); suffix++) {
          name = `${base}-${suffix}`;
        }
        for (const theme of plan.themes) {
          const file = themedFile(name, theme);
          filenames.add(file);
          let shot;
          try {
            shot = await capture(browser, plan, url, viewport, theme, file);
          } catch (cause) {
            shot = { ...newShot(url, viewport, theme), error: cause.message };
          }
          shots.push(shot);
          if (shot.error !== undefined) errors.push({ url, viewport: viewport.name, theme, error: shot.error });
        }
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
