#!/usr/bin/env node
import { Command } from 'commander';
import { registerRepos } from './domains/repos.js';
import { registerSwarm } from './domains/swarm.js';
import { registerAutopilot } from './domains/autopilot.js';
import { registerAgents } from './domains/agents.js';
import { registerSecrets } from './domains/secrets.js';
import { registerProducts } from './domains/products.js';
import { registerMarket } from './domains/market.js';
import { registerOps } from './domains/ops.js';
import { registerCopilot } from './domains/copilot.js';
import { registerNetwork } from './domains/network.js';
import { registerWordPress } from './domains/wordpress.js';

const program = new Command();

program
  .name('aurora')
  .description('Aurora — unified CLI brainstem for autonomous multi-agent operations')
  .version('1.0.0')
  .addHelpText(
    'after',
    `
Domains:
  repos       Manage and inspect your repo ecosystem
  swarm       Coordinate multi-repo swarm operations
  autopilot   Automated orchestration and deployment pipelines
  agents      Manage and inspect domain agents
  secrets     Manage repository and environment secrets
  products    Manage Stripe products, prices, and subscriptions
  market      Marketing automation — offers, funnels, emails, social
  ops         Operational commands — diagnostics, recovery, deployments
  copilot     GitHub Copilot CLI integration
  network     Network Solutions account and DNS management
  wordpress   WordPress site management and automation

Examples:
  aurora repos list
  aurora repos sync
  aurora swarm run "npm test" --tag backend
  aurora autopilot deploy my-app --env production
  aurora copilot run "list my repos" --type gh
  aurora network doctor
  aurora wordpress doctor
  aurora ops doctor
`
  );

registerRepos(program);
registerSwarm(program);
registerAutopilot(program);
registerAgents(program);
registerSecrets(program);
registerProducts(program);
registerMarket(program);
registerOps(program);
registerCopilot(program);
registerNetwork(program);
registerWordPress(program);

program.parse(process.argv);
