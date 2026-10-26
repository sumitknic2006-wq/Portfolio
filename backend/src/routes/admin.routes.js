import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { adminAuthLimiter } from '../middleware/rateLimiter.js';
import {
  adminLoginSchema,
  messageStatusSchema,
  messageReplySchema,
} from '../validators/admin.validator.js';

const router = Router();

// Authentication endpoints
router.post(
  '/auth/login',
  adminAuthLimiter,
  validateRequest(adminLoginSchema),
  adminController.login
);

router.post('/auth/logout', adminController.logout);

router.get('/auth/me', authenticateAdmin, adminController.getMe);

// Statistics endpoint (protected)
router.get('/messages/stats', authenticateAdmin, adminController.getStats);

// Contact messages management endpoints (protected)
router.get('/messages', authenticateAdmin, adminController.getMessages);

router.get('/messages/:id', authenticateAdmin, adminController.getMessageById);

router.patch('/messages/:id/read', authenticateAdmin, adminController.toggleReadStatus);

router.patch(
  '/messages/:id/status',
  authenticateAdmin,
  validateRequest(messageStatusSchema),
  adminController.updateStatus
);

router.post(
  '/messages/:id/reply',
  authenticateAdmin,
  validateRequest(messageReplySchema),
  adminController.replyToMessage
);

router.delete('/messages/:id', authenticateAdmin, adminController.deleteMessage);

export default router;
