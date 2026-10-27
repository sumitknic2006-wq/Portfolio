import { env } from '../config/env.js';
import { getDbStatus } from '../config/db.js';
import { projectRepository } from '../repositories/project.repository.js';
import { skillRepository } from '../repositories/skill.repository.js';
import { achievementRepository } from '../repositories/achievement.repository.js';
import { educationRepository } from '../repositories/education.repository.js';
import { experienceRepository } from '../repositories/experience.repository.js';
import { codingProfileRepository } from '../repositories/codingProfile.repository.js';
import { profileRepository } from '../repositories/profile.repository.js';

/**
 * Custom Error for Database Availability Constraints
 */
export class DatabaseUnavailableError extends Error {
  constructor(message = 'Database service unavailable') {
    super(message);
    this.name = 'DatabaseUnavailableError';
    this.statusCode = 503;
    this.code = 'DATABASE_UNAVAILABLE';
    this.isOperational = true;
  }
}

// -----------------------------------------------------------------------------
// Verified In-Memory Fixtures (Allowed ONLY in explicit development mode)
// -----------------------------------------------------------------------------
export const devFixtures = {
  profile: {
    name: 'Sumit Kumar',
    role: 'Full-Stack Developer & Data Science Engineer',
    headline: 'Data Science Engineer | Full-Stack Developer | DSA in C++',
    avatar: '/images/sumit.png',
    avatarFallback: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    university: 'SAGE University, Indore',
    institute: 'ALTA School of Technology',
    degree: 'Bachelor of Technology (B.Tech) in Computer Science & Technology',
    duration: '2025 – 2029',
    currentYear: '2nd Year (Ongoing)',
    email: 'sumitknic2006@gmail.com',
    phone: '+91 92419 59612',
    location: 'Indore, Madhya Pradesh / Nawada, Bihar',
    resumeUrl: '/files/Sumit_Kumar_Resume.pdf',
    socials: {
      github: 'https://github.com/sumitknic2006-wq',
      linkedin: 'https://www.linkedin.com/in/sumit-kumar-45a154387/',
      twitter: 'https://x.com/Sumitkumar95862',
      leetcode: 'https://leetcode.com/u/25001122/',
      codeforces: 'https://codeforces.com/profile/sumitknic567',
    },
    careerObjective:
      'Computer Science undergraduate passionate about building modern full-stack web applications using React, Node.js, Express.js, and MongoDB, while strengthening problem-solving skills through DSA in C++. Exploring Data Science, AI/ML, and modern cloud technologies to build intelligent, data-driven solutions.',
  },

  skills: [
    {
      category: 'Programming',
      categoryKey: 'programming',
      description: 'Core languages utilized for algorithmic problem solving and system development.',
      skills: [
        { name: 'C++', focus: 'Primary DSA language, STL, Memory Management', level: 'Core DSA' },
        { name: 'JavaScript', focus: 'ES6+, Asynchronous Programming, DOM APIs', level: 'Full-Stack' },
        { name: 'Python', focus: 'Scripting, Foundations, Data Structures', level: 'Academic' },
        { name: 'Java', focus: 'OOP Fundamentals, Syntax, Coursework', level: 'Academic' },
      ],
      displayOrder: 1,
    },
    {
      category: 'Frontend Development',
      categoryKey: 'frontend',
      description: 'Modern component-driven web user interfaces and responsive architectures.',
      skills: [
        { name: 'React', focus: 'Hooks, Component Architecture, State Management', level: 'Advanced' },
        { name: 'Tailwind CSS', focus: 'Utility-first styling, CSS Variables, Responsive design', level: 'Advanced' },
        { name: 'HTML5 & CSS3', focus: 'Semantic markup, Flexbox, CSS Grid, Media Queries', level: 'Foundation' },
        { name: 'Vite', focus: 'Fast modern bundler, ESM plugin workflows', level: 'Tooling' },
      ],
      displayOrder: 2,
    },
    {
      category: 'Backend & APIs',
      categoryKey: 'backend',
      description: 'Server architectures, middleware design, and RESTful web service endpoints.',
      skills: [
        { name: 'Node.js', focus: 'Server-side runtime, Event-driven architecture, NPM', level: 'Active' },
        { name: 'Express.js', focus: 'REST API routing, Middleware chains, Error handling', level: 'Active' },
        { name: 'REST APIs', focus: 'HTTP verbs, Status codes, JSON payloads, Pagination', level: 'Design' },
      ],
      displayOrder: 3,
    },
    {
      category: 'Databases & Storage',
      categoryKey: 'database',
      description: 'Document and relational data models for persistent web applications.',
      skills: [
        { name: 'MongoDB', focus: 'NoSQL document schemas, Aggregation pipelines', level: 'Active' },
        { name: 'Mongoose ODM', focus: 'Schema validation, Models, Middleware hooks', level: 'Active' },
        { name: 'SQL', focus: 'Relational queries, Joins, Table normalization', level: 'Coursework' },
      ],
      displayOrder: 4,
    },
    {
      category: 'Tools & DevOps',
      categoryKey: 'tools',
      description: 'Developer environments, version control, and cloud platforms.',
      skills: [
        { name: 'Git & GitHub', focus: 'Branching, Commit discipline, Pull requests', level: 'Daily' },
        { name: 'VS Code', focus: 'Extensions, Debugging, Workspace configs', level: 'Primary IDE' },
        { name: 'Postman / REST Tools', focus: 'API endpoint testing, Collections, Environment variables', level: 'Workflow' },
        { name: 'Vercel / Render', focus: 'Frontend Edge and Node.js deployment pipelines', level: 'Deploy' },
      ],
      displayOrder: 5,
    },
    {
      category: 'Core CS Concepts',
      categoryKey: 'coreConcepts',
      description: 'Theoretical and structural foundations of computer science & engineering.',
      skills: [
        { name: 'Data Structures & Algorithms', focus: 'Arrays, Trees, Graphs, Sorting, Dynamic logic', level: 'Core Focus' },
        { name: 'Object-Oriented Programming', focus: 'Encapsulation, Inheritance, Polymorphism', level: 'Core Concept' },
        { name: 'Operating Systems', focus: 'Process Scheduling, Memory Management, Concurrency', level: 'Academic' },
        { name: 'Database Management Systems', focus: 'ACID properties, Normalization, Indexing', level: 'Academic' },
      ],
      displayOrder: 6,
    },
  ],

  projects: [
    {
      slug: 'restify',
      title: 'RESTIFY',
      subtitle: 'Digital Wellbeing & Smart Screen-Time Control Platform',
      category: 'Web Development',
      categoryTag: 'web',
      isVerified: true,
      thumbnail: '/images/restify-architecture.svg',
      summary:
        'Digital wellbeing and screen-time telemetry application offering automated session tracking, productivity analytics, and customizable web focus timers.',
      description:
        'RESTIFY empowers users to reclaim digital focus and optimize screen-time usage through intelligent telemetry and focus session controls. It provides a real-time responsive dashboard, session history analytics, and secure RESTful synchronization across client and server.',
      problem:
        'Modern digital distraction and unmonitored screen hours drastically diminish developer focus and productivity. Existing commercial blockers are often intrusive or lack detailed personal developer analytics.',
      solution:
        'A full-stack, non-intrusive wellbeing companion built with React, Vite, Node.js, and Express, enabling customizable focus intervals, activity tracking, and dashboard telemetry metrics.',
      technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Vercel', 'Render'],
      features: [
        'Interactive digital wellbeing dashboard with real-time focus timers',
        'Screen-time telemetry charts and historical trend visualizations',
        'RESTful API architecture hosted on Render with CORS and rate protection',
        'Client SPA deployed on Vercel Edge networks for low latency',
        'Session storage and customizable alert triggers',
      ],
      contribution:
        'Designed end-to-end full-stack architecture, developed the React dashboard with modular UI components, implemented Express REST endpoints, and deployed production pipelines on Vercel and Render.',
      architecture:
        'Client SPA built on React and Vite communicates via JSON over HTTPS to the Express REST API hosted on Render. State and telemetry are processed through centralized controllers with Mongoose models.',
      challenges:
        'Maintaining low-latency telemetry synchronization across distributed client tabs without excessive server polling; solved through client-side state buffers and efficient batch updates.',
      liveDemo: 'https://restify-6no6.vercel.app/dashboard',
      backendUrl: 'https://restify-p6wb.onrender.com/',
      github: 'https://github.com/sumitknic2006-wq',
      statusBadge: 'Live Verified Deployment',
      displayOrder: 1,
    },
    {
      slug: 'stocksaathi-ai',
      title: 'StockSaathi AI',
      subtitle: 'AI-Powered Dead Stock Recovery for Small Retailers',
      category: 'AI/ML',
      categoryTag: 'ai',
      isVerified: false,
      thumbnail: '/images/stocksaathi-architecture.svg',
      summary:
        'Intelligent inventory intelligence system designed to detect dead stock, forecast clearance windows, and generate automated promotional discount strategies.',
      description:
        'StockSaathi AI addresses the chronic capital lockup faced by local micro-retailers in India due to stagnant inventory. By analyzing historical sales velocity and seasonal trends, the platform recommends dynamic markdown schedules and bundled promotional strategies.',
      problem:
        'Small and medium retail shops frequently suffer substantial cash flow losses due to capital trapped in unsold items and seasonal dead stock without access to expensive enterprise ERP tools.',
      solution:
        'A lightweight web companion featuring predictive inventory velocity flags, AI-generated local language clearance copy, and actionable discount thresholds.',
      technologies: ['React', 'Tailwind CSS', 'Node.js', 'Express.js', 'Predictive Analytics'],
      features: [
        'Dead stock risk scoring based on sales velocity and days-on-shelf metrics',
        'Interactive markdown simulator evaluating profit margin tradeoffs',
        'Automated promotional messaging copy generator for local customer outreach',
        'Responsive inventory management dashboard with categorization tags',
      ],
      contribution:
        'Formulated domain problem statement, authored component architecture, designed user journey for non-technical shop owners, and built the frontend prototype.',
      architecture:
        'Modular client interface interfacing with predictive scoring service and Express middleware pipeline.',
      challenges:
        'Creating an interface intuitive enough for traditional shopkeepers without requiring complex inventory accounting knowledge.',
      liveDemo: '#',
      backendUrl: '',
      github: 'https://github.com/sumitknic2006-wq',
      statusBadge: 'Prototype / In Progress',
      displayOrder: 2,
    },
    {
      slug: 'investor-management-app',
      title: 'Investor Management App',
      subtitle: 'Investment Tracking & Portfolio Capital Analytics',
      category: 'FinTech',
      categoryTag: 'web',
      isVerified: false,
      thumbnail: '/images/investor-architecture.svg',
      summary:
        'Full-stack management portal for tracking investor relationships, capital allocations, portfolio valuation logs, and shareholder correspondence.',
      description:
        'A structured enterprise-grade portal developed with the MERN stack to maintain investor directories, record round allocations, calculate ownership dilution estimates, and archive meeting memorandums.',
      problem:
        'Early-stage founders and investment groups manage critical financial relations across fragmented spreadsheets, risking calculation oversights and broken audit trails.',
      solution:
        'A centralized database-backed administrative portal with strict schema validation, structured transaction logging, and intuitive investor profile cards.',
      technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose ODM', 'Tailwind CSS'],
      features: [
        'Directory of investor contacts, categorized by angel, VC, and institutional tiers',
        'Capital investment ledger tracking tranche release dates and ownership shares',
        'Schema-validated RESTful CRUD endpoints with Mongoose middleware',
        'Dilution and ownership summary cards with visual share metrics',
      ],
      contribution:
        'Engineered Mongoose data schemas, designed RESTful API controllers, and built the administrative dashboard views with reusable table and card components.',
      architecture:
        'Express REST API handles authenticated transactions and performs schema verification with Mongoose before writing to MongoDB. React frontend provides reactive state views.',
      challenges:
        'Implementing strict decimal precision for shareholding allocations without floating-point rounding anomalies.',
      liveDemo: '#',
      backendUrl: '',
      github: 'https://github.com/sumitknic2006-wq',
      statusBadge: 'Development Prototype',
      displayOrder: 3,
    },
    {
      slug: 'dsa-in-cpp',
      title: 'DSA in C++ Practice Suite',
      subtitle: 'Algorithmic Solutions & Complexity Analysis Suite',
      category: 'DSA',
      categoryTag: 'dsa',
      isVerified: true,
      thumbnail: '/images/dsa-architecture.svg',
      summary:
        'Curated C++ algorithmic repository focusing on standard problem-solving patterns, step-by-step dry runs, and optimal asymptotic time/space complexity.',
      description:
        'A systematic problem-solving suite documenting C++ implementations for core algorithmic paradigms encountered on LeetCode and competitive programming platforms, complete with edge case analysis and invariant proofs.',
      problem:
        'Algorithmic learning often lacks clear documentation of dry-runs and time/space tradeoff rationales between naive and optimal solutions.',
      solution:
        'A structured collection classifying problems by algorithmic patterns (Two Pointers, Sliding Window, Monotonic Stack, BST) with thorough commentary and asymptotic benchmarking.',
      technologies: ['C++', 'STL', 'Algorithms', 'Data Structures', 'LeetCode'],
      features: [
        'Comprehensive pattern implementations in modern standard C++',
        'Step-by-step dry-run traces documenting pointer evolutions',
        'Formal Big-O time and space complexity evaluations',
        'Edge case validation suites for null pointers, duplicate values, and bounds',
      ],
      contribution:
        'Authoring clean C++ solutions utilizing optimal STL containers, documenting logic dry-runs, and maintaining code structure on GitHub.',
      architecture:
        'Structured C++ code modules categorized by algorithmic category with companion markdown specifications.',
      challenges:
        'Refining iterative solutions for complex tree traversals to achieve O(1) auxiliary space beyond recursion stacks.',
      liveDemo: '#dsa',
      backendUrl: '',
      github: 'https://github.com/sumitknic2006-wq',
      statusBadge: 'Active Daily Practice',
      displayOrder: 4,
    },
  ],

  achievements: [
    {
      id: 'gcp-arcade',
      title: 'Google Cloud Arcade Program',
      issuer: 'Google Cloud Skills Boost',
      category: 'Certifications',
      categoryTag: 'certifications',
      date: '2026',
      badgeType: 'Facilitator & Skill Badges',
      description:
        'Earned hands-on skill badges covering Google Cloud fundamentals, Cloud Storage lifecycle configurations, IAM access policies, and serverless compute deployments on Google Cloud Platform.',
      details: [
        'Completed interactive labs in Cloud IAM, Compute Engine, and Cloud Storage buckets',
        'Configured secure access rules and analyzed cloud billing allocation telemetry',
        'Practiced disaster recovery and snapshot backup strategies',
      ],
      credentialUrl: 'https://www.cloudskillsboost.google',
      status: 'Verified Program Participant',
      displayOrder: 1,
    },
    {
      id: 'udbhav-hackathon',
      title: 'Udbhav AI Sprint Hackathon',
      issuer: 'University Hackathon Organization',
      category: 'Hackathons',
      categoryTag: 'hackathon',
      date: '2026',
      badgeType: 'Team Collaborator',
      description:
        'Participated in a multi-disciplinary AI sprint focused on rapid ideation and prototype development for practical automated solutions. Collaborated with peers on architecture design and frontend workflows.',
      details: [
        'Collaborated on rapid MVP wireframing and user experience mockups',
        'Integrated AI prompt APIs with React component interfaces',
        'Presented solution architecture in front of student technical review panel',
      ],
      credentialUrl: '',
      status: 'Participant',
      displayOrder: 2,
    },
    {
      id: 'squid-hackathon',
      title: 'Squid Hackathon Competition',
      issuer: 'Technical Student Community',
      category: 'Hackathons',
      categoryTag: 'hackathon',
      date: '2026',
      badgeType: 'Sprint Developer',
      description:
        'Engaged in intense 24-hour sprint challenge constructing responsive web tools under strict time and resource constraints. Implemented agile version control and modular CSS layout practices.',
      details: [
        'Engineered rapid web components using modern CSS Flexbox and Grid',
        'Managed continuous Git branches and conflict resolutions under sprint timelines',
        'Applied responsive UI patterns for cross-device compatibility',
      ],
      credentialUrl: '',
      status: 'Participant',
      displayOrder: 3,
    },
    {
      id: 'web-dev-workshop',
      title: 'Full-Stack Web Development Workshop',
      issuer: 'MERN Stack Developer Track',
      category: 'Learning Achievements',
      categoryTag: 'learning',
      date: '2026',
      badgeType: 'Certification of Completion',
      description:
        'Intensive immersion in full-stack architecture covering React component state lifecycles, Express routing, MongoDB document stores, and REST API testing standards.',
      details: [
        'Built and integrated REST endpoints connecting frontend state to Express controllers',
        'Implemented user registration flows with input validation sanitization',
        'Applied clean UI aesthetics, dark mode tokens, and accessible contrast principles',
      ],
      credentialUrl: '',
      status: 'Completed',
      displayOrder: 4,
    },
  ],

  education: [
    {
      id: 'sage-university-btech',
      degree: 'Bachelor of Technology (B.Tech) in Computer Science & Technology',
      university: 'SAGE University, Indore',
      institute: 'ALTA School of Technology',
      duration: '2025 – 2029',
      currentYear: '2nd Year (Ongoing)',
      location: 'Indore, Madhya Pradesh / Nawada, Bihar',
      coreCoursework: [
        'Data Structures & Algorithms (C++)',
        'Object-Oriented Programming Systems (OOP)',
        'Database Management Systems (DBMS)',
        'Operating Systems & Concurrency',
        'Computer Networks & Protocols',
        'Web Application Architectures (MERN)',
      ],
      displayOrder: 1,
    },
  ],

  experience: [
    {
      id: 'gcp-arcade-facilitator',
      role: 'Google Cloud Arcade Facilitator & Arcade Labs Participant',
      organization: 'Google Cloud Skills Boost / Google Developer Program',
      duration: 'Jun 2026 – Present',
      location: 'Active Participant • India',
      status: 'Active Participant',
      highlights: [
        'Actively participating in Google Cloud Arcade and Arcade Labs, gaining hands-on experience with Google Cloud technologies.',
        'Earned 9 Google Developer Program badges through hands-on labs, quests, and technical challenges.',
        'Strengthening practical skills in cloud computing, deployment, and modern developer tools through project-based learning.',
      ],
      skills: ['Cloud Computing', 'Google Cloud (GCP)', 'Cloud Storage & IAM', '9 Developer Badges'],
      displayOrder: 1,
    },
  ],

  codingProfiles: [
    {
      platform: 'github',
      username: 'sumitknic2006-wq',
      profileUrl: 'https://github.com/sumitknic2006-wq',
      status: 'Active',
      verifiedHighlights: [
        'Author of RESTIFY digital wellbeing repository and frontend dashboard',
        'Maintains C++ algorithmic practice and MERN development repos',
      ],
    },
    {
      platform: 'leetcode',
      username: '25001122',
      profileUrl: 'https://leetcode.com/u/25001122/',
      primaryLanguage: 'C++',
      status: 'Active Solver',
      focusParadigms: [
        'Two Pointers & Sliding Window',
        'Linked Lists & Two-Way Traversals',
        'Binary Search & Monotonic Conditions',
        'Binary Trees & Recursive Invariants',
      ],
    },
    {
      platform: 'codeforces',
      username: 'sumitknic567',
      profileUrl: 'https://codeforces.com/profile/sumitknic567',
      primaryLanguage: 'C++',
      status: 'Active Contestant',
      focusParadigms: [
        'Math & Number Theory',
        'Greedy Algorithms',
        'Constructive Algorithms',
        'Implementation & Brute Force',
      ],
    },
  ],
};

