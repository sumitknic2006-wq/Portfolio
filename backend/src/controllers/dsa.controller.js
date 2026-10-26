import { dsaService } from '../services/dsa.service.js';
import { dsaSchedulerService } from '../services/dsaScheduler.service.js';
import { DsaSyncState } from '../models/DsaSyncState.js';
import { env } from '../config/env.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const dsaController = {
  /**
   * GET /api/v1/dsa/platforms
   * Returns overview cards data for LeetCode & Codeforces
   */
  async getPlatforms(req, res) {
    try {
      const data = await dsaService.getPlatformsOverview();
      return sendSuccess(res, data, 'DSA platforms overview retrieved');
    } catch (err) {
      console.error(`[DsaController] getPlatforms error: ${err.message}`);
      return sendError(res, 'Failed to retrieve DSA platform statistics.', 500);
    }
  },

  /**
   * GET /api/v1/dsa/leetcode
   * Returns LeetCode profile info and solved problems list
   */
  async getLeetcode(req, res) {
    try {
      const [profileStats, problemsData] = await Promise.all([
        dsaService.fetchLeetcodeLiveStats(),
        dsaService.getProblems('leetcode', req.query),
      ]);

      const responsePayload = {
        profile: profileStats,
        problems: problemsData.problems,
        stats: problemsData.stats,
      };

      return sendSuccess(
        res,
        responsePayload,
        'LeetCode problem tracker retrieved',
        200,
        problemsData.pagination
      );
    } catch (err) {
      console.error(`[DsaController] getLeetcode error: ${err.message}`);
      return sendError(res, 'Failed to retrieve LeetCode dashboard data.', 500);
    }
  },

  /**
   * GET /api/v1/dsa/codeforces
   * Returns Codeforces profile info and problems list
   */
  async getCodeforces(req, res) {
    try {
      const [profileStats, problemsData] = await Promise.all([
        dsaService.fetchCodeforcesLiveStats(),
        dsaService.getProblems('codeforces', req.query),
      ]);

      const responsePayload = {
        profile: profileStats,
        problems: problemsData.problems,
        stats: problemsData.stats,
      };

      return sendSuccess(
        res,
        responsePayload,
        'Codeforces problem tracker retrieved',
        200,
        problemsData.pagination
      );
    } catch (err) {
      console.error(`[DsaController] getCodeforces error: ${err.message}`);
      return sendError(res, 'Failed to retrieve Codeforces dashboard data.', 500);
    }
  },

  /**
   * GET /api/v1/dsa/problems/:platform/:slug
   * Returns full problem detail including dry run and source code
   */
  async getProblemDetail(req, res) {
    try {
      const { platform, slug } = req.params;
      if (!['leetcode', 'codeforces'].includes(platform.toLowerCase())) {
        return sendError(res, 'Invalid platform. Must be leetcode or codeforces.', 400);
      }

      const problem = await dsaService.getProblemDetail(platform, slug);
      if (!problem) {
        return sendError(
          res,
          `Problem '${slug}' not found for platform '${platform}'.`,
          404,
          null,
          'PROBLEM_NOT_FOUND'
        );
      }

      return sendSuccess(res, problem, 'Problem detail retrieved');
    } catch (err) {
      console.error(`[DsaController] getProblemDetail error: ${err.message}`);
      return sendError(res, 'Failed to retrieve problem detail.', 500);
    }
  },

  /**
   * POST /api/v1/dsa/import/preview
   * Previews raw JSON/CSV problem imports with validation & duplicate detection
   */
  async previewImport(req, res) {
    try {
      const platform = req.body.platform || 'leetcode';
      const rawData =
        req.body.rawText !== undefined
          ? req.body.rawText
          : (req.body.data || req.body.problems || req.body.csv || req.body);
      const preview = await dsaService.previewImport(platform, rawData);
      return sendSuccess(res, preview, 'Import preview generated successfully.');
    } catch (err) {
      console.error(`[DsaController] previewImport error: ${err.message}`);
      return sendError(res, err.message || 'Failed to preview import.', 400);
    }
  },

  /**
   * POST /api/v1/dsa/import
   * Imports validated problem records into MongoDB with duplicate protection
   */
  async importProblems(req, res) {
    try {
      const platform = req.body.platform || 'leetcode';
      const rawData = req.body.problems || req.body.data || req.body;
      const result = await dsaService.importProblems(rawData, platform);
      return sendSuccess(
        res,
        result,
        result.message || `Successfully imported ${result.importedCount} problem record(s) into database.`,
        201
      );
    } catch (err) {
      console.error(`[DsaController] importProblems error: ${err.message}`);
      return sendError(
        res,
        err.message || 'Failed to import problem records.',
        err.statusCode || 500
      );
    }
  },

  /**
   * PATCH /api/v1/dsa/problems/:platform/:slug
   * Updates personal notes, dry run, or code for a problem
   */
  async updateProblem(req, res) {
    try {
      const { platform, slug } = req.params;
      const updated = await dsaService.updateProblem(platform, slug, req.body);
      if (!updated) {
        return sendError(res, 'Problem not found to update.', 404, null, 'PROBLEM_NOT_FOUND');
      }

      return sendSuccess(res, updated, 'Problem solution notes updated successfully.');
    } catch (err) {
      console.error(`[DsaController] updateProblem error: ${err.message}`);
      return sendError(res, err.message || 'Failed to update problem notes.', err.statusCode || 500);
    }
  },

  /**
   * POST /api/v1/dsa/sync/:platform
   * Forces manual synchronization of real account data for a platform
   */
  async syncPlatform(req, res) {
    try {
      const { platform } = req.params;
      const fullResync = req.query.full === 'true';
      const result = await dsaService.triggerSync(platform, fullResync);
      return sendSuccess(res, result, result.message, 200);
    } catch (err) {
      console.error(`[DsaController] syncPlatform error: ${err.message}`);
      return sendError(res, err.message || 'Failed to sync platform.', err.statusCode || 500);
    }
  },

  /**
   * POST /api/v1/dsa/sync/cron
   * Webhook endpoint for external scheduler execution (e.g., Vercel Cron, GitHub Actions)
   */
  async triggerCronSync(req, res) {
    try {
      const authHeader = req.headers['authorization'];
      const cronSecretHeader = req.headers['x-cron-secret'];
      const querySecret = req.query.secret;
      const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

      const providedSecret = cronSecretHeader || querySecret || bearerToken;
      if (env.CRON_SECRET && providedSecret !== env.CRON_SECRET) {
        return sendError(res, 'Unauthorized: Invalid or missing cron secret token.', 401);
      }

      const syncResult = await dsaSchedulerService.runScheduledSync('external_cron_webhook');
      return sendSuccess(res, syncResult, 'Scheduled sync triggered successfully.');
    } catch (err) {
      console.error(`[DsaController] triggerCronSync error: ${err.message}`);
      return sendError(res, err.message || 'Scheduled cron sync failed.', 500);
    }
  },

  /**
   * GET /api/v1/dsa/sync/status
   * Returns current sync telemetry and scheduler health
   */
  async getSyncStatus(req, res) {
    try {
      const states = await DsaSyncState.find({}).lean();
      const scheduler = dsaSchedulerService.getStatus();
      return sendSuccess(
        res,
        {
          scheduler,
          platforms: states,
        },
        'DSA synchronization telemetry retrieved'
      );
    } catch (err) {
      return sendError(res, 'Failed to retrieve sync status telemetry.', 500);
    }
  },
};

export default dsaController;
