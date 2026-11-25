/** Exercises mouse routes through real OpenTUI hit testing and captured frames. */
import { expect, test } from "bun:test";
import { createTestRenderer } from "@opentui/core/testing";
import { button, listPanel, panel } from "../src/tui/components.ts";
import { themes } from "../src/tui/theme.ts";
import { framePoint, withTui } from "./tui-fixture.ts";

test("clicking a Home card opens its module and the Back chip and brand return Home", async () => {
  await withTui(async (setup) => {
    await setup.mockMouse.click(...framePoint(setup, "a ℹ About"), 2);
    await setup.renderOnce();
    expect(setup.captureCharFrame().split("\n")[0]).toContain("⌂ Home");
    await setup.mockMouse.click(...framePoint(setup, "a ℹ About"));
    await setup.renderOnce();
    expect(setup.captureCharFrame()).toContain("Credits");
    await setup.mockMouse.click(...framePoint(setup, "← Back"));
    await setup.renderOnce();
    expect(setup.captureCharFrame().split("\n")[0]).toContain("⌂ Home");
    await setup.mockMouse.click(...framePoint(setup, "1 ◐ Theme"));
    await setup.renderOnce();
    expect(setup.captureCharFrame().split("\n")[0]).toContain("› ◐ Theme");
    await setup.mockMouse.click(...framePoint(setup, "◆ Designfy"));
    await setup.renderOnce();
    expect(setup.captureCharFrame().split("\n")[0]).toContain("⌂ Home");
  }, "overview", { width: 140, height: 40 });
});
test("clicking quit in the key bar destroys the renderer", async () => {
  await withTui(async (setup) => {
    await setup.mockMouse.click(...framePoint(setup, "quit", true));
    expect(setup.renderer.isDestroyed).toBe(true);
  });
});
test("a key bar screen action copies MCP config and reports its result", async () => {
  await withTui(async (setup) => {
    await setup.mockMouse.click(...framePoint(setup, "copy MCP config", true));
    await setup.renderOnce();
    expect(setup.captureCharFrame()).toMatch(/copied|OSC 52/);
  }, "project");
});
test("clicking a help action runs it and closes the help", async () => {
  await withTui(async (setup) => {
    setup.mockInput.pressKey("?");
    await setup.renderOnce();
    expect(setup.captureCharFrame()).toContain("Keys");
    await setup.mockMouse.click(...framePoint(setup, "↻ reload"));
    await setup.renderOnce();
    expect(setup.captureCharFrame()).toContain("Reloaded");
    expect(setup.captureCharFrame()).not.toContain("Keys");
  }, "project");
});
test("list row clicks select and activate while right clicks and wheel do not activate", async () => {
  const setup = await createTestRenderer({ width: 50, height: 10 });
  const calls: number[] = [];
  try {
    const list = listPanel(setup.renderer, themes.night, { title: "Choices", items: ["First choice", "Second choice", "Third choice"], onSelect: (index) => calls.push(index) });
    list.box.height = 10;
    setup.renderer.root.add(list.box);
    await setup.renderOnce();
    await setup.mockMouse.click(...framePoint(setup, "Second choice"), 2);
    await setup.mockMouse.scroll(...framePoint(setup, "Second choice"), "down");
    expect(calls).toEqual([]);
    await setup.mockMouse.click(...framePoint(setup, "Second choice"));
    await setup.renderOnce();
    expect(list.selected()).toBe(1);
    expect(calls).toEqual([1]);
    expect(setup.captureCharFrame()).toContain("> Second choice");
  } finally { setup.renderer.destroy(); }
});
test("a nested button runs once and stops propagation to its panel", async () => {
  const setup = await createTestRenderer({ width: 50, height: 8 });
  let presses = 0;
  let parentPresses = 0;
  try {
    const container = panel(setup.renderer, themes.night, { title: "Actions", height: 8 });
    container.onMouseDown = () => { parentPresses++; };
    container.add(button(setup.renderer, themes.night, { key: "x", label: "Do action", onPress: () => { presses++; } }));
    setup.renderer.root.add(container);
    await setup.renderOnce();
    await setup.mockMouse.click(...framePoint(setup, "Do action"));
    expect(presses).toBe(1);
    expect(parentPresses).toBe(0);
    await setup.mockMouse.click(...framePoint(setup, "Do action"), 2);
    await setup.mockMouse.scroll(...framePoint(setup, "Do action"), "down");
    expect(presses).toBe(1);
  } finally { setup.renderer.destroy(); }
});

test("About clipboard errors become a status message", async () => {
  await withTui(async (setup) => {
    await setup.mockMouse.click(...framePoint(setup, "copy link", true));
    await setup.renderOnce();
    expect(setup.captureCharFrame()).toMatch(/Copied|OSC 52/);
  }, "about");
});
test("the narrow Home scrolls to tool modules and keeps cards clickable", async () => {
  await withTui(async (setup) => {
    for (let attempt = 0; attempt < 40 && !setup.captureCharFrame().includes("0 ⚙ Settings"); attempt++) {
      await setup.mockMouse.scroll(18, 5, "down");
      await setup.renderOnce();
    }
    await setup.mockMouse.click(...framePoint(setup, "0 ⚙ Settings"));
    await setup.renderOnce();
    expect(setup.captureCharFrame().split("\n")[0]).toContain("› ⚙ Settings");
    setup.mockInput.pressBackspace();
    setup.mockInput.pressKey("c");
    await setup.renderOnce();
    expect(setup.captureCharFrame()).toContain("No credentials");
  }, "overview", { width: 60, height: 16 });
});
