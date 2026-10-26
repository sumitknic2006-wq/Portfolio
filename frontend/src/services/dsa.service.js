import apiClient from './apiClient.js';

export const dsaService = {
  /**
   * Get overview statistics for all supported DSA platforms
   */
  async getPlatformsOverview() {
    return apiClient.get('/dsa/platforms');
  },

  /**
   * Get LeetCode profile statistics and paginated problems
   */
  async getLeetcode({
    page = 1,
    limit = 10,
    difficulty = '',
    category = '',
    search = '',
    provenance = '',
    sort = 'problemId',
    order = 'asc',
  } = {}) {
    return apiClient.get('/dsa/leetcode', {
      params: { page, limit, difficulty, category, search, provenance, sort, order },
    });
  },

  /**
   * Get Codeforces profile statistics and paginated problems
   */
  async getCodeforces({
    page = 1,
    limit = 10,
    difficulty = '',
    category = '',
    search = '',
    provenance = '',
    sort = 'problemId',
    order = 'asc',
  } = {}) {
    return apiClient.get('/dsa/codeforces', {
      params: { page, limit, difficulty, category, search, provenance, sort, order },
    });
  },

  /**
   * Force manual synchronization of real account data for a platform
   */
  async syncPlatform(platform, full = false) {
    return apiClient.post(`/dsa/sync/${platform}${full ? '?full=true' : ''}`);
  },

  /**
   * Get full problem detail by platform and slug
   */
  async getProblemDetail(platform, slug) {
    return apiClient.get(`/dsa/problems/${platform}/${slug}`);
  },

  /**
   * Preview problem imports with validation & duplicate detection
   */
  async previewImport(platform, rawData) {
    return apiClient.post('/dsa/import/preview', { platform, data: rawData });
  },

  /**
   * Import problems array or raw string into MongoDB
   */
  async importProblems(data, platform = 'leetcode') {
    return apiClient.post('/dsa/import', { platform, data });
  },

  /**
   * Update personal notes or solution code for a problem
   */
  async updateProblem(platform, slug, updateData) {
    return apiClient.patch(`/dsa/problems/${platform}/${slug}`, updateData);
  },

  /**
   * Get sync status and scheduler health
   */
  async getSyncStatus() {
    return apiClient.get('/dsa/sync/status');
  },
};

export default dsaService;
