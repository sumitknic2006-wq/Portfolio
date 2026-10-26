import { env } from '../config/env.js';
import { dsaService } from './dsa.service.js';

let schedulerInterval = null;
let isJobRunning = false;

/**
 * Background Scheduler for Automated Incremental DSA Synchronization
 */
export const dsaSchedulerService = {
  /**
   * Run background sync for all supported platforms
   */
  async runScheduledSync(source = 'scheduler') {
    if (isJobRunning) {
      console.log(`[DsaScheduler] Scheduled sync skipped: a previous job is still executing.`);
      return { skipped: true, reason: 'JOB_ALREADY_RUNNING' };
    }

    isJobRunning = true;
    console.log(`\n⏰ [DsaScheduler] Initiating scheduled DSA sync (source: ${source})...`);
    const results = {};

    try {
      // 1. Sync LeetCode
      try {
        console.log(`[DsaScheduler] Syncing LeetCode profile @${env.LEETCODE_USERNAME}...`);
        results.leetcode = await dsaService.fetchLeetcodeLiveStats(env.LEETCODE_USERNAME, true);
        console.log(`[DsaScheduler] LeetCode sync success. Total solved: ${results.leetcode.totalSolved}`);
      } catch (lcErr) {
        console.error(`[DsaScheduler] LeetCode sync warning: ${lcErr.message}`);
        results.leetcode = { error: lcErr.message };
      }

      // Small delay between platform syncs
      await new Promise((r) => setTimeout(r, 1000));

      // 2. Sync Codeforces
      try {
        console.log(`[DsaScheduler] Syncing Codeforces profile @${env.CODEFORCES_HANDLE}...`);
        results.codeforces = await dsaService.fetchCodeforcesLiveStats(env.CODEFORCES_HANDLE, true);
        console.log(`[DsaScheduler] Codeforces sync success. Solved: ${results.codeforces.solvedCount}`);
      } catch (cfErr) {
        console.error(`[DsaScheduler] Codeforces sync warning: ${cfErr.message}`);
        results.codeforces = { error: cfErr.message };
      }

      console.log(`✅ [DsaScheduler] Scheduled DSA sync completed successfully.\n`);
      return { success: true, timestamp: new Date().toISOString(), results };
    } finally {
      isJobRunning = false;
    }
  },

  /**
   * Initialize background sync timer on server startup
   */
  startScheduler() {
    if (!env.DSA_AUTO_SYNC_ENABLED) {
      console.log('ℹ️ [DsaScheduler] Background DSA auto-sync is disabled via DSA_AUTO_SYNC_ENABLED=false.');
      return;
    }

    if (schedulerInterval) {
      clearInterval(schedulerInterval);
    }

    const intervalMs = Math.max(15, env.DSA_SYNC_INTERVAL_MINUTES) * 60 * 1000;
    console.log(
      `⏱️ [DsaScheduler] Scheduling automated DSA background sync every ${env.DSA_SYNC_INTERVAL_MINUTES} minutes.`
    );

    // Initial check after 30 seconds of server startup to let DB initialize
    setTimeout(() => {
      this.runScheduledSync('startup_initial').catch((err) =>
        console.warn(`[DsaScheduler] Startup sync note: ${err.message}`)
      );
    }, 30000);

    schedulerInterval = setInterval(() => {
      this.runScheduledSync('interval_timer').catch((err) =>
        console.warn(`[DsaScheduler] Interval sync note: ${err.message}`)
      );
    }, intervalMs);

    if (schedulerInterval.unref) {
      schedulerInterval.unref();
    }
  },

  /**
   * Graceful stop
   */
  stopScheduler() {
    if (schedulerInterval) {
      clearInterval(schedulerInterval);
      schedulerInterval = null;
      console.log('ℹ️ [DsaScheduler] Background scheduler stopped.');
    }
  },

  /**
   * Get current scheduler status
   */
  getStatus() {
    return {
      enabled: env.DSA_AUTO_SYNC_ENABLED,
      intervalMinutes: env.DSA_SYNC_INTERVAL_MINUTES,
      isJobRunning,
      isRunning: isJobRunning,
      hasActiveTimer: schedulerInterval !== null,
    };
  },

  /**
   * Alias for runScheduledSync
   */
  async runSyncJob(source = 'manual') {
    return this.runScheduledSync(source);
  },
};

export const dsaScheduler = dsaSchedulerService;
export default dsaSchedulerService;
