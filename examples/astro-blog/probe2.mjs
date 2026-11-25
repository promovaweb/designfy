import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:4332/blog/a-regua-de-chuva/", { waitUntil: "networkidle" });
const info = await page.evaluate(() => Array.from(document.images).map((img) => ({ src: img.currentSrc.split("/").slice(-1)[0], loading: img.loading, complete: img.complete, w: img.naturalWidth, opacity: getComputedStyle(img).opacity })));
console.log(JSON.stringify(info, null, 2));
await browser.close();
