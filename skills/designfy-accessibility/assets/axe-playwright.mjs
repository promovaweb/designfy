#!/usr/bin/env node
/**
 * Accessibility audit with axe-core through Playwright.
 *
 * Usage:
 *   node axe-playwright.mjs <url> [<url>...] [--tags wcag2a,wcag2aa,wcag21aa,wcag22aa]
 *                           [--viewports mobile,desktop] [--themes light,dark]
 *                           [--json] [--fail-on serious]
 *
 * Opens each URL in each viewport and color scheme, runs axe with the WCAG
 * 2.2 A and AA rules and prints the violations grouped by impact, with the
 * element selector, the rule and the help link.
 *
 * Requirements (in the project): playwright and @axe-core/playwright
 *   designfy deps install testing && npx playwright install chromium
 *
 * Exit codes: 0 no violation at or above --fail-on (default "serious");
 * 1 violations found; 2 invalid arguments or missing packages.
 */
import { createRequire } from "node:module";

const require = createRequire(`${process.cwd()}/`);
const argv = process.argv.slice(2);

function option(name, fallback) {
  const index = argv.indexOf(`--${name}`);
  if (index === -1) return fallback;
  const value = argv[index + 1];
  argv.splice(index, 2);
  return value;
}

const asJson = argv.includes("--json");
if (asJson) argv.splice(argv.indexOf("--json"), 1);
const tags = option("tags", "wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa").split(",");
const viewportNames = option("viewports", "mobile,desktop").split(",");
const themes = option("themes", "light,dark").split(",");
const failOn = option("fail-on", "serious");
const urls = argv.filter((value) => !value.startsWith("--"));

const VIEWPORTS = {
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  tablet: { width: 820, height: 1180, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  desktop: { width: 1440, height: 900 },
};
const IMPACT_ORDER = ["minor", "moderate", "serious", "critical"];

if (urls.length === 0 || !IMPACT_ORDER.includes(failOn) || viewportNames.some((name) => !VIEWPORTS[name])) {
  console.error("Usage: node axe-playwright.mjs <url> [<url>...] [--viewports mobile,desktop] [--themes light,dark] [--fail-on serious] [--json]");
  process.exit(2);
}

let chromium;
let AxeBuilder;
try {
  ({ chromium } = require("playwright"));
  ({ AxeBuilder } = require("@axe-core/playwright"));
} catch {
  console.error("Missing packages. Run: designfy deps install testing && npx playwright install chromium");
  process.exit(2);
}

const browser = await chromium.launch();
const runs = [];
try {
  for (const url of urls) {
    for (const viewportName of viewportNames) {
      for (const theme of themes) {
        const { isMobile, hasTouch, deviceScaleFactor, ...viewport } = VIEWPORTS[viewportName];
        const context = await browser.newContext({ viewport, isMobile, hasTouch, deviceScaleFactor, colorScheme: theme });
        const page = await context.newPage();
        try {
          await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
          const results = await new AxeBuilder({ page }).withTags(tags).analyze();
          runs.push({
            url,
            viewport: viewportName,
            theme,
            violations: results.violations.map((violation) => ({
              id: violation.id,
              impact: violation.impact ?? "minor",
              help: violation.help,
              helpUrl: violation.helpUrl,
              wcag: violation.tags.filter((tag) => /^wcag\d/.test(tag)),
              nodes: violation.nodes.map((node) => ({ target: node.target.join(" "), summary: node.failureSummary ?? "" })),
            })),
          });
        } catch (error) {
          runs.push({ url, viewport: viewportName, theme, error: error instanceof Error ? error.message : String(error), violations: [] });
        } finally {
          await context.close();
        }
      }
    }
  }
} finally {
  await browser.close();
}

const threshold = IMPACT_ORDER.indexOf(failOn);
const blocking = runs.flatMap((run) => run.violations).filter((violation) => IMPACT_ORDER.indexOf(violation.impact) >= threshold);
const failed = blocking.length > 0 || runs.some((run) => run.error);

if (asJson) {
  console.log(JSON.stringify({ ok: !failed, failOn, runs }, null, 2));
} else {
  for (const run of runs) {
    console.log(`\n${run.url}  [${run.viewport}, ${run.theme}]`);
    if (run.error) {
      console.log(`  could not audit: ${run.error}`);
      continue;
    }
    if (run.violations.length === 0) {
      console.log("  no violations");
      continue;
    }
    const sorted = [...run.violations].sort((a, b) => IMPACT_ORDER.indexOf(b.impact) - IMPACT_ORDER.indexOf(a.impact));
    for (const violation of sorted) {
      console.log(`  ${violation.impact.toUpperCase()}  ${violation.id}: ${violation.help}`);
      console.log(`    ${violation.wcag.join(", ")}  ${violation.helpUrl}`);
      for (const node of violation.nodes.slice(0, 5)) console.log(`    - ${node.target}`);
      if (violation.nodes.length > 5) console.log(`    - and ${violation.nodes.length - 5} more`);
    }
  }
  const total = runs.reduce((count, run) => count + run.violations.length, 0);
  console.log(`\n${total} violation(s) in ${runs.length} run(s); ${blocking.length} at or above "${failOn}".`);
}

process.exit(failed ? 1 : 0);
