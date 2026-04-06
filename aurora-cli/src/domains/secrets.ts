import { Command } from 'commander';
import { runCommand } from '../util/run.js';

export function registerSecrets(program: Command): void {
  const secrets = program
    .command('secrets')
    .description('Manage repository and environment secrets');

  secrets
    .command('list <repo>')
    .description('List secrets for a repository')
    .action(async (repo: string) => {
      const result = await runCommand('gh', ['secret', 'list', '--repo', repo]);
      if (result.exitCode !== 0) {
        console.error(`aurora secrets: failed to list secrets for ${repo}`);
        console.error(result.stderr);
        process.exit(1);
      }
      console.log(result.stdout || `aurora secrets: no secrets found for ${repo}`);
    });

  secrets
    .command('set <repo> <name>')
    .description('Set a secret for a repository (reads value from stdin or --value)')
    .option('--value <value>', 'Secret value (use env var or stdin for production)')
    .action(async (repo: string, name: string, opts: { value?: string }) => {
      const args = ['secret', 'set', name, '--repo', repo];
      if (opts.value) args.push('--body', opts.value);
      const result = await runCommand('gh', args);
      if (result.exitCode !== 0) {
        console.error(`aurora secrets: failed to set ${name}`);
        console.error(result.stderr);
        process.exit(1);
      }
      console.log(`  ✓ secret ${name} set on ${repo}`);
    });
}
