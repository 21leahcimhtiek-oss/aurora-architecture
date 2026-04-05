# Mapping to Current Reality

How Aurora's architecture maps to Keith's existing tools, repos, and workflows.

---

## Ninja / SuperNinja → Aurora-Orchestrator + UI

The current SuperNinja agent becomes the **Aurora-Orchestrator** plus a thin interface layer. Today, SuperNinja handles intent classification, task decomposition, and execution in a single loop. Aurora formalizes this by splitting the orchestration logic from the domain-specific execution, giving each domain a dedicated agent with its own state, contracts, and event model.

| Current | Aurora Equivalent |
|---|---|
| SuperNinja prompt + loop | Aurora-Orchestrator (intent → plan → dispatch) |
| Chat interface | Interface Layer (NL input + webhook ingestion) |
| Manual repo operations | Repo-Architect agent |
| Manual Stripe setup | Stripe-Productizer agent |
| Ad-hoc deploy scripts | Deploy-Agent |

---

## SOPs → Domain Agents / Playbooks

Every Standard Operating Procedure Keith has been building is a candidate **domain agent** or **playbook** within an agent. SOPs that describe recurring multi-step processes become agent logic. SOPs that describe one-off or emergency procedures become playbooks consumed by the Recovery-Agent or Diagnostics-Agent.

| SOP Type | Aurora Target |
|---|---|
| Repo categorization & tagging | Repo-Architect core logic |
| Backup & sync procedures | Backup-Agent core logic |
| Stripe product setup | Stripe-Productizer core logic |
| DNS record management | DNS-Orchestrator core logic |
| Deployment checklists | Deploy-Agent core logic |
| Marketing launch sequences | Marketing-Agent core logic |
| Disk recovery procedures | Recovery-Agent playbooks |
| System health checks | Diagnostics-Agent sweep logic |

---

## Per-Repo Lifecycle

Under Aurora, every repo gets a full lifecycle managed by three coordinating agents:

### Productization Profile (Stripe + Marketing + Deployment)

```
Repo-Architect indexes repo
      │
      ├── Stripe-Productizer creates product/price
      │         │
      │         └── Marketing-Agent generates landing page, emails, social
      │
      ├── Deploy-Agent builds and deploys
      │         │
      │         └── DNS-Orchestrator provisions subdomain
      │
      └── Backup-Agent archives
```

Each repo receives:

1. **A productization profile** — Stripe product ID, price ID, checkout link, licensing rules.
2. **A marketing profile** — Landing page, email sequences, social posts, content calendar entry.
3. **A deployment profile** — Target environment, manifest, rollback plan, health checks.
4. **A backup profile** — Archive location, last backup timestamp, integrity hash.
5. **A narrative profile** — "Behind the build" story, origin context, milestone timeline.

### Lifecycle States

```
discovered → indexed → productized → deployed → marketed → monitored
                                                              │
                                                              └── retired (if analytics recommend)
```

---

## Existing Repos → Aurora Mapping

| Repo | Primary Agent(s) | Notes |
|---|---|---|
| `activepieces` | Repo-Architect, Deploy-Agent | AI Agents / MCP / Workflow Automation platform |
| `next-js-assist-loop-template` | Repo-Architect, Deploy-Agent | Template for productization |
| `upload-google-play` | Repo-Architect, Stripe-Productizer | GitHub Action — candidate for marketplace listing |
| `google-cloud-4-words` | Repo-Architect | Reference/utility repo |
| `pro-projects` | Repo-Architect, Stripe-Productizer | Revised projects — bundle candidates |
| Mashup/synthesis repos | Repo-Architect, StoryForge-Agent | Narrative-rich, story-driven products |

---

## Migration Path

Aurora doesn't require a big-bang migration. The path is incremental:

1. **Phase 1: Indexing** — Repo-Architect scans and indexes all 300+ repos. Master index established.
2. **Phase 2: Backup** — Backup-Agent begins nightly sync. Recovery manifests generated.
3. **Phase 3: Productization** — Stripe-Productizer creates products for high-priority repos/bundles.
4. **Phase 4: Deployment** — Deploy-Agent + DNS-Orchestrator provision and deploy top products.
5. **Phase 5: Marketing** — Marketing-Agent generates assets. StoryForge-Agent provides narrative.
6. **Phase 6: Monitoring** — Diagnostics-Agent runs continuous health sweeps. Full autonomy achieved.

Each phase is independently valuable. No phase depends on all previous phases being 100% complete.