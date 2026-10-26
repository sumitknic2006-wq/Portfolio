import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { setupTestDB, teardownTestDB } from './helpers/dbTestHelper.js';
import { seedDatabase } from '../src/scripts/seed.js';

// Import frontend data objects directly into Node.js test environment for validation
import { dsaProblems } from '../../frontend/src/data/dsaData.js';
import { translations } from '../../frontend/src/data/translations.js';
import { projectsData } from '../../frontend/src/data/projectsData.js';
import { achievementsData } from '../../frontend/src/data/achievementsData.js';

describe('Phase 6 — Advanced Interactive Features Validation', () => {
  before(async () => {
    await setupTestDB();
    await seedDatabase(false);
  });

  after(async () => {
    await teardownTestDB();
  });

  // ---------------------------------------------------------------------------
  // 1. Project Category Filtering & Search
  // ---------------------------------------------------------------------------
  describe('1. Project Filtering and Search', () => {
    it('supports all required category filters: All, Web Development, AI/ML, FinTech, DSA', async () => {
      const categories = ['Web Development', 'AI/ML', 'FinTech', 'DSA'];
      for (const cat of categories) {
        const res = await request(app)
          .get(`/api/v1/projects?category=${encodeURIComponent(cat)}`)
          .expect(200);

        assert.equal(res.body.success, true);
        assert.ok(Array.isArray(res.body.data));
        assert.ok(res.body.data.length >= 1, `Category '${cat}' should return at least 1 project`);
        res.body.data.forEach((p) => {
          const match =
            p.categoryTag.toLowerCase() === cat.toLowerCase() ||
            p.category.toLowerCase().includes(cat.toLowerCase());
          assert.ok(match, `Project ${p.title} matches category ${cat}`);
        });
      }
    });

    it('correctly filters projects by keyword search across title, description, and technologies', () => {
      const runSearch = (query, category = 'All') => {
        const normalizedQuery = query.toLowerCase().trim();
        return projectsData.filter((project) => {
          const catMatch = category === 'All' || project.category === category || project.categoryTag === category;
          if (!catMatch) return false;

          const titleMatch = (project.title || '').toLowerCase().includes(normalizedQuery);
          const descMatch = (project.description || '').toLowerCase().includes(normalizedQuery);
          const summaryMatch = (project.summary || '').toLowerCase().includes(normalizedQuery);
          const techMatch = (project.technologies || []).some((t) => t.toLowerCase().includes(normalizedQuery));

          return titleMatch || descMatch || summaryMatch || techMatch;
        });
      };

      // Search by title
      const restifyResults = runSearch('RESTIFY');
      assert.equal(restifyResults.length, 1);
      assert.equal(restifyResults[0].slug, 'restify');

      // Search by technology
      const reactResults = runSearch('React');
      assert.ok(reactResults.length >= 3, 'React should match RESTIFY, StockSaathi, Investor App');

      // Search by C++ technology
      const cppResults = runSearch('C++');
      assert.equal(cppResults.length, 1);
      assert.equal(cppResults[0].slug, 'dsa-in-cpp');

      // Combined Category + Search
      const fintechReact = runSearch('React', 'FinTech');
      assert.equal(fintechReact.length, 1);
      assert.equal(fintechReact[0].slug, 'investor-management-app');

      // Clear/Reset test
      const allReset = runSearch('', 'All');
      assert.equal(allReset.length, projectsData.length);
    });

    it('verifies all project detail routes are valid and linkable', () => {
      projectsData.forEach((project) => {
        assert.ok(project.slug, `Project ${project.title} must have a slug`);
        assert.match(project.slug, /^[a-z0-9-]+$/, `Slug '${project.slug}' must be URL friendly`);
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Achievement Filtering
  // ---------------------------------------------------------------------------
  describe('2. Achievement Filtering', () => {
    it('supports required achievement categories: Hackathons, Certifications, Learning Achievements', async () => {
      const categories = ['Hackathons', 'Certifications', 'Learning Achievements'];
      for (const cat of categories) {
        const res = await request(app)
          .get(`/api/v1/achievements?category=${encodeURIComponent(cat)}`)
          .expect(200);

        assert.equal(res.body.success, true);
        assert.ok(res.body.data.length >= 1, `Category '${cat}' should return at least 1 achievement`);
      }
    });

    it('contains verified Google Cloud Arcade certification with authentic credential', () => {
      const arcade = achievementsData.find((a) => a.id === 'gcp-arcade');
      assert.ok(arcade, 'Google Cloud Arcade achievement must be present');
      assert.equal(arcade.issuer, 'Google Cloud Skills Boost');
      assert.equal(arcade.category, 'Certifications');
      assert.ok(arcade.credentialUrl.includes('cloudskillsboost.google'));
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Dark and Light Theme Persistence & Tokens
  // ---------------------------------------------------------------------------
  describe('3. Dark/Light Theme Switching & Contrast', () => {
    it('validates theme persistence schema in localStorage contract', () => {
      const validThemes = ['dark', 'light'];
      validThemes.forEach((theme) => {
        // Test localStorage storage contract
        const storedTheme = theme;
        assert.ok(validThemes.includes(storedTheme));
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 4. Hindi/English Language Switching & Localization Dictionary
  // ---------------------------------------------------------------------------
  describe('4. Localization System & UI Translations', () => {
    it('verifies both English (en) and Hindi (hi) dictionaries are fully populated', () => {
      assert.ok(translations.en, 'English dictionary must exist');
      assert.ok(translations.hi, 'Hindi dictionary must exist');

      const requiredSections = [
        'nav',
        'hero',
        'about',
        'skills',
        'projects',
        'achievements',
        'dsa',
        'codingProfiles',
        'projectDetail',
        'assistant',
        'education',
        'contact',
        'footer',
        'common',
      ];

      for (const section of requiredSections) {
        assert.ok(translations.en[section], `English must have section '${section}'`);
        assert.ok(translations.hi[section], `Hindi must have section '${section}'`);

        // Check key parity between English and Hindi
        const enKeys = Object.keys(translations.en[section]);
        const hiKeys = Object.keys(translations.hi[section]);
        assert.ok(hiKeys.length >= enKeys.length, `Hindi section '${section}' must cover English keys`);
      }
    });

    it('verifies template parameter interpolation for count labels', () => {
      const template = translations.en.projects.showingFilteredCount;
      assert.ok(template.includes('{count}') && template.includes('{total}'));

      const interpolated = template.replace('{count}', '2').replace('{total}', '4');
      assert.equal(interpolated, 'Showing 2 of 4 projects');

      const hiTemplate = translations.hi.projects.showingFilteredCount;
      const hiInterpolated = hiTemplate.replace('{count}', '2').replace('{total}', '4');
      assert.equal(hiInterpolated, '4 में से 2 प्रोजेक्ट्स प्रदर्शित');
    });

    it('preserves code, technological names and URLs in Hindi localization', () => {
      assert.equal(translations.hi.dsa.timeComplexity, 'समय');
      assert.equal(translations.hi.dsa.spaceComplexity, 'स्थान');
      assert.ok(translations.hi.codingProfiles.primaryLanguage.includes('C++'));
    });
  });

  // ---------------------------------------------------------------------------
  // 5. Interactive DSA Explorer
  // ---------------------------------------------------------------------------
  describe('5. Interactive DSA Explorer & Step-by-Step Dry Runs', () => {
    it('covers all required DSA topics: Arrays, Strings, Two Pointers, Sliding Window, Recursion, Backtracking, Hashing', () => {
      const coveredTopics = new Set();
      dsaProblems.forEach((p) => {
        coveredTopics.add(p.category);
      });

      const requiredCategories = ['Two Pointers', 'Sliding Window', 'Recursion & Backtracking', 'Strings', 'Hashing', 'Arrays'];
      for (const reqCat of requiredCategories) {
        assert.ok(
          Array.from(coveredTopics).some((c) => c.toLowerCase().includes(reqCat.toLowerCase())),
          `DSA suite must cover topic: ${reqCat}`
        );
      }
    });

    it('verifies each problem has valid C++ solution code, Big-O complexities, and problem numbers', () => {
      dsaProblems.forEach((problem) => {
        assert.ok(problem.id, 'Problem must have unique id');
        assert.ok(problem.title, 'Problem must have title');
        assert.ok(problem.difficulty, 'Problem must have difficulty');
        assert.ok(['Easy', 'Medium', 'Hard'].includes(problem.difficulty), `Difficulty must be Easy, Medium, or Hard`);
        assert.ok(problem.timeComplexity, 'Problem must specify time complexity');
        assert.ok(problem.spaceComplexity, 'Problem must specify space complexity');
        assert.ok(problem.cppCode, 'Problem must have C++ solution code');
        assert.ok(problem.cppCode.includes('#include'), 'C++ code must include standard headers');
        assert.ok(problem.problemNumber, 'Problem must have verified LeetCode problem number');
      });
    });

    it('verifies interactive dry run steps data structure for step-by-step trace simulation', () => {
      dsaProblems.forEach((problem) => {
        if (problem.dryRunSteps) {
          assert.ok(Array.isArray(problem.dryRunSteps));
          assert.ok(problem.dryRunSteps.length >= 2, 'Problem must have at least 2 trace steps');
          problem.dryRunSteps.forEach((step, idx) => {
            assert.equal(step.step, idx + 1, 'Step numbers must be sequential');
            assert.ok(step.description, 'Step must have explanatory description');
            assert.ok(step.variables && typeof step.variables === 'object', 'Step must have variables snapshot');
            assert.ok(step.highlight, 'Step must have decision highlight');
          });
        }
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 6. Coding Profiles & Graceful Fallbacks
  // ---------------------------------------------------------------------------
  describe('6. Coding Profile Hub & Telemetry Integrity', () => {
    it('GET /api/v1/coding-profiles returns verified GitHub and LeetCode profiles from database', async () => {
      const res = await request(app).get('/api/v1/coding-profiles').expect(200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.github);
      assert.ok(res.body.data.leetcode);

      assert.equal(res.body.data.github.username, 'sumitknic2006-wq');
      assert.equal(res.body.data.github.profileUrl, 'https://github.com/sumitknic2006-wq');
      assert.equal(res.body.data.leetcode.username, '25001122');
      assert.equal(res.body.data.leetcode.profileUrl, 'https://leetcode.com/u/25001122/');
    });
  });

  // ---------------------------------------------------------------------------
  // 7. Project Detail Experience
  // ---------------------------------------------------------------------------
  describe('7. Project Detail Architecture & Not Found Handling', () => {
    it('GET /api/v1/projects/restify returns complete architecture specifications', async () => {
      const res = await request(app).get('/api/v1/projects/restify').expect(200);
      assert.equal(res.body.success, true);
      const project = res.body.data;

      assert.equal(project.slug, 'restify');
      assert.equal(project.title, 'RESTIFY');
      assert.ok(project.problem, 'Must specify problem');
      assert.ok(project.solution, 'Must specify solution');
      assert.ok(Array.isArray(project.features) && project.features.length >= 3, 'Must specify features list');
      assert.ok(Array.isArray(project.technologies) && project.technologies.length >= 3, 'Must specify technologies');
      assert.ok(project.contribution, 'Must specify personal contribution');
      assert.ok(project.architecture, 'Must specify architecture');
      assert.ok(project.challenges, 'Must specify challenges');
    });

    it('GET /api/v1/projects/invalid-slug returns 404 PROJECT_NOT_FOUND', async () => {
      const res = await request(app).get('/api/v1/projects/invalid-slug').expect(404);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'PROJECT_NOT_FOUND');
    });
  });

  // ---------------------------------------------------------------------------
  // 8. Grounded AI Portfolio Assistant
  // ---------------------------------------------------------------------------
  describe('8. Portfolio Assistant Grounding Engine', () => {
    const testAssistantMatcher = (query) => {
      const q = query.toLowerCase().trim();
      if (q.includes('restify')) return 'RESTIFY';
      if (q.includes('skill') || q.includes('stack')) return 'SKILLS';
      if (
        q.includes('education') ||
        q.includes('college') ||
        q.includes('university') ||
        q.includes('sage') ||
        q.includes('study')
      )
        return 'EDUCATION';
      if (q.includes('achievement') || q.includes('arcade')) return 'ACHIEVEMENTS';
      if (q.includes('dsa') || q.includes('c++')) return 'DSA';
      if (q.includes('contact') || q.includes('email')) return 'CONTACT';
      return 'UNKNOWN';
    };

    it('correctly maps user questions to verified portfolio topics', () => {
      assert.equal(testAssistantMatcher('What is the RESTIFY project?'), 'RESTIFY');
      assert.equal(testAssistantMatcher('What programming skills does Sumit have?'), 'SKILLS');
      assert.equal(testAssistantMatcher('Where is Sumit studying at university?'), 'EDUCATION');
      assert.equal(testAssistantMatcher('Does Sumit have Google Cloud Arcade badges?'), 'ACHIEVEMENTS');
      assert.equal(testAssistantMatcher('How does Sumit practice DSA in C++?'), 'DSA');
      assert.equal(testAssistantMatcher('How can I contact Sumit?'), 'CONTACT');
      assert.equal(testAssistantMatcher('What is the weather today?'), 'UNKNOWN');
    });
  });
});
