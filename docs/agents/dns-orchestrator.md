# DNS-Orchestrator

## Identity

| Field | Value |
|---|---|
| Agent | `DNS-Orchestrator` |
| Domain | DNS, Deployment, and Infra |
| Scope | Network Solutions DNS, subdomains, records |

## Responsibilities

1. Given a product or app, **create/update DNS records** (A, CNAME, TXT, MX).
2. Maintain a **registry**: `product/app ↔ domain/subdomain ↔ target`.
3. **Validate propagation** — poll DNS resolvers until records are live.
4. Run **health checks** — verify targets respond correctly after propagation.
5. Support **bulk operations** — migrate records, update targets across multiple subdomains.
6. Coordinate with Deploy-Agent — DNS must resolve before deploy is marked complete.

## Inputs

- `job.dns.record.create` — Create a new DNS record for a product/app.
- `job.dns.record.update` — Update an existing record's target.
- `job.dns.record.delete` — Remove a record.
- `job.dns.validate` — Check propagation and health for a specific record.
- `event.deploy.pending` — Deploy-Agent signals DNS needs to be ready.

## Outputs

- `event.dns.record.created` — Record created at registrar.
- `event.dns.record.updated` — Record updated.
- `event.dns.propagation.complete` — Record verified live across resolvers.
- `event.dns.health.ok` — Target responding correctly.
- `event.dns.health.failed` — Target unreachable or misconfigured.

## Data Stores

- `dns-registry.json` — Master mapping of products/apps to domains, subdomains, and targets.
- `propagation-logs/` — Per-record propagation check history.
- `health-checks/` — Endpoint health check results and history.

## Dependencies

| Agent | Relationship |
|---|---|
| Deploy-Agent | DNS must be ready before deploy completes; receives `event.dns.propagation.complete` |
| Diagnostics-Agent | Receives DNS health events for monitoring |
| Aurora-Orchestrator | Dependency ordering — DNS steps block downstream deploy steps |