import { Router } from 'express';
import healthRoutes from './health.routes.js';

const router = Router();

// Health check endpoint
router.use('/health', healthRoutes);

/**
 * Planned Route Groups (Architecture for Phase 2 & beyond):
 * - router.use('/profile', profileRoutes);
 * - router.use('/skills', skillsRoutes);
 * - router.use('/projects', projectsRoutes);
 * - router.use('/education', educationRoutes);
 * - router.use('/achievements', achievementsRoutes);
 * - router.use('/coding-profiles', codingProfilesRoutes);
 * - router.use('/contact', contactRoutes);
 * - router.use('/assistant', assistantRoutes);
 */

export default router;
