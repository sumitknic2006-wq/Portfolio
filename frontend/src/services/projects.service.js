import { apiClient } from './apiClient.js';
import { projectsData } from '../data/projectsData.js';

export const projectsService = {
  /**
   * Fetch portfolio projects, optionally filtered by category
   */
  async getProjects(category = null) {
    try {
      const params = category && category !== 'All' ? { category } : {};
      const res = await apiClient.get('/projects', { params });
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      console.warn('[projectsService] Backend unavailable/timed out, using local fallback:', err.message);
    }

    if (category && category !== 'All') {
      const normCat = category.toLowerCase().trim();
      return projectsData.filter((item) => {
        const itemCat = (item.category || item.categoryTag || '').toLowerCase().trim();
        return itemCat === normCat;
      });
    }

    return projectsData;
  },

  /**
   * Fetch full architecture details for a single project by unique slug
   */
  async getProjectBySlug(slug) {
    if (!slug) return null;
    try {
      const res = await apiClient.get(`/projects/${slug}`);
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('[projectsService] Backend unavailable/timed out, using local fallback for slug:', slug);
    }

    return projectsData.find((p) => p.slug === slug) || null;
  },
};

export default projectsService;

