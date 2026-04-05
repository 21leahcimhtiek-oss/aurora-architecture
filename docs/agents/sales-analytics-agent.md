# Sales-Analytics-Agent

## Identity

| Field | Value |
|---|---|
| Agent | `Sales-Analytics-Agent` |
| Domain | Stripe, Offers, and Monetization |
| Scope | Revenue, cohorts, product performance |

## Responsibilities

1. **Consume Stripe webhooks** — checkout completed, refunds, subscription changes, churn events.
2. Maintain **per-product and per-bundle metrics** — revenue, conversion rates, LTV, churn rate.
3. Build **cohort analysis** — group customers by acquisition date, product, channel.
4. Feed actionable insights back to Marketing-Agent — what to push, what to retire, what to reprice.
5. Generate **periodic reports** — daily revenue summary, weekly product performance, monthly cohort review.

## Inputs

- `event.stripe.webhook.*` — All Stripe events forwarded from Stripe-Productizer.
- `job.analytics.report.daily` — Scheduled daily revenue summary.
- `job.analytics.report.weekly` — Scheduled weekly product performance.
- `job.analytics.cohort.refresh` — Rebuild cohort data.

## Outputs

- `event.analytics.insight` — Actionable insight generated (e.g., "Product X churn spiked 40%").
- `event.analytics.report.ready` — Report generated and stored.
- `event.analytics.recommendation` — Pricing/retirement/promotion recommendation for Marketing-Agent.

## Data Stores

- `metrics/` — Time-series revenue and event data per product.
- `cohorts/` — Customer cohort definitions and performance snapshots.
- `reports/` — Generated report artifacts (JSON, markdown, PDF).

## Dependencies

| Agent | Relationship |
|---|---|
| Stripe-Productizer | Primary event source — all Stripe webhooks |
| Marketing-Agent | Receives insights and recommendations for campaign decisions |
| Aurora-Orchestrator | Receives high-severity alerts (revenue drops, mass churn) |