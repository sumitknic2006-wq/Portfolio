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

### Backend
- **Runtime**: Node.js (v20+)
- **Framework**: Express.js (ES Modules)
- **Database**: MongoDB with Mongoose ODM (MongoDB Atlas in production)
- **Testing**: Node.js Native Test Runner (`node:test`) + Supertest

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

### Backend Verification
```bash
# Run health check & API test suite
cd backend && npm test
```

---

## 🚢 Planned Deployment Process

### Frontend Deployment (Vercel)
1. Link repository to Vercel.
2. Set Root Directory to `frontend`.
3. Framework Preset: **Vite**.
4. Configure Build Command: `npm run build` and Output Directory: `dist`.
5. Set environment variable: `VITE_API_BASE_URL` pointing to the deployed backend URL.

### Backend Deployment (Node Platform)
1. Deploy `backend` to a Node-compatible host (e.g. Render, Railway, or VPS).
2. Configure environment variables in the host dashboard:
   - `NODE_ENV=production`
   - `PORT=5001` (or host-provided port)
   - `CLIENT_ORIGIN=https://<your-vercel-domain>.vercel.app`
   - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/sumit_portfolio`
3. Configure Health Check path to `/health`.

---

## 👤 Author & Truthful Portfolio Profile

- **Author**: Sumit Kumar
- **Academic Standing**: 2nd Year B.Tech Computer Science & Engineering, SAGE University, Indore
- **Core Focus**: Full-Stack Web Development (MERN), Data Structures & Algorithms in C++
- **Featured Projects**: RESTIFY, StockSaathi AI, Investor Management App, DSA Practice Suite
- **Achievements**: Google Cloud Arcade Badges, University Hackathon Participant
