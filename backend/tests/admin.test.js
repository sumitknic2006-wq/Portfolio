import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { setupTestDB, teardownTestDB, clearTestDB } from './helpers/dbTestHelper.js';
import { Admin } from '../src/models/Admin.js';
import { ContactMessage } from '../src/models/ContactMessage.js';

let authToken = '';
let testAdmin = null;
let sampleMessageId = '';

before(async () => {
  await setupTestDB();
});

after(async () => {
  await teardownTestDB();
});

beforeEach(async () => {
  await clearTestDB();

  // Create test admin
  const passwordHash = await Admin.hashPassword('AdminSecret123!');
  testAdmin = await Admin.create({
    name: 'Sumit Admin',
    email: 'admin@sumitportfolio.dev',
    passwordHash,
    role: 'superadmin',
  });

  // Create sample contact messages
  const msg1 = await ContactMessage.create({
    name: 'Alice Johnson',
    email: 'alice@example.com',
    subject: 'Project Collaboration',
    message: 'Hello Sumit, I would love to discuss a project with you.',
    status: 'pending',
    isRead: false,
  });
  sampleMessageId = msg1._id.toString();

  await ContactMessage.create({
    name: 'Bob Smith',
    email: 'bob@example.com',
    subject: 'Hiring Inquiry',
    message: 'We are looking for a full stack developer for our team.',
    status: 'replied',
    isRead: true,
  });

  // Login to get token
  const loginRes = await request(app).post('/api/v1/admin/auth/login').send({
    email: 'admin@sumitportfolio.dev',
    password: 'AdminSecret123!',
  });

  authToken = loginRes.body.data.token;
});

test('POST /api/v1/admin/auth/login rejects invalid credentials with 401', async () => {
  const res = await request(app).post('/api/v1/admin/auth/login').send({
    email: 'admin@sumitportfolio.dev',
    password: 'WrongPassword!',
  });

  assert.equal(res.status, 401);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error.code, 'INVALID_CREDENTIALS');
});

test('POST /api/v1/admin/auth/login accepts valid credentials, sets cookie, and returns token', async () => {
  const res = await request(app).post('/api/v1/admin/auth/login').send({
    email: 'admin@sumitportfolio.dev',
    password: 'AdminSecret123!',
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.token);
  assert.equal(res.body.data.admin.email, 'admin@sumitportfolio.dev');

  // Verify HttpOnly cookie header was set
  const cookies = res.headers['set-cookie'];
  assert.ok(cookies);
  const adminCookie = cookies.find((c) => c.startsWith('admin_token='));
  assert.ok(adminCookie);
  assert.ok(adminCookie.includes('HttpOnly'));
});

test('GET /api/v1/admin/auth/me rejects unauthorized request with 401', async () => {
  const res = await request(app).get('/api/v1/admin/auth/me');
  assert.equal(res.status, 401);
  assert.equal(res.body.success, false);
});

test('GET /api/v1/admin/auth/me returns admin profile when authenticated', async () => {
  const res = await request(app)
    .get('/api/v1/admin/auth/me')
    .set('Authorization', `Bearer ${authToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.admin.email, 'admin@sumitportfolio.dev');
});

test('GET /api/v1/admin/messages/stats returns real counts from MongoDB', async () => {
  const res = await request(app)
    .get('/api/v1/admin/messages/stats')
    .set('Authorization', `Bearer ${authToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.total, 2);
  assert.equal(res.body.data.unread, 1);
  assert.equal(res.body.data.pending, 1);
  assert.equal(res.body.data.replied, 1);
  assert.ok(Array.isArray(res.body.data.latest));
});

test('GET /api/v1/admin/messages supports search and status filtering', async () => {
  // Query pending messages
  const pendingRes = await request(app)
    .get('/api/v1/admin/messages?status=pending')
    .set('Authorization', `Bearer ${authToken}`);

  assert.equal(pendingRes.status, 200);
  assert.equal(pendingRes.body.data.length, 1);
  assert.equal(pendingRes.body.data[0].email, 'alice@example.com');

  // Search by keyword
  const searchRes = await request(app)
    .get('/api/v1/admin/messages?search=Hiring')
    .set('Authorization', `Bearer ${authToken}`);

  assert.equal(searchRes.status, 200);
  assert.equal(searchRes.body.data.length, 1);
  assert.equal(searchRes.body.data[0].name, 'Bob Smith');
});

test('PATCH /api/v1/admin/messages/:id/read updates read status', async () => {
  const res = await request(app)
    .patch(`/api/v1/admin/messages/${sampleMessageId}/read`)
    .set('Authorization', `Bearer ${authToken}`)
    .send({ isRead: true });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.isRead, true);

  const updatedInDb = await ContactMessage.findById(sampleMessageId);
  assert.equal(updatedInDb.isRead, true);
});

test('PATCH /api/v1/admin/messages/:id/status updates status enum and rejects invalid values', async () => {
  // Valid status
  const validRes = await request(app)
    .patch(`/api/v1/admin/messages/${sampleMessageId}/status`)
    .set('Authorization', `Bearer ${authToken}`)
    .send({ status: 'archived' });

  assert.equal(validRes.status, 200);
  assert.equal(validRes.body.data.status, 'archived');

  // Invalid status
  const invalidRes = await request(app)
    .patch(`/api/v1/admin/messages/${sampleMessageId}/status`)
    .set('Authorization', `Bearer ${authToken}`)
    .send({ status: 'unknown_status' });

  assert.equal(invalidRes.status, 400);
  assert.equal(invalidRes.body.error.code, 'VALIDATION_ERROR');
});

test('DELETE /api/v1/admin/messages/:id removes message from MongoDB', async () => {
  const res = await request(app)
    .delete(`/api/v1/admin/messages/${sampleMessageId}`)
    .set('Authorization', `Bearer ${authToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);

  const inDb = await ContactMessage.findById(sampleMessageId);
  assert.equal(inDb, null);
});

test('POST /api/v1/admin/auth/logout clears cookie session', async () => {
  const res = await request(app).post('/api/v1/admin/auth/logout');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);

  const cookies = res.headers['set-cookie'];
  assert.ok(cookies);
  const clearedCookie = cookies.find((c) => c.startsWith('admin_token=;'));
  assert.ok(clearedCookie);
});

test('POST /api/v1/contact saves message to DB resiliently even without email credentials', async () => {
  const res = await request(app).post('/api/v1/contact').send({
    name: 'Charlie Test',
    email: 'charlie@example.com',
    subject: 'General Question',
    message: 'Testing that contact message is persisted resiliently.',
  });

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.id);

  const savedMsg = await ContactMessage.findById(res.body.data.id);
  assert.ok(savedMsg);
  assert.equal(savedMsg.name, 'Charlie Test');
  assert.equal(savedMsg.email, 'charlie@example.com');
  assert.equal(savedMsg.status, 'pending');
  assert.equal(savedMsg.isRead, false);
});
