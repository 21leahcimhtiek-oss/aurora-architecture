# Communication & State

## Message Bus / Queue

Aurora uses an event-driven architecture. All inter-agent communication flows through a central message bus.

### Pattern

1. **Aurora-Orchestrator publishes jobs** → domain agents subscribe to their relevant topics.
2. **Domain agents emit events** → orchestrator and peer agents react.
3. All messages are structured, typed, and include correlation IDs for tracing.

### Message Format

```json
{
  "id": "msg-uuid",
  "correlation_id": "job-uuid",
  "type": "job | event",
  "topic": "repo.bundle.create",
  "source": "aurora-orchestrator",
  "target": "repo-architect",
  "payload": {},
  "timestamp": "ISO-8601",
  "retry_count": 0
}
```

### Topic Taxonomy

| Topic | Direction | Description |
|---|---|---|
| `job.repo.index.refresh` | Orchestrator → Repo-Architect | Re-scan all repos |
| `job.repo.bundle.create` | Orchestrator → Repo-Architect | Group repos into bundle |
| `job.backup.nightly` | Orchestrator → Backup-Agent | Scheduled full sync |
| `job.backup.verify` | Orchestrator → Backup-Agent | Integrity check |
| `job.stripe.product.create` | Orchestrator → Stripe-Productizer | Create product from bundle |
| `job.stripe.checkout.generate` | Orchestrator → Stripe-Productizer | Generate checkout URL |
| `job.dns.record.create` | Orchestrator → DNS-Orchestrator | Create DNS record |
| `job.deploy.build` | Orchestrator → Deploy-Agent | Build and deploy |
| `job.deploy.rollback` | Orchestrator → Deploy-Agent | Rollback deployment |
| `job.marketing.landing.generate` | Orchestrator → Marketing-Agent | Generate landing page |
| `job.story.artifact.generate` | Orchestrator → StoryForge-Agent | Generate narrative |
| `job.recovery.plan.generate` | Orchestrator → Recovery-Agent | Generate recovery plan |
| `job.diagnostics.sweep` | Orchestrator → Diagnostics-Agent | Full health sweep |
| `event.repo.indexed` | Repo-Architect → * | Repo added/updated |
| `event.repo.bundle.created` | Repo-Architect → Stripe-Productizer | Bundle ready for productization |
| `event.backup.completed` | Backup-Agent → * | Backup run finished |
| `event.backup.failed` | Backup-Agent → Diagnostics-Agent | Backup failure |
| `event.stripe.product.created` | Stripe-Productizer → Marketing-Agent | Product live |
| `event.stripe.webhook.*` | Stripe-Productizer → Sales-Analytics-Agent | Stripe events |
| `event.dns.propagation.complete` | DNS-Orchestrator → Deploy-Agent | DNS ready |
| `event.deploy.completed` | Deploy-Agent → * | Deployment live |
| `event.deploy.failed` | Deploy-Agent → Diagnostics-Agent | Deploy failure |
| `event.analytics.recommendation` | Sales-Analytics-Agent → Marketing-Agent | Action insight |
| `event.storyforge.artifact.ready` | StoryForge-Agent → Marketing-Agent | Narrative ready |
| `event.diagnostics.anomaly` | Diagnostics-Agent → Orchestrator | Issue detected |
| `event.recovery.playbook.updated` | Recovery-Agent → * | Playbook improved |

---

## State & Registry

### Central Config Store

Aurora maintains a single source of truth for all system state:

| Store | Owner | Description |
|---|---|---|
| `repo-index.json` | Repo-Architect | Master catalog of all repos, tags, categories |
| `product-catalog.json` | Stripe-Productizer | Repos/bundles → Stripe product/price IDs |
| `dns-registry.json` | DNS-Orchestrator | Products/apps → domains/subdomains → targets |
| `deployment-manifests/` | Deploy-Agent | What's deployed where, which commit, which config |
| `backup-manifests/` | Backup-Agent | Per-run backup records with hashes |
| `health-status/` | Diagnostics-Agent | Current health state per domain |
| `content-calendar.json` | Marketing-Agent | Scheduled marketing content |
| `knowledge-graph/` | StoryForge-Agent | Structured life/business event graph |
| `agent-registry.json` | Aurora-Orchestrator | Agent capabilities, versions, health |

### Job Ledger

Every job dispatched by Aurora-Orchestrator is tracked in a global ledger:

```json
{
  "job_id": "job-uuid",
  "intent": "Create productized offer for repo X",
  "status": "in_progress | completed | failed | rolled_back",
  "steps": [
    {
      "agent": "repo-architect",
      "action": "job.repo.bundle.create",
      "status": "completed",
      "started_at": "ISO-8601",
      "completed_at": "ISO-8601"
    },
    {
      "agent": "stripe-productizer",
      "action": "job.stripe.product.create",
      "status": "in_progress",
      "started_at": "ISO-8601"
    }
  ],
  "rollback_hooks": [],
  "created_at": "ISO-8601",
  "updated_at": "ISO-8601"
}
```

### State Consistency

- All state changes are **event-sourced** — the event log is the canonical truth.
- Registries are **derived views** — rebuilt from the event log if needed.
- Every agent writes **structured logs** with correlation IDs for full traceability.
- The Orchestrator maintains **rollback hooks** per step for safe failure recovery.