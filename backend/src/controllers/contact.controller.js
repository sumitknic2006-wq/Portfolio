import { contactService } from '../services/contact.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * POST /api/v1/contact
 * Validates inquiry payload and invokes contact service for MongoDB persistence
 * Strictly rejects fake submissions when database is offline
 */
export const submitContactInquiry = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  // Process contact inquiry through service boundary
  const result = await contactService.handleInquiry({
    name,
    email,
    message,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  });

  return sendSuccess(
    res,
    result,
    'Your inquiry has been successfully received and stored securely.',
    201
  );
});

export default submitContactInquiry;
