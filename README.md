# Sumit Kumar — Full-Stack Developer Portfolio

A developer portfolio and showcase for **Sumit Kumar**, second-year B.Tech Computer Science & Engineering student at **SAGE University, Indore**.

This repository contains a full-stack web application designed with a dark navy aesthetic, cyan and blue glow accents, and responsive modular architecture.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (JavaScript / JSX)
- **Tooling & Bundler**: Vite 6
- **Styling**: Tailwind CSS v4 (with custom `@theme` tokens)
- **Icons**: Lucide React
- **Motion & Transitions**: Framer Motion
- **Routing**: React Router v7
- **API Client**: Service layer with timeout control, normalized error mapping, and loading/error states

### Backend
- **Runtime**: Node.js (v20+)
- **Framework**: Express.js (ES Modules)
- **Database**: MongoDB with Mongoose ODM (MongoDB Atlas in production)
- **Testing**: Node.js Native Test Runner (`node:test`) + Supertest
- **Integration**: Full-stack REST integration across all portfolio sections and contact persistence

---

## 📂 Project Structure

```
sumit-portfolio/
├── frontend/                   # Client application (React + Vite + Tailwind v4)
│   ├── public/                 # Static public files & assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── files/
│   │       └── README.md       # Downloadable resume guidelines
│   ├── src/
│   │   ├── assets/             # Bundled static media & styling
│   │   ├── components/         # Reusable atomic & layout components
│   │   │   ├── common/
│   │   │   ├── navigation/
│   │   │   ├── cards/
│   │   │   ├── buttons/
│   │   │   ├── forms/
│   │   │   └── feedback/
│   │   ├── layouts/            # Page shell layouts (MainLayout)
│   │   ├── pages/              # Primary routes (Home, ProjectDetail, NotFound)
│   │   ├── sections/           # Homepage sections (Hero, About, Skills, etc.)
│   │   ├── features/           # Domain feature modules (projects, dsa, etc.)
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   ├── data/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.jsx             # Client routing definitions
│   │   └── main.jsx            # React root bootstrap
│   ├── index.html              # HTML5 template with SEO metadata
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── README.md
├── backend/                    # REST API server (Node.js + Express)
│   ├── src/
│   │   ├── config/             # DB & server configurations
│   │   ├── models/             # Mongoose schemas
│   │   ├── controllers/        # Request handlers & controllers
│   │   ├── routes/             # Versioned API routes (/api/v1)
│   │   ├── services/           # Business logic & email dispatch
│   │   ├── middleware/         # Error handlers & security middleware
│   │   ├── validators/         # Input validation schemas
│   │   ├── utils/              # Utility helpers
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Server bootstrap & lifecycle listeners
│   ├── tests/                  # Automated API tests
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── docs/                       # Architectural documentation
│   ├── ARCHITECTURE.md         # Full-stack architectural specification
│   └── FEATURES.md             # Complete feature roadmap & checklist
├── .gitignore                  # Git exclusions for dependencies, builds, & secrets
├── .env.example                # Root environment variable template
└── README.md                   # This project overview document
```

---

## 📋 Prerequisites

- **Node.js**: `v20.x` or later (tested on Node v24)
- **npm**: `v10.x` or later (tested on npm v11)
- **Git**: Installed and configured

---

## 🚀 Installation & Local Development

The frontend and backend operate independently with separate dependencies. No monorepo complexity is needed.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/sumit-portfolio.git
cd sumit-portfolio
```

### 2. Configure Environment Variables
Copy example files to `.env` in both folders:

```bash
# Frontend environment
cp frontend/.env.example frontend/.env

# Backend environment
cp backend/.env.example backend/.env
```

### 3. Frontend Setup & Run
In a dedicated terminal:
```bash
cd frontend
npm install
npm run dev
```
The client will be live at: **`http://localhost:5173`**

### 4. Backend Setup & Run
In a separate terminal:
```bash
cd backend
npm install
npm run dev
```
The API server will be live at: **`http://localhost:5001`**
Health check endpoint: **`http://localhost:5001/health`**
AI Assistant status: **`http://localhost:5001/api/v1/assistant/status`**
AI Assistant chat: **`POST http://localhost:5001/api/v1/assistant/chat`**

To activate live Google Gemini responses for the AI Portfolio Assistant:
1. Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Set `AI_API_KEY=your_key` in `backend/.env`.
3. Restart backend. Without an API key, the assistant transparently informs visitors and uses verified local portfolio knowledge fallback.

---

## 🧪 Testing & Verification Commands

### Frontend Verification
```bash
# Run linting
cd frontend && npm run lint

# Run production build
cd frontend && npm run build

# Preview production build locally
cd frontend && npm run preview
```

