# Deploy-Agent

## Identity

| Field | Value |
|---|---|
| Agent | `Deploy-Agent` |
| Domain | DNS, Deployment, and Infra |
| Scope | Vercel, Cloud Run, bare metal deployments |

## Responsibilities

1. Given a repo + environment, **build and deploy** the application.
2. Integrate with **DNS-Orchestrator** — wait for DNS propagation before marking deploy live.
3. Integrate with **Stripe-Productizer** — enforce access gating on protected deployments.
4. Maintain **deployment manifests** — what's deployed where, which commit, which config.
5. Maintain **rollback plans** — previous known-good state per deployment target.
6. Support multiple targets: Vercel, Google Cloud Run, bare metal servers, static hosting.

## Inputs

- `job.deploy.build` — Build a repo for a target environment.
- `job.deploy.push` — Push built artifacts to deployment target.
- `job.deploy.rollback` — Roll back to previous known-good deployment.
- `event.dns.propagation.complete` — DNS is ready, proceed with deploy finalization.
- `event.repo.actions.completed` — CI passed, eligible for deploy.

## Outputs

- `event.deploy.started` — Build/deploy initiated.
- `event.deploy.pending` — Waiting on dependency (DNS, Stripe gate, etc.).
- `event.deploy.completed` — Deployment live, URL confirmed.
- `event.deploy.failed` — Build or deploy failed, error context attached.
- `event.deploy.rolledback` — Rollback executed successfully.

## Data Stores

- `deployment-manifests/` — Per-target manifest: repo, commit SHA, config, URL, timestamp.
- `rollback-states/` — Previous deployment snapshots for quick recovery.
- `build-logs/` — Build output per deployment run.

## Dependencies

| Agent | Relationship |
|---|---|
| DNS-Orchestrator | Must confirm DNS propagation before deploy finalization |
| Stripe-Productizer | Provides access gating rules for protected apps |
| Repo-Architect | Triggers deploys for repos with deployment targets |
| Diagnostics-Agent | Receives deploy health events for monitoring |
| Backup-Agent | Deployment manifests included in backup scope |