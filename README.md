# Aurora Architecture

Autonomous multi-agent orchestration system for Keith's software marketplace. Aurora manages 300+ repos, Stripe monetization, DNS, deployments, marketing, recovery, and diagnostics through a coordinated network of specialized domain agents.

## Layers

```
User / Webhooks → Aurora-Orchestrator → Domain Agents → Repos / APIs / Storage
```

| Layer | Purpose |
|---|---|
| **Interface** | Humans, webhooks, scheduled jobs touch Aurora |
| **Orchestration** | Routing, planning, dependency management |
| **Domain Agents** | Focused, specialized workers |
| **Infra & Observability** | Logging, state, recovery, policy |

## Domain Agents

| Agent | Scope |
|---|---|
| [Repo-Architect](docs/agents/repo-architect.md) | 300+ repos, monorepo migration, categorization, actions |
| [Backup-Agent](docs/agents/backup-agent.md) | GitHub → cloud storage → local vaults |
| [Stripe-Productizer](docs/agents/stripe-productizer.md) | Products, prices, subscriptions, licensing |
| [Sales-Analytics-Agent](docs/agents/sales-analytics-agent.md) | Revenue, cohorts, product performance |
| [DNS-Orchestrator](docs/agents/dns-orchestrator.md) | Network Solutions DNS, subdomains, records |
| [Deploy-Agent](docs/agents/deploy-agent.md) | Vercel, Cloud Run, bare metal deployments |
| [Marketing-Agent](docs/agents/marketing-agent.md) | Offers, funnels, emails, landing pages, social |
| [StoryForge-Agent](docs/agents/storyforge-agent.md) | Memoir, legacy, narrative coherence |
| [Recovery-Agent](docs/agents/recovery-agent.md) | Disk recovery, profile repair, NTFS, Linux rescue |
| [Diagnostics-Agent](docs/agents/diagnostics-agent.md) | System health, repo health, automation health |

## Docs

- [Full Architecture Spec](docs/architecture.md)
- [Communication & State](docs/communication.md)
- [Mapping to Current Reality](docs/mapping.md)

## License

Private. All rights reserved.