/** Prepares a version, validates generated assets and creates the release commit and tag. */
import { readFileSync, writeFileSync } from "node:fs";
import { listAssets } from "./sync-skill-assets.ts";

const args = process.argv.slice(2);
const version = args.find((arg) => !arg.startsWith("-"));
const push = args.includes("--push");
const dryRun = args.includes("--dry-run");
if (!version || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version) ||
    args.some((arg) => ![version, "--dry-run", "--push"].includes(arg)) || new Set(args).size !== args.length) {
  throw new Error("Usage: bun run release <X.Y.Z> [--dry-run] [--push]");
}

const tag = "v" + version;
const steps = ["npm:readme", "opencli", "skills:sync", "ebook", "validate"];
const expected = new Set([
  "CHANGELOG.md", "package.json", "npm/package.json", "ebook/VERSION", "docs/opencli.json", "npm/README.md",
  ...listAssets().map(({ target }) => target),
  "ebook/build.json", "ebook/ebook-designfy.pdf", "ebook/ebook-designfy.epub",
  ...["epub", "pdf"].map((ext) => `ebook/Designfy-Guia-do-Usuario-${tag}.${ext}`),
]);

function run(command: string[], capture = false): string {
  const result = Bun.spawnSync(command, { stdout: capture ? "pipe" : "inherit", stderr: "inherit" });
  if (result.exitCode !== 0) throw new Error(`Command failed: ${command.join(" ")}`);
  return result.stdout?.toString() ?? "";
}

function prunableEditions(nextVersion: string): Set<string> {
  const tracked = run(["git", "ls-tree", "-r", "--name-only", "HEAD", "ebook"], true).split("\n");
  const editions = tracked.flatMap((path) => {
    const match = /^ebook\/Designfy-Guia-do-Usuario-v(\d+\.\d+\.\d+)\.(pdf|epub)$/.exec(path);
    return match ? [{ path, version: match[1]! }] : [];
  });
  const versions = new Set([nextVersion, ...editions.map((edition) => edition.version)]);
  const retained = new Set([...versions].sort((a, b) => Bun.semver.order(b, a)).slice(0, 5));
  return new Set(editions.filter((edition) => !retained.has(edition.version)).map((edition) => edition.path));
}

function changes(prunable: Set<string>): string[] {
  const status = run(["git", "status", "--porcelain=v1", "-z", "--no-renames", "--untracked-files=all"], true);
  return status.split("\0").filter(Boolean).map((entry) => {
    const path = entry.slice(3);
    // The ebook builder prunes older versioned editions beyond its retention limit.
    const pruned = [" D", "D "].includes(entry.slice(0, 2)) && prunable.has(path);
    if (!expected.has(path) && !pruned) throw new Error("Unexpected working tree change: " + path);
    return path;
  });
}

console.log(`Prepare ${tag} on main. Check the working tree, tag and today's changelog entry.
Update package.json, npm/package.json and ebook/VERSION.
${steps.map((step) => "bun run " + step).join("\n")}
Commit the validated release files and create annotated tag ${tag}.`);
if (push) console.log(`git push --atomic origin HEAD:main ${tag}`);

if (!dryRun) {
  if (run(["git", "branch", "--show-current"], true).trim() !== "main") throw new Error("Switch to main before releasing.");
  const prunable = prunableEditions(version);
  changes(prunable);
  if (run(["git", "tag", "--list", tag], true).trim()) throw new Error("Release tag already exists: " + tag);
  const previous = JSON.parse(run(["git", "show", "HEAD:package.json"], true)).version;
  if (Bun.semver.order(version, previous) <= 0) throw new Error("Release version must be newer than " + previous);
  const today = new Date().toLocaleDateString("sv-SE");
  const heading = `## [${version}] - ${today}`;
  if (!readFileSync("CHANGELOG.md", "utf8").split(/\r?\n/).includes(heading)) throw new Error("Missing changelog heading: " + heading);
  for (const path of ["package.json", "npm/package.json"]) {
    const pkg = JSON.parse(readFileSync(path, "utf8"));
    pkg.version = version;
    writeFileSync(path, JSON.stringify(pkg, null, 2) + "\n");
  }
  writeFileSync("ebook/VERSION", version + "\n");
  for (const step of steps) run(["bun", "run", step]);
  const files = changes(prunable);
  const stagedDeletions = new Set(run(["git", "diff", "--cached", "--diff-filter=D", "--name-only", "-z"], true).split("\0"));
  const toStage = files.filter((path) => !stagedDeletions.has(path));
  if (toStage.length) run(["git", "add", "--", ...toStage]);
  run(["git", "commit", "--only", "-m", "release: designfy " + tag, "--", ...files]);
  run(["git", "tag", "-a", tag, "-m", tag]);
  if (push) run(["git", "push", "--atomic", "origin", "HEAD:main", tag]);
}

if (!push) console.log(`When ready, run git push --atomic origin HEAD:main ${tag}`);
console.log(`Wait for the Release workflow and confirm the five binaries and SHA256SUMS with gh release view ${tag}.
From npm/, confirm npm whoami prints contatopromovaweb, then run npm publish --access public.`);
