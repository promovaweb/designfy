#!/usr/bin/env bun
/**
 * Binary entry point.
 *
 * Dispatch rule:
 *
 * 1. no arguments and an interactive terminal → open the TUI;
 * 2. no arguments and no TTY → print help and exit with code 2, so pipes
 *    and agents do not hang waiting for an interface;
 * 3. with arguments → CLI (including `mcp`, which becomes a stdio server).
 *
 * Normal completion lets stdout and stderr drain before Bun exits with
 * the selected code from `app/exit-codes.ts`.
 */
import { runCli } from "./cli/index.ts";
import { ExitCode } from "./app/exit-codes.ts";

const argv = process.argv.slice(2);

process.on("SIGINT", () => {
  process.exit(ExitCode.INTERRUPTED);
});

const noArguments = argv.length === 0;
const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY);

const code = noArguments && interactive ? await runCli(["tui"]) : await runCli(noArguments ? ["--help"] : argv);

process.exitCode = noArguments && !interactive ? ExitCode.USAGE : code;
