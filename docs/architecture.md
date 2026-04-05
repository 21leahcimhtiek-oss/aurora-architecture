# Aurora Architecture — Full Specification

## 1. Top-Level Layout

Aurora operates across four distinct layers, each with clear boundaries and responsibilities.

### Layers

```
Interface Layer → Orchestration Layer → Domain Agents → Infra & Observability
```

**Interface Layer** — Where humans and external systems touch Aurora. Natural language commands, Stripe webhooks, DNS change events, GitHub events, and scheduled cron jobs all enter here.

**Orchestration Layer** — The Aurora-Orchestrator receives all inbound intents, classifies them, decomposes them into plans, resolves dependency ordering, and dispatches work to domain agents. It owns the global state machine.

**Domain Agents** — Focused, specialized workers. Each agent owns a single domain (repos, Stripe, DNS, deployments, marketing, etc.) and exposes a clean contract: inputs it accepts, actions it performs, events it emits.

**Infra & Observability** — Logging, state persistence, recovery hooks, policy enforcement. Every agent writes structured logs. The Diagnostics-Agent continuously monitors health across all domains.

### Data Flow

```
User / Webhooks
      │
      ▼
Aurora-Orchestrator
      │
      ├── Repo-Architect ──► GitHub API / Actions
      ├── Backup-Agent ──► Cloud Storage / Local Vaults
      ├── Stripe-Productizer ──► Stripe API
      ├── Sales-Analytics-Agent ──► Metrics Store
      ├── DNS-Orchestrator ──► Network Solutions API
      ├── Deploy-Agent ──► Vercel / Cloud Run / Bare Metal
      ├── Marketing-Agent ──► CMS / Email / Social APIs
      ├── StoryForge-Agent ──► Knowledge Graph / Content Store
      ├── Recovery-Agent ──► Playbook Engine / Script Runner
      └── Diagnostics-Agent ──► Health Dashboard
```

---

## 2. Core Orchestrator

### Agent: Aurora-Orchestrator

**Role:** Single entrypoint for all high-level intents.

### Inputs

- **Natural language** — e.g., "spin up a new Stripe productized offer for repo X"
- **Webhooks** — Stripe events, DNS changes, GitHub events
- **Scheduled jobs** — Nightly sync, backups, health checks

### Responsibilities

1. **Intent classification** — Determine which domain(s) are involved.
2. **Plan decomposition** — Break into ordered steps and assign to agents.
3. **Dependency graph** — Ensure ordering (e.g., DNS before deploy, Stripe product before marketing).
4. **State tracking** — Job IDs, status per step, rollback hooks.
5. **Error escalation** — If an agent fails, retry with backoff, then escalate.

### Outputs

- Dispatches jobs to domain agents via the message bus.
- Publishes status updates to logs, dashboards, and notification channels.
- Maintains a global job ledger with full audit trail.

---

## 3. Domain Agents

### 3.1 Repo & Code Ecosystem

See: [Repo-Architect](agents/repo-architect.md) · [Backup-Agent](agents/backup-agent.md)

### 3.2 Stripe, Offers, and Monetization

See: [Stripe-Productizer](agents/stripe-productizer.md) · [Sales-Analytics-Agent](agents/sales-analytics-agent.md)

### 3.3 DNS, Deployment, and Infra

See: [DNS-Orchestrator](agents/dns-orchestrator.md) · [Deploy-Agent](agents/deploy-agent.md)

### 3.4 Marketing, Content, and Story

See: [Marketing-Agent](agents/marketing-agent.md) · [StoryForge-Agent](agents/storyforge-agent.md)

### 3.5 Recovery, OS, and Hardware Workflows

See: [Recovery-Agent](agents/recovery-agent.md) · [Diagnostics-Agent](agents/diagnostics-agent.md)

---

## 4. Communication & State

See: [Communication & State](communication.md)

---

## 5. Mapping to Current Reality

See: [Mapping](mapping.md)