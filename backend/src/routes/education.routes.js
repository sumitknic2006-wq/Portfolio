import { Router } from 'express';
import { getEducation } from '../controllers/education.controller.js';

const router = Router();

// GET /api/v1/education
router.get('/', getEducation);

export default router;
