import { apiClient } from './apiClient.js';
import { educationData } from '../data/educationData.js';

export const educationService = {
  /**
   * Fetch university education curriculum and professional experience
   */
  async getEducation() {
    try {
      const res = await apiClient.get('/education');
      if (res?.data && (res.data.education?.length || res.data.experience?.length)) {
        return res.data;
      }
    } catch (err) {
      console.warn('[educationService] Backend unavailable/timed out, using local fallback:', err.message);
    }

    return educationData;
  },
};

export default educationService;

