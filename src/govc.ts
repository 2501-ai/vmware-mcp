import { execFile } from 'node:child_process';

const DEFAULT_TIMEOUT_MS = 60_000;

export interface GovcResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Execute a govc command with the given arguments.
 * Uses execFile (not exec) to avoid shell injection.
 * Passes through GOVC_* environment variables to the child process.
 */
export async function execGovc(args: string[], timeoutMs = DEFAULT_TIMEOUT_MS): Promise<GovcResult> {
  return await new Promise((resolve, reject) => {
    const govcEnv: Record<string, string> = {};
    for (const [key, value] of Object.entries(process.env)) {
      if (key.startsWith('GOVC_') && value !== undefined) {
        govcEnv[key] = value;
      }
    }

    // Include PATH so the govc binary can be found
    if (process.env.PATH) {
      govcEnv.PATH = process.env.PATH;
    }
    if (process.env.HOME) {
      govcEnv.HOME = process.env.HOME;
    }

    execFile(
      'govc',
      args,
      { env: govcEnv, timeout: timeoutMs, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error && 'killed' in error && error.killed) {
          reject(new Error(`govc command timed out after ${String(timeoutMs)}ms`));
          return;
        }

        const exitCode = error && 'code' in error && typeof error.code === 'number' ? error.code : error ? 1 : 0;

        resolve({
          stdout: stdout ?? '',
          stderr: stderr ?? '',
          exitCode,
        });
      },
    );
  });
}
