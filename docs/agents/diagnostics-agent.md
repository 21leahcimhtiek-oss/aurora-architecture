# Diagnostics-Agent

## Identity

| Field | Value |
|---|---|
| Agent | `Diagnostics-Agent` |
| Domain | Recovery, OS, and Hardware Workflows |
| Scope | System health, repo health, automation health |

## Responsibilities

1. **Periodically check** health across all domains:
   - GitHub Actions status — failing workflows, stale runs.
   - Backup freshness — last successful backup age vs. threshold.
   - DNS correctness — records resolve to expected targets.
   - Stripe webhook health — delivery failures, missed events.
   - Deployment health — endpoints responding, SSL valid.
2. **Report anomalies** to Aurora-Orchestrator for automated or manual remediation.
3. Maintain a **health dashboard** — current status of every monitored system.
4. Support **on-demand diagnostics** — deep scan of a specific domain on request.
5. Track **historical health trends** — detect degradation patterns before failures occur.

## Inputs

- `job.diagnostics.sweep` — Scheduled full health sweep across all domains.
- `job.diagnostics.domain` — On-demand deep scan of a specific domain.
- `event.backup.failed` — Backup failure triggers backup health check.
- `event.deploy.failed` — Deploy failure triggers deployment health check.
- `event.dns.health.failed` — DNS issue triggers DNS health check.

## Outputs

- `event.diagnostics.healthy` — All checks passed for a domain.
- `event.diagnostics.anomaly` — Issue detected, severity and context attached.
- `event.diagnostics.disk.failing` — Disk SMART data indicates degradation.
- `event.diagnostics.report.ready` — Health report generated.

## Data Stores

- `health-status/` — Current health state per domain and per check.
- `health-history/` — Time-series health data for trend analysis.
- `reports/` — Generated health reports (JSON, markdown).
- `thresholds.json` — Configurable alert thresholds per check type.

## Dependencies

| Agent | Relationship |
|---|---|
| Aurora-Orchestrator | Receives anomaly events for remediation dispatch |
| Backup-Agent | Monitors backup freshness and integrity |
| DNS-Orchestrator | Monitors DNS record correctness |
| Deploy-Agent | Monitors deployment endpoint health |
| Recovery-Agent | Triggers preemptive recovery on hardware degradation |
| Stripe-Productizer | Monitors webhook delivery health |