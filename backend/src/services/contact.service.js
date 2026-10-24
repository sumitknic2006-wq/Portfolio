import mongoose from 'mongoose';

/**
 * Custom Error for Service Availability Constraints
 */
export class ServiceUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ServiceUnavailableError';
    this.statusCode = 503;
    this.code = 'SERVICE_UNAVAILABLE';
    this.isOperational = true;
  }
}

/**
 * Contact Service Layer
 * 
 * In Phase 3:
 * Rejects fake successes. Because MongoDB is not connected and email transport
 * is not configured, this service returns a strictly honest 503 Service Unavailable
 * response.
 * 
 * In Phase 4:
 * When MongoDB is connected, messages will be saved into the ContactMessage collection
 * and dispatched to the configured administrator inbox.
 */
export const contactService = {
  isConfigured() {
    // Phase 3: MongoDB is intentionally not connected.
    const isDbConnected = mongoose.connection.readyState === 1;
    const hasEmailApiKey = Boolean(process.env.RESEND_API_KEY);
    return isDbConnected && hasEmailApiKey;
  },

  async handleInquiry(inquiryData) {
    // Strict Honesty Check: Do NOT fake message delivery or storage
    if (!this.isConfigured()) {
      throw new ServiceUnavailableError(
        'Contact inquiry received and validated, but persistent storage and message delivery are currently offline in Phase 3. Live transmission will be enabled upon MongoDB connection in Phase 4.'
      );
    }

    // Planned Phase 4 logic:
    // const message = await ContactMessage.create(inquiryData);
    // await sendEmailNotification(inquiryData);
    // return { id: message._id, status: 'delivered' };
  },
};

export default contactService;
