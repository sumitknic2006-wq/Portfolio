import apiClient from './apiClient.js';
import { dsaProblems } from '../data/dsaData.js';

export const dsaService = {
  /**
   * Get overview statistics for all supported DSA platforms
   */
  async getPlatformsOverview() {
    try {
      const res = await apiClient.get('/dsa/platforms');
      if (res?.data) return res;
    } catch (err) {
      console.warn('[dsaService] Backend unavailable/timed out, using local fallback:', err.message);
    }

    return {
      success: true,
      data: {
        leetcode: {
          username: '25001122',
          profileUrl: 'https://leetcode.com/u/25001122/',
          totalSolved: 186,
          easySolved: 128,
          mediumSolved: 56,
          hardSolved: 2,
          dashboardUrl: '/dsa/leetcode',
        },
        codeforces: {
          handle: 'sumitknic567',
          profileUrl: 'https://codeforces.com/profile/sumitknic567',
          rating: 0,
          rank: 'Unrated',
          solvedCount: 0,
          dashboardUrl: '/dsa/codeforces',
        },
      },
    };
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
    try {
      const res = await apiClient.get('/dsa/leetcode', {
        params: { page, limit, difficulty, category, search, provenance, sort, order },
      });
      if (res?.data) return res;
    } catch (err) {
      console.warn('[dsaService] Backend unavailable/timed out, using local fallback:', err.message);
    }

    // Format local fallback problems
    let filtered = [...dsaProblems];
    if (difficulty) {
      filtered = filtered.filter(p => p.difficulty?.toLowerCase() === difficulty.toLowerCase());
    }
    if (category) {
      filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.problemNumber?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        profile: {
          username: '25001122',
          profileUrl: 'https://leetcode.com/u/25001122/',
          totalSolved: 186,
          easySolved: 128,
          mediumSolved: 56,
          hardSolved: 2,
          ranking: 'Top 15%',
          acceptanceRate: '68.4%',
        },
        problems: paginated,
        stats: {
          total: 186,
          easy: 128,
          medium: 56,
          hard: 2,
          curatedCount: dsaProblems.length,
        },
      },
      meta: {
        page,
        limit,
        totalProblems: filtered.length,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      },
    };
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
    try {
      const res = await apiClient.get('/dsa/codeforces', {
        params: { page, limit, difficulty, category, search, provenance, sort, order },
      });
      if (res?.data) return res;
    } catch (err) {
      console.warn('[dsaService] Backend unavailable/timed out, using local fallback:', err.message);
    }

    return {
      success: true,
      data: {
        profile: {
          handle: 'sumitknic567',
          profileUrl: 'https://codeforces.com/profile/sumitknic567',
          rating: 0,
          rank: 'Unrated',
          maxRating: 0,
          maxRank: 'Unrated',
          contribution: 0,
          solvedCount: 0,
        },
        problems: [],
        stats: {
          totalSolved: 0,
          contestsCount: 0,
          maxRating: 0,
        },
      },
      meta: {
        page,
        limit,
        totalProblems: 0,
        totalPages: 1,
      },
    };
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
    try {
      const res = await apiClient.get(`/dsa/problems/${platform}/${slug}`);
      if (res?.data) return res;
    } catch (err) {
      console.warn('[dsaService] Backend unavailable/timed out, using local fallback for problem:', slug);
    }

    const problem = dsaProblems.find(p => p.id === slug || p.slug === slug);
    if (problem) {
      return { success: true, data: problem };
    }
    return { success: false, data: null };
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
