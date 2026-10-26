import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { setupTestDB, teardownTestDB, clearTestDB } from './helpers/dbTestHelper.js';
import { Project } from '../src/models/Project.js';
import { ContactMessage } from '../src/models/ContactMessage.js';
import { projectRepository } from '../src/repositories/project.repository.js';
import { seedDatabase } from '../src/scripts/seed.js';

before(async () => {
  await setupTestDB();
});

after(async () => {
  await teardownTestDB();
});

test('Project model enforces required fields and slug regex', async () => {
  await clearTestDB();

  // Test missing slug fails validation
  const missingSlug = new Project({
    title: 'Test Project',
    category: 'Web',
    categoryTag: 'web',
    summary: 'A short summary',
    description: 'Detailed description',
  });

  await assert.rejects(async () => {
    await missingSlug.save();
  }, /slug is required/);

  // Test invalid uppercase/spaces in slug fails validation
  const invalidSlug = new Project({
    title: 'Test Project',
    slug: 'Invalid Slug!',
    category: 'Web',
    categoryTag: 'web',
    summary: 'A short summary',
    description: 'Detailed description',
  });

  await assert.rejects(async () => {
    await invalidSlug.save();
  });
});

test('Project model enforces unique slug constraints (duplicate key error)', async () => {
  await clearTestDB();
  await Project.init();

  const p1 = new Project({
    title: 'First RESTIFY',
    slug: 'restify-unique',
    category: 'Web Development',
    categoryTag: 'web',
    summary: 'Summary 1',
    description: 'Description 1',
  });
  await p1.save();

  const p2 = new Project({
    title: 'Second RESTIFY Duplicate',
    slug: 'restify-unique',
    category: 'Web Development',
    categoryTag: 'web',
    summary: 'Summary 2',
    description: 'Description 2',
  });

  await assert.rejects(async () => {
    await p2.save();
  }, (err) => err.code === 11000 || /duplicate key/i.test(err.message));
});

test('Project repository respects published vs draft content filter', async () => {
  await clearTestDB();

  await Project.create([
    {
      title: 'Published Project',
      slug: 'published-proj',
      category: 'Web',
      categoryTag: 'web',
      summary: 'Summary',
      description: 'Description',
      isPublished: true,
    },
    {
      title: 'Unpublished Draft',
      slug: 'draft-proj',
      category: 'Web',
      categoryTag: 'web',
      summary: 'Draft summary',
      description: 'Draft description',
      isPublished: false,
    },
  ]);

  const allPublic = await projectRepository.findAll();
  assert.equal(allPublic.length, 1);
  assert.equal(allPublic[0].slug, 'published-proj');

  // Slug lookup for draft should return null through repository
  const draftLookup = await projectRepository.findBySlug('draft-proj');
  assert.equal(draftLookup, null);
});

test('Seed script is idempotent: running twice does not produce duplicates', async () => {
  await clearTestDB();

  // Run seed first time
  const firstRun = await seedDatabase();
  const projectCount1 = await Project.countDocuments();
  assert.ok(projectCount1 >= 4);

  // Run seed second time
  const secondRun = await seedDatabase();
  const projectCount2 = await Project.countDocuments();

  // Counts must match exactly
  assert.equal(projectCount1, projectCount2);
  assert.equal(firstRun.projects, secondRun.projects);
});

test('ContactMessage model persists data and protects sensitive telemetry from public projection', async () => {
  await clearTestDB();

  const msg = await ContactMessage.create({
    name: 'Sumit Tester',
    email: 'tester@example.com',
    message: 'Testing Mongoose contact message persistence.',
    ipAddress: '192.168.1.1',
    userAgent: 'Supertest/Agent',
  });

  assert.ok(msg._id);
  assert.equal(msg.status, 'pending');
  assert.ok(msg.createdAt);

  // Default find does not project ipAddress because select: false
  const retrieved = await ContactMessage.findById(msg._id).lean();
  assert.equal(retrieved.ipAddress, undefined);
  assert.equal(retrieved.userAgent, undefined);
  assert.equal(retrieved.name, 'Sumit Tester');
});
