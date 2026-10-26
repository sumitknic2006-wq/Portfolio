import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { setupTestDB, seedTestDB, teardownTestDB } from './helpers/dbTestHelper.js';

before(async () => {
  await setupTestDB();
  await seedTestDB();
});

after(async () => {
  await teardownTestDB();
});

test('GET /api/v1/dsa/platforms returns 200 with platform cards and connected real handles', async () => {
  const response = await request(app).get('/api/v1/dsa/platforms');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(response.body.data);
  assert.ok(response.body.data.leetcode);
  assert.ok(response.body.data.codeforces);

  const lc = response.body.data.leetcode;
  assert.equal(lc.id, 'leetcode');
  assert.equal(lc.username, '25001122');
  assert.ok(lc.profileUrl.includes('25001122'));
  assert.ok(lc.dashboardUrl.includes('/dsa/leetcode'));

  const cf = response.body.data.codeforces;
  assert.equal(cf.id, 'codeforces');
  assert.equal(cf.handle, 'sumitknic567');
  assert.ok(cf.profileUrl.includes('sumitknic567'));
  assert.ok(cf.dashboardUrl.includes('/dsa/codeforces'));
});

test('GET /api/v1/dsa/leetcode returns 200 with real profile stats, breakdown, and problems', async () => {
  const response = await request(app).get('/api/v1/dsa/leetcode');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(response.body.data);
  assert.ok(response.body.data.profile);
  assert.equal(response.body.data.profile.username, '25001122');
  assert.ok(Array.isArray(response.body.data.problems));
  assert.ok(response.body.data.problems.length > 0);
  assert.ok(response.body.meta);

  const problem = response.body.data.problems[0];
  assert.ok(problem.title);
  assert.ok(problem.slug);
  assert.equal(problem.platform, 'leetcode');
  assert.ok(problem.provenance);
});

test('GET /api/v1/dsa/leetcode with provenance filter separates curated from verified records', async () => {
  const curatedRes = await request(app).get('/api/v1/dsa/leetcode?provenance=curated_example');
  assert.equal(curatedRes.status, 200);
  assert.ok(Array.isArray(curatedRes.body.data.problems));
  for (const p of curatedRes.body.data.problems) {
    assert.equal(p.provenance, 'curated_example');
  }
});

test('GET /api/v1/dsa/codeforces returns 200 with handle stats for sumitknic567', async () => {
  const response = await request(app).get('/api/v1/dsa/codeforces');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(response.body.data);
  assert.ok(response.body.data.profile);
  assert.equal(response.body.data.profile.handle, 'sumitknic567');
  assert.ok(Array.isArray(response.body.data.problems));

  const problem = response.body.data.problems[0];
  assert.ok(problem.title);
  assert.ok(problem.slug);
  assert.equal(problem.platform, 'codeforces');
});

test('POST /api/v1/dsa/sync/:platform triggers manual platform synchronization', async () => {
  const response = await request(app).post('/api/v1/dsa/sync/codeforces');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.platform, 'codeforces');
  assert.ok(response.body.data.lastSyncedAt);
});

test('GET /api/v1/dsa/problems/:platform/:slug returns 200 with complete problem details', async () => {
  const response = await request(app).get('/api/v1/dsa/problems/codeforces/watermelon');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  const data = response.body.data;
  assert.equal(data.slug, 'watermelon');
  assert.equal(data.platform, 'codeforces');
  assert.ok(data.title.includes('Watermelon'));
  assert.equal(data.provenance, 'curated_example');
  assert.ok(data.sourceCode);
  assert.ok(data.approach);
  assert.ok(data.timeComplexity);
  assert.ok(data.spaceComplexity);
});

test('GET /api/v1/dsa/problems/:platform/:slug returns 404 for non-existent problem', async () => {
  const response = await request(app).get('/api/v1/dsa/problems/leetcode/non-existent-xyz');

  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
});

