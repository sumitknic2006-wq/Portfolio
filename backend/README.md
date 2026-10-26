# Backend — Sumit Kumar Developer Portfolio REST API & MongoDB Atlas Service

Modular, production-ready Express.js REST API service for Sumit Kumar's full-stack developer portfolio. Built with pure JavaScript ES modules, Mongoose ODM, MongoDB Atlas integration, repository-pattern queries, robust request validation, rate limiting, and defensive security headers.

---

## 1. Technology Stack

- **Runtime**: Node.js (v20+ / v24+)
- **Framework**: Express.js (ES Modules, `"type": "module"`)
- **Database**: MongoDB Atlas / Local MongoDB with Mongoose ODM (v8.10+)
- **Architecture**: Controller-Service-Repository Pattern
- **In-Memory Test Database**: `mongodb-memory-server` (isolated, fast, credential-free automated tests)
- **Security**: Helmet HTTP headers, CORS origin restrictions, payload size caps (10kb), mass-assignment protection
- **Validation**: Zod (strict schema validation with custom error formatting)
- **Rate Limiting**: `express-rate-limit` (general API limits + strict contact limits)
- **Testing**: Node.js Native Test Runner (`node:test`) + Supertest

---

## 2. Directory Layout

```
backend/
├── src/
│   ├── config/
│   │   ├── env.js                     # Environment variable validation & typed defaults
│   │   └── db.js                      # Resilient Mongoose connection, reconnection traps, & graceful shutdown
│   ├── models/                        # Mongoose schemas with validation, indexes, & timestamps
│   │   ├── Profile.js                 # Single default public developer profile
│   │   ├── Project.js                 # Portfolio projects with unique slug regex & category indexing
│   │   ├── Skill.js                   # Categorized skills with display order
│   │   ├── Achievement.js             # Verified certifications & hackathons
│   │   ├── Education.js               # University academic curriculum
│   │   ├── Experience.js              # Professional programs & roles
│   │   ├── CodingProfile.js           # Verified GitHub & LeetCode statistics
│   │   └── ContactMessage.js          # Inbound contact inquiries (telemetry protected)
│   ├── repositories/                  # Dedicated query abstraction layer (no raw queries in controllers)
│   │   ├── profile.repository.js
│   │   ├── project.repository.js
│   │   ├── skill.repository.js
│   │   ├── achievement.repository.js
│   │   ├── education.repository.js
│   │   ├── experience.repository.js
│   │   ├── codingProfile.repository.js
│   │   └── contact.repository.js
│   ├── controllers/                   # HTTP handling & status code mapping
│   │   ├── health.controller.js
│   │   ├── profile.controller.js
│   │   ├── skills.controller.js
│   │   ├── projects.controller.js
│   │   ├── achievements.controller.js
│   │   ├── education.controller.js
│   │   ├── codingProfiles.controller.js
│   │   └── contact.controller.js
│   ├── routes/                        # Versioned REST endpoint routers
│   │   ├── index.js                   # Master router (/api/v1)
│   │   ├── health.routes.js
│   │   ├── profile.routes.js
│   │   ├── skills.routes.js
│   │   ├── projects.routes.js
│   │   ├── achievements.routes.js
│   │   ├── education.routes.js
│   │   ├── codingProfiles.routes.js
│   │   └── contact.routes.js
│   ├── services/                      # Business logic & strict fallback enforcement
│   │   ├── portfolio.service.js       # Live DB retrieval; strict 503 in production on DB offline
│   │   └── contact.service.js         # Write-confirmed contact persistence & honest status reporting
│   ├── scripts/
│   │   └── seed.js                    # Idempotent database seed script with --dry-run support
│   ├── middleware/                    # HTTP middleware pipeline
│   │   ├── notFound.js                # Standard 404 handler
│   │   ├── errorHandler.js            # Centralized error handler with operational error codes
│   │   ├── validateRequest.js         # Zod schema validation middleware
│   │   └── rateLimiter.js             # General API & contact endpoint rate limiters
│   ├── validators/                    # Request payload schemas
│   │   └── contact.validator.js       # Contact input validation schema
│   ├── utils/                         # Helper utilities
│   │   ├── apiResponse.js             # Standardized JSON response formatters
│   │   └── asyncHandler.js            # Async error boundary wrapper
│   ├── app.js                         # Express app assembly & middleware stack
│   └── server.js                      # HTTP server startup & fail-fast DB check in production
├── tests/                             # Automated test suites
│   ├── helpers/
│   │   └── dbTestHelper.js            # In-memory MongoDB lifecycle management
│   ├── database.test.js               # Model validations, unique slugs, draft filtering, seed idempotency
│   ├── contact.test.js                # Persistence verification, rate limits, 503 offline behavior
│   ├── projects.test.js               # Project catalog, category filters, 404 handling
│   ├── endpoints.test.js              # Skills, achievements, profile, education against MongoDB
│   └── health.test.js                 # Health status distinguishing application vs DB connectivity
├── .env.example                       # Safe environment template
├── package.json
└── README.md
```

