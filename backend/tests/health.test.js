import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { setupTestDB, teardownTestDB } from './helpers/dbTestHelper.js';

before(async () => {
  await setupTestDB();
});

after(async () => {
  await teardownTestDB();
});

test('GET /health returns 200 and reflects connected database status', async () => {
  const response = await request(app).get('/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.status, 'healthy');
  assert.ok(response.body.data.timestamp);
  assert.equal(response.body.data.database.connected, true);
  assert.equal(response.body.data.database.status, 'connected');
});

test('GET /api/v1/health returns 200 and runtime diagnostics with connected database', async () => {
  const response = await request(app).get('/api/v1/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.status, 'healthy');
  assert.equal(typeof response.body.data.uptimeSeconds, 'number');
  assert.equal(response.body.data.version, '1.0.0');
  assert.equal(response.body.data.database.connected, true);
});

test('GET /api/v1/non-existent-route returns 404 Route Not Found', async () => {
  const response = await request(app).get('/api/v1/non-existent-route');

  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
  assert.ok(response.body.error);
  assert.equal(response.body.error.code, 'ROUTE_NOT_FOUND');
});
