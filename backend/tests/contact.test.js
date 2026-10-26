import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { setupTestDB, teardownTestDB, clearTestDB } from './helpers/dbTestHelper.js';
import ContactMessage from '../src/models/ContactMessage.js';

before(async () => {
  await setupTestDB();
});

after(async () => {
  await teardownTestDB();
});

test('POST /api/v1/contact rejects empty payload with 400 validation error', async () => {
  const response = await request(app).post('/api/v1/contact').send({});

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
  assert.ok(Array.isArray(response.body.error.details));
  assert.ok(response.body.error.details.length >= 3);
});

test('POST /api/v1/contact rejects invalid email format with 400', async () => {
  const response = await request(app).post('/api/v1/contact').send({
    name: 'Jane Doe',
    email: 'not-an-email',
    message: 'Hello, this is a test inquiry message that is long enough.',
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
  const emailError = response.body.error.details.find((d) => d.field === 'email');
  assert.ok(emailError);
});

test('POST /api/v1/contact rejects message shorter than 10 characters with 400', async () => {
  const response = await request(app).post('/api/v1/contact').send({
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'Short',
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  const msgError = response.body.error.details.find((d) => d.field === 'message');
  assert.ok(msgError);
});

test('POST /api/v1/contact rejects unexpected fields (mass assignment prevention) with 400', async () => {
  const response = await request(app).post('/api/v1/contact').send({
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'Hello, this is a valid inquiry message for the developer.',
    admin: true, // Unexpected injected field
    role: 'superadmin',
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
});

test('POST /api/v1/contact persists valid message to MongoDB and returns 201 Created', async () => {
  const testPayload = {
    name: 'Recruiter User',
    email: 'recruiter@techcorp.com',
    message: 'We reviewed your developer portfolio and would like to discuss a software engineering opportunity.',
  };

  const response = await request(app).post('/api/v1/contact').send(testPayload);

  assert.equal(response.status, 201);
  assert.equal(response.body.success, true);
  assert.ok(response.body.message.includes('successfully'));
  assert.ok(response.body.data.id);
  assert.equal(response.body.data.status, 'stored_successfully');
  assert.ok(response.body.data.createdAt);

  // Verify write was actually committed to MongoDB
  const savedDoc = await ContactMessage.findById(response.body.data.id);
  assert.ok(savedDoc);
  assert.equal(savedDoc.name, testPayload.name);
  assert.equal(savedDoc.email, testPayload.email);
  assert.equal(savedDoc.message, testPayload.message);
  assert.equal(savedDoc.status, 'pending');
});

test('POST /api/v1/contact returns 503 when database is disconnected', async () => {
  // Temporarily disconnect mongoose
  await mongoose.disconnect();

  const response = await request(app).post('/api/v1/contact').send({
    name: 'Recruiter User',
    email: 'recruiter@techcorp.com',
    message: 'Testing database offline behavior for service availability.',
  });

  assert.equal(response.status, 503);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'SERVICE_UNAVAILABLE');
  assert.ok(response.body.error.message.includes('offline'));

  // Reconnect for teardown or subsequent hooks
  await setupTestDB();
});

test('GET /api/v1/contact does not expose stored messages publicly (404/Not Allowed)', async () => {
  const response = await request(app).get('/api/v1/contact');
  // There is no public GET endpoint for contact messages
  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
});
