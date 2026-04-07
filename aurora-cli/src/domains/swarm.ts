import { Command } from 'commander';
import { loadConfig } from '../config.js';
import { runCommand } from '../util/run.js';

export function registerSwarm(program: Command): void {
  const swarm = program
    .command('swarm')
    .description('Coordinate multi-repo swarm operations');

  swarm
    .command('run <script>')
    .description('Run a script across all repos in the manifest')
    .option('--manifest <path>', 'Path to aurora.ecosystem.json')
    .option('--tag <tag>', 'Filter repos by tag')
    .action(async (script: string, opts: { manifest?: string; tag?: string }) => {
      const config = loadConfig({ manifest: opts.manifest });
      let repos = config.repos;
      if (opts.tag) {
        repos = repos.filter((r) => r.tags?.includes(opts.tag!));
      }
      if (repos.length === 0) {
        console.log('aurora swarm: no repos matched');
        return;
      }
      for (const repo of repos) {
        console.log(`aurora swarm: running "${script}" in ${repo.name}...`);
        const parts = script.split(' ');
        const result = await runCommand(parts[0], parts.slice(1), { cwd: repo.path });
        if (result.exitCode !== 0) {
          console.error(`  ! ${repo.name}: ${result.stderr}`);
        } else {
          if (result.stdout) console.log(result.stdout);
          console.log(`  ✓ ${repo.name}`);
        }
      }
    });

  swarm
    .command('build')
    .description('Run build across all repos')
    .option('--manifest <path>', 'Path to aurora.ecosystem.json')
    .option('--tag <tag>', 'Filter repos by tag')
    .action(async (opts: { manifest?: string; tag?: string }) => {
      const config = loadConfig({ manifest: opts.manifest });
      let repos = config.repos;
      if (opts.tag) {
        repos = repos.filter((r) => r.tags?.includes(opts.tag!));
      }
      for (const repo of repos) {
        console.log(`aurora swarm: building ${repo.name}...`);
        const result = await runCommand('npm', ['run', 'build'], { cwd: repo.path });
        if (result.exitCode !== 0) {
          console.error(`  ! ${repo.name} build failed: ${result.stderr}`);
        } else {
          console.log(`  ✓ ${repo.name}`);
        }
      }
    });
}
