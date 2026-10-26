import { apiClient } from './apiClient.js';

export const skillsService = {
  /**
   * Fetch technical skills, optionally filtered by category
   */
  async getSkills(category = null) {
    const params = category && category !== 'All' ? { category } : {};
    const res = await apiClient.get('/skills', { params });
    return res.data || [];
  },
};

export default skillsService;
