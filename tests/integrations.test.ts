/** Checks integration discovery, repository boundaries and advisory diagnostics. */
import { afterEach, expect, test } from "bun:test";
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { collectDoctorChecks } from "../src/cli/commands/doctor.ts";
import { getProjectStatus, integrationsText } from "../src/cli/commands/status.ts";
import { detectIntegrations } from "../src/design/integrations.ts";

const fixtures = join(import.meta.dir, "fixtures/integrations");
let project: string;
function fixture(name: string) {
  project = mkdtempSync(join(fixtures, "test-"));
  cpSync(join(fixtures, name), project, { recursive: true });
}
afterEach(() => rmSync(project, { recursive: true, force: true }));

test("reports Astrofy sources and warns when the guide points away from generated tokens", () => {
  fixture("astrofy");
  const status = getProjectStatus(project);
  expect(status.integrations.astrofy).toMatchObject({
    present: true, sitespecDir: ".sitespec", astrofyDir: ".astrofy",
    designSystemJson: ".astrofy/design/design-system.json", generatedTokensCss: "designsystem.css",
  });
  expect(integrationsText(status.integrations)).toContain("Integrations");
  const doctor = () => collectDoctorChecks(undefined, project);
  expect(doctor().checks).toContainEqual(expect.objectContaining({ name: "astrofy-guide", status: "warn" }));
  writeFileSync(join(project, "VIEWSPEC.md"), "---\ntokensFile: src/global.css\n---\n");
  expect(doctor().checks).toContainEqual(expect.objectContaining({ name: "astrofy-tokens", status: "warn" }));
  mkdirSync(join(project, ".astrofy/config"));
  writeFileSync(join(project, ".astrofy/config/paths.json"), '{"designSystemCss":"src/global.css"}');
  expect(doctor().checks.map(c => c.name)).not.toContain("astrofy-tokens");
  expect(doctor().integrations?.astrofy.generatedTokensCss).toBeNull();
});

test("detects shared Specsfy specs within Git and requires a citation in the guide body", () => {
  fixture("specsfy");
  mkdirSync(join(project, ".git"));
  const app = join(project, "apps/web");
  mkdirSync(app, { recursive: true });
  expect(detectIntegrations(app).specsfy).toMatchObject({
    present: true, specsDir: "../../specs", designSystemMd: "../../DESIGNSYSTEM.MD", interfaceMd: "../../INTERFACE.md",
  });
  const warnings = () => collectDoctorChecks(undefined, app).checks.filter(c => c.name === "specsfy-guide");
  const header = "---\ndescription: DESIGNSYSTEM.MD\n---\n";
  writeFileSync(join(app, "VIEWSPEC.md"), header);
  expect(warnings()[0]?.status).toBe("warn");
  writeFileSync(join(app, "VIEWSPEC.md"), header + "See DESIGNSYSTEM.MD.\n");
  expect(warnings()).toEqual([]);
  mkdirSync(join(app, ".git"));
  expect(detectIntegrations(app).specsfy.present).toBe(false);
  rmSync(join(app, ".git"), { recursive: true });
  mkdirSync(join(app, "specs"));
  expect(detectIntegrations(app).specsfy.present).toBe(false);
});
