import { portfolioService } from '../services/portfolio.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * GET /api/v1/profile
 * Returns public developer portfolio profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const profile = await portfolioService.getProfile();
  return sendSuccess(res, profile, 'Profile retrieved successfully');
});

export default getProfile;
