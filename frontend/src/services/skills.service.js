import { apiClient } from './apiClient.js';
import { skillsData } from '../data/skillsData.js';

export const skillsService = {
  /**
   * Fetch technical skills, optionally filtered by category
   */
  async getSkills(category = null) {
    try {
      const params = category && category !== 'All' ? { category } : {};
      const res = await apiClient.get('/skills', { params });
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      console.warn('[skillsService] Backend unavailable/timed out, using local fallback:', err.message);
    }

    if (category && category !== 'All') {
      const normCat = category.toLowerCase().trim();
      return skillsData.filter((item) => {
        const itemCat = (item.category || item.categoryKey || '').toLowerCase().trim();
        return itemCat === normCat;
      });
    }

    return skillsData;
  },
};

export default skillsService;

