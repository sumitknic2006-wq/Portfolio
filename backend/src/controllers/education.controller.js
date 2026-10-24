import { portfolioService } from '../services/portfolio.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * GET /api/v1/education
 * Returns available education and experience entries without missing or invented claims
 */
export const getEducation = asyncHandler(async (req, res) => {
  const records = await portfolioService.getEducationAndExperience();
  return sendSuccess(res, records, 'Education and professional experience retrieved successfully');
});

export default getEducation;
