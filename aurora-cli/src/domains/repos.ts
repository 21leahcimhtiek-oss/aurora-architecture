import { Command } from 'commander';
import { loadConfig } from '../config.js';
import { runCommand } from '../util/run.js';

export function registerRepos(program: Command): void {
  const repos = program
    .command('repos')
    .description('Manage and inspect your repo ecosystem');

  repos
    .command('list')
    .description('List all repos registered in the manifest')
    .option('--manifest <path>', 'Path to aurora.ecosystem.json')
    .action((opts: { manifest?: string }) => {
      const config = loadConfig({ manifest: opts.manifest });
      if (config.repos.length === 0) {
        console.log('aurora repos: no repos registered in manifest');
        return;
      }
      for (const repo of config.repos) {
        const tags = repo.tags && repo.tags.length > 0 ? `  [${repo.tags.join(', ')}]` : '';
        console.log(`  ${repo.name}${tags}`);
        console.log(`    ${repo.path}`);
      }
    });

  repos
    .command('sync')
    .description('Sync all repos (pull latest)')
    .option('--manifest <path>', 'Path to aurora.ecosystem.json')
    .action(async (opts: { manifest?: string }) => {
      const config = loadConfig({ manifest: opts.manifest });
      for (const repo of config.repos) {
        console.log(`aurora repos: syncing ${repo.name}...`);
        const result = await runCommand('git', ['pull'], { cwd: repo.path });
        if (result.exitCode !== 0) {
          console.error(`  ! error syncing ${repo.name}: ${result.stderr}`);
        } else {
          console.log(`  ✓ ${repo.name}`);
        }
      }
    });

  repos
    .command('status')
    .description('Show git status across all repos')
    .option('--manifest <path>', 'Path to aurora.ecosystem.json')
    .action(async (opts: { manifest?: string }) => {
      const config = loadConfig({ manifest: opts.manifest });
      for (const repo of config.repos) {
        console.log(`\naura repos: ${repo.name}`);
        const result = await runCommand('git', ['status', '--short'], { cwd: repo.path });
        if (result.exitCode !== 0) {
          console.error(`  ! ${result.stderr}`);
        } else {
          console.log(result.stdout || '  (clean)');
        }
      }
    });
}
