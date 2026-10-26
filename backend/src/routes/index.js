import { Router } from 'express';
import healthRoutes from './health.routes.js';
import profileRoutes from './profile.routes.js';
import skillsRoutes from './skills.routes.js';
import projectsRoutes from './projects.routes.js';
import achievementsRoutes from './achievements.routes.js';
import educationRoutes from './education.routes.js';
import codingProfilesRoutes from './codingProfiles.routes.js';
import contactRoutes from './contact.routes.js';
import assistantRoutes from './assistant.routes.js';
import adminRoutes from './admin.routes.js';
import dsaRoutes from './dsa.routes.js';

const router = Router();

// Health check endpoint
router.use('/health', healthRoutes);

// Public Portfolio Endpoints
router.use('/profile', profileRoutes);
router.use('/skills', skillsRoutes);
router.use('/projects', projectsRoutes);
router.use('/achievements', achievementsRoutes);
router.use('/education', educationRoutes);
router.use('/coding-profiles', codingProfilesRoutes);

// DSA Explorer & Platform Trackers
router.use('/dsa', dsaRoutes);

// AI Portfolio Assistant
router.use('/assistant', assistantRoutes);

// Contact Inquiry Submission
router.use('/contact', contactRoutes);

// Secure Portfolio Admin Dashboard & Inbox
router.use('/admin', adminRoutes);

export default router;
