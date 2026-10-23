# Backend — Sumit Kumar Developer Portfolio REST API

Express.js RESTful API service backed by MongoDB and Mongoose.

## Tech Stack
- **Runtime**: Node.js (v20+ recommended)
- **Framework**: Express.js (ES Modules)
- **Database ODM**: Mongoose (MongoDB Atlas / local)
- **Testing**: Node.js Native Test Runner (`node:test`) + Supertest

## Directory Layout
```
backend/
├── src/
│   ├── config/          # Database and environment configurations
│   ├── models/          # Planned Mongoose schemas
│   ├── controllers/     # Route logic controllers
│   ├── routes/          # REST endpoint routers
│   ├── services/        # Business logic & third-party integrations
│   ├── middleware/      # Error handlers, rate limiters, auth guards
│   ├── validators/      # Request schema validators
│   ├── utils/           # Helper utilities and formatters
│   ├── app.js           # Express app instance and middleware stack
│   └── server.js        # Server entry point and DB connection bootstrap
├── tests/               # Test suites
├── package.json
├── .env.example
└── README.md
```

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create local environment file:
   ```bash
   cp .env.example .env
   ```

3. Start server in development mode (with auto-reload):
   ```bash
   npm run dev
   ```

4. Start server in production mode:
   ```bash
   npm start
   ```

5. Run test suite:
   ```bash
   npm test
   ```

## Planned API Endpoints
- `GET /health` — Diagnostic health probe
- `GET /api/v1/health` — Versioned diagnostic endpoint
- `GET /api/v1/profile` — Verified profile details
- `GET /api/v1/skills` — Categorized skills
- `GET /api/v1/projects` — Project showcase & metadata
- `GET /api/v1/projects/:slug` — Single project detail
- `POST /api/v1/contact` — Contact submission endpoint with spam protection
