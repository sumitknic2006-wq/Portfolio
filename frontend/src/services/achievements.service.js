import { apiClient } from './apiClient.js';

export const achievementsService = {
  /**
   * Fetch verified achievements and certifications, optionally filtered by category
   */
  async getAchievements(category = null) {
    const params = category && category !== 'All' ? { category } : {};
    const res = await apiClient.get('/achievements', { params });
    return res.data || [];
  },
};

export default achievementsService;
