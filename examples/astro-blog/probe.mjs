import { chromium } from "playwright";
const url = process.argv[2];
const width = Number(process.argv[3] ?? 390);
const mobile = process.argv[4] !== "desktop";
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: mobile ? 3 : 1, isMobile: mobile, hasTouch: mobile });
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });
const report = await page.evaluate(() => {
  const viewport = document.documentElement.clientWidth;
  const rows = [];
  for (const el of document.querySelectorAll("*")) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (rect.right > viewport + 1 || rect.left < -1) rows.push({ tag: el.tagName.toLowerCase(), cls: (el.getAttribute("class") ?? "").slice(0, 100), left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) });
  }
  return { viewport, scrollWidth: document.documentElement.scrollWidth, bodyScrollWidth: document.body.scrollWidth, rows: rows.slice(0, 20) };
});
console.log(JSON.stringify(report, null, 2));
await browser.close();