test('POST /api/v1/dsa/import rejects invalid records with 400 and validation error details', async () => {
  const invalidPayload = {
    problems: [
      {
        slug: 'bad-problem',
        // missing platform, problemId, title
        timeComplexity: 'O(1)',
      },
    ],
  };

  const response = await request(app).post('/api/v1/dsa/import').send(invalidPayload);

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.ok(response.body.error);
});

test('POST /api/v1/dsa/import saves valid custom problem records to database with 201', async () => {
  const validPayload = {
    problems: [
      {
        slug: 'custom-binary-search-test',
        platform: 'leetcode',
        problemId: '704',
        title: 'Binary Search (Custom Import Test)',
        difficulty: 'Easy',
        category: 'Binary Search',
        tags: ['Array', 'Binary Search'],
        problemUrl: 'https://leetcode.com/problems/binary-search/',
        summary: 'Given an array of integers nums which is sorted in ascending order.',
        approach: 'Classic iterative binary search with left and right bounds.',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        language: 'C++',
        sourceCode: 'int search(vector<int>& nums, int target) { return 0; }',
      },
    ],
  };

  const response = await request(app).post('/api/v1/dsa/import').send(validPayload);

  assert.equal(response.status, 201);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.importedCount, 1);

  // Verify it can now be retrieved via GET
  const getRes = await request(app).get('/api/v1/dsa/problems/leetcode/custom-binary-search-test');
  assert.equal(getRes.status, 200);
  assert.equal(getRes.body.data.slug, 'custom-binary-search-test');
  assert.equal(getRes.body.data.isCustom, true);
});

test('PATCH /api/v1/dsa/problems/:platform/:slug updates notes and approach', async () => {
  const updatePayload = {
    approach: 'Updated approach: Optimized two pointer algorithm with boundary checks.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
  };

  const response = await request(app)
    .patch('/api/v1/dsa/problems/leetcode/two-sum-sorted')
    .send(updatePayload);

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.approach, updatePayload.approach);
});

test('Profile identifiers: LeetCode is 25001122 and Codeforces is sumitknic567 across platform endpoints', async () => {
  const lcRes = await request(app).get('/api/v1/dsa/leetcode');
  assert.equal(lcRes.status, 200);
  assert.equal(lcRes.body.data.profile.username, '25001122');
  assert.ok(lcRes.body.data.profile.profileUrl.includes('25001122'));

  const cfRes = await request(app).get('/api/v1/dsa/codeforces');
  assert.equal(cfRes.status, 200);
  assert.equal(cfRes.body.data.profile.handle, 'sumitknic567');
  assert.ok(cfRes.body.data.profile.profileUrl.includes('sumitknic567'));
});

test('LeetCode partial-history: note and meta distinguish aggregate total from recent synced activity', async () => {
  const response = await request(app).get('/api/v1/dsa/leetcode');
  assert.equal(response.status, 200);
  const profile = response.body.data.profile;
  assert.ok(profile.note, 'Profile should have a transparency note');
  assert.ok(typeof profile.totalSolved === 'number');
  // Verified problems array in database / response
  assert.ok(Array.isArray(response.body.data.problems));
});

test('Provenance isolation: curated_example records do NOT inflate verified account statistics', async () => {
  const { dsaRepository } = await import('../src/repositories/dsa.repository.js');
  const stats = await dsaRepository.getStats('leetcode');

  // total should only count live_sync and manual_import, not curated_example
  assert.ok(typeof stats.total === 'number');
  assert.ok(typeof stats.curatedCount === 'number');
  assert.ok(stats.curatedCount > 0);
  // total + curatedCount <= totalAll
  assert.equal(stats.total + stats.curatedCount, stats.totalAll);
});

