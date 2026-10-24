import { portfolioService } from '../services/portfolio.service.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * GET /api/v1/projects
 * Supports category filtering (?category=web)
 */
export const getProjects = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const projects = await portfolioService.getProjects(category);

  return sendSuccess(
    res,
    projects,
    category
      ? `Projects filtered by category '${category}'`
      : 'All projects retrieved successfully',
    200,
    {
      categoryFilter: category || null,
      count: projects.length,
    }
  );
});

/**
 * GET /api/v1/projects/:slug
 * Retrieves specific project by its unique slug identifier
 */
export const getProjectBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const project = await portfolioService.getProjectBySlug(slug);

  if (!project) {
    return sendError(
      res,
      `Project with slug '${slug}' was not found in verified portfolio records`,
      404,
      null,
      'PROJECT_NOT_FOUND'
    );
  }

  return sendSuccess(res, project, `Project '${project.title}' retrieved successfully`);
});

export default {
  getProjects,
  getProjectBySlug,
};
