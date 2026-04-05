# Backup-Agent

## Identity

| Field | Value |
|---|---|
| Agent | `Backup-Agent` |
| Domain | Repo & Code Ecosystem |
| Scope | GitHub → cloud storage → local vaults |

## Responsibilities

1. **Nightly sync** of all repos — pull latest, archive, push to backup destination.
2. **Integrity verification** — compare hashes, file counts, detect missing repos vs. master index.
3. Maintain **recovery manifests** — what to restore, from where, in what order.
4. Support **on-demand backup** for individual repos or bundles.
5. Alert Diagnostics-Agent on any backup failure or integrity mismatch.

## Inputs

- `job.backup.nightly` — Scheduled full sync.
- `job.backup.repo` — On-demand backup of a single repo.
- `job.backup.verify` — Integrity check against master index.
- `event.repo.indexed` — New/updated repo from Repo-Architect triggers incremental backup.

## Outputs

- `event.backup.completed` — Backup run finished with manifest.
- `event.backup.failed` — Backup failed, includes error context.
- `event.backup.integrity.ok` — Verification passed.
- `event.backup.integrity.mismatch` — Verification failed, details attached.

## Data Stores

- `backup-manifests/` — Per-run manifests with timestamps, hashes, repo list.
- `recovery-plans/` — Predefined restoration sequences.
- Cloud storage buckets (S3/GCS/R2) for archived tarballs.
- Local vault paths for air-gapped copies.

## Dependencies

| Agent | Relationship |
|---|---|
| Repo-Architect | Receives repo index updates to keep backup scope current |
| Diagnostics-Agent | Receives health/failure events for monitoring |
| Recovery-Agent | Consumes recovery manifests during disaster recovery |