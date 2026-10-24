import { Router } from 'express';
import { submitContactInquiry } from '../controllers/contact.controller.js';
import { validateRequestBody } from '../middleware/validateRequest.js';
import { contactSchema } from '../validators/contact.validator.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// POST /api/v1/contact
router.post(
  '/',
  contactLimiter,
  validateRequestBody(contactSchema),
  submitContactInquiry
);

export default router;