test('Duplicate prevention: upserting same problem slug updates without creating duplicates', async () => {
  const { dsaRepository } = await import('../src/repositories/dsa.repository.js');
  const { DsaProblem } = await import('../src/models/DsaProblem.js');

  const testSlug = 'duplicate-prevention-test-slug';
  await dsaRepository.upsertOne({
    slug: testSlug,
    platform: 'leetcode',
    problemId: '9999',
    title: 'Duplicate Test 1',
    difficulty: 'Easy',
    problemUrl: 'https://leetcode.com/problems/test/',
    provenance: 'manual_import',
  });

  // Second upsert with same slug
  await dsaRepository.upsertOne({
    slug: testSlug,
    platform: 'leetcode',
    problemId: '9999',
    title: 'Duplicate Test 1 (Updated)',
    difficulty: 'Easy',
    problemUrl: 'https://leetcode.com/problems/test/',
    provenance: 'manual_import',
  });

  const count = await DsaProblem.countDocuments({ slug: testSlug });
  assert.equal(count, 1, 'Only one document should exist for the slug');
  await DsaProblem.deleteOne({ slug: testSlug });
});

test('Preserving manually saved solutions: live sync upsert preserves existing sourceCode and notes', async () => {
  const { dsaRepository } = await import('../src/repositories/dsa.repository.js');
  const { DsaProblem } = await import('../src/models/DsaProblem.js');

  const testSlug = 'preserve-code-sync-test';
  const customCode = 'int myCustomSolution() { return 42; }';
  const customApproach = 'My custom dynamic programming approach';

  // User saved custom notes
  await dsaRepository.upsertOne({
    slug: testSlug,
    platform: 'leetcode',
    problemId: '10001',
    title: 'Preserve Solution Test',
    difficulty: 'Medium',
    problemUrl: 'https://leetcode.com/problems/test-preserve/',
    sourceCode: customCode,
    approach: customApproach,
    provenance: 'manual_import',
  });

  // Automated live sync comes in with empty sourceCode and empty approach
  await dsaRepository.upsertOne({
    slug: testSlug,
    platform: 'leetcode',
    problemId: '10001',
    title: 'Preserve Solution Test',
    difficulty: 'Medium',
    problemUrl: 'https://leetcode.com/problems/test-preserve/',
    sourceCode: '',
    approach: '',
    provenance: 'live_sync',
  });

  const updatedDoc = await DsaProblem.findOne({ slug: testSlug }).lean();
  assert.equal(updatedDoc.sourceCode, customCode, 'Existing sourceCode must not be erased by sync');
  assert.equal(updatedDoc.approach, customApproach, 'Existing approach must not be erased by sync');
  assert.equal(updatedDoc.provenance, 'manual_import', 'Manual import provenance must not be downgraded');

  await DsaProblem.deleteOne({ slug: testSlug });
});

