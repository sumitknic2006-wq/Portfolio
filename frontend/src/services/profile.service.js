import { apiClient } from './apiClient.js';
import { profileData } from '../data/profileData.js';

export const profileService = {
  /**
   * Fetch verified public developer profile from backend
   */
  async getProfile() {
    try {
      const res = await apiClient.get('/profile');
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('[profileService] Backend unavailable/timed out, using local fallback:', err.message);
    }

    return profileData;
  },
};

export default profileService;

