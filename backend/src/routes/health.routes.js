import { Router } from 'express';
import { getHealthStatus } from '../controllers/health.controller.js';

const router = Router();

// GET /health and /api/v1/health
router.get('/', getHealthStatus);

export default router;
