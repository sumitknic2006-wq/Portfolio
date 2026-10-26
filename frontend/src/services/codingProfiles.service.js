import { apiClient } from './apiClient.js';

export const codingProfilesService = {
  /**
   * Fetch verified coding profile statistics (GitHub and LeetCode)
   */
  async getCodingProfiles() {
    const res = await apiClient.get('/coding-profiles');
    return res.data || {};
  },
};

export default codingProfilesService;
