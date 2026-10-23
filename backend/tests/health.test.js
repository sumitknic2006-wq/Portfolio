import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

test('GET /health returns 200 and healthy status', async () => {
  const response = await request(app).get('/health');
  
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.status, 'healthy');
  assert.ok(response.body.timestamp);
});

test('GET /api/v1/health returns 200 and healthy status', async () => {
  const response = await request(app).get('/api/v1/health');
  
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.status, 'healthy');
});

test('GET /non-existent-route returns 404', async () => {
  const response = await request(app).get('/api/v1/non-existent-route');
  
  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
});
