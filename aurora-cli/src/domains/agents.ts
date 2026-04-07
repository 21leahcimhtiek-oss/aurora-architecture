import { Command } from 'commander';
import { runCommand } from '../util/run.js';

export function registerAgents(program: Command): void {
  const agents = program
    .command('agents')
    .description('Manage and inspect domain agents');

  agents
    .command('list')
    .description('List available domain agents')
    .action(() => {
      const agentList = [
        'repo-architect     — repos, monorepo migration, categorization',
        'backup-agent       — GitHub → cloud storage → local vaults',
        'stripe-productizer — products, prices, subscriptions, licensing',
        'sales-analytics    — revenue, cohorts, product performance',
        'dns-orchestrator   — Network Solutions DNS, subdomains, records',
        'deploy-agent       — Vercel, Cloud Run, bare metal deployments',
        'marketing-agent    — offers, funnels, emails, landing pages',
        'storyforge-agent   — memoir, legacy, narrative coherence',
        'recovery-agent     — disk recovery, profile repair, rescue',
        'diagnostics-agent  — system health, repo health, automation health',
      ];
      console.log('aurora agents:');
      for (const a of agentList) {
        console.log(`  ${a}`);
      }
    });

  agents
    .command('status')
    .description('Check status of running agents')
    .action(async () => {
      const result = await runCommand('gh', ['run', 'list', '--limit', '10']);
      if (result.exitCode !== 0) {
        console.error('aurora agents: failed to fetch agent status');
        console.error(result.stderr);
        process.exit(1);
      }
      console.log(result.stdout);
    });
}
