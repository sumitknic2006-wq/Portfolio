import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

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

test('POST /api/v1/contact with valid payload returns 503 Service Unavailable in Phase 3', async () => {
  const response = await request(app).post('/api/v1/contact').send({
    name: 'Recruiter User',
    email: 'recruiter@techcorp.com',
    message: 'We reviewed your developer portfolio and would like to discuss a software engineering opportunity.',
  });

  // Strict requirement: Never report fake successful delivery or fake persistence!
  assert.equal(response.status, 503);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'SERVICE_UNAVAILABLE');
  assert.ok(response.body.error.message.includes('offline in Phase 3'));
});
