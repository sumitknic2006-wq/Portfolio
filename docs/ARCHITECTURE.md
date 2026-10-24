# Architecture & Engineering Specification

This document details the software architecture, design principles, module boundaries, data models, and deployment strategy for the portfolio of **Sumit Kumar** (B.Tech Computer Science & Engineering, SAGE University, Indore).

---

## 1. High-Level Architecture Overview

The system is architected as a decoupled, full-stack web application consisting of:
1. **Client Tier (Frontend)**: Single Page Application (SPA) built with React 19, Vite, and Tailwind CSS v4, deployed to Vercel edge networks.
2. **API Tier (Backend)**: Lightweight, modular RESTful microservice built with Node.js and Express.js (ES Modules), with centralized error handling and health probes.
3. **Data Tier (Database)**: Cloud-hosted MongoDB Atlas cluster with strict Mongoose schema enforcement and connection pooling.

```
+--------------------------------------------------------------------+
|                         CLIENT (Vercel)                            |
|  React 19 + Vite 6 + Tailwind CSS v4 + Framer Motion + Lucide      |
|  - Client-side Routing (React Router)                              |
|  - Dynamic Theme & Locale State                                    |
|  - Verified Showcase (RESTIFY, StockSaathi AI, Investor App, DSA) |
+---------------------------------+----------------------------------+
                                  |
                        HTTPS / JSON REST API
                                  |
+---------------------------------v----------------------------------+
|                    BACKEND REST SERVICE (Node/Express)             |
|  - /health (Monitoring probe)                                      |
|  - /api/v1/profile, /projects, /skills, /dsa, /achievements        |
|  - /api/v1/contact (Validation & Email Dispatch)                   |
|  - Centralized Error & 404 Handlers                                |
+---------------------------------+----------------------------------+
                                  |
                            Mongoose ODM
                                  |
+---------------------------------v----------------------------------+
|                     DATABASE (MongoDB Atlas)                       |
|  - Collections: projects, skills, achievements, messages, profile   |
+--------------------------------------------------------------------+
```

---

## 2. Frontend & Backend Responsibilities

### Frontend Responsibilities
- **Presentation & UX**: Render dark navy themed UI with cyan/blue accents and subtle glow styling.
- **Client Routing**: Fast client navigation between sections (`#about`, `#projects`, `#skills`, `#dsa`, `#achievements`, `#contact`) and dedicated detail routes (`/projects/:slug`).
- **State Management & Interactivity**: Filtering projects by category (Web, AI/ML, FinTech, DSA), theme preferences, contact form UI states, and mobile responsive menus.
- **Static Asset Serving**: Delivery of verified resume documents and architectural SVG assets via `/public/files/` and `/public/images/`.
- **Accessibility & Performance**: Semantic HTML5 markup, WCAG-compliant contrast ratios, accessible keyboard focus rings (`:focus-visible`), and respect for `prefers-reduced-motion`.

### Backend Responsibilities
- **Data Integrity & Validation**: Validate incoming payloads (contact form submissions, inquiry fields) using strict schema definitions.
- **Spam Mitigation**: Rate-limiting and sanity checking for public contact endpoints.
- **Email & Notification Dispatch**: Forwarding validated user inquiries to Sumit's verified inbox without exposing credentials to clients.
- **System Telemetry**: Expose non-blocking `/health` and `/api/v1/health` diagnostics for uptime monitors.
- **Separation of Secrets**: Protect sensitive environment variables (database credentials, SMTP/API keys) strictly on the server tier.

---

## 3. Folder & Module Responsibilities

### Root Directory
- `.gitignore`: Prevents checking in secrets, build artifacts (`dist/`), temporary logs, and `node_modules/`.
- `.env.example`: Comprehensive template for local and production environment configuration.
- `README.md`: Developer entry point with setup steps, build scripts, and architecture summary.
- `docs/`: Technical guides, architecture blueprints, and complete feature matrices.

### Frontend (`frontend/`)
```
frontend/
├── public/                     # Static files served directly (root URL)
│   ├── images/                 # Unprocessed public images / avatars
│   ├── icons/                  # Favicons and SVG markers
│   └── files/                  # Downloadable assets (e.g. resume PDF)
├── src/
│   ├── assets/                 # Bundled styles, SVG icons, fonts
│   ├── components/
│   │   ├── common/             # Reusable atomic UI (Cards, Badges, Modals)
│   │   ├── navigation/         # Header Navbar, Mobile Drawer, Footer
│   │   ├── cards/              # Project, Skill, and Achievement card components
│   │   ├── buttons/            # Action buttons and CTA variants
│   │   ├── forms/              # Validated inputs, textareas, status badges
│   │   └── feedback/           # Alert banners, loading spinners, toast messages
│   ├── layouts/                # Top-level screen structures (MainLayout)
│   ├── pages/                  # Page routes (HomePage, ProjectDetailPage, NotFoundPage)
│   ├── sections/               # Modular homepage sections (Hero, About, Skills, etc.)
│   ├── features/               # Domain-specific feature modules
│   │   ├── projects/           # Project filtering & showcase logic
│   │   ├── skills/             # Categorized skill badges and matrices
│   │   ├── achievements/       # Badges, Arcade completions, hackathons
│   │   ├── coding-profiles/    # GitHub, LeetCode profile links & stats
│   │   ├── dsa-explorer/       # C++ algorithms, dry runs, and time/space complexity
│   │   └── portfolio-assistant/# Verified knowledge assistant
│   ├── hooks/                  # Custom React hooks (useScroll, useTheme)
│   ├── context/                # Global contexts (Theme, Language, Notification)
│   ├── services/               # HTTP client integration with backend API
│   ├── data/                   # Verified static fallback data & metadata
│   ├── utils/                  # String helpers, date formatters, class merges
│   ├── styles/                 # Tailwind v4 globals and custom utilities
│   ├── App.jsx                 # Route declarations
│   └── main.jsx                # DOM mounting & React.StrictMode
├── index.html                  # HTML5 template with SEO tags & Google Fonts
├── vite.config.js              # Vite bundler configuration & plugins
└── eslint.config.js            # Linter rules enforcing modern JavaScript practices
```

