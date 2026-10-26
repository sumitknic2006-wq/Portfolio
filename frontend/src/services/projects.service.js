import { apiClient } from './apiClient.js';

export const projectsService = {
  /**
   * Fetch portfolio projects, optionally filtered by category
   */
  async getProjects(category = null) {
    const params = category && category !== 'All' ? { category } : {};
    const res = await apiClient.get('/projects', { params });
    return res.data || [];
  },

  /**
   * Fetch full architecture details for a single project by unique slug
   */
  async getProjectBySlug(slug) {
    if (!slug) return null;
    const res = await apiClient.get(`/projects/${slug}`);
    return res.data;
  },
};

export default projectsService;
