# LegacyChain — Monitoring & Scheduled Jobs Plan

---

## Two Separate Concerns

Don't conflate them:

1. **Scheduled jobs (cron)** — time-based tasks like nominee resend
2. **Monitoring agent** — constant watching of health, alerts, errors

---

## Part 1: Cron / Scheduled Jobs

### The nominee resend problem

When a nominee doesn't open their access link, the system should resend it automatically — up to 2 times. This requires a scheduler.

### Option A — `node-cron` inside the server

- Runs inside the existing Node process
- Good enough for: nominee resend, check-in expiry checks
- **Risk:** if the server goes down, cron stops too

### Option B — External scheduler (recommended)

- Your backend exposes a protected endpoint:
  ```
  POST /api/internal/run-resend-check
  Header: x-internal-secret: <SECRET>
  ```
- An external scheduler calls this endpoint on a schedule (e.g. every hour)
- Server doesn't manage timing — fully decoupled and testable manually by hitting the endpoint directly

**External scheduler options (all have free tiers):**
- [Render Cron Jobs](https://render.com/docs/cronjobs) — if hosted on Render
- [Railway Cron](https://railway.app) — same idea
- [cron-job.org](https://cron-job.org) — free, no hosting required, just enter your URL + schedule

### What needs to be built (backend)

| Step | What |
|------|------|
| 1 | New DB table `NomineeAccessSends` — tracks `nomineeId`, `sentAt`, `sendCount`, `token` |
| 2 | Update send route to write a record on every send |
| 3 | Resend check endpoint — finds records where `sendCount < 2`, no `AccessLog` redemption, and enough time has passed |
| 4 | Wire external scheduler to hit that endpoint |

### Testing the resend

Set an env var for the resend interval so you can shorten it for testing:

```
RESEND_INTERVAL_HOURS=24   # production: wait 24h before resending
# set to 0.05 (~3 minutes) during testing
```

---

## Part 2: Monitoring Stack

### What to monitor

| Layer | What to watch |
|-------|--------------|
| **Database** | Connection failures, slow queries, sync errors |
| **Backend API** | 5xx errors, response times, auth failures |
| **Frontend** | JS errors, failed API calls, page crashes |
| **Business logic** | Emails bouncing, nominee links expiring unread, missed check-ins not triggering |

---

### Recommended tool stack

#### Sentry — Error monitoring (frontend + backend)
- Catches all JS errors in React automatically
- Catches all unhandled exceptions in Node/Express automatically
- AI-generated error summaries built in
- Free tier covers small projects
- Setup time: ~30 minutes for both
- [https://sentry.io](https://sentry.io)

#### BetterStack — Uptime + log alerts
- Pings your server every minute
- Alerts via email/SMS/Slack if server goes down
- Log drain — stream server logs for search and alerts
- Free tier available
- [https://betterstack.com](https://betterstack.com)

#### Resend Webhooks — Email delivery tracking
- Alerts when an email bounces or fails to deliver
- Important for knowing if nominee emails are actually reaching inboxes
- Built into Resend dashboard — just enable the webhook

#### Optional: Axiom — Structured log search
- Query your server logs like a database
- Useful for patterns (e.g. "how many nominee links sent this week")
- Free tier is generous
- [https://axiom.co](https://axiom.co)

---

### `/api/health` endpoint (build first)

A simple endpoint BetterStack (or anyone) can ping:

```json
GET /api/health

{
  "status": "ok",
  "db": "connected",
  "uptime": 3600,
  "timestamp": "2026-06-24T10:00:00Z"
}
```

Returns `503` if the DB connection fails — BetterStack will alert immediately.

---

## Recommended Build Order

| Priority | Task |
|----------|------|
| 1 | Build `GET /api/health` endpoint with DB check |
| 2 | Add Sentry to frontend (React) |
| 3 | Add Sentry to backend (Node/Express) |
| 4 | Set up BetterStack to ping `/api/health` every minute |
| 5 | Enable Resend delivery webhooks |
| 6 | Build `NomineeAccessSends` table + resend check endpoint |
| 7 | Wire external cron scheduler to resend endpoint |
| 8 | Add Axiom log drain (optional, when you need log search) |

---

## Future: Custom AI Agent (when you need it)

Once you have logs flowing into Axiom or BetterStack, you can layer an AI agent on top using:

- **LangChain** — query your logs and summarise anomalies on a schedule
- **AutoGen (Microsoft)** — multi-agent setup for more complex monitoring workflows
- **Highlight.io** — open-source session replay + AI error summaries, self-hostable

This is only worth building at scale. For now, Sentry + BetterStack + Resend webhooks covers 95% of what a custom agent would do with almost zero maintenance.