### Backend Verification & Seeding
```bash
# Run automated backend test suite (isolated in-memory MongoDB)
cd backend && npm test

# Validate seed data dry-run
cd backend && npm run seed:dry

# Populate database with verified portfolio records
cd backend && npm run seed
```

---

## 🚢 Planned Deployment Process

### Frontend Deployment (Vercel)
1. Link repository to Vercel.
2. Set Root Directory to `frontend`.
3. Framework Preset: **Vite**.
4. Configure Build Command: `npm run build` and Output Directory: `dist`.
5. Set environment variable in Vercel Dashboard: `VITE_API_BASE_URL` pointing to the deployed backend URL (e.g., `https://sumit-portfolio-api.onrender.com/api/v1`).
6. SPA route rewrites are pre-configured in `frontend/vercel.json`.

### Backend Deployment (Render / Railway / Cloud Host)
1. Deploy `backend` to a Node-compatible host (e.g. Render, Railway, or VPS).
2. Configure environment variables in the host dashboard:
   - `NODE_ENV=production`
   - `PORT=5001` (or host-assigned port)
   - `CLIENT_ORIGIN=https://<your-vercel-domain>.vercel.app`
   - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/sumit_portfolio?retryWrites=true&w=majority`
   - `JWT_SECRET=<strong_random_secret_at_least_32_chars>`
   - `JWT_EXPIRES_IN=7d`
   - `ADMIN_EMAIL=sumitknic2006@gmail.com`
   - `ADMIN_DEFAULT_PASSWORD=<strong_admin_password>`
   - `APP_URL=https://<your-vercel-domain>.vercel.app`
   - `RESEND_API_KEY=<your_resend_api_key>` (Optional for transactional notifications)
   - `EMAIL_FROM=Portfolio Contact <notifications@yourdomain.com>`
   - `CONTACT_RECEIVER_EMAIL=sumitknic2006@gmail.com`
   - `AI_PROVIDER=gemini`
   - `AI_API_KEY=<your_gemini_api_key>`
   - `AI_MODEL=gemini-3.5-flash-lite`
   - `AI_TIMEOUT_MS=60000`
3. Configure Health Check path to `/health`.
4. Run `npm run seed` once to verify database collection documents if empty.
5. Run `npm run admin:setup` to seed or initialize your superadmin account securely.

---

## 🔒 Phase 9 — Secure Admin Dashboard & Instant Notifications

- **Admin Login Route**: `/admin/login` (Protected dashboard at `/admin/dashboard`).
- **Server-Side Authentication**: Session-based HttpOnly JWT cookies + Bearer token support.
- **Brute-Force Protection**: Dedicated rate limiter (`adminAuthLimiter`) on login attempts.
- **Initial Setup CLI**: `npm run admin:setup` creates/updates the admin credentials securely via terminal; no public registration endpoint exists.
- **Dashboard Overview**: Aggregated counts directly from MongoDB (`total`, `unread`, `pending`, `replied`, `archived`).
- **Contact Inbox**: Complete inbox supporting search, status filtering, read/unread toggling, full message modal, and deletion confirmation dialog.
- **Instant Email Notifications**: Resend integration sends formatted notifications to the configured admin inbox with visitor `Reply-To`.
- **Fault Resilience**: Database write is confirmed and preserved first; email dispatch failures never lose contact submissions.
- **Reply Workflow**: Supports one-click native email client reply (`mailto:`) and in-app authenticated Resend dispatch.

---

## 🔒 Security & Performance Audit (Phase 8)

- **Dependencies**: 0 vulnerabilities found via `npm audit` across both frontend and backend.
- **Rollup Chunking**: Optimized manual chunking in `vite.config.js` (`vendor-react`, `vendor-motion`, `vendor-icons`), keeping all chunks under 400kB.
- **Security Headers**: Helmet enabled on all HTTP responses with cross-origin resource policies.
- **CORS Protection**: Origin-checked middleware enforcing strict domain whitelisting.
- **Input Validation**: Strict Zod schemas on all inbound payloads with mass-assignment protection.
- **SEO & Metadata**: Search engine discovery with `robots.txt`, `sitemap.xml`, OpenGraph tags, and Twitter summary cards.
- **Telemetry Protection**: Internal IP addresses and user agents stored with `select: false` in Mongoose.

---

## 👤 Author & Truthful Portfolio Profile

- **Author**: Sumit Kumar
- **Academic Standing**: 2nd Year B.Tech Computer Science & Engineering, SAGE University, Indore
- **Core Focus**: Full-Stack Web Development (MERN), Data Structures & Algorithms in C++
- **Featured Projects**: RESTIFY, StockSaathi AI, Investor Management App, DSA Practice Suite
- **Achievements**: Google Cloud Arcade Badges, University Hackathon Participant
