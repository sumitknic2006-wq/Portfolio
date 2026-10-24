import { portfolioService } from '../services/portfolio.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * GET /api/v1/skills
 * Supports category filtering (?category=frontend)
 */
export const getSkills = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const skills = await portfolioService.getSkills(category);

  const totalSkillsCount = skills.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0);

  return sendSuccess(
    res,
    skills,
    category
      ? `Skills filtered by category '${category}'`
      : 'All skill categories retrieved successfully',
    200,
    {
      categoryFilter: category || null,
      categoriesCount: skills.length,
      totalSkillsCount,
    }
  );
});

export default getSkills;
