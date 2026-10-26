import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { contactRepository } from '../repositories/contact.repository.js';
import { emailService } from '../services/email.service.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const adminController = {
  /**
   * POST /api/v1/admin/auth/login
   * Authenticates administrator credentials and issues HttpOnly JWT cookie + Bearer token
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
      if (!admin) {
        return sendError(res, 'Invalid email or password credentials.', 401, null, 'INVALID_CREDENTIALS');
      }

      const isValidPassword = await admin.comparePassword(password);
      if (!isValidPassword) {
        return sendError(res, 'Invalid email or password credentials.', 401, null, 'INVALID_CREDENTIALS');
      }

      // Generate JWT
      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: admin.role },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
      );

      // Record last login timestamp
      admin.lastLogin = new Date();
      await admin.save();

      // Configure secure HttpOnly cookie
      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: env.isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return sendSuccess(
        res,
        {
          token,
          admin: {
            id: admin._id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
            lastLogin: admin.lastLogin,
          },
        },
        'Admin authentication successful'
      );
    } catch (err) {
      console.error(`[AdminController] Login error: ${err.message}`);
      return sendError(res, 'Internal server error during authentication.', 500);
    }
  },

  /**
   * POST /api/v1/admin/auth/logout
   * Clears admin cookie session
   */
  async logout(req, res) {
    res.clearCookie('admin_token', {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: env.isProduction ? 'none' : 'lax',
    });
    return sendSuccess(res, null, 'Logged out successfully');
  },

  /**
   * GET /api/v1/admin/auth/me
   * Fetches profile of currently authenticated administrator
   */
  async getMe(req, res) {
    return sendSuccess(
      res,
      {
        admin: {
          id: req.admin._id,
          name: req.admin.name,
          email: req.admin.email,
          role: req.admin.role,
          lastLogin: req.admin.lastLogin,
        },
      },
      'Admin session active'
    );
  },

  /**
   * GET /api/v1/admin/messages/stats
   * Retrieves aggregated portfolio contact counts directly from MongoDB
   */
  async getStats(req, res) {
    try {
      const stats = await contactRepository.getStats();
      return sendSuccess(res, stats, 'Dashboard statistics retrieved');
    } catch (err) {
      console.error(`[AdminController] Stats error: ${err.message}`);
      return sendError(res, 'Failed to fetch contact statistics.', 500);
    }
  },

  /**
   * GET /api/v1/admin/messages
   * Paginated contact inbox with filtering by status, isRead, and search term
   */
  async getMessages(req, res) {
    try {
      const { page, limit, status, isRead, search } = req.query;
      const result = await contactRepository.findPaginated({
        page,
        limit,
        status,
        isRead,
        search,
      });

      return sendSuccess(res, result.messages, 'Messages retrieved', 200, result.pagination);
    } catch (err) {
      console.error(`[AdminController] Messages query error: ${err.message}`);
      return sendError(res, 'Failed to query contact messages.', 500);
    }
  },

  /**
   * GET /api/v1/admin/messages/:id
   * Retrieves single contact message with complete details
   */
  async getMessageById(req, res) {
    try {
      const { id } = req.params;
      const message = await contactRepository.findById(id);
      if (!message) {
        return sendError(res, 'Message not found.', 404, null, 'MESSAGE_NOT_FOUND');
      }
      return sendSuccess(res, message, 'Message retrieved');
    } catch (err) {
      console.error(`[AdminController] Get message error: ${err.message}`);
      return sendError(res, 'Failed to load message.', 500);
    }
  },

  /**
   * PATCH /api/v1/admin/messages/:id/read
   * Toggles or sets read status of a message
   */
  async toggleReadStatus(req, res) {
    try {
      const { id } = req.params;
      const message = await contactRepository.findById(id);
      if (!message) {
        return sendError(res, 'Message not found.', 404, null, 'MESSAGE_NOT_FOUND');
      }

      const nextRead = req.body && typeof req.body.isRead === 'boolean' ? req.body.isRead : !message.isRead;
      const updated = await contactRepository.updateById(id, { isRead: nextRead });

      return sendSuccess(res, updated, `Message marked as ${nextRead ? 'read' : 'unread'}`);
    } catch (err) {
      console.error(`[AdminController] Toggle read error: ${err.message}`);
      return sendError(res, 'Failed to update read status.', 500);
    }
  },

  /**
   * PATCH /api/v1/admin/messages/:id/status
   * Updates message status (pending, processed, replied, archived)
   */
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updated = await contactRepository.updateById(id, { status });
      if (!updated) {
        return sendError(res, 'Message not found.', 404, null, 'MESSAGE_NOT_FOUND');
      }

      return sendSuccess(res, updated, `Message status updated to ${status}`);
    } catch (err) {
      console.error(`[AdminController] Update status error: ${err.message}`);
      return sendError(res, 'Failed to update message status.', 500);
    }
  },

  /**
   * POST /api/v1/admin/messages/:id/reply
   * Sends transactional email reply to visitor via configured provider & updates status
   */
  async replyToMessage(req, res) {
    try {
      const { id } = req.params;
      const { replyText, subject } = req.body;

      const message = await contactRepository.findById(id);
      if (!message) {
        return sendError(res, 'Message not found.', 404, null, 'MESSAGE_NOT_FOUND');
      }

      if (!emailService.isConfigured()) {
        return sendError(
          res,
          'Cannot send in-app reply: RESEND_API_KEY is not configured in backend environment. You can use the mailto action to reply directly via your email client.',
          503,
          null,
          'EMAIL_PROVIDER_UNCONFIGURED'
        );
      }

      // Dispatch reply through Resend
      const dispatch = await emailService.sendReplyToVisitor({
        to: message.email,
        visitorName: message.name,
        subject: subject || message.subject || 'Portfolio Inquiry',
        replyText,
        originalMessage: message.message,
      });

      // Update message status in MongoDB
      const updated = await contactRepository.updateById(id, {
        status: 'replied',
        isRead: true,
        replyText,
        repliedAt: new Date(),
      });

      return sendSuccess(
        res,
        {
          message: updated,
          deliveryId: dispatch.id,
        },
        'Reply dispatched to visitor and message status set to replied.'
      );
    } catch (err) {
      console.error(`[AdminController] Reply dispatch error: ${err.message}`);
      return sendError(
        res,
        err.message || 'Failed to dispatch email reply to visitor.',
        err.statusCode || 500,
        null,
        err.code || 'EMAIL_REPLY_FAILED'
      );
    }
  },

  /**
   * DELETE /api/v1/admin/messages/:id
   * Deletes a contact message after administrator confirmation
   */
  async deleteMessage(req, res) {
    try {
      const { id } = req.params;
      const deleted = await contactRepository.deleteById(id);
      if (!deleted) {
        return sendError(res, 'Message not found.', 404, null, 'MESSAGE_NOT_FOUND');
      }
      return sendSuccess(res, null, 'Message deleted successfully');
    } catch (err) {
      console.error(`[AdminController] Delete message error: ${err.message}`);
      return sendError(res, 'Failed to delete message.', 500);
    }
  },
};

export default adminController;
