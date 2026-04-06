import { execa } from 'execa';

export interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export async function runCommand(
  command: string,
  args: string[] = [],
  options: { cwd?: string; env?: Record<string, string> } = {}
): Promise<RunResult> {
  try {
    const result = await execa(command, args, {
      cwd: options.cwd,
      env: options.env ? { ...process.env, ...options.env } : process.env,
      reject: false,
    });
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode ?? 0,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { stdout: '', stderr: message, exitCode: 1 };
  }
}
