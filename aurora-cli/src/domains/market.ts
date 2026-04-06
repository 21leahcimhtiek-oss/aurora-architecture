import { Command } from 'commander';
import { runCommand } from '../util/run.js';

export function registerMarket(program: Command): void {
  const market = program
    .command('market')
    .description('Marketing automation — offers, funnels, emails, social');

  market
    .command('list')
    .description('List active marketing campaigns')
    .action(() => {
      console.log('aurora market: listing campaigns (configure your marketing integration)');
      console.log('  Set MARKETING_PROVIDER and MARKETING_API_KEY env vars to enable.');
    });

  market
    .command('publish <campaign>')
    .description('Publish or trigger a marketing campaign')
    .action(async (campaign: string) => {
      const provider = process.env.MARKETING_PROVIDER;
      const apiKey = process.env.MARKETING_API_KEY;
      if (!provider || !apiKey) {
        console.error('aurora market: MARKETING_PROVIDER and MARKETING_API_KEY are required');
        process.exit(1);
      }
      console.log(`aurora market: publishing campaign "${campaign}" via ${provider}...`);
      const result = await runCommand('node', [
        'scripts/marketing.js',
        'publish',
        campaign,
      ]);
      if (result.exitCode !== 0) {
        console.error(`  ! failed: ${result.stderr}`);
        process.exit(1);
      }
      console.log(`  ✓ campaign "${campaign}" published`);
    });
}
