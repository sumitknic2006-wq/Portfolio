import { apiClient } from './apiClient.js';
import { achievementsData } from '../data/achievementsData.js';

export const achievementsService = {
  /**
   * Fetch verified achievements and certifications, optionally filtered by category
   */
  async getAchievements(category = null) {
    try {
      const params = category && category !== 'All' ? { category } : {};
      const res = await apiClient.get('/achievements', { params });
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      console.warn('[achievementsService] Backend unavailable/timed out, using local fallback:', err.message);
    }

    if (category && category !== 'All') {
      const normCat = category.toLowerCase().trim();
      return achievementsData.filter((item) => {
        const itemCat = (item.category || item.categoryTag || '').toLowerCase().trim();
        return itemCat === normCat;
      });
    }

    return achievementsData;
  },
};

export default achievementsService;