---

## 3. Environment Configuration & Security

Create your local `.env` configuration file from the template:

```bash
cp .env.example .env
```

### Supported Configuration Keys

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `NODE_ENV` | `development` | Runtime environment (`development`, `production`, `test`) |
| `PORT` | `5001` | TCP port for the Express HTTP server |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Primary frontend SPA origin for CORS |
| `ALLOWED_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Comma-delimited list of allowed CORS origins |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/sumit_portfolio` | MongoDB connection URI (Atlas SRV in production) |
| `ALLOW_DEV_FIXTURES` | `false` | Explicit dev flag allowing fixture fallback when local DB is offline |
| `RATE_LIMIT_WINDOW_MS` | `900000` (15m) | Rate limiting sliding window in milliseconds |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max general requests allowed per window per IP |
| `CONTACT_RATE_LIMIT_MAX` | `5` | Max contact inquiries allowed per window per IP |
| `RESEND_API_KEY` | *(empty)* | Optional transactional email key for alerts |
| `CONTACT_RECEIVER_EMAIL` | `sumitknic2006@gmail.com` | Destination inbox for verified inquiries |

### Security & Privacy Rules
- **No Credentials Committed**: `.env` is ignored by git.
- **No Credentials Logged**: Database connection logging sanitizes URIs and logs only hostnames without passwords.
- **Fail-Fast in Production**: In `production`, missing `MONGODB_URI` or database connection failure terminates process startup immediately with code 1.
- **Critical Fallback Rule**: In `production`, database query failures return a clean `503 Service Unavailable` error (`DATABASE_UNAVAILABLE`). Silent fallback to hardcoded fixture data is strictly disallowed.
- **Contact Message Privacy**: IP addresses and user agents are saved with `select: false` so they are never leaked in queries. No public GET endpoints exist for contact messages.

---

## 4. MongoDB Atlas Setup Guide

To deploy with MongoDB Atlas:

1. **Create an Atlas Cluster**:
   - Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Create a free Shared Cluster (M0) in a region close to your deployment (e.g. `ap-south-1` Mumbai).

2. **Create a Least-Privilege Database User**:
   - Go to **Database Access** -> **Add New Database User**.
   - Authentication Method: **Password**.
   - Built-in Role: **Read and write to any database** (or restrict to `sumit_portfolio` database).
   - *Never give cluster admin or user-management privileges to the application user.*

3. **Configure Network Access**:
   - Go to **Network Access** -> **Add IP Address**.
   - For local development: Add your current IP address.
   - For cloud hosting (e.g. Render, Railway): Add the static outbound IPs provided by your host, or configure `0.0.0.0/0` with a strong, rotated database user password.

4. **Obtain Connection String**:
   - Go to **Database** -> **Connect** -> **Drivers** (Node.js).
   - Format: `mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/sumit_portfolio?retryWrites=true&w=majority`
   - Set this as `MONGODB_URI` in your production environment variables (e.g., Render/Railway dashboard).

---

## 5. Seed Script (`npm run seed`)

The seed script (`backend/src/scripts/seed.js`) populates the MongoDB database with verified portfolio information for Sumit Kumar.

### Idempotency & Safety
- **Idempotency**: Running the script repeatedly updates records using `$set` without creating duplicates (`upsert: true`).
- **Unique Identifiers**: Projects keyed by unique `slug`, skill categories by `categoryKey`, achievements by `id`, education/experience by `id`, and coding profiles by `platform`.
- **Dry-Run Mode**: Validate schema integrity without writing to the database:
  ```bash
  npm run seed:dry
  ```
