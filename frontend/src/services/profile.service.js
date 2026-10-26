import { apiClient } from './apiClient.js';

export const profileService = {
  /**
   * Fetch verified public developer profile from backend
   */
  async getProfile() {
    const res = await apiClient.get('/profile');
    return res.data;
  },
};

export default profileService;
