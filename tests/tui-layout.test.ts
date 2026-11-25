/** Visual regressions for bounded panels, complete key hints and responsive screens. */
import { manifest } from "../src/app/manifest.ts";
import { expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createTestRenderer } from "@opentui/core/testing";
import { BoxRenderable, ScrollBoxRenderable, TextRenderable, MarkdownRenderable, parseColor, type Renderable } from "@opentui/core";
import { HOME_VARIABLE, MASTER_KEY_VARIABLE } from "../src/config/paths.ts";
import { setCredential } from "../src/config/credentials.ts";
import { mountTui } from "../src/tui/index.ts";
import { iconSets } from "../src/tui/icons.ts";
import { terminalTheme } from "../src/tui/theme.ts";
import { normalizeMarkdown } from "../src/tui/screens/docs.ts";

const sizes = [[60, 16], [64, 20], [80, 24], [100, 30], [130, 32], [200, 60]] as const;
const tabs = ["project", "settings", "credentials", "docs", "about"];

/** Finds actual scroll viewports so assertions include their native visibility. */
function scrollPanels(node: Renderable): ScrollBoxRenderable[] {
  return [
    ...(node instanceof ScrollBoxRenderable ? [node] : []),
    ...node.getChildren().flatMap(scrollPanels),
  ];
}
for (const [width, height] of sizes) {
  for (const tab of tabs) {
    test(`${tab} fits ${width}×${height} with a populated vault`, async () => {
      const directory = mkdtempSync(join(tmpdir(), "termfy-layout-"));
      const previousHome = process.env[HOME_VARIABLE];
      const previousKey = process.env[MASTER_KEY_VARIABLE];
      process.env[HOME_VARIABLE] = directory;
      delete process.env[MASTER_KEY_VARIABLE];
      const setup = await createTestRenderer({ width, height });
      let closed: Promise<void> | undefined;
      try {
        setCredential("github.token", "visual-test-secret");
        closed = mountTui(setup.renderer, { initialTab: tab, icons: iconSets.unicode, motion: false }, terminalTheme());
        if (tab === "docs") {
          for (let attempt = 0; attempt < 750; attempt++) {
            await setup.renderOnce();
            if (setup.captureCharFrame().includes("Convenções")) break;
            await Bun.sleep(10);
          }
          expect(setup.captureCharFrame()).toContain("Convenções");
        }
        await setup.renderOnce();
        await setup.renderOnce();
        const frame = setup.captureCharFrame();
        const lines = frame.trimEnd().split("\n");
        const bar = lines.at(-1)!;
        expect(bar.trimEnd()).toMatch(/\? +help +q +quit$/);
        if (width >= 130) expect(bar).toMatch(/\^K +commands/);
        const barNode = setup.renderer.root.getChildren()[0]!.getChildren().at(-1)! as BoxRenderable;
        expect(barNode.backgroundColor).toEqual(parseColor(terminalTheme().barBackground));
        const chips = barNode.getChildren().flatMap((node) => node.getChildren())
          .flatMap((node) => node.getChildren()).filter((node): node is TextRenderable => node instanceof TextRenderable);
        expect(chips.some((node) => node.content.chunks.map(({ text }) => text).join("") === " ? " && node.bg.equals(barNode.backgroundColor))).toBe(false);
        expect(bar).not.toMatch(/\bq\s+q\b/);
        for (const line of lines) {
          expect(Bun.stringWidth(line)).toBeLessThanOrEqual(width);
          for (const border of line.matchAll(/╰[^╯]*╯/g)) expect(border[0]).toMatch(/^[╰╯─]+$/);
        }
        expect(frame).not.toContain("visual-test-secret");
        expect(lines[1]).toContain("← Back");
        const visit = (node: Renderable): void => {
          if (node instanceof BoxRenderable && node.constructor.name === "Card") {
            const body = node.getChildren()[0] as BoxRenderable;
            if (body.title && body.y >= 0 && body.height > 2) {
              const segment = lines[body.y]?.slice(body.x, body.x + body.width) ?? "";
              expect(segment.startsWith("╭")).toBe(true);
              expect(segment).toContain(body.title.trim().slice(0, Math.max(1, body.width - 9)));
              expect(segment.endsWith("╮")).toBe(true);
            }
          }
          node.getChildren().forEach(visit);
        };
        visit(setup.renderer.root);
        if ((tab === "project" || tab === "credentials") && width === 200) {
          expect(bar).toContain("1 credential");
          expect(bar).not.toContain("1 credentials");
        }
        if (tab === "settings") {
          expect(frame).toContain(width === 60 ? "capture.outDir" : "output.colors");
          expect(frame).not.toContain("Accepted: boolean");
        }
        if (tab === "credentials") {
          expect(frame).toContain("github.token");
          if (width >= 80) expect(frame).toContain("credentials.json");
        }
        if (tab === "docs") expect(frame).toContain("cli");
        if (tab === "about") {
          const panels = scrollPanels(setup.renderer.root);
          if (width < 80) {
            expect(panels).toHaveLength(1);
            expect(panels.filter(panel => panel.verticalScrollBar.visible).length).toBeLessThanOrEqual(1);
            let sections = frame;
            const panel = panels[0]!;
            for (let attempt = 0; attempt < 300; attempt++) {
              const previous = panel.scrollTop;
              panel.scrollBy(3);
              await setup.renderOnce();
              sections += setup.captureCharFrame();
              if (panel.scrollTop === previous) break;
            }
            for (const title of ["Binary", "Project", "Credits"]) expect(sections).toContain(title);
            expect(sections).not.toContain("Standards");
          } else {
            expect(frame).toContain("Credits");
            expect(frame).toContain("Binary");
            expect(frame).toContain("Project");
            expect(frame).not.toContain("Binary / Project");
            expect(frame).not.toMatch(/[▀▄]/);
            if (width < 120) {
              expect(panels).toHaveLength(3);
              expect(frame).not.toContain("Standards");
              if (height >= 30) expect(panels.filter(panel => panel.verticalScrollBar.visible)).toHaveLength(0);
            } else expect(frame).toContain("Standards");
          }
        }
        if (tab === "project" && width === 80 && height === 24) {
          // Assert buttons in the content area, independently of status hints.
          const content = lines.slice(3, -1).join("\n");
          expect(content).toMatch(/\[c\] copy MCP config/);
          expect(content).toMatch(/\[r\] reload/);
          const reading = scrollPanels(setup.renderer.root).at(-1)!;
          let steps = content;
          for (let attempt = 0; attempt < 300; attempt++) {
            const previous = reading.scrollTop;
            reading.scrollBy(1);
            await setup.renderOnce();
            const scrolled = setup.captureCharFrame().split("\n").slice(2, -1).join("\n");
            expect(scrolled).toMatch(/\[c\] copy MCP config/);
            expect(scrolled).toMatch(/\[r\] reload/);
            steps += scrolled;
            if (reading.scrollTop === previous) break;
          }
          expect(steps).toContain(`${manifest.bin} --help`);
          expect(steps).toContain(`${manifest.bin} --skill`);
        }
        if (tab === "project" && width >= 80 && height >= 32) {
          for (const text of ["IN THE TERMINAL", "FOR AGENTS", '"args": ["mcp"]']) expect(frame).toContain(text);
          const reading = scrollPanels(setup.renderer.root).at(-1)!;
          reading.scrollTo(Infinity);
          await setup.renderOnce();
          const end = setup.captureCharFrame();
          for (const text of [`${manifest.bin} credentials set <name>`, `${manifest.bin} --skill`]) expect(end).toContain(text);
        }
        if (tab === "docs") {
          const checkDocument = (node: Renderable): void => {
            if (node instanceof MarkdownRenderable) expect(node.content).not.toMatch(/^# CLI\b/);
            node.getChildren().forEach(checkDocument);
          };
          checkDocument(setup.renderer.root);
          if (width === 80) expect(frame).toContain("[options].");
        }
        if (tab === "project" && width === 200) {
          const borders = lines.filter(line => /^\s*╰/.test(line));
          expect(borders).toHaveLength(2);
          const nextTop = lines.findIndex(line => line.includes("Next steps"));
          const nextBottom = lines.indexOf(borders[1]!);
          expect(nextBottom - nextTop + 1).toBeLessThanOrEqual(12);
          expect(nextBottom).toBeLessThan(height / 2 + 2);
          const first = borders[0]!.trim();
          const split = first.indexOf("╯") + 1;
          expect(split / Bun.stringWidth(first)).toBeGreaterThan(0.4);
          expect(split / Bun.stringWidth(first)).toBeLessThan(0.65);
        }
      } finally {
        setup.renderer.destroy();
        await closed;
        if (previousHome === undefined) delete process.env[HOME_VARIABLE];
        else process.env[HOME_VARIABLE] = previousHome;
        if (previousKey === undefined) delete process.env[MASTER_KEY_VARIABLE];
        else process.env[MASTER_KEY_VARIABLE] = previousKey;
        rmSync(directory, { recursive: true, force: true });
      }
    });
  }
}

test("Markdown joins prose and list continuations without changing literal blocks", () => {
  const source = "A paragraph\ncontinued.\n\n- First item\n  continued.\n- Second item\n\n# Heading\n\n| A | B |\n| - | - |\n\n```ts\nconst value = 1;\n  literal();\n```\n\n    indented\n    code";
  expect(normalizeMarkdown(source)).toBe("A paragraph continued.\n\n- First item continued.\n- Second item\n\n# Heading\n\n| A | B |\n| - | - |\n\n```ts\nconst value = 1;\n  literal();\n```\n\n    indented\n    code");
});