- **Live Seeding**:
  ```bash
  npm run seed
  ```

---

## 6. Running & Testing

### Development Server
```bash
npm run dev
```

### Production Server
```bash
npm start
```

### Automated Test Suite
The test suite utilizes `mongodb-memory-server` to spin up an isolated, credential-free in-memory MongoDB instance during tests. Tests do not affect development or production databases.

```bash
npm test
```

Test coverage includes:
- Model validation (slug regex, required fields, enum constraints)
- Unique slug indexing and duplicate key handling (`E11000`)
- Category filtering and published vs draft content exclusion
- Seed script idempotency (running twice produces identical counts)
- Contact form persistence, rate limiting, and write confirmation (201 Created)
- Database disconnection handling (503 Service Unavailable)
- Security headers (Helmet) and mass-assignment protection

---

## 7. API Reference

All versioned endpoints are prefixed with `/api/v1`.

### 1. Health Diagnostics
- `GET /health` (Quick probe)
- `GET /api/v1/health` (Telemetry probe)

Response distinguishes application state from database connectivity:
```json
{
  "success": true,
  "message": "Server is operational and healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2026-10-24T09:20:00.000Z",
    "environment": "development",
    "uptimeSeconds": 15,
    "database": {
      "status": "connected",
      "connected": true,
      "host": "127.0.0.1",
      "mode": "mongodb_atlas"
    },
    "version": "1.0.0"
  }
}
```

### 2. Profile
- `GET /api/v1/profile`
Returns the single default public developer profile (`isDefault: true`).

### 3. Skills
- `GET /api/v1/skills`
- `GET /api/v1/skills?category=frontend`
Filters by `categoryKey`. Returns published skill categories with display ordering.

### 4. Projects
- `GET /api/v1/projects`
- `GET /api/v1/projects?category=web`
- `GET /api/v1/projects/:slug`
Returns published portfolio projects (RESTIFY, StockSaathi AI, Investor Management App, DSA in C++). Draft projects (`isPublished: false`) are excluded.

### 5. Achievements
- `GET /api/v1/achievements`
- `GET /api/v1/achievements?category=hackathon`
Returns verified hackathon milestones and Google Cloud Arcade credentials.

### 6. Education & Experience
- `GET /api/v1/education`
Returns undergraduate degree data and verified experience roles (Google Cloud Arcade Facilitator & Arcade Labs Participant).

### 7. Coding Profiles
- `GET /api/v1/coding-profiles`
Returns verified profiles for GitHub (`sumitknic2006-wq`), LeetCode (`25001122`), and Codeforces (`sumitknic567`).

