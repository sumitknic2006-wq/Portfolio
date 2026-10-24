import { contactService } from '../services/contact.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * POST /api/v1/contact
 * Validates inquiry payload and invokes contact service
 * Strictly rejects fake submissions when persistence/delivery are offline (Phase 3)
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

  // This line is only reached when persistence is truly configured and successful (Phase 4)
  return sendSuccess(
    res,
    result,
    'Your inquiry has been successfully delivered.',
    201
  );
});

export default submitContactInquiry;
