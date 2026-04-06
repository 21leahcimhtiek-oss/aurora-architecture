# aurora-cli

Aurora is a unified CLI brainstem for autonomous multi-agent operations across your entire software ecosystem.

```
aurora <domain> <command> [target] [flags]
```

Inspired by the `gh copilot` CLI pattern: every domain is discoverable, every command has concise help, and operations are manifest-driven.

---

## Install

```sh
cd aurora-cli
npm install
npm run build
npm link          # makes `aurora` available globally
```

## Usage

```sh
aurora --help
aurora <domain> --help
```

---

## Domains

### `repos` — Repo ecosystem management

```sh
aurora repos list                        # list registered repos
aurora repos sync                        # git pull across all repos
aurora repos status                      # git status across all repos
```

### `swarm` — Multi-repo coordination

```sh
aurora swarm run "npm test"              # run a script in all repos
aurora swarm run "npm test" --tag api    # filter by tag
aurora swarm build                       # npm run build everywhere
```

### `autopilot` — Orchestration and deployments

```sh
aurora autopilot plan                    # show execution plan
aurora autopilot deploy my-app           # deploy to staging
aurora autopilot deploy my-app --env production
aurora autopilot health                  # health check all repos
```

### `agents` — Domain agents

```sh
aurora agents list                       # list available agents
aurora agents status                     # show recent agent runs (via gh)
```

### `secrets` — Secrets management

```sh
aurora secrets list my-repo             # list repo secrets
aurora secrets set my-repo MY_KEY       # set a secret
```

### `products` — Stripe monetization

```sh
aurora products list                     # list Stripe products
aurora products create "My Product"      # create a product
```

### `market` — Marketing automation

```sh
aurora market list                       # list campaigns
aurora market publish my-campaign        # publish a campaign
```

### `ops` — Operations and diagnostics

```sh
aurora ops doctor                        # system-wide diagnostics
aurora ops deploy my-service             # deploy a service
aurora ops recover                       # run recovery playbook
```

### `copilot` — GitHub Copilot CLI integration

```sh
aurora copilot doctor                    # check Copilot CLI readiness
aurora copilot run "list my repos"       # suggest a gh command
aurora copilot run "find all node_modules" --type shell
aurora copilot explain "git rebase -i HEAD~3"
aurora copilot repo analyze my-repo     # Copilot-assisted repo ops
```

### `network` — Network Solutions DNS and domains

```sh
aurora network doctor                    # check integration readiness
aurora network account                  # show account info
aurora network run dns                  # run DNS operation
aurora network run domain example.com  # operate on a domain
```

### `wordpress` — WordPress site management

```sh
aurora wordpress doctor                  # check integration readiness
aurora wordpress site                   # show site info
aurora wordpress run deploy             # deploy WordPress
aurora wordpress run backup             # backup site
```

---

## Manifest (`aurora.ecosystem.json`)

Aurora reads a declarative manifest to discover repos and integration settings:

```json
{
  "version": "1.0.0",
  "repos": [
    { "name": "my-app", "path": "../my-app", "tags": ["api"] }
  ],
  "integrations": {
    "networkSolutions": {
      "command": "node scripts/network-solutions.js",
      "accountEnvVar": "NETWORK_SOLUTIONS_ACCOUNT",
      "requiredEnvVars": ["NETWORK_SOLUTIONS_ACCOUNT", "NETWORK_SOLUTIONS_API_KEY"]
    },
    "wordpress": {
      "command": "node scripts/wordpress.js",
      "siteEnvVar": "WORDPRESS_SITE_URL",
      "requiredEnvVars": ["WORDPRESS_SITE_URL", "WORDPRESS_APP_PASSWORD"]
    }
  }
}
```

### Required environment variables

Integration commands validate env vars before executing. Set them in your shell profile or `.env` file:

```sh
# Network Solutions
export NETWORK_SOLUTIONS_ACCOUNT=your-account-id
export NETWORK_SOLUTIONS_API_KEY=your-api-key

# WordPress
export WORDPRESS_SITE_URL=https://yoursite.com
export WORDPRESS_USERNAME=your-username
export WORDPRESS_APP_PASSWORD=your-app-password
```

---

## Architecture

Aurora follows the architecture defined in [`docs/architecture.md`](../docs/architecture.md).

```
aurora <domain> <command>
       │
       ├── repos      → Repo-Architect agent
       ├── swarm      → multi-repo orchestration
       ├── autopilot  → Aurora-Orchestrator
       ├── agents     → Domain Agent registry
       ├── secrets    → Secrets management
       ├── products   → Stripe-Productizer agent
       ├── market     → Marketing-Agent
       ├── ops        → Diagnostics + Deploy + Recovery agents
       ├── copilot    → GitHub Copilot CLI bridge
       ├── network    → DNS-Orchestrator (Network Solutions)
       └── wordpress  → WordPress management
```

---

## License

Private. All rights reserved.
