# Backend — Sumit Kumar Developer Portfolio REST API

Modular, production-ready Express.js REST API service for Sumit Kumar's full-stack developer portfolio. Built with pure JavaScript ES modules, robust request validation, rate limiting, and defensive security headers.

---

## 1. Technology Stack

- **Runtime**: Node.js (v20+ / v24+)
- **Framework**: Express.js (ES Modules, `"type": "module"`)
- **Planned Data Layer**: Mongoose ODM (prepared for Phase 4 MongoDB integration)
- **Security**: Helmet HTTP headers, CORS origin restrictions, payload size caps (10kb)
- **Validation**: Zod (strict schema validation with mass-assignment protection)
- **Rate Limiting**: `express-rate-limit` (general API limits + strict contact limits)
- **Testing**: Node.js Native Test Runner (`node:test`) + Supertest

---

## 2. Directory Layout

```
backend/
├── src/
│   ├── config/
│   │   ├── env.js                     # Environment variable validation & typed defaults
│   │   └── db.js                      # Mongoose connection & graceful shutdown handlers
│   ├── models/                        # Mongoose schemas prepared for Phase 4
│   │   ├── Project.js
│   │   ├── Skill.js
│   │   ├── ContactMessage.js
│   │   └── Profile.js
│   ├── controllers/                   # Route logic controllers
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
│   ├── services/                      # Business logic & repository abstractions
│   │   ├── portfolio.service.js       # Verified fixtures & data layer
│   │   └── contact.service.js         # Contact submission handler (strict honesty)
│   ├── middleware/                    # HTTP middleware pipeline
│   │   ├── notFound.js                # Standard 404 handler
│   │   ├── errorHandler.js            # Centralized error handler
│   │   ├── validateRequest.js         # Zod schema validation middleware
│   │   └── rateLimiter.js             # General API & contact endpoint rate limiters
│   ├── validators/                    # Request payload schemas
│   │   └── contact.validator.js       # Contact input validation schema
│   ├── utils/                         # Helper utilities
│   │   ├── apiResponse.js             # Standardized JSON response formatters
│   │   └── asyncHandler.js            # Async error boundary wrapper
│   ├── app.js                         # Express app assembly & middleware stack
│   └── server.js                      # HTTP server startup & signal traps
├── tests/                             # Automated test suites
│   ├── health.test.js
│   ├── projects.test.js
│   ├── contact.test.js
│   └── endpoints.test.js
├── .env.example                       # Safe environment template
├── package.json
└── README.md
```

---

## 3. Environment Setup

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
| `MONGODB_URI` | *(empty in Phase 3)* | Database connection URI (planned for Phase 4) |
| `RATE_LIMIT_WINDOW_MS` | `900000` (15m) | Rate limiting sliding window in milliseconds |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max general requests allowed per window per IP |
| `CONTACT_RATE_LIMIT_MAX` | `5` | Max contact inquiries allowed per window per IP |

---

## 4. Running the Backend

### Installation
```bash
npm install
```

### Development Server (with auto-reload on Node 20+)
```bash
npm run dev
```

### Production Start
```bash
npm start
```

### Running the Automated Test Suite
```bash
npm test
```

---

## 5. API Documentation

All versioned endpoints use the `/api/v1` prefix.

### Response Conventions

All API responses follow a consistent structure:

#### Success Format
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... } | [ ... ],
  "meta": { ... }
}
```

#### Error Format
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error description",
    "code": "ERROR_CODE",
    "details": [ ... ]
  }
}
```

---

### Endpoint Reference

#### 1. Health Status
- **`GET /health`** (Direct probe)
- **`GET /api/v1/health`** (Versioned probe)

**Example Response:**
```json
{
  "success": true,
  "message": "Server is operational and healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2026-10-24T08:58:55.285Z",
    "environment": "development",
    "uptimeSeconds": 42,
    "database": {
      "status": "disconnected",
      "connected": false,
      "mode": "phase3_standalone_fixtures"
    },
    "version": "1.0.0"
  }
}
```

#### 2. Profile
- **`GET /api/v1/profile`**

Returns public developer profile data including headline, degree, contact points, and verified social links.

#### 3. Skills
- **`GET /api/v1/skills`**
- **`GET /api/v1/skills?category=frontend`**

Supports category filtering by key (`programming`, `frontend`, `backend`, `database`, `tools`, `coreConcepts`).

#### 4. Projects
- **`GET /api/v1/projects`**
- **`GET /api/v1/projects?category=web`**
- **`GET /api/v1/projects/:slug`**

Returns verified project showcases (RESTIFY, StockSaathi AI, Investor Management App, DSA in C++). If the slug is not found, returns `404 Not Found`:
```json
{
  "success": false,
  "error": {
    "message": "Project with slug 'unknown' was not found in verified portfolio records",
    "code": "PROJECT_NOT_FOUND"
  }
}
```

#### 5. Achievements
- **`GET /api/v1/achievements`**
- **`GET /api/v1/achievements?category=hackathon`**

Returns verified certifications and hackathon sprint milestones.

#### 6. Education & Experience
- **`GET /api/v1/education`**

Returns undergraduate B.Tech curriculum at SAGE University, Indore, alongside verified experience entries (Google Cloud Arcade Facilitator & Arcade Labs Participant).

#### 7. Coding Profiles
- **`GET /api/v1/coding-profiles`**

Returns verified public links and statistics for GitHub (`sumitknic2006-wq`) and LeetCode (`sumitknic2006`).

#### 8. Contact Form
- **`POST /api/v1/contact`**

**Request Body:**
```json
{
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "message": "I would like to discuss a full-stack developer role with you."
}
```

**Validation Rules:**
- `name`: String, 2–100 characters.
- `email`: Valid email format, max 255 characters.
- `message`: String, 10–2000 characters.
- Extra unexpected fields are rejected (strict schema).

**Phase 3 Response (503 Service Unavailable):**
```json
{
  "success": false,
  "error": {
    "message": "Contact inquiry received and validated, but persistent storage and message delivery are currently offline in Phase 3. Live transmission will be enabled upon MongoDB connection in Phase 4.",
    "code": "SERVICE_UNAVAILABLE"
  }
}
```

---

## 6. Current Limitations & Phase 4 Roadmap

### Phase 3 Scope
- Server operates completely standalone using verified development fixtures.
- Database connection to MongoDB is gracefully bypassed.
- Contact inquiries are validated client- and server-side, but rejected with an honest `503 Service Unavailable` status rather than returning a fake success message.

### Phase 4 Roadmap
- Wire Mongoose models (`Project`, `Skill`, `ContactMessage`, `Profile`) to live MongoDB Atlas cluster.
- Seed MongoDB with verified portfolio fixtures.
- Implement transactional email transport (e.g., via Resend) to dispatch contact inquiries directly to `sumitknic2006@gmail.com`.
- Full end-to-end integration between React frontend and Express backend.
