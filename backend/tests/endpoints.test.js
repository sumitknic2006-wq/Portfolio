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

test('GET /api/v1/profile returns 200 and verified developer profile from MongoDB', async () => {
  const response = await request(app).get('/api/v1/profile');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.name, 'Sumit Kumar');
  assert.equal(response.body.data.university, 'SAGE University, Indore');
  assert.ok(response.body.data.socials.github);
  assert.ok(response.body.data.socials.leetcode);
});

test('GET /api/v1/skills returns all skill categories from MongoDB', async () => {
  const response = await request(app).get('/api/v1/skills');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(Array.isArray(response.body.data));
  assert.ok(response.body.data.length >= 5);
  assert.ok(response.body.meta.totalSkillsCount > 10);
});

test('GET /api/v1/skills?category=frontend filters by categoryKey', async () => {
  const response = await request(app).get('/api/v1/skills?category=frontend');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(Array.isArray(response.body.data));
  assert.equal(response.body.data.length, 1);
  assert.equal(response.body.data[0].categoryKey, 'frontend');
});

test('GET /api/v1/achievements returns verified achievements from MongoDB', async () => {
  const response = await request(app).get('/api/v1/achievements');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(Array.isArray(response.body.data));
  assert.ok(response.body.data.length >= 3);
});

test('GET /api/v1/achievements?category=hackathon filters achievements', async () => {
  const response = await request(app).get('/api/v1/achievements?category=hackathon');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(Array.isArray(response.body.data));
  assert.ok(response.body.data.length >= 2);
});

test('GET /api/v1/education returns both education and experience records from MongoDB', async () => {
  const response = await request(app).get('/api/v1/education');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(Array.isArray(response.body.data.education));
  assert.ok(Array.isArray(response.body.data.experience));
  assert.equal(response.body.data.education[0].university, 'SAGE University, Indore');

  const gcpExp = response.body.data.experience.find((e) => e.id === 'gcp-arcade-facilitator');
  assert.ok(gcpExp);
  assert.equal(gcpExp.role, 'Google Cloud Arcade Facilitator & Arcade Labs Participant');
});

test('GET /api/v1/coding-profiles returns verified GitHub and LeetCode data from MongoDB', async () => {
  const response = await request(app).get('/api/v1/coding-profiles');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.github.username, 'sumitknic2006-wq');
  assert.equal(response.body.data.leetcode.username, '25001122');
});

test('API responses include Helmet security headers', async () => {
  const response = await request(app).get('/api/v1/health');

  assert.equal(response.headers['x-content-type-options'], 'nosniff');
  assert.equal(response.headers['x-frame-options'], 'SAMEORIGIN');
});
