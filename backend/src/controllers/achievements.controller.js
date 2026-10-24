import { portfolioService } from '../services/portfolio.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * GET /api/v1/achievements
 * Supports category filtering (?category=hackathon)
 */
export const getAchievements = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const achievements = await portfolioService.getAchievements(category);

  return sendSuccess(
    res,
    achievements,
    category
      ? `Achievements filtered by category '${category}'`
      : 'All achievements retrieved successfully',
    200,
    {
      categoryFilter: category || null,
      count: achievements.length,
    }
  );
});

export default getAchievements;
