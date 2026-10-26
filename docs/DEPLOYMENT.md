# Deployment & Synchronization Guide

This guide details the deployment procedures, environment configuration, automated DSA synchronization pipelines, and production cron scheduler setups for **Sumit Kumar's Portfolio**.

---

## 1. Production Architecture Overview

The portfolio system operates with two decoupled tiers:

1. **Frontend (Vercel Edge SPA)**:
   - Built with React 19, Vite, and Tailwind CSS.
   - Connects to the backend via `VITE_API_BASE_URL`.
   - Hosted statically on Vercel with automatic global CDN distribution.

2. **Backend (Node.js REST Service)**:
   - Express.js (ES Modules) service running with persistent Node.js process (e.g. Render, Railway, AWS ECS, VPS, DigitalOcean).
   - Connected to MongoDB Atlas for persistent storage of projects, contact messages, DSA problems, and telemetry states.
   - Contains the automated background scheduler daemon and webhook cron receiver.

---

## 2. Environment Variables Configuration

### Backend Environment Variables (`backend/.env`)

```ini
# Server Core
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://sumitkumar.dev

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority

# Coding Profiles Config
LEETCODE_USERNAME=25001122
CODEFORCES_HANDLE=sumitknic567

# Automated DSA Synchronization Scheduler
DSA_AUTO_SYNC_ENABLED=true
DSA_SYNC_INTERVAL_MINUTES=360
CRON_SECRET=your_secure_cron_secret_token_here

# Email & Admin Credentials
ADMIN_EMAIL=sumitkumar@example.com
ADMIN_PASSWORD=your_secure_admin_password
JWT_SECRET=your_jwt_secret_token_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

### Frontend Environment Variables (`frontend/.env`)

```ini
VITE_API_BASE_URL=https://api.sumitkumar.dev
```

---

## 3. DSA Synchronization Architecture

### Codeforces History Sync
- **Official API**: `https://codeforces.com/api/user.status?handle=sumitknic567`
- **Pagination Strategy**: Requests sequential chunks of 100 submissions (`from=1, count=100`, `from=101, count=100`...) until `submissions.length < pageSize`.
- **Deduplication**: Identifies all accepted submissions (`verdict === 'OK'`) and deduplicates by `contestId + problem.index`.
- **Incremental Resume**: Stores `lastProcessedSubmissionId` in MongoDB (`dsa_sync_states`). Subsequent scheduled syncs only process submissions newer than the last processed ID, avoiding expensive full-history rescans unless requested via `full=true`.
- **Rate-Limiting Protection**: Enforces 250ms pauses between successive page fetches to respect Codeforces API guidelines.
- **Error Isolation**: Empty submission lists (such as a fresh handle with 0 submissions) are accurately recorded as `0 problems` without converting genuine network/API errors into false zeros.

### LeetCode History & Verification
- **Public GraphQL Endpoint**: `https://leetcode.com/graphql`
- **Capabilities & Limits**: The public unauthenticated GraphQL endpoint provides exact aggregate statistics (Total Solved: 186, Easy: 128, Medium: 56, Hard: 2), but LeetCode restricts `recentAcSubmissionList` to the **20 most recent submissions**.
- **Historical Import Wizard**:
  - Located in the portfolio at `/dsa/leetcode` via the **"Import Full History"** action.
  - Supports CSV (LeetCode submission export / format) or JSON.
  - Two-step wizard:
    1. **Format Preview & Analysis**: Previews parsed rows, detects duplicates against MongoDB, and highlights rejected rows with clear validation reasons.
    2. **Confirmation & Merge**: Non-destructively upserts records. User-written solution code, custom approaches, dry runs, and time/space complexity notes are **never overwritten**.
  - **Completeness Telemetry**: Tracks status as `complete`, `partially_synchronized`, or `awaiting_historical_import`.

---

## 4. Production Cron & Automated Background Synchronization

To guarantee newly solved problems appear on your portfolio automatically, configure either the built-in daemon or an external cloud cron webhook.

### Approach A: Built-in Node Daemon (For Persistent Servers / Containers)
If your backend runs on a continuous Node.js server (e.g. Render Web Service, Railway, VPS, EC2):
- Set `DSA_AUTO_SYNC_ENABLED=true`
- Set `DSA_SYNC_INTERVAL_MINUTES=360` (runs every 6 hours)
- The daemon automatically starts with `server.js` and fires periodic incremental syncs.
- Overlapping executions are blocked by the built-in `isJobRunning` concurrency lock.

### Approach B: External Cron Webhook (Recommended for Serverless / Cloud Hosting)
For serverless hosting where background timers may sleep, trigger the dedicated endpoint:
- **Endpoint**: `POST /api/v1/dsa/sync/cron`
- **Headers**:
  - `x-cron-secret: <CRON_SECRET>` or `Authorization: Bearer <CRON_SECRET>`
- **Response**: Returns `{ success: true, source: 'external_cron_webhook', results: { ... } }`

#### 1. Setup with GitHub Actions (Zero Cost & Highly Reliable)
Create `.github/workflows/dsa-sync-cron.yml` in your repository:

```yaml
name: DSA Scheduled Sync

on:
  schedule:
    # Runs every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)
    - cron: '0 */6 * * *'
  workflow_dispatch: # Allows manual trigger from GitHub UI

jobs:
  sync-dsa:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger DSA Sync Webhook
        run: |
          curl -X POST "${{ secrets.BACKEND_API_URL }}/api/v1/dsa/sync/cron" \
            -H "Content-Type: application/json" \
            -H "x-cron-secret: ${{ secrets.CRON_SECRET }}" \
            --fail --silent --show-error
```

Configure `BACKEND_API_URL` and `CRON_SECRET` in your GitHub Repository Settings -> Secrets and variables -> Actions.

#### 2. Setup with Linux Crontab (On VPS or Dedicated Server)
Open the crontab editor on your server:
```bash
crontab -e
```
Add the following line to run every 6 hours:
```bash
0 */6 * * * curl -s -X POST https://api.yourdomain.com/api/v1/dsa/sync/cron -H "x-cron-secret: your_cron_secret" > /dev/null 2>&1
```

#### 3. Setup with Vercel Cron (If Backend is Deployed on Vercel)
In `backend/vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/v1/dsa/sync/cron",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

---

## 5. Verification & Telemetry Endpoints

- **Scheduler Telemetry**: `GET /api/v1/dsa/sync/status`
  - Returns scheduler status, timer activity, and latest synchronization document for each platform.
- **Manual Sync**: `POST /api/v1/dsa/sync/:platform` (supports `?full=true` for complete Codeforces resync)
- **Import Preview**: `POST /api/v1/dsa/import/preview`
- **Import Confirmation**: `POST /api/v1/dsa/import`

---

## 6. Build and Test Verification

Run verification before deploying:

```bash
# Backend Test Suite (97 passing tests across all modules)
cd backend
npm test

# Frontend Production Build
cd ../frontend
npm run build
```
