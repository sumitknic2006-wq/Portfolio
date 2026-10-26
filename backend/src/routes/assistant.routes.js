import { Router } from 'express';
import {
  getAssistantStatus,
  chatWithAssistant,
} from '../controllers/assistant.controller.js';
import { validateRequestBody } from '../middleware/validateRequest.js';
import { assistantChatSchema } from '../validators/assistant.validator.js';
import { assistantLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// GET /api/v1/assistant/status
router.get('/status', getAssistantStatus);

// POST /api/v1/assistant/chat
router.post(
  '/chat',
  assistantLimiter,
  validateRequestBody(assistantChatSchema),
  chatWithAssistant
);

export default router;
