import { Router } from 'express';
import { getProfile } from '../controllers/profile.controller.js';

const router = Router();

// GET /api/v1/profile
router.get('/', getProfile);

export default router;