### Backend (`backend/`)
```
backend/
├── src/
│   ├── config/                 # DB connectors and environment configuration
│   ├── models/                 # Mongoose schema definitions (Message, Project)
│   ├── controllers/            # Request handler functions
│   ├── routes/                 # Express route definitions
│   ├── services/               # Business services (Email delivery, stats parser)
│   ├── middleware/             # Error handler, 404 handler, rate limiter
│   ├── validators/             # Request payload validation logic
│   ├── utils/                  # Logging and response formatting utilities
│   ├── app.js                  # Express app composition
│   └── server.js               # Entry point and HTTP listener bootstrap
├── tests/                      # Automated unit and API test suites
├── package.json
└── .env.example
```

---

## 4. Planned REST API Route Groups

All resource endpoints are versioned under `/api/v1`:

| Method | Endpoint | Description | Phase Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Diagnostic server health check & DB status | Active |
| `GET` | `/api/v1/health` | Versioned health diagnostic check & telemetry | Active (Phase 3 Implemented) |
| `GET` | `/api/v1/profile` | Sumit Kumar verified profile data & academic bio | Active (Phase 3 Implemented) |
| `GET` | `/api/v1/skills` | Categorized technical skill registry (?category=) | Active (Phase 3 Implemented) |
| `GET` | `/api/v1/projects` | Full project catalog with category filtering | Active (Phase 3 Implemented) |
| `GET` | `/api/v1/projects/:slug` | Deep-dive project architecture details & 404 | Active (Phase 3 Implemented) |
| `GET` | `/api/v1/achievements` | Badges, Hackathon entries, Cloud Arcade | Active (Phase 3 Implemented) |
| `GET` | `/api/v1/education` | B.Tech CSE & Google Cloud Arcade Experience | Active (Phase 3 Implemented) |
| `GET` | `/api/v1/coding-profiles` | Verified GitHub & LeetCode links & stats | Active (Phase 3 Implemented) |
| `POST` | `/api/v1/contact` | Validated contact form submission (Zod, Rate Limiter) | Active (Phase 3 Implemented; 503 until Phase 4 DB) |
| `POST` | `/api/v1/assistant` | Grounded portfolio conversational query | Phase 5 |

---

## 5. Planned MongoDB Collections & Schemas

### 1. `contacts`
Stores inquiries sent via the portfolio contact form:
```javascript
{
  name: String (required, trim: true, minLength: 2, maxLength: 100),
  email: String (required, lowercase: true, trim: true),
  message: String (required, minLength: 10, maxLength: 2000),
  ipHash: String (for rate limiting / spam detection),
  isRead: Boolean (default: false),
  createdAt: Date (default: Date.now)
}
```

### 2. `projects`
Stores project records:
```javascript
{
  slug: String (required, unique: true, trim: true),
  title: String (required, trim: true),
  category: String (enum: ['Web', 'AI/ML', 'FinTech', 'DSA']),
  summary: String (required),
  description: String (detailed overview),
  technologies: [String],
  githubUrl: String,
  liveDemoUrl: String,
  architectureDiagramUrl: String,
  featured: Boolean (default: false),
  order: Number (default: 0)
}
```

### 3. `achievements`
Stores verified certifications, Google Cloud Arcade badges, and hackathon records:
```javascript
{
  title: String (required),
  issuer: String (e.g., 'Google Cloud', 'Hackathon Organizer'),
  badgeType: String,
  issueDate: Date,
  credentialUrl: String,
  description: String
}
```

---

## 6. Environment Variable Strategy

Secrets are strictly segregated between frontend and backend:

1. **Frontend (`frontend/.env`)**:
   - Variables MUST be prefixed with `VITE_` to be bundled by Vite.
   - Never place secret tokens or private keys here.
   - Example: `VITE_API_BASE_URL=http://localhost:5001/api/v1`

2. **Backend (`backend/.env`)**:
   - Contains server-only configurations: `PORT`, `MONGODB_URI`, `CLIENT_ORIGIN`, API keys.
   - Kept out of version control via `.gitignore`.
   - Production secrets managed via deployment platform environment dashboards (e.g. Render, Railway, or Vercel Environment Variables).

---

## 7. Development Workflow

- **Independent Execution**:
  - Run frontend dev server: `cd frontend && npm run dev` (Port 5173)
  - Run backend dev server: `cd backend && npm run dev` (Port 5001)
- **Quality Gates**:
  - Frontend linting: `npm run lint --prefix frontend`
  - Frontend build verification: `npm run build --prefix frontend`
  - Backend automated testing: `npm test --prefix backend`

---

## 8. Deployment Architecture

1. **Frontend Hosting (Vercel)**:
   - Git push to `main` triggers automated Vercel CI/CD pipeline.
   - Build command: `npm run build`
   - Output directory: `dist`
   - Client-side rewrites configured in `vercel.json` to handle React Router client routes (`/projects/*`).

2. **Backend Hosting (Node Platform - Render / Railway)**:
   - Root directory set to `backend/`.
   - Build command: `npm install`
   - Start command: `node src/server.js`
   - Health check path: `/health`

3. **Database (MongoDB Atlas)**:
   - Dedicated M0 / Serverless cloud cluster with IP Access List restricted to hosting provider CIDRs or VPC peering.