### 8. Contact Submission
- `POST /api/v1/contact`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hello, I would like to discuss an opportunity."
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Message sent successfully. Thank you for reaching out!",
  "data": {
    "id": "671a14b5f8910408544c09a1",
    "status": "stored_successfully",
    "createdAt": "2026-10-24T09:20:00.000Z",
    "note": "Message stored securely in portfolio database. Email delivery will be dispatched upon transactional provider configuration."
  }
}
```
*Note: The API returns 201 only after the database confirms the write. If MongoDB is offline, it returns 503 Service Unavailable.*

### 9. AI Portfolio Assistant (Phase 7)
- `GET /api/v1/assistant/status`: Retrieves safe provider metadata without exposing API keys.
- `POST /api/v1/assistant/chat`: Interacts with the grounded AI assistant.

**Request Body:**
```json
{
  "message": "Explain the RESTIFY project",
  "language": "en",
  "conversationHistory": [
    { "role": "user", "text": "Who is Sumit?" },
    { "role": "assistant", "text": "Sumit Kumar is a Full-Stack MERN Developer and DSA Enthusiast..." }
  ]
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Assistant response generated successfully",
  "data": {
    "answer": "RESTIFY is a digital wellbeing and smart screen-time control platform developed by Sumit Kumar. Built using React, Node.js, Express, and MongoDB, it features real-time focus timers, historical telemetry charts, and verified RESTful API synchronization.",
    "sources": [
      {
        "type": "project",
        "title": "RESTIFY",
        "identifier": "restify"
      }
    ]
  }
}
```

**Unconfigured Response (503 Service Unavailable):**
```json
{
  "success": false,
  "error": {
    "code": "AI_PROVIDER_UNCONFIGURED",
    "message": "The AI Portfolio Assistant is currently unconfigured. Set AI_API_KEY in backend/.env to activate live answers."
  }
}
```

---

## 7. AI Provider Integration & Setup Guide

### Supported AI Provider: Google Gemini (`@google/genai`)
- **Official SDK**: `@google/genai` (v2.31+)
- **Official Documentation**: [Google Gen AI SDK Documentation](https://ai.google.dev/gemini-api/docs/quickstart)
- **Default Recommended Model**: `gemini-2.5-flash` (or `gemini-1.5-flash`)
- **Deterministic Mock Provider**: `AI_PROVIDER=mock` (used for automated CI tests without API keys or cost)

### Secure Configuration Steps:
1. Obtain an API key from Google AI Studio: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Add the key to `backend/.env` (NEVER commit this file):
   ```env
   AI_PROVIDER=gemini
   AI_API_KEY=your_actual_gemini_api_key_here
   AI_MODEL=gemini-2.5-flash
   AI_MAX_OUTPUT_TOKENS=600
   ```
3. Restart the backend server.
4. Verify by checking `GET /api/v1/assistant/status` (will return `configured: true`).

### Integration Status Matrix:
| Stage | Status | Description |
|---|---|---|
| **1. UI Implemented** | **Completed** | Floating launcher, expandable chat panel, quick suggestions, loading indicator, sources chips, error banner, retry button, full keyboard navigation. |
| **2. Backend Integration Implemented** | **Completed** | Zod validation, rate limiter (30 req / 15m), verified MongoDB context builder, anti-injection system prompt, provider adapter pattern. |
| **3. Provider Configured** | **Awaiting Key** | `backend/.env` template configured. Awaiting user's `AI_API_KEY`. Returns honest 503 `AI_PROVIDER_UNCONFIGURED` without falsifying results. |
| **4. Real Provider Request Tested** | **Verified with Mock** | Comprehensive automated tests pass with `AI_PROVIDER=mock`. Live Gemini call ready immediately upon inserting API key into `backend/.env`. |

---

## 8. DSA Explorer & Automated Synchronization Architecture

### Features:
- **Real Profiles**: Connected to LeetCode (`25001122`) and Codeforces (`sumitknic567`).
- **Sequential Codeforces Pagination**: Fetches every batch via official `user.status` API with 250ms rate-limiting and resumption from `lastProcessedSubmissionId`.
- **LeetCode Historical Import**: Import wizard supporting JSON/CSV with preview, duplicate detection, and non-destructive merges (never overwrites solution code or notes).
- **Background Synchronization**: Built-in timer daemon (`DSA_AUTO_SYNC_ENABLED=true`, `DSA_SYNC_INTERVAL_MINUTES=360`) + concurrency lock (`isJobRunning`) + external cron webhook (`POST /api/v1/dsa/sync/cron`).

### API Endpoints:
- `GET /api/v1/dsa/platforms`: Platform summary cards with real handle links.
- `GET /api/v1/dsa/leetcode`: LeetCode profile statistics and paginated problems.
- `GET /api/v1/dsa/codeforces`: Codeforces profile statistics and paginated problems.
- `GET /api/v1/dsa/problems/:platform/:slug`: Detailed problem view with custom code, approach, and dry-run steps.
- `POST /api/v1/dsa/import/preview`: Previews JSON/CSV records, reports rejected rows, and flags duplicates.
- `POST /api/v1/dsa/import`: Persists validated problem records into MongoDB.
- `POST /api/v1/dsa/sync/:platform`: Triggers manual sync (supports `?full=true`).
- `POST /api/v1/dsa/sync/cron`: Secured webhook for external cron triggers (`x-cron-secret`).
- `GET /api/v1/dsa/sync/status`: Retrieves scheduler status and platform sync telemetry.

For production cron deployment instructions, see [docs/DEPLOYMENT.md](file:///Users/sumitkumar/sumit-portfolio/docs/DEPLOYMENT.md).

