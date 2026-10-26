# Frontend — Sumit Kumar Developer Portfolio

The client application for Sumit Kumar's full-stack developer portfolio, engineered with **React 19**, **Vite 6**, **Tailwind CSS v4**, and connected to the Express & MongoDB Atlas backend REST API.

---

## 1. Tech Stack

- **Framework**: React 19 (JavaScript ES modules & JSX, no TypeScript)
- **Bundler & Tooling**: Vite 6
- **Styling**: Tailwind CSS v4 with curated dark navy palette (`#070d17` / `#0b1324`) and cyan/blue glow accents
- **API Client**: Native `fetch` with `AbortController` timeouts, normalized error formatting, and domain service abstractions
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Client Routing**: React Router v7 (`/` and `/projects/:slug`)
- **State Management**: React Context (`ProfileContext`, `ThemeContext`, `LanguageContext`)

---

## 2. Directory Layout

```
frontend/
├── public/
│   ├── images/                        # Architecture SVGs and profile images
│   ├── icons/                         # Favicons and SVG markers
│   └── files/                         # Downloadable resume assets
├── src/
│   ├── components/
│   │   ├── common/                    # SectionHeading, SocialLinks, ThemeToggle, BackToTop
│   │   ├── navigation/                # Navbar, Mobile Menu, Footer
│   │   ├── cards/                     # ProjectCard, SkillCard, AchievementCard, DsaProblemCard
│   │   ├── buttons/                   # Action buttons and CTA variants
│   │   ├── forms/                     # ContactForm with client & server validation
│   │   └── feedback/                  # SectionSkeleton, ProjectDetailSkeleton, ErrorState, EmptyState
│   ├── layouts/                       # MainLayout, Sidebar
│   ├── pages/                         # HomePage, ProjectDetailPage, NotFoundPage
│   ├── sections/                      # HeroSection, AboutSection, SkillsSection, ProjectsSection,
│   │                                  # AchievementsSection, DsaSection, EducationSection, ContactSection
│   ├── services/                      # Central API Client & Domain Services
│   │   ├── apiClient.js               # Core HTTP client with timeout & error normalization
│   │   ├── profile.service.js         # GET /api/v1/profile
│   │   ├── skills.service.js          # GET /api/v1/skills(?category=)
│   │   ├── projects.service.js        # GET /api/v1/projects & /api/v1/projects/:slug
│   │   ├── achievements.service.js    # GET /api/v1/achievements(?category=)
│   │   ├── education.service.js       # GET /api/v1/education
│   │   ├── codingProfiles.service.js  # GET /api/v1/coding-profiles
│   │   ├── contact.service.js         # POST /api/v1/contact
│   │   └── index.js                   # Unified barrel export
│   ├── context/                       # ProfileContext, ThemeContext, LanguageContext
│   ├── data/                          # Verified static fallback data & i18n translations
│   ├── styles/                        # Tailwind v4 theme tokens
│   ├── App.jsx                        # Route declarations
│   └── main.jsx                       # React DOM mount with all Context Providers
├── .env.example                       # Documented environment template
├── package.json
└── vite.config.js
```

---

## 3. Environment Configuration

Copy the template to your local `.env`:

```bash
cp .env.example .env
```

### Configuration Keys

| Variable | Local Default | Production Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:5001/api/v1` | Public URL of deployed backend REST service |
| `VITE_APP_NAME` | `Sumit Kumar \| Developer Portfolio` | Public document title |
| `VITE_APP_ENV` | `development` | Client runtime environment indicator |

> **Security Guardrail**: Never expose database connection strings (`MONGODB_URI`) or backend API secrets in `frontend/.env`. Frontend variables are public and bundled into the client build.

---

## 4. API Integration Details

All portfolio components query the backend via `/api/v1` services:

- **Hero & About**: `ProfileContext` calls `profileService.getProfile()` to populate title, headline, degree, contact points, and verified social links.
- **Skills Section**: Calls `skillsService.getSkills()`. Shows `SectionSkeleton` during loading, `ErrorState` with retry on failure, and renders categorized skills.
- **Projects Section & Filters**: Calls `projectsService.getProjects(activeFilter)` to support reactive filtering across `All`, `Web Development`, `AI/ML`, `FinTech`, and `DSA`.
- **Project Detail Page (`/projects/:slug`)**: Calls `projectsService.getProjectBySlug(slug)`. Features loading skeleton, 404 not-found screen, error recovery, and optional field safeguards.
- **Achievements Section**: Calls `achievementsService.getAchievements(activeFilter)` for hackathons and Google Cloud Arcade badges.
- **Education & Experience**: Calls `educationService.getEducation()` to render university milestones alongside professional roles.
- **Coding Profiles**: Calls `codingProfilesService.getCodingProfiles()` to render verified GitHub and LeetCode hubs.
- **Contact Form**: Transmits validated inquiries to `POST /api/v1/contact`. Confirms database persistence (`201 Created`), disables duplicate clicks, prevents mass assignment, and never logs message content in the browser console.

---

## 5. Verification Commands

```bash
# 1. Start development server (Port 5173)
npm run dev

# 2. Run ESLint code quality checks
npm run lint

# 3. Compile optimized production build
npm run build

# 4. Preview compiled production distribution
npm run preview
```
