/** Registers MCP tools for listing capture runs and writing new screenshots. */
import { z } from "zod";
import { AppError } from "../../app/errors.ts";
import { captureManifestSchema, listCaptures, planCapture, runCapture } from "../../design/capture.ts";
import type { Registrar } from "../server.ts";

const outDir = z.string().min(1).optional().describe("Capture root directory. Defaults to the capture.outDir setting.");

function content(data: Record<string, unknown>) {
  return [{ type: "text" as const, text: JSON.stringify(data, null, 2) }];
}

async function query(read: () => Record<string, unknown> | Promise<Record<string, unknown>>) {
  try {
    const data = await read();
    return { content: content(data), structuredContent: data };
  } catch (cause) {
    if (cause instanceof AppError) return { content: content({ error: cause.toJSON() }), isError: true };
    throw cause;
  }
}

/** Registers capture history in every MCP mode. */
export function registerCaptureReadTools({ server, catalog }: Registrar): void {
  const description = "Use to find previous browser captures. Returns manifests from newest to oldest.";
  catalog.tools.push({ name: "capture_list", description });
  server.registerTool("capture_list", {
    title: "List browser captures",
    description,
    annotations: { readOnlyHint: true, openWorldHint: false },
    inputSchema: { outDir },
    outputSchema: { captures: z.array(captureManifestSchema) },
  }, (input) => query(() => ({ captures: listCaptures(process.cwd(), input.outDir) })));
}

/** Registers browser capture for write-enabled MCP mode. */
export function registerCaptureWriteTools({ server, catalog }: Registrar): void {
  const description = "Use to capture pages across viewport sizes. Visits the URLs, writes screenshots and a manifest, and returns screenshot paths, page metrics, and browser errors.";
  catalog.tools.push({ name: "capture_run", description });
  server.registerTool("capture_run", {
    title: "Capture browser screenshots",
    description,
    annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: true },
    inputSchema: {
      urls: z.array(z.string().min(1)).nonempty().describe("HTTP or HTTPS URLs to capture."),
      viewports: z.union([z.string().min(1), z.array(z.string().min(1)).nonempty()]).optional()
        .describe("Named or WIDTHxHEIGHT viewports. Accepts an array or comma-separated text and defaults to capture.viewports."),
      theme: z.enum(["light", "dark"]).optional().describe("Browser color scheme. Defaults to light."),
      fullPage: z.boolean().optional().describe("Capture the full page when true, or the visible viewport when false. Defaults to true."),
      reducedMotion: z.boolean().optional().describe("Ask the page for reduced motion. Defaults to false."),
      waitMs: z.number().int().nonnegative().optional().describe("Extra time to wait after load in milliseconds."),
      selector: z.string().min(1).optional().describe("Capture only the element matching this CSS selector."),
      outDir,
      name: z.string().min(1).optional().describe("Run directory name. Defaults to a UTC timestamp."),
    },
    outputSchema: captureManifestSchema,
  }, ({ urls, ...options }) => query(() => runCapture(planCapture(process.cwd(), urls, options))));
}
