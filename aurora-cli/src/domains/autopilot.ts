import { Command } from 'commander';
import { loadConfig } from '../config.js';
import { runCommand } from '../util/run.js';

export function registerAutopilot(program: Command): void {
  const autopilot = program
    .command('autopilot')
    .description('Automated orchestration and deployment pipelines');

  autopilot
    .command('deploy <target>')
    .description('Deploy a target repo or service')
    .option('--manifest <path>', 'Path to aurora.ecosystem.json')
    .option('--env <environment>', 'Target environment (staging, production)', 'staging')
    .action(async (target: string, opts: { manifest?: string; env: string }) => {
      const config = loadConfig({ manifest: opts.manifest });
      const repo = config.repos.find((r) => r.name === target);
      if (!repo) {
        console.error(`aurora autopilot: repo "${target}" not found in manifest`);
        process.exit(1);
      }
      console.log(`aurora autopilot: deploying ${target} to ${opts.env}...`);
      const result = await runCommand('npm', ['run', 'deploy'], {
        cwd: repo.path,
        env: { DEPLOY_ENV: opts.env },
      });
      if (result.exitCode !== 0) {
        console.error(`  ! deploy failed: ${result.stderr}`);
        process.exit(1);
      }
      console.log(`  ✓ ${target} deployed to ${opts.env}`);
    });

  autopilot
    .command('health')
    .description('Run health checks across all registered repos')
    .option('--manifest <path>', 'Path to aurora.ecosystem.json')
    .action(async (opts: { manifest?: string }) => {
      const config = loadConfig({ manifest: opts.manifest });
      let allHealthy = true;
      for (const repo of config.repos) {
        const result = await runCommand('git', ['status', '--porcelain'], { cwd: repo.path });
        const healthy = result.exitCode === 0;
        const icon = healthy ? '✓' : '!';
        console.log(`  ${icon} ${repo.name}`);
        if (!healthy) allHealthy = false;
      }
      if (!allHealthy) process.exit(1);
    });

  autopilot
    .command('plan')
    .description('Show the autopilot execution plan without running it')
    .option('--manifest <path>', 'Path to aurora.ecosystem.json')
    .action((opts: { manifest?: string }) => {
      const config = loadConfig({ manifest: opts.manifest });
      console.log('aurora autopilot: execution plan');
      console.log(`  manifest: ${config._manifestPath || '(none)'}`);
      console.log(`  repos: ${config.repos.length}`);
      for (const repo of config.repos) {
        console.log(`    - ${repo.name} → ${repo.path}`);
      }
    });
}
