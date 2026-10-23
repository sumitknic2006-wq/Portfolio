export const projectsData = [
  {
    slug: 'restify',
    title: 'RESTIFY',
    subtitle: 'Digital Wellbeing & Smart Screen-Time Control Platform',
    category: 'Web Development',
    categoryTag: 'Web Development',
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
    github: 'https://github.com/sumitknic2006-wq', // Verified repository profile
    statusBadge: 'Live Verified Deployment',
  },
  {
    slug: 'stocksaathi-ai',
    title: 'StockSaathi AI',
    subtitle: 'AI-Powered Dead Stock Recovery for Small Retailers',
    category: 'AI/ML',
    categoryTag: 'AI/ML',
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
  },
  {
    slug: 'investor-management-app',
    title: 'Investor Management App',
    subtitle: 'Investment Tracking & Portfolio Capital Analytics',
    category: 'FinTech',
    categoryTag: 'FinTech',
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
  },
  {
    slug: 'dsa-in-cpp',
    title: 'DSA in C++ Practice Suite',
    subtitle: 'Algorithmic Solutions & Complexity Analysis Suite',
    category: 'DSA',
    categoryTag: 'DSA',
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
  },
];
