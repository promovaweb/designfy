/** Installs the foundation through runCli in local fixture projects. */
import { expect, test } from "bun:test";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { ExitCode } from "../src/app/exit-codes.ts";
import { HOME_VARIABLE } from "../src/config/paths.ts";
import { loadRegistry, resolveItems, type AddResult } from "../src/design/registry.ts";

const cli = `
  import { runCli } from ${JSON.stringify(resolve(import.meta.dir, "../src/cli/index.ts"))};
  process.exitCode = await runCli(process.argv.slice(1));
`;

function run(cwd: string, ...args: string[]) {
  const result = Bun.spawnSync([process.execPath, "--eval", cli, "--", ...args, "--json"], {
    cwd,
    env: { ...process.env, [HOME_VARIABLE]: cwd, DESIGNFY_REGISTRY_FILE: "" },
    stdin: "ignore",
    stdout: "pipe",
    stderr: "pipe",
  });
  return { code: result.exitCode, output: JSON.parse(result.stdout.toString()) };
}

const cases = [
  {
    framework: "astro",
    dependencies: { astro: "*", tailwindcss: "^4" },
    componentFiles: ["background/Background.astro", "background/presets.ts", "hero-split/HeroSplit.astro", "lib/designfy-motion.ts"],
    missing: [],
  },
  {
    framework: "react-vite",
    dependencies: { react: "^19", vite: "*", tailwindcss: "^4" },
    componentFiles: ["background/background.tsx", "background/presets.ts", "hero-split/hero-split.tsx", "lib/cn.ts", "lib/designfy-motion.ts"],
    missing: ["clsx", "motion", "tailwind-merge"],
  },
] as const;

for (const { framework, dependencies, componentFiles, missing } of cases) {
  test(`adds hero-split and background to a ${framework} project`, () => {
    const cwd = mkdtempSync(join(tmpdir(), "designfy-registry-e2e-"));
    const paths = { components: "src/ui/foundation", styles: "src/css" };
    const alias = "~/ui/foundation";
    try {
      writeFileSync(join(cwd, "package.json"), JSON.stringify({ dependencies }));
      writeFileSync(join(cwd, "designfy.json"), JSON.stringify({ paths, aliases: { components: alias } }));

      const before = run(cwd, "theme", "show");
      expect(before.code).toBe(ExitCode.NOT_FOUND);
      expect(before.output.error.details.hint).toBe("designfy components add designfy-theme");

      const { code, output } = run(cwd, "components", "add", "hero-split", "background");
      expect(code).toBe(ExitCode.SUCCESS);
      expect(output).toMatchObject({ ok: true, command: "designfy components add" });
      const data: AddResult = output.data;
      expect(data.framework).toBe(framework);

      const styleFiles = ["designfy-backgrounds.css", "designfy-motion.css", "designfy-theme.css"];
      const expected = [
        ...componentFiles.map((file) => join(cwd, paths.components, file)),
        ...styleFiles.map((file) => join(cwd, paths.styles, file)),
      ].sort();
      expect(data.written.toSorted()).toEqual(expected);
      expect(data.missingDependencies.toSorted()).toEqual([...missing]);
      expect(data.missingDevDependencies).toEqual([]);
      const theme = run(cwd, "theme", "show", "--group", "colors");
      expect(theme.code).toBe(ExitCode.SUCCESS);
      expect(theme.output.data.file).toBe(join(cwd, paths.styles, "designfy-theme.css"));

      if (framework === "astro") {
        const reveal = run(cwd, "components", "add", "reveal");
        const file = join(cwd, paths.components, "reveal/Reveal.astro");
        expect(reveal.code).toBe(ExitCode.SUCCESS);
        expect(reveal.output.data.written).toEqual([file]);
        expect(readFileSync(file, "utf8")).toContain(`from "${alias}/lib/designfy-motion"`);
        expected.push(file);
      } else {
        const file = join(cwd, paths.components, "hero-split/hero-split.tsx");
        expect(readFileSync(file, "utf8")).toContain(`from "${alias}/lib/cn"`);
      }

      const written = readdirSync(join(cwd, "src"), { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => join(entry.parentPath, entry.name));
      expect(written.toSorted()).toEqual(expected.toSorted());
      for (const file of written) {
        expect(readFileSync(file, "utf8")).not.toContain("@designfy/components");
      }
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test(`resolves the full dependency chain of every ${framework} item`, () => {
    const { items } = loadRegistry(framework);
    expect(items.length).toBeGreaterThan(0);
    for (const { name } of items) {
      expect(resolveItems([name], framework).at(-1)?.name).toBe(name);
    }
  });
}
