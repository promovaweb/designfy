/** Runs external commands without a shell and lets tests inject a runner. */

export interface RunOptions {
  cwd?: string;
  env?: Record<string, string>;
  inherit?: boolean;
}

export interface RunResult {
  code: number;
  stdout: string;
  stderr: string;
}

export type Runner = (command: string, args: string[], options: RunOptions) => Promise<RunResult>;

async function readOutput(stream: ReadableStream<Uint8Array>, inherit: boolean): Promise<string> {
  if (!inherit) return new Response(stream).text();
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let output = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) return output + decoder.decode();
      process.stderr.write(value);
      output += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}

const processRunner: Runner = async (command, args, options) => {
  const child = Bun.spawn([command, ...args], {
    cwd: options.cwd,
    env: { ...process.env, ...options.env },
    stdin: "ignore",
    stdout: "pipe",
    stderr: "pipe",
  });
  const [code, stdout, stderr] = await Promise.all([
    child.exited,
    readOutput(child.stdout, options.inherit ?? false),
    readOutput(child.stderr, options.inherit ?? false),
  ]);
  return { code, stdout, stderr };
};

let currentRunner = processRunner;

/** Runs a command with the active runner. */
export function run(command: string, args: string[], options: RunOptions = {}): Promise<RunResult> {
  return currentRunner(command, args, options);
}

/** Replaces process execution with an injected runner. */
export function setRunner(runner: Runner): void {
  currentRunner = runner;
}

/** Restores real process execution. */
export function resetRunner(): void {
  currentRunner = processRunner;
}