// -----------------------------------------------------------------------------
// Service Implementation
// -----------------------------------------------------------------------------
export const portfolioService = {
  /**
   * Helper verifying database availability and enforcing strict fallback rules
   */
  checkDbAvailability() {
    const isConnected = getDbStatus().connected;

    if (!isConnected) {
      if (env.isProduction) {
        throw new DatabaseUnavailableError(
          'Database connectivity is required in production. Disconnected state is rejected.'
        );
      }
      if (!env.ALLOW_DEV_FIXTURES && !env.isTest) {
        throw new DatabaseUnavailableError(
          'MongoDB is currently offline. To run with local fixtures in development, explicitly enable ALLOW_DEV_FIXTURES=true in your environment.'
        );
      }
      return false; // Allowed dev/test fallback
    }

    return true; // Use real database
  },

  async getProfile() {
    const useDb = this.checkDbAvailability();

    if (useDb) {
      const dbProfile = await profileRepository.findDefault();
      const experiences = await experienceRepository.findAll();

      if (dbProfile) {
        return {
          ...dbProfile,
          experiences: experiences.length > 0 ? experiences : devFixtures.experience,
        };
      }
    }

    // Explicit dev/test fallback
    return {
      ...devFixtures.profile,
      experiences: devFixtures.experience,
    };
  },

  async getSkills(category = null) {
    const useDb = this.checkDbAvailability();

    if (useDb) {
      const filter = {};
      if (category) {
        const normalized = category.toLowerCase().trim();
        filter.$or = [
          { categoryKey: normalized },
          { category: new RegExp(normalized, 'i') },
        ];
      }

      const dbSkills = await skillRepository.findAll(filter);
      if (dbSkills.length > 0 || category) {
        return dbSkills;
      }
    }

    // Explicit dev/test fallback
    if (!category) {
      return devFixtures.skills;
    }
    const normalized = category.toLowerCase().trim();
    return devFixtures.skills.filter(
      (s) =>
        s.categoryKey.toLowerCase() === normalized ||
        s.category.toLowerCase().includes(normalized)
    );
  },

  async getProjects(category = null) {
    const useDb = this.checkDbAvailability();

    if (useDb) {
      const filter = {};
      if (category) {
        const normalized = category.toLowerCase().trim();
        filter.$or = [
          { categoryTag: normalized },
          { category: new RegExp(normalized, 'i') },
        ];
      }

      const dbProjects = await projectRepository.findAll(filter);
      if (dbProjects.length > 0 || category) {
        return dbProjects;
      }
    }

    // Explicit dev/test fallback
    if (!category) {
      return devFixtures.projects;
    }
    const normalized = category.toLowerCase().trim();
    return devFixtures.projects.filter(
      (p) =>
        p.categoryTag.toLowerCase() === normalized ||
        p.category.toLowerCase().includes(normalized)
    );
  },

  async getProjectBySlug(slug) {
    if (!slug) return null;
    const normalized = slug.toLowerCase().trim();
    const useDb = this.checkDbAvailability();

    if (useDb) {
      const dbProject = await projectRepository.findBySlug(normalized);
      if (dbProject) return dbProject;
      // If DB is connected and project is not found, return null (404)
      return null;
    }

    // Explicit dev/test fallback
    return devFixtures.projects.find((p) => p.slug === normalized) || null;
  },

  async getAchievements(category = null) {
    const useDb = this.checkDbAvailability();

    if (useDb) {
      const filter = {};
      if (category) {
        const normalized = category.toLowerCase().trim();
        filter.$or = [
          { categoryTag: normalized },
          { category: new RegExp(normalized, 'i') },
        ];
      }

      const dbAchievements = await achievementRepository.findAll(filter);
      if (dbAchievements.length > 0 || category) {
        return dbAchievements;
      }
    }

    // Explicit dev/test fallback
    if (!category) {
      return devFixtures.achievements;
    }
    const normalized = category.toLowerCase().trim();
    return devFixtures.achievements.filter(
      (a) =>
        a.categoryTag.toLowerCase() === normalized ||
        a.category.toLowerCase().includes(normalized)
    );
  },

  async getEducationAndExperience() {
    const useDb = this.checkDbAvailability();

    if (useDb) {
      const [education, experience] = await Promise.all([
        educationRepository.findAll(),
        experienceRepository.findAll(),
      ]);

      if (education.length > 0 || experience.length > 0) {
        return {
          education: education.length > 0 ? education : devFixtures.education,
          experience: experience.length > 0 ? experience : devFixtures.experience,
        };
      }
    }

    // Explicit dev/test fallback
    return {
      education: devFixtures.education,
      experience: devFixtures.experience,
    };
  },

  async getCodingProfiles() {
    const useDb = this.checkDbAvailability();

    if (useDb) {
      const profiles = await codingProfileRepository.findAll();
      if (profiles.length > 0) {
        const result = {};
        profiles.forEach((p) => {
          result[p.platform] = p;
        });
        return result;
      }
    }

    // Explicit dev/test fallback
    const result = {};
    devFixtures.codingProfiles.forEach((p) => {
      result[p.platform] = p;
    });
    return result;
  },
};

export default portfolioService;
