import { portfolioService } from '../services/portfolio.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * GET /api/v1/coding-profiles
 * Returns public GitHub and LeetCode links with verified problem-solving highlights
 */
export const getCodingProfiles = asyncHandler(async (req, res) => {
  const profiles = await portfolioService.getCodingProfiles();
  return sendSuccess(res, profiles, 'Coding profiles retrieved successfully');
});

export default getCodingProfiles;
