import { Command } from 'commander';
import { loadConfig } from '../config.js';
import { runCommand } from '../util/run.js';

export function registerOps(program: Command): void {
  const ops = program
    .command('ops')
    .description('Operational commands — diagnostics, recovery, deployments');

  ops
    .command('doctor')
    .description('Run system-wide diagnostics')
    .option('--manifest <path>', 'Path to aurora.ecosystem.json')
    .action(async (opts: { manifest?: string }) => {
      const config = loadConfig({ manifest: opts.manifest });
      console.log('aurora ops: running diagnostics...');
      console.log(`  manifest: ${config._manifestPath || '(none)'}`);
      console.log(`  repos: ${config.repos.length}`);

      const nodeResult = await runCommand('node', ['--version']);
      console.log(`  node: ${nodeResult.stdout.trim()}`);

      const ghResult = await runCommand('gh', ['auth', 'status']);
      const ghOk = ghResult.exitCode === 0;
      console.log(`  gh auth: ${ghOk ? '✓' : '✗'}`);
      if (!ghOk) console.log(`    ${ghResult.stderr.trim()}`);

      console.log('aurora ops: diagnostics complete');
    });

  ops
    .command('deploy <target>')
    .description('Deploy a service to a target environment')
    .option('--env <env>', 'Target environment', 'staging')
    .action(async (target: string, opts: { env: string }) => {
      console.log(`aurora ops: deploying ${target} to ${opts.env}...`);
      const result = await runCommand('node', [
        'scripts/deploy.js',
        target,
        opts.env,
      ]);
      if (result.exitCode !== 0) {
        console.error(`  ! deploy failed: ${result.stderr}`);
        process.exit(1);
      }
      console.log(`  ✓ ${target} deployed to ${opts.env}`);
    });

  ops
    .command('recover')
    .description('Run recovery playbook')
    .action(async () => {
      console.log('aurora ops: starting recovery...');
      const result = await runCommand('node', ['scripts/recover.js']);
      if (result.exitCode !== 0) {
        console.error(`  ! recovery failed: ${result.stderr}`);
        process.exit(1);
      }
      console.log('  ✓ recovery complete');
    });
}
