import { Command } from 'commander';
import { loadConfig, checkRequiredEnvVars } from '../config.js';
import { runCommand } from '../util/run.js';

export function registerNetwork(program: Command): void {
  const network = program
    .command('network')
    .description('Network Solutions account and DNS management');

  network
    .command('doctor')
    .description('Check Network Solutions integration readiness')
    .option('--manifest <path>', 'Path to aurora.ecosystem.json')
    .action((opts: { manifest?: string }) => {
      const config = loadConfig({ manifest: opts.manifest });
      const integration = config.integrations?.networkSolutions;

      console.log('aurora network: doctor');

      if (!integration) {
        console.log('  ! no networkSolutions integration configured in manifest');
        console.log('    Add integrations.networkSolutions to aurora.ecosystem.json');
        return;
      }

      const required = integration.requiredEnvVars ?? [];
      const missing = checkRequiredEnvVars(required);

      const accountVar = integration.accountEnvVar;
      const accountVal = process.env[accountVar];
      console.log(`  ${accountVar}: ${accountVal ? '✓' : '✗ (not set)'}`);

      if (integration.siteEnvVar) {
        const siteVal = process.env[integration.siteEnvVar];
        console.log(`  ${integration.siteEnvVar}: ${siteVal ? '✓' : '✗ (not set)'}`);
      }

      if (missing.length > 0) {
        console.error(`  ! missing required env vars: ${missing.join(', ')}`);
        process.exit(1);
      }

      console.log('aurora network: doctor complete');
    });

  network
    .command('run <action> [target]')
    .description('Run a Network Solutions operation (dns, domain, account)')
    .option('--manifest <path>', 'Path to aurora.ecosystem.json')
    .action(async (action: string, target: string | undefined, opts: { manifest?: string }) => {
      const config = loadConfig({ manifest: opts.manifest });
      const integration = config.integrations?.networkSolutions;

      if (!integration) {
        console.error('aurora network: no networkSolutions integration in manifest');
        process.exit(1);
      }

      const required = integration.requiredEnvVars ?? [];
      const missing = checkRequiredEnvVars(required);
      if (missing.length > 0) {
        console.error(`aurora network: missing required env vars: ${missing.join(', ')}`);
        process.exit(1);
      }

      const commandParts = integration.command.split(' ');
      const args = [...commandParts.slice(1), action];
      if (target) args.push(target);

      console.log(`aurora network: running ${action}${target ? ` on ${target}` : ''}...`);
      const result = await runCommand(commandParts[0], args);
      if (result.exitCode !== 0) {
        console.error(`  ! network operation failed: ${result.stderr}`);
        process.exit(1);
      }
      if (result.stdout) console.log(result.stdout);
      console.log(`  ✓ ${action} complete`);
    });

  network
    .command('account')
    .description('Show Network Solutions account information')
    .option('--manifest <path>', 'Path to aurora.ecosystem.json')
    .action(async (opts: { manifest?: string }) => {
      const config = loadConfig({ manifest: opts.manifest });
      const integration = config.integrations?.networkSolutions;

      if (!integration) {
        console.error('aurora network: no networkSolutions integration in manifest');
        process.exit(1);
      }

      const account = process.env[integration.accountEnvVar];
      if (!account) {
        console.error(`aurora network: ${integration.accountEnvVar} env var not set`);
        process.exit(1);
      }

      console.log(`aurora network: account`);
      console.log(`  account: ${account}`);
    });
}
