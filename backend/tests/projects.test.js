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

test('GET /api/v1/projects returns 200 with list of verified projects from MongoDB', async () => {
  const response = await request(app).get('/api/v1/projects');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(Array.isArray(response.body.data));
  assert.ok(response.body.data.length >= 4);
  assert.equal(response.body.meta.count, response.body.data.length);

  // Check structure of first project
  const project = response.body.data[0];
  assert.ok(project.title);
  assert.ok(project.slug);
  assert.ok(project.summary);
  assert.ok(Array.isArray(project.technologies));
});

test('GET /api/v1/projects?category=web filters projects correctly', async () => {
  const response = await request(app).get('/api/v1/projects?category=web');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(Array.isArray(response.body.data));
  assert.ok(response.body.data.length > 0);

  // Ensure filtered results match the requested category tag or category name
  response.body.data.forEach((p) => {
    const matchesTag = p.categoryTag.toLowerCase() === 'web';
    const matchesCategory = p.category.toLowerCase().includes('web');
    assert.ok(matchesTag || matchesCategory);
  });
});

test('GET /api/v1/projects/:slug returns 200 for existing project', async () => {
  const response = await request(app).get('/api/v1/projects/restify');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.slug, 'restify');
  assert.equal(response.body.data.title, 'RESTIFY');
  assert.equal(response.body.data.isVerified, true);
});

test('GET /api/v1/projects/:slug returns 404 for non-existent project slug', async () => {
  const response = await request(app).get('/api/v1/projects/non-existent-project-xyz');

  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'PROJECT_NOT_FOUND');
  assert.ok(response.body.error.message.includes('non-existent-project-xyz'));
});
