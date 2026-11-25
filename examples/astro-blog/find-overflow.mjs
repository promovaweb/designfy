import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:4321/blog/a-regua-de-chuva/";
const width = Number(process.argv[3] ?? 390);
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width, height: 844 } });
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });
const report = await page.evaluate(() => {
  const viewport = document.documentElement.clientWidth;
  const rows = [];
  for (const el of document.querySelectorAll("*")) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (rect.right > viewport + 1 || rect.left < -1) {
      rows.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.getAttribute("class") ?? "").slice(0, 120),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
      });
    }
  }
  return { viewport, documentWidth: document.documentElement.scrollWidth, rows: rows.slice(0, 25) };
});
console.log(JSON.stringify(report, null, 2));
await browser.close();
