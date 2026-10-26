import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { setupTestDB, seedTestDB, teardownTestDB } from './helpers/dbTestHelper.js';
import ContactMessage from '../src/models/ContactMessage.js';

before(async () => {
  await setupTestDB();
  await seedTestDB();
});

after(async () => {
  await teardownTestDB();
});

test('Integration: GET /api/v1/profile fulfills all Frontend Sidebar, Hero & Navbar contracts', async () => {
  const res = await request(app).get('/api/v1/profile');

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  const profile = res.body.data;

  // Verify fields required by Sidebar, Navbar, Hero, About, Contact
  assert.equal(profile.name, 'Sumit Kumar');
  assert.ok(profile.headline.includes('Full-Stack'));
  assert.equal(profile.university, 'SAGE University, Indore');
  assert.ok(profile.email.includes('@'));
  assert.ok(profile.phone);
  assert.ok(profile.location);
  assert.ok(profile.resumeUrl);
  assert.ok(profile.socials.github);
  assert.ok(profile.socials.leetcode);
  assert.ok(profile.socials.linkedin);
});

test('Integration: GET /api/v1/skills satisfies SkillCard component requirements', async () => {
  const res = await request(app).get('/api/v1/skills');

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(Array.isArray(res.body.data));
  assert.ok(res.body.data.length >= 5);

  const category = res.body.data[0];
  assert.ok(category.categoryKey);
  assert.ok(category.category);
  assert.ok(category.description);
  assert.ok(Array.isArray(category.skills));
  assert.ok(category.skills.length > 0);

  const skill = category.skills[0];
  assert.ok(skill.name);
  assert.ok(skill.focus);
  assert.ok(skill.level);
});

test('Integration: GET /api/v1/projects fulfills ProjectCard and filter tabs', async () => {
  // Test All projects
  const resAll = await request(app).get('/api/v1/projects');
  assert.equal(resAll.status, 200);
  assert.ok(resAll.body.data.length >= 4);

  const firstProj = resAll.body.data[0];
  assert.ok(firstProj.slug);
  assert.ok(firstProj.title);
  assert.ok(firstProj.summary);
  assert.ok(firstProj.categoryTag);
  assert.ok(Array.isArray(firstProj.technologies));

  // Test Web Development category filter
  const resWeb = await request(app).get('/api/v1/projects?category=web');
  assert.equal(resWeb.status, 200);
  assert.ok(resWeb.body.data.length > 0);
  resWeb.body.data.forEach((p) => {
    assert.ok(
      p.categoryTag.toLowerCase() === 'web' ||
      p.category.toLowerCase().includes('web')
    );
  });
});

test('Integration: GET /api/v1/projects/:slug provides full schema for ProjectDetailPage', async () => {
  const res = await request(app).get('/api/v1/projects/restify');

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  const project = res.body.data;

  assert.equal(project.slug, 'restify');
  assert.equal(project.title, 'RESTIFY');
  assert.ok(project.subtitle);
  assert.ok(project.description);
  assert.ok(project.problem);
  assert.ok(project.solution);
  assert.ok(project.architecture);
  assert.ok(project.contribution);
  assert.ok(project.challenges);
  assert.ok(Array.isArray(project.features));
  assert.ok(Array.isArray(project.technologies));
  assert.equal(project.isVerified, true);
});

test('Integration: GET /api/v1/projects/:slug returns 404 for non-existent slug', async () => {
  const res = await request(app).get('/api/v1/projects/unknown-slug-xyz');

  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error.code, 'PROJECT_NOT_FOUND');
});

test('Integration: GET /api/v1/achievements satisfies AchievementCard component', async () => {
  const res = await request(app).get('/api/v1/achievements');

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.data));
  assert.ok(res.body.data.length >= 3);

  const item = res.body.data[0];
  assert.ok(item.id);
  assert.ok(item.title);
  assert.ok(item.issuer);
  assert.ok(item.categoryTag);
  assert.ok(item.date);
  assert.ok(item.description);
});

test('Integration: GET /api/v1/education fulfills EducationSection timeline', async () => {
  const res = await request(app).get('/api/v1/education');

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.data.education));
  assert.ok(Array.isArray(res.body.data.experience));

  // Check education node
  const edu = res.body.data.education[0];
  assert.equal(edu.university, 'SAGE University, Indore');
  assert.ok(edu.degree);
  assert.ok(Array.isArray(edu.coreCoursework));

  // Check experience node
  const exp = res.body.data.experience.find((e) => e.id === 'gcp-arcade-facilitator');
  assert.ok(exp);
  assert.equal(exp.role, 'Google Cloud Arcade Facilitator & Arcade Labs Participant');
  assert.ok(Array.isArray(exp.highlights));
  assert.ok(Array.isArray(exp.skills));
});

test('Integration: GET /api/v1/coding-profiles provides verified GitHub and LeetCode hubs', async () => {
  const res = await request(app).get('/api/v1/coding-profiles');

  assert.equal(res.status, 200);
  assert.ok(res.body.data.github);
  assert.ok(res.body.data.leetcode);
  assert.equal(res.body.data.github.username, 'sumitknic2006-wq');
  assert.equal(res.body.data.leetcode.username, '25001122');
});

test('Integration: POST /api/v1/contact persists message and confirms 201 Created', async () => {
  const contactSubmission = {
    name: 'Sarah Connor',
    email: 'sarah.connor@cyberdyne.org',
    message: 'We are impressed with your RESTIFY and DSA projects. Would like to discuss an engineering role.',
  };

  const res = await request(app).post('/api/v1/contact').send(contactSubmission);

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.id);
  assert.equal(res.body.data.status, 'stored_successfully');
  assert.ok(res.body.data.createdAt);

  // Directly check database persistence
  const doc = await ContactMessage.findById(res.body.data.id);
  assert.ok(doc);
  assert.equal(doc.name, contactSubmission.name);
  assert.equal(doc.email, contactSubmission.email);
  assert.equal(doc.message, contactSubmission.message);
  assert.equal(doc.status, 'pending');
});
