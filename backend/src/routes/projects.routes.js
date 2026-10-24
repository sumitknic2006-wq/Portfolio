import { Router } from 'express';
import { getProjects, getProjectBySlug } from '../controllers/projects.controller.js';

const router = Router();

// GET /api/v1/projects (supports ?category=web)
router.get('/', getProjects);

// GET /api/v1/projects/:slug
router.get('/:slug', getProjectBySlug);

export default router;
