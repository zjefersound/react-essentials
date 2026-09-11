import { existsSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

/**
 * Whether the actual package install should be skipped. Enabled during automated
 * tests (which invoke the CLI with NODE_ENV=test) and via an explicit opt-out so
 * the file-scaffolding behaviour can be exercised without hitting the network.
 */
export function shouldSkipInstall(): boolean {
  return (
    process.env.NODE_ENV === 'test' ||
    process.env.REACT_ESSENTIALS_SKIP_INSTALL === '1'
  );
}

/**
 * Runs an install command (from getInstallCommand) in `cwd`, inheriting stdio.
 * Resolves immediately without spawning anything when shouldSkipInstall() is true.
 */
export function runInstall(command: string[], cwd: string): Promise<void> {
  if (shouldSkipInstall()) {
    console.log(`(skipped: ${command.join(' ')})`);
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const proc = spawn(command[0], command.slice(1), {
      cwd,
      stdio: 'inherit',
      shell: true,
    });

    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Installation failed with code ${code}`));
    });
  });
}

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, 'bun.lockb'))) return 'bun';
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

export function getInstallCommand(pm: PackageManager, packages: string[]): string[] {
  switch (pm) {
    case 'bun':
      return ['bun', 'add', ...packages];
    case 'pnpm':
      return ['pnpm', 'add', ...packages];
    case 'yarn':
      return ['yarn', 'add', ...packages];
    case 'npm':
    default:
      return ['npm', 'install', ...packages];
  }
}
