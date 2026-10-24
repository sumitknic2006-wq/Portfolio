import { Router } from 'express';
import { getSkills } from '../controllers/skills.controller.js';

const router = Router();

// GET /api/v1/skills (supports ?category=frontend)
router.get('/', getSkills);

export default router;
