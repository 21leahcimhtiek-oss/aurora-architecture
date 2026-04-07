import { Command } from 'commander';
import { loadConfig, checkRequiredEnvVars } from '../config.js';
import { runCommand } from '../util/run.js';

export function registerCopilot(program: Command): void {
  const copilot = program
    .command('copilot')
    .description('GitHub Copilot CLI integration — AI-assisted operations');

  copilot
    .command('doctor')
    .description('Check GitHub Copilot CLI availability and auth')
    .option('--manifest <path>', 'Path to aurora.ecosystem.json')
    .action(async (opts: { manifest?: string }) => {
      const config = loadConfig({ manifest: opts.manifest });
      const integration = config.integrations?.copilot;
      const required = integration?.requiredEnvVars ?? [];
      const missing = checkRequiredEnvVars(required);

      console.log('aurora copilot: doctor');
      if (missing.length > 0) {
        console.error(`  ! missing env vars: ${missing.join(', ')}`);
        process.exit(1);
      }

      const ghResult = await runCommand('gh', ['auth', 'status']);
      const ghOk = ghResult.exitCode === 0;
      console.log(`  gh auth:    ${ghOk ? '✓' : '✗'}`);
      if (!ghOk) console.log(`    ${ghResult.stderr.trim()}`);

      const copilotResult = await runCommand('gh', ['copilot', '--version']);
      const copilotOk = copilotResult.exitCode === 0;
      console.log(`  gh copilot: ${copilotOk ? '✓' : '✗ (install: gh extension install github/gh-copilot)'}`);

      console.log('aurora copilot: doctor complete');
    });

  copilot
    .command('run <prompt>')
    .description('Run a natural language prompt via gh copilot suggest')
    .option('--type <type>', 'Suggestion type: shell, gh, git', 'shell')
    .action(async (prompt: string, opts: { type: string }) => {
      const result = await runCommand('gh', ['copilot', 'suggest', '-t', opts.type, prompt]);
      if (result.exitCode !== 0) {
        console.error('aurora copilot: suggestion failed');
        console.error(result.stderr);
        process.exit(1);
      }
      console.log(result.stdout);
    });

  copilot
    .command('explain <command>')
    .description('Explain a shell command via gh copilot explain')
    .action(async (command: string) => {
      const result = await runCommand('gh', ['copilot', 'explain', command]);
      if (result.exitCode !== 0) {
        console.error('aurora copilot: explain failed');
        console.error(result.stderr);
        process.exit(1);
      }
      console.log(result.stdout);
    });

  copilot
    .command('repo <action> [target]')
    .description('Copilot-assisted repo operations (analyze, scaffold)')
    .action(async (action: string, target?: string) => {
      const prompt = target
        ? `${action} repository ${target}`
        : `perform ${action} on this repository`;
      const result = await runCommand('gh', ['copilot', 'suggest', '-t', 'gh', prompt]);
      if (result.exitCode !== 0) {
        console.error('aurora copilot: repo operation failed');
        console.error(result.stderr);
        process.exit(1);
      }
      console.log(result.stdout);
    });
}
