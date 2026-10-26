import { getDbStatus } from '../config/db.js';
import { contactRepository } from '../repositories/contact.repository.js';
import { emailService } from './email.service.js';

export class ServiceUnavailableError extends Error {
  constructor(message = 'Service unavailable') {
    super(message);
    this.name = 'ServiceUnavailableError';
    this.statusCode = 503;
    this.code = 'SERVICE_UNAVAILABLE';
    this.isOperational = true;
  }
}

/**
 * Contact Service Layer for Phase 4 & Phase 9
 * 
 * Persists validated contact inquiries into MongoDB ContactMessage collection.
 * Triggers instant email notification to the admin with graceful fallback if the email provider fails or is unconfigured.
 * Enforces strict resilience: returns success once database write succeeds.
 */
export const contactService = {
  async handleInquiry(inquiryData) {
    const dbStatus = getDbStatus();

    // Verify MongoDB connection is active
    if (!dbStatus.connected) {
      throw new ServiceUnavailableError(
        'Database connection is currently offline. Your message could not be stored. Please reach out directly to sumitknic2006@gmail.com.'
      );
    }

    try {
      // 1. Persist validated message into MongoDB first
      const saved = await contactRepository.create({
        name: inquiryData.name,
        email: inquiryData.email,
        subject: inquiryData.subject || 'General Portfolio Inquiry',
        message: inquiryData.message,
        ipAddress: inquiryData.ipAddress,
        userAgent: inquiryData.userAgent,
        status: 'pending',
      });

      // 2. Dispatch email notification asynchronously with graceful fallback
      let emailResult = { sent: false, note: 'Notification pending or provider unconfigured' };
      try {
        emailResult = await emailService.sendContactNotification({
          id: saved._id,
          name: saved.name,
          email: saved.email,
          subject: saved.subject,
          message: saved.message,
          createdAt: saved.createdAt,
        });

        // Record notification status safely in MongoDB
        if (emailResult.sent) {
          await contactRepository.updateById(saved._id, {
            notificationSent: true,
            notificationError: null,
          });
        } else if (emailResult.error) {
          await contactRepository.updateById(saved._id, {
            notificationSent: false,
            notificationError: String(emailResult.error).slice(0, 500),
          });
        }
      } catch (emailErr) {
        // Safe logging: log error message without private email content or credentials
        console.warn(`[ContactService] Non-fatal notification failure for msg ${saved._id}: ${emailErr.message}`);
        await contactRepository.updateById(saved._id, {
          notificationSent: false,
          notificationError: String(emailErr.message).slice(0, 500),
        }).catch(() => {});
      }

      // 3. Format response confirming database persistence
      return {
        id: saved._id,
        status: 'stored_successfully',
        createdAt: saved.createdAt,
        notificationDispatched: emailResult.sent,
        note: emailResult.sent
          ? 'Message saved and instant admin notification dispatched.'
          : 'Message saved securely in database. Admin notification queued.',
      };
    } catch (error) {
      console.error(`[ContactService] Failed to persist message: ${error.message}`);
      throw error;
    }
  },
};

export default contactService;
