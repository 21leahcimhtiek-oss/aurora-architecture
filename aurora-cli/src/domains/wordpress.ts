import { Command } from 'commander';
import { loadConfig, checkRequiredEnvVars } from '../config.js';
import { runCommand } from '../util/run.js';

export function registerWordPress(program: Command): void {
  const wordpress = program
    .command('wordpress')
    .description('WordPress site management and automation');

  wordpress
    .command('doctor')
    .description('Check WordPress integration readiness')
    .option('--manifest <path>', 'Path to aurora.ecosystem.json')
    .action((opts: { manifest?: string }) => {
      const config = loadConfig({ manifest: opts.manifest });
      const integration = config.integrations?.wordpress;

      console.log('aurora wordpress: doctor');

      if (!integration) {
        console.log('  ! no wordpress integration configured in manifest');
        console.log('    Add integrations.wordpress to aurora.ecosystem.json');
        return;
      }

      const required = integration.requiredEnvVars ?? [];
      const missing = checkRequiredEnvVars(required);

      const siteVar = integration.siteEnvVar;
      const siteVal = process.env[siteVar];
      console.log(`  ${siteVar}: ${siteVal ? '✓' : '✗ (not set)'}`);

      if (integration.accountEnvVar) {
        const accountVal = process.env[integration.accountEnvVar];
        console.log(`  ${integration.accountEnvVar}: ${accountVal ? '✓' : '✗ (not set)'}`);
      }

      if (missing.length > 0) {
        console.error(`  ! missing required env vars: ${missing.join(', ')}`);
        process.exit(1);
      }

      console.log('aurora wordpress: doctor complete');
    });

  wordpress
    .command('run <action> [target]')
    .description('Run a WordPress operation (deploy, sync, backup, export)')
    .option('--manifest <path>', 'Path to aurora.ecosystem.json')
    .action(async (action: string, target: string | undefined, opts: { manifest?: string }) => {
      const config = loadConfig({ manifest: opts.manifest });
      const integration = config.integrations?.wordpress;

      if (!integration) {
        console.error('aurora wordpress: no wordpress integration in manifest');
        process.exit(1);
      }

      const required = integration.requiredEnvVars ?? [];
      const missing = checkRequiredEnvVars(required);
      if (missing.length > 0) {
        console.error(`aurora wordpress: missing required env vars: ${missing.join(', ')}`);
        process.exit(1);
      }

      const commandParts = integration.command.split(' ');
      const args = [...commandParts.slice(1), action];
      if (target) args.push(target);

      console.log(`aurora wordpress: running ${action}${target ? ` on ${target}` : ''}...`);
      const result = await runCommand(commandParts[0], args);
      if (result.exitCode !== 0) {
        console.error(`  ! wordpress operation failed: ${result.stderr}`);
        process.exit(1);
      }
      if (result.stdout) console.log(result.stdout);
      console.log(`  ✓ ${action} complete`);
    });

  wordpress
    .command('site')
    .description('Show WordPress site information')
    .option('--manifest <path>', 'Path to aurora.ecosystem.json')
    .action((opts: { manifest?: string }) => {
      const config = loadConfig({ manifest: opts.manifest });
      const integration = config.integrations?.wordpress;

      if (!integration) {
        console.error('aurora wordpress: no wordpress integration in manifest');
        process.exit(1);
      }

      const siteUrl = process.env[integration.siteEnvVar];
      if (!siteUrl) {
        console.error(`aurora wordpress: ${integration.siteEnvVar} env var not set`);
        process.exit(1);
      }

      console.log('aurora wordpress: site');
      console.log(`  url: ${siteUrl}`);
    });
}
