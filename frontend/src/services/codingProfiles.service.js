import { apiClient } from './apiClient.js';

export const codingProfilesService = {
  /**
   * Fetch verified coding profile statistics (GitHub and LeetCode)
   */
  async getCodingProfiles() {
    try {
      const res = await apiClient.get('/coding-profiles');
      if (res?.data) return res.data;
    } catch (err) {
      console.warn('[codingProfilesService] Backend unavailable/timed out, using local fallback:', err.message);
    }

    return {
      github: {
        username: 'sumitknic2006-wq',
        profileUrl: 'https://github.com/sumitknic2006-wq',
        status: 'Active',
      },
      leetcode: {
        username: '25001122',
        profileUrl: 'https://leetcode.com/u/25001122/',
        status: 'Active Solver',
      },
      codeforces: {
        handle: 'sumitknic567',
        profileUrl: 'https://codeforces.com/profile/sumitknic567',
        status: 'Active Contestant',
      },
    };
  },
};

export default codingProfilesService;

