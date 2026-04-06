import { Command } from 'commander';
import { runCommand } from '../util/run.js';

export function registerProducts(program: Command): void {
  const products = program
    .command('products')
    .description('Manage Stripe products, prices, and subscriptions');

  products
    .command('list')
    .description('List Stripe products')
    .action(async () => {
      const apiKey = process.env.STRIPE_SECRET_KEY;
      if (!apiKey) {
        console.error('aurora products: STRIPE_SECRET_KEY env var is required');
        process.exit(1);
      }
      const result = await runCommand('stripe', ['products', 'list']);
      if (result.exitCode !== 0) {
        console.error('aurora products: failed to list products');
        console.error(result.stderr);
        process.exit(1);
      }
      console.log(result.stdout);
    });

  products
    .command('create <name>')
    .description('Create a new Stripe product')
    .option('--description <desc>', 'Product description')
    .action(async (name: string, opts: { description?: string }) => {
      const apiKey = process.env.STRIPE_SECRET_KEY;
      if (!apiKey) {
        console.error('aurora products: STRIPE_SECRET_KEY env var is required');
        process.exit(1);
      }
      const args = ['products', 'create', '--name', name];
      if (opts.description) args.push('--description', opts.description);
      const result = await runCommand('stripe', args);
      if (result.exitCode !== 0) {
        console.error(`aurora products: failed to create ${name}`);
        console.error(result.stderr);
        process.exit(1);
      }
      console.log(result.stdout);
    });
}
