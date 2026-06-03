# Aurora Rayes Architecture

Internal architecture and operating model for the Aurora Rayes software ecosystem. This repository documents orchestration, domain agents, governance, recovery, and marketplace operations without shipping live secrets or payment links.

## Purpose

Aurora Rayes Architecture is an internal reference for coordinating product repositories, automation agents, deployment workflows, marketing support, and diagnostics across the Aurora Rayes ecosystem.

## Layers

```
User / Webhooks → Aurora Rayes Orchestrator → Domain Agents → Repos / APIs / Storage
```

| Layer | Purpose |
|---|---|
| **Interface** | Humans, webhooks, and scheduled jobs interact with the ecosystem |
| **Orchestration** | Routing, planning, dependency management, and audit trails |
| **Domain Agents** | Specialized workers for repos, backups, deployments, marketing, and diagnostics |
| **Infra & Observability** | Logging, state, recovery, policy, and safety controls |

## Domain Agents

| Agent | Scope |
|---|---|
| [Repo-Architect](docs/agents/repo-architect.md) | Repository standards, categorization, migrations, and actions |
| [Backup-Agent](docs/agents/backup-agent.md) | GitHub backup strategy, cloud storage, and local vaults |
| [Stripe-Productizer](docs/agents/stripe-productizer.md) | Payment-provider planning and placeholder product metadata |
| [Sales-Analytics-Agent](docs/agents/sales-analytics-agent.md) | Revenue, cohorts, and product-performance analysis |
| [DNS-Orchestrator](docs/agents/dns-orchestrator.md) | DNS, subdomains, and record governance |
| [Deploy-Agent](docs/agents/deploy-agent.md) | Deployment workflows and release readiness |
| [Marketing-Agent](docs/agents/marketing-agent.md) | Offers, funnels, emails, landing pages, and social copy |
| [StoryForge-Agent](docs/agents/storyforge-agent.md) | Narrative coherence and long-form content support |
| [Recovery-Agent](docs/agents/recovery-agent.md) | Disk recovery, profile repair, and incident response |
| [Diagnostics-Agent](docs/agents/diagnostics-agent.md) | System, repository, automation, and health checks |

## Documentation

- [Full Architecture Spec](docs/architecture.md)
- [Communication & State](docs/communication.md)
- [Mapping to Current Reality](docs/mapping.md)
- [Internal enablement brief](SELL.md)
- [Marketing positioning notes](marketing/pitch.md)

## Safety Notes

- Keep live secrets, private keys, and production payment links out of the repository.
- Use `.env.example` placeholders only.
- Treat monetization artifacts as planning metadata until an approved payment provider is configured outside source control.

## License

Private. All rights reserved.

## Aurora Ecosystem Positioning
This repository is part of the Aurora ecosystem of focused AI products, aligned to shared reliability and product-quality standards.

## No-Key-First Experience
Aurora products prioritize a no-key-first onboarding path so users can start with core functionality before adding external API keys or credentials.

