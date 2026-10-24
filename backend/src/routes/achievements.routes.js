import { Router } from 'express';
import { getAchievements } from '../controllers/achievements.controller.js';

const router = Router();

// GET /api/v1/achievements (supports ?category=hackathon)
router.get('/', getAchievements);

export default router;
