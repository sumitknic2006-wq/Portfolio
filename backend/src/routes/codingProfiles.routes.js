import { Router } from 'express';
import { getCodingProfiles } from '../controllers/codingProfiles.controller.js';

const router = Router();

// GET /api/v1/coding-profiles
router.get('/', getCodingProfiles);

export default router;
