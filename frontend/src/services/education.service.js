import { apiClient } from './apiClient.js';

export const educationService = {
  /**
   * Fetch university education curriculum and professional experience
   */
  async getEducation() {
    const res = await apiClient.get('/education');
    return res.data || { education: [], experience: [] };
  },
};

export default educationService;
