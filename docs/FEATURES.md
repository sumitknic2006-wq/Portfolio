# Complete Feature Checklist & Roadmap

This document catalogs every planned capability, visual standard, interactive behavior, backend requirement, and production milestone for the developer portfolio of **Sumit Kumar** (B.Tech Computer Science & Engineering, SAGE University, Indore).

---

## A. Design & Aesthetics

- [x] **Dark Navy Palette**: Deep, modern slate/navy backdrop (`#070d17` / `#0b1324`).
- [x] **Cyan and Blue Accents**: High-contrast, tailored accents (`#06b6d4`, `#3b82f6`) with subtle glowing shadows (`glow-card`).
- [x] **Reference-Inspired Portfolio Layout**: Clean layout with clear hierarchy, distinct card groupings, and focused spacing.
- [x] **Card UI & Borders**: Subtle borders (`rgba(30, 46, 79, 0.7)`), rounded corners (`rounded-xl`, `rounded-2xl`), and gentle hover elevation.
- [x] **Responsive Layouts**: Seamless adaptations across mobile (<640px), tablet (640px–1024px), and desktop (>1024px).
- [x] **Professional Typography**: Inter for clean body reading and JetBrains Mono for code blocks and metadata tags.
- [x] **Smooth Scrolling**: Native smooth scroll behavior across sections with anchor navigation.
- [x] **Accessibility (a11y)**:
  - Accessible contrast ratios meeting WCAG AA standards.
  - Visible focus indicator rings (`:focus-visible`).
  - Reduced-motion queries (`prefers-reduced-motion`) to respect user motion preferences.

---

## B. Main Content & Portfolio Sections

- [x] **Hero Section**:
  - Name: Sumit Kumar
  - Headline: Aspiring Software Engineer & Full-Stack Developer
  - University: 2nd-Year B.Tech CSE, SAGE University, Indore
  - Social and professional links: GitHub, LinkedIn, Email
  - Action CTAs: "Explore Projects" & "Get in Touch"
- [x] **About Me**:
  - Academic background at SAGE University
  - Technical engineering foundation and core interests
- [x] **Categorized Technical Skills**:
  - Frontend: React, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Vite
  - Backend: Node.js, Express.js, REST APIs, Middleware
  - Database: MongoDB, Mongoose ODM, MongoDB Atlas
  - Core CS: C++, Data Structures & Algorithms, OOP, Git/GitHub
- [x] **Featured Projects Showcase**:
  - **RESTIFY**: API workflow and testing tool
  - **StockSaathi AI**: Financial analytics and market surveillance companion
  - **Investor Management App**: Full-stack capital management and investor tracking platform
  - **DSA Practice Suite**: Algorithmic problem solver in C++
- [x] **Reusable Project Detail Pages**:
  - Dynamic routing via `/projects/:slug`
  - Overview, key architectural features, technology stack tags, GitHub repository and demo links
- [x] **Achievements & Certifications**:
  - Google Cloud Arcade facilitator program badges
  - University hackathon participation and rapid prototyping
- [x] **DSA & Coding Profiles**:
  - Algorithmic approaches in C++ (Two pointers, Sliding Window, Monotonic Stack, Trees)
  - Links to LeetCode and GitHub profiles
- [x] **Education**:
  - SAGE University, Indore — B.Tech Computer Science (2nd Year, Ongoing)
  - Key coursework: DBMS, OS, OOP, DSA, Web Architectures
- [x] **Contact & Resume**:
  - Verified contact details & professional email
  - Working download for resume document (`/files/README.md` or PDF)
- [x] **Footer**:
  - Copyright, university credential credit, social navigation links

---

## C. Interactive Features

- [x] **Responsive Mobile Navigation**: Collapsible drawer menu with hamburger toggle.
- [ ] **Dynamic Project Filters** *(Phase 2)*: Filter projects by tag (Web, AI/ML, FinTech, DSA).
- [ ] **Dark / Light Theme Switch** *(Phase 3)*: Persistent theme preference in localStorage.
- [ ] **Hindi / English Language Switch** *(Phase 3)*: Localized strings for bilingual accessibility.
- [ ] **Framer Motion Reveal Effects** *(Phase 2)*: Micro-interactions and viewport scroll animations.
- [ ] **Live Coding Statistics** *(Phase 3)*: Display live LeetCode/GitHub stats when official APIs are reachable.
- [ ] **Interactive DSA Explanations** *(Phase 3)*: Step-by-step logic viewer and visual complexity badges.
- [ ] **AI Portfolio Assistant** *(Phase 4)*: Conversational assistant answering questions grounded solely in verified portfolio data.
- [ ] **Contact Form Validation & Real Email Delivery** *(Phase 3)*: Server-side email delivery via Resend/Nodemailer.
- [x] **PDF Resume Download**: Direct asset access from public distribution folder.
- [x] **SEO Metadata & OpenGraph**: Complete metadata tags, social sharing cards, and search engine directives in `index.html`.

---

## D. Backend & Data Management

- [x] **Express.js REST API**: Versioned route hierarchy mounted at `/api/v1`.
- [x] **Health Check Endpoints**: Diagnostic probes at `/health` and `/api/v1/health`.
- [x] **Mongoose ODM Integration**: Resilient connection manager with local development offline tolerance.
- [x] **Centralized Error Handling**: Structured JSON error formatting and catch-all 404 handlers.
- [ ] **Contact Submission Persistence** *(Phase 3)*: MongoDB collection with spam filtering and IP hashing.
- [ ] **Validated Profile Endpoints** *(Phase 2)*: REST endpoints serving verified portfolio information.
- [x] **Strict Secret Segregation**: Dedicated `.env.example` templates and `.gitignore` guardrails.

---

## E. Production, Testing & Deployment

- [x] **Separate Dependencies**: Independent `package.json` for frontend and backend without monorepo overhead.
- [x] **Automated Testing Suite**: Backend health tests implemented using Node's native test runner (`node:test`) and Supertest.
- [x] **Linting Configuration**: Modern ESLint flat config for React JavaScript code.
- [x] **Production Bundle Validation**: Tested Vite production build generating clean optimized distribution chunks.
- [ ] **GitHub Repository Setup**: Remote repository setup with initial branch protection.
- [ ] **Vercel Frontend Deployment**: Automated CI/CD deployment with SPA route rewriting.
- [ ] **Cloud Backend Deployment**: Hosted on Node platform (Render/Railway) connected to MongoDB Atlas.
- [ ] **End-to-End Verification**: Complete verification of live forms, endpoints, and asset downloads.