test('No curated code displayed on unrelated live problems: live problem without attached code returns empty sourceCode', async () => {
  const { dsaRepository } = await import('../src/repositories/dsa.repository.js');
  const { DsaProblem } = await import('../src/models/DsaProblem.js');

  const liveSlug = 'live-sync-no-curated-leak';
  await dsaRepository.upsertOne({
    slug: liveSlug,
    platform: 'leetcode',
    problemId: '20002',
    title: 'Live Synced Without User Code',
    difficulty: 'Medium',
    problemUrl: 'https://leetcode.com/problems/live-no-leak/',
    sourceCode: '',
    approach: '',
    provenance: 'live_sync',
  });

  const res = await request(app).get(`/api/v1/dsa/problems/leetcode/${liveSlug}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.data.sourceCode, '', 'Live problem must not inherit unrelated curated code');
  assert.equal(res.body.data.provenance, 'live_sync');

  await DsaProblem.deleteOne({ slug: liveSlug });
});

test('POST /api/v1/dsa/sync/:platform rejects unsupported platform with 400', async () => {
  const response = await request(app).post('/api/v1/dsa/sync/hackerrank');
  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
});

test('POST /api/v1/dsa/import/preview validates JSON payload and detects duplicates', async () => {
  const testPayload = {
    platform: 'leetcode',
    rawText: JSON.stringify([
      {
        problemId: '1',
        title: 'Two Sum',
        slug: 'two-sum',
        difficulty: 'Easy',
        category: 'Arrays',
        tags: ['Array', 'Hash Table'],
        problemUrl: 'https://leetcode.com/problems/two-sum/',
      },
      {
        // Malformed row: missing title
        problemId: '99999',
        slug: 'missing-title-problem',
      },
    ]),
  };

  const response = await request(app)
    .post('/api/v1/dsa/import/preview')
    .send(testPayload);

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.platform, 'leetcode');
  assert.equal(response.body.data.parsedCount, 2);
  assert.equal(response.body.data.validCount, 1);
  assert.equal(response.body.data.rejectedCount, 1);
  assert.ok(response.body.data.rejectedRows.length > 0);
  assert.ok(response.body.data.preview.length > 0);
  assert.equal(response.body.data.preview[0].title, 'Two Sum');
});

test('POST /api/v1/dsa/import/preview parses CSV text accurately', async () => {
  const csvContent = [
    'Title,URL,Difficulty,Status',
    '"3Sum","https://leetcode.com/problems/3sum/","Medium","Accepted"',
    '"Valid Anagram","https://leetcode.com/problems/valid-anagram/","Easy","Accepted"',
    '"",,"Easy","Accepted"', // Malformed row
  ].join('\n');

  const response = await request(app)
    .post('/api/v1/dsa/import/preview')
    .send({ platform: 'leetcode', rawText: csvContent });

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.format, 'csv');
  assert.equal(response.body.data.parsedCount, 3);
  assert.equal(response.body.data.validCount, 2);
  assert.equal(response.body.data.rejectedCount, 1);
  assert.equal(response.body.data.preview[0].slug, '3sum');
});

test('GET /api/v1/dsa/sync/status returns scheduler configuration and platform sync documents', async () => {
  const response = await request(app).get('/api/v1/dsa/sync/status');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(response.body.data);
  assert.ok(response.body.data.scheduler);
  assert.equal(typeof response.body.data.scheduler.enabled, 'boolean');
  assert.equal(typeof response.body.data.scheduler.intervalMinutes, 'number');
  assert.ok(response.body.data.platforms);
});

test('POST /api/v1/dsa/sync/cron enforces secret authorization when configured', async () => {
  const { env } = await import('../src/config/env.js');

  // Request with invalid secret
  const unauthRes = await request(app)
    .post('/api/v1/dsa/sync/cron')
    .set('x-cron-secret', 'wrong_secret_123');

  if (env.CRON_SECRET) {
    assert.equal(unauthRes.status, 401);
    assert.equal(unauthRes.body.success, false);

    // Request with valid secret
    const authRes = await request(app)
      .post('/api/v1/dsa/sync/cron')
      .set('x-cron-secret', env.CRON_SECRET);

    assert.equal(authRes.status, 200);
    assert.equal(authRes.body.success, true);
    assert.ok(authRes.body.data);
  } else {
    // If no secret configured in test env, it succeeds
    assert.equal(unauthRes.status, 200);
  }
});

test('dsaScheduler prevents overlapping sync runs via concurrency lock', async () => {
  const { dsaScheduler } = await import('../src/services/dsaScheduler.service.js');

  // Trigger first run and inspect status
  const run1Promise = dsaScheduler.runSyncJob('scheduled_cron_test');
  assert.equal(dsaScheduler.getStatus().isRunning, true);

  // Triggering simultaneous run should be safely skipped
  const run2Result = await dsaScheduler.runSyncJob('overlapping_test');
  assert.equal(run2Result.skipped, true);
  assert.equal(run2Result.reason, 'JOB_ALREADY_RUNNING');

  // Wait for run 1 to finish
  const run1Result = await run1Promise;
  assert.equal(run1Result.success, true);
  assert.equal(dsaScheduler.getStatus().isRunning, false);
});


