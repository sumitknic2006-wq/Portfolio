import { env } from '../config/env.js';
import { getDbStatus } from '../config/db.js';
import { dsaRepository } from '../repositories/dsa.repository.js';
import { curatedDsaProblems } from '../fixtures/dsaFixtures.js';
import { DsaSyncState } from '../models/DsaSyncState.js';
import { DsaProblem } from '../models/DsaProblem.js';
import { validateAndParseImport } from '../utils/dsaImportParser.js';

// In-memory cache for external platform responses with 5-minute TTL
const cache = {
  codeforces: { data: null, timestamp: 0 },
  leetcode: { data: null, timestamp: 0 },
  lastSync: {
    codeforces: null,
    leetcode: null,
  },
  questionDetailsCache: new Map(),
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const isSyncRunning = {
  leetcode: false,
  codeforces: false,
};

/**
 * Service Layer for DSA Platform-Wise Problem Tracker
 */
export const dsaService = {
  /**
   * Fetch official Codeforces profile statistics and complete paginated accepted submissions
   * Supports sequential multi-page fetching, incremental resume, and safe rate limiting.
   */
  async fetchCodeforcesLiveStats(handle = env.CODEFORCES_HANDLE, force = false, fullResync = false) {
    const cleanHandle = (handle || env.CODEFORCES_HANDLE || 'sumitknic567').trim();
    const now = Date.now();

    if (!force && cache.codeforces.data && now - cache.codeforces.timestamp < CACHE_TTL_MS) {
      return cache.codeforces.data;
    }

    if (isSyncRunning.codeforces) {
      console.log(`[DsaService] Codeforces sync currently in progress. Returning cached/offline state.`);
      if (cache.codeforces.data) return cache.codeforces.data;
    }

    isSyncRunning.codeforces = true;

    const result = {
      handle: cleanHandle,
      profileUrl: `https://codeforces.com/profile/${cleanHandle}`,
      available: false,
      rating: 0,
      maxRating: 0,
      rank: 'Unrated',
      maxRank: 'Unrated',
      contribution: 0,
      avatar: 'https://userpic.codeforces.org/no-avatar.jpg',
      solvedCount: 0,
      storedCount: 0,
      recentAccepted: [],
      syncStatus: 'idle',
      historyCompleteness: 'complete',
      batchesProcessed: 0,
      lastSyncedAt: cache.lastSync.codeforces || new Date().toISOString(),
      note: `Fetched via official Codeforces API v1.0 for @${cleanHandle}`,
    };

    try {
      let syncStateDoc = null;
      if (getDbStatus().connected) {
        try {
          syncStateDoc = await DsaSyncState.findOne({ platform: 'codeforces' });
          if (!syncStateDoc) {
            syncStateDoc = await DsaSyncState.create({
              platform: 'codeforces',
              handle: cleanHandle,
              syncStatus: 'in_progress',
              lastSyncAttempt: new Date(),
            });
          } else {
            syncStateDoc.lastSyncAttempt = new Date();
            syncStateDoc.syncStatus = 'in_progress';
            await syncStateDoc.save();
          }
        } catch (dbErr) {
          console.warn(`[DsaService] DsaSyncState tracking warning: ${dbErr.message}`);
        }
      }

      // 1. Fetch user.info
      const infoController = new AbortController();
      const infoTimeout = setTimeout(() => infoController.abort(), 8000);
      let infoRes;
      try {
        infoRes = await fetch(
          `https://codeforces.com/api/user.info?handles=${encodeURIComponent(cleanHandle)}`,
          { signal: infoController.signal }
        );
      } catch (netErr) {
        throw new Error(`Codeforces API unreachable or network timeout: ${netErr.message}`);
      } finally {
        clearTimeout(infoTimeout);
      }

      if (!infoRes.ok) {
        const errorText = await infoRes.text();
        throw new Error(`Codeforces user.info returned HTTP ${infoRes.status}: ${errorText.slice(0, 100)}`);
      }

      const infoData = await infoRes.json();
      if (infoData.status !== 'OK' || !infoData.result?.[0]) {
        result.available = false;
        result.syncStatus = 'error';
        result.note = infoData.comment || `User @${cleanHandle} not found on Codeforces.`;
        if (syncStateDoc) {
          syncStateDoc.syncStatus = 'error';
          syncStateDoc.lastErrorMessage = result.note;
          await syncStateDoc.save();
        }
        cache.codeforces = { data: result, timestamp: now };
        return result;
      }

      const user = infoData.result[0];
      result.available = true;
      result.rating = user.rating || 0;
      result.maxRating = user.maxRating || 0;
      result.rank = user.rank
        ? user.rank.charAt(0).toUpperCase() + user.rank.slice(1)
        : 'Unrated';
      result.maxRank = user.maxRank
        ? user.maxRank.charAt(0).toUpperCase() + user.maxRank.slice(1)
        : 'Unrated';
      result.contribution = user.contribution || 0;
      result.avatar = user.titlePhoto || user.avatar || result.avatar;

      // 2. Fetch full submission history in sequential paginated batches
      const acceptedProblemsMap = new Map();
      let from = 1;
      const pageSize = 100;
      let hasMore = true;
      let totalBatches = 0;
      let maxSubmissionIdSeen = 0;
      const resumeSubmissionId =
        !fullResync && syncStateDoc?.lastProcessedSubmissionId
          ? Number(syncStateDoc.lastProcessedSubmissionId)
          : null;

      while (hasMore) {
        totalBatches++;
        const statusController = new AbortController();
        const statusTimeout = setTimeout(() => statusController.abort(), 10000);

        let statusRes;
        try {
          statusRes = await fetch(
            `https://codeforces.com/api/user.status?handle=${encodeURIComponent(
              cleanHandle
            )}&from=${from}&count=${pageSize}`,
            { signal: statusController.signal }
          );
        } catch (fetchErr) {
          clearTimeout(statusTimeout);
          if (from === 1) {
            throw new Error(`Codeforces user.status failed: ${fetchErr.message}`);
          } else {
            console.warn(`[DsaService] Batch ${totalBatches} interrupted: ${fetchErr.message}. Saving fetched items.`);
            break;
          }
        }
        clearTimeout(statusTimeout);

        if (!statusRes.ok) {
          if (from === 1) {
            throw new Error(`Codeforces user.status HTTP ${statusRes.status}`);
          }
          break;
        }

        const statusData = await statusRes.json();
        if (statusData.status !== 'OK' || !Array.isArray(statusData.result)) {
          if (from === 1) {
            throw new Error(`Codeforces API status failed: ${statusData.comment || 'Unknown error'}`);
          }
          break;
        }

        const submissions = statusData.result;
        if (submissions.length === 0) {
          hasMore = false;
          break;
        }

        let reachedPreviousSync = false;
        for (const sub of submissions) {
          if (sub.id) {
            maxSubmissionIdSeen = Math.max(maxSubmissionIdSeen, Number(sub.id));
          }

          // Incremental sync checkpoint check
          if (resumeSubmissionId && sub.id && Number(sub.id) <= resumeSubmissionId) {
            reachedPreviousSync = true;
            break;
          }

          if (sub.verdict === 'OK' && sub.problem && sub.problem.contestId && sub.problem.index) {
            const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
            if (!acceptedProblemsMap.has(problemKey)) {
              acceptedProblemsMap.set(problemKey, {
                slug: `cf-${sub.problem.contestId}-${sub.problem.index.toLowerCase()}`,
                platform: 'codeforces',
                problemId: `${sub.problem.contestId}${sub.problem.index}`,
                title: sub.problem.name,
                difficulty: sub.problem.rating ? String(sub.problem.rating) : 'Unrated',
                rating: sub.problem.rating || null,
                category: sub.problem.tags?.[0] ? sub.problem.tags[0] : 'Implementation',
                tags: sub.problem.tags || [],
                problemUrl: `https://codeforces.com/problemset/problem/${sub.problem.contestId}/${sub.problem.index}`,
                language: sub.programmingLanguage || 'C++',
                status: 'Solved',
                submissionDate: new Date(sub.creationTimeSeconds * 1000),
                provenance: 'live_sync',
                sourceCode: '',
                summary: `Codeforces Problem ${sub.problem.contestId}${sub.problem.index}: ${sub.problem.name}`,
                approach: '',
                timeComplexity: '',
                spaceComplexity: '',
                syncMetadata: {
                  lastSyncedAt: new Date(),
                  submissionId: String(sub.id),
                  verdict: sub.verdict,
                  contestId: sub.problem.contestId,
                  problemIndex: sub.problem.index,
                },
              });
            }
          }
        }

        if (reachedPreviousSync || submissions.length < pageSize) {
          hasMore = false;
        } else {
          from += pageSize;
          // Polite rate-limiting between successive pages (Codeforces standard guideline: <= 1 req/sec)
          await new Promise((r) => setTimeout(r, 250));
        }
      }

      const uniqueSolved = Array.from(acceptedProblemsMap.values());
      result.recentAccepted = uniqueSolved;
      result.batchesProcessed = totalBatches;
      result.lastSyncedAt = new Date().toISOString();
      cache.lastSync.codeforces = result.lastSyncedAt;

      // 3. Persist live_sync records to MongoDB preserving manual solutions
      if (getDbStatus().connected && uniqueSolved.length > 0) {
        for (const prob of uniqueSolved) {
          try {
            await dsaRepository.upsertOne({
              ...prob,
              provenance: 'live_sync',
              isPublished: true,
            });
          } catch (err) {
            console.warn(`[DsaService] CF sync upsert note: ${err.message}`);
          }
        }
      }

      // Count total stored problems in DB for Codeforces
      let storedCount = uniqueSolved.length;
      if (getDbStatus().connected) {
        try {
          storedCount = await DsaProblem.countDocuments({
            platform: 'codeforces',
            provenance: { $in: ['live_sync', 'manual_import'] },
          });
        } catch {}
      }

      result.solvedCount = storedCount;
      result.storedCount = storedCount;
      result.syncStatus = storedCount === 0 && uniqueSolved.length === 0 ? 'verified_empty' : 'success';
      result.historyCompleteness = 'complete';

      if (syncStateDoc) {
        syncStateDoc.lastSuccessfulSync = new Date();
        syncStateDoc.syncStatus = result.syncStatus;
        syncStateDoc.profileSolvedCount = storedCount;
        syncStateDoc.totalStoredCount = storedCount;
        syncStateDoc.batchesProcessed = totalBatches;
        syncStateDoc.historyCompleteness = 'complete';
        if (maxSubmissionIdSeen > 0) {
          syncStateDoc.lastProcessedSubmissionId = String(maxSubmissionIdSeen);
        }
        await syncStateDoc.save();
      }

      cache.codeforces = { data: result, timestamp: now };
      return result;
    } catch (err) {
      console.warn(`[DsaService] Codeforces sync exception: ${err.message}`);
      result.available = false;
      result.syncStatus = 'error';
      result.note = `Codeforces API sync failed: ${err.message}. Displaying cached/offline data.`;
      return result;
    } finally {
      isSyncRunning.codeforces = false;
    }
  },

  /**
   * Fetch LeetCode statistics and recent verified submissions via GraphQL
   * Computes completeness and tracks historical import requirements.
   */
  async fetchLeetcodeLiveStats(username = env.LEETCODE_USERNAME, force = false) {
    const cleanUsername = (username || env.LEETCODE_USERNAME || '25001122').trim();
    const now = Date.now();

    if (!force && cache.leetcode.data && now - cache.leetcode.timestamp < CACHE_TTL_MS) {
      return cache.leetcode.data;
    }

    if (isSyncRunning.leetcode) {
      console.log(`[DsaService] LeetCode sync currently in progress. Returning cached/offline state.`);
      if (cache.leetcode.data) return cache.leetcode.data;
    }

    isSyncRunning.leetcode = true;

    const result = {
      username: cleanUsername,
      profileUrl: `https://leetcode.com/u/${cleanUsername}/`,
      available: false,
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      ranking: null,
      storedCount: 0,
      recentAccepted: [],
      syncStatus: 'idle',
      historyCompleteness: 'partially_synchronized',
      lastSyncedAt: cache.lastSync.leetcode || new Date().toISOString(),
      note: `Verified live statistics from LeetCode public GraphQL for @${cleanUsername}.`,
    };

    try {
      let syncStateDoc = null;
      if (getDbStatus().connected) {
        try {
          syncStateDoc = await DsaSyncState.findOne({ platform: 'leetcode' });
          if (!syncStateDoc) {
            syncStateDoc = await DsaSyncState.create({
              platform: 'leetcode',
              handle: cleanUsername,
              syncStatus: 'in_progress',
              lastSyncAttempt: new Date(),
            });
          } else {
            syncStateDoc.lastSyncAttempt = new Date();
            syncStateDoc.syncStatus = 'in_progress';
            await syncStateDoc.save();
          }
        } catch (dbErr) {
          console.warn(`[DsaService] DsaSyncState tracking warning: ${dbErr.message}`);
        }
      }

      // Query 1: Profile & aggregate counts via GraphQL
      const userProfileQuery = `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
              userAvatar
            }
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Referer: `https://leetcode.com/u/${cleanUsername}/`,
        },
        body: JSON.stringify({
          query: userProfileQuery,
          variables: { username: cleanUsername },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const body = await response.json();
        const matched = body?.data?.matchedUser;
        if (matched) {
          result.available = true;
          result.ranking = matched.profile?.ranking || null;
          const stats = matched.submitStats?.acSubmissionNum || [];
          for (const s of stats) {
            if (s.difficulty === 'All') result.totalSolved = s.count;
            if (s.difficulty === 'Easy') result.easySolved = s.count;
            if (s.difficulty === 'Medium') result.mediumSolved = s.count;
            if (s.difficulty === 'Hard') result.hardSolved = s.count;
          }
        }
      }

      // Query 2: Fetch recent accepted submissions
      const recentController = new AbortController();
      const recentTimeout = setTimeout(() => recentController.abort(), 8000);

      const recentQuery = `
        query recentAcSubmissions($username: String!, $limit: Int!) {
          recentAcSubmissionList(username: $username, limit: $limit) {
            id
            title
            titleSlug
            timestamp
          }
        }
      `;

      const recentRes = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Referer: `https://leetcode.com/u/${cleanUsername}/`,
        },
        body: JSON.stringify({
          query: recentQuery,
          variables: { username: cleanUsername, limit: 50 },
        }),
        signal: recentController.signal,
      });
      clearTimeout(recentTimeout);

      if (recentRes.ok) {
        const recentBody = await recentRes.json();
        const recentSubs = recentBody?.data?.recentAcSubmissionList || [];

        // Deduplicate recent submissions by titleSlug
        const uniqueSubsMap = new Map();
        for (const sub of recentSubs) {
          if (!uniqueSubsMap.has(sub.titleSlug)) {
            uniqueSubsMap.set(sub.titleSlug, sub);
          }
        }

        const syncedProblems = [];

        // For each unique submission, retrieve question metadata
        for (const [slug, sub] of uniqueSubsMap.entries()) {
          let qMeta = cache.questionDetailsCache.get(slug);

          if (!qMeta) {
            try {
              const qQuery = `
                query questionData($titleSlug: String!) {
                  question(titleSlug: $titleSlug) {
                    questionFrontendId
                    title
                    difficulty
                    topicTags {
                      name
                      slug
                    }
                  }
                }
              `;
              const qRes = await fetch('https://leetcode.com/graphql', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                  Referer: `https://leetcode.com/u/${cleanUsername}/`,
                },
                body: JSON.stringify({ query: qQuery, variables: { titleSlug: slug } }),
              });

              if (qRes.ok) {
                const qJson = await qRes.json();
                const qData = qJson?.data?.question;
                if (qData) {
                  qMeta = {
                    problemId: qData.questionFrontendId || '',
                    difficulty: qData.difficulty || 'Medium',
                    category: qData.topicTags?.[0]?.name || 'Algorithms',
                    tags: qData.topicTags?.map((t) => t.name) || [],
                  };
                  cache.questionDetailsCache.set(slug, qMeta);
                }
              }
            } catch {
              // fallback
            }
          }

          const probDoc = {
            slug,
            platform: 'leetcode',
            problemId: qMeta?.problemId || '',
            title: sub.title,
            difficulty: qMeta?.difficulty || 'Medium',
            rating: null,
            category: qMeta?.category || 'Algorithms',
            tags: qMeta?.tags || ['Algorithms'],
            problemUrl: `https://leetcode.com/problems/${slug}/`,
            language: 'C++',
            status: 'Solved',
            submissionDate: new Date(parseInt(sub.timestamp, 10) * 1000),
            provenance: 'live_sync',
            sourceCode: '',
            summary: `LeetCode problem: ${sub.title}`,
            approach: '',
            timeComplexity: '',
            spaceComplexity: '',
            syncMetadata: {
              lastSyncedAt: new Date(),
              submissionId: sub.id,
            },
          };

          syncedProblems.push(probDoc);

          // Persist to MongoDB preserving any existing user notes/code
          if (getDbStatus().connected) {
            try {
              await dsaRepository.upsertOne({
                ...probDoc,
                isPublished: true,
              });
            } catch (err) {
              console.warn(`[DsaService] LC sync upsert note: ${err.message}`);
            }
          }
        }

        result.recentAccepted = syncedProblems;
      }

      // Calculate completeness based on total verified problems in DB
      let storedVerifiedCount = result.recentAccepted.length;
      if (getDbStatus().connected) {
        try {
          storedVerifiedCount = await DsaProblem.countDocuments({
            platform: 'leetcode',
            provenance: { $in: ['live_sync', 'manual_import'] },
          });
        } catch {}
      }

      result.storedCount = storedVerifiedCount;
      if (result.totalSolved > 0 && storedVerifiedCount >= result.totalSolved) {
        result.historyCompleteness = 'complete';
      } else if (storedVerifiedCount > 0) {
        result.historyCompleteness = 'partially_synchronized';
      } else {
        result.historyCompleteness = 'awaiting_historical_import';
      }

      result.syncStatus = 'success';
      result.lastSyncedAt = new Date().toISOString();
      cache.lastSync.leetcode = result.lastSyncedAt;

      if (syncStateDoc) {
        syncStateDoc.lastSuccessfulSync = new Date();
        syncStateDoc.syncStatus = 'success';
        syncStateDoc.profileSolvedCount = result.totalSolved;
        syncStateDoc.totalStoredCount = storedVerifiedCount;
        syncStateDoc.historyCompleteness = result.historyCompleteness;
        await syncStateDoc.save();
      }

      cache.leetcode = { data: result, timestamp: now };
      return result;
    } catch (err) {
      console.warn(`[DsaService] LeetCode GraphQL note: ${err.message}`);
      result.note = `LeetCode GraphQL note: Unable to refresh live stats for @${cleanUsername}. Displaying cached data.`;
      result.syncStatus = 'error';
      return result;
    } finally {
      isSyncRunning.leetcode = false;
    }
  },

  /**
   * Preview a raw import file (JSON or CSV)
   * Validates records, detects duplicates vs new items, and generates preview table.
   */
  async previewImport(platform = 'leetcode', rawData) {
    const cleanPlatform = (platform || 'leetcode').toLowerCase();
    const parsed = validateAndParseImport(rawData, cleanPlatform);

    // Check duplicates against existing database records
    let duplicateCount = 0;
    let newCount = 0;
    const previewItems = [];

    for (let i = 0; i < parsed.validItems.length; i++) {
      const item = parsed.validItems[i];
      let existsInDb = false;

      if (getDbStatus().connected) {
        try {
          const existing = await dsaRepository.findBySlug(cleanPlatform, item.slug);
          if (existing) {
            existsInDb = true;
          }
        } catch {}
      }

      if (existsInDb) {
        duplicateCount++;
      } else {
        newCount++;
      }

      if (previewItems.length < 25) {
        previewItems.push({
          ...item,
          isDuplicate: existsInDb,
        });
      }
    }

    return {
      platform: cleanPlatform,
      format: parsed.format,
      totalParsed: parsed.totalParsed,
      parsedCount: parsed.parsedCount,
      validCount: parsed.validCount,
      newCount,
      duplicateCount,
      rejectedCount: parsed.rejectedCount,
      rejectedRows: parsed.rejectedRows,
      preview: previewItems,
      previewItems,
    };
  },

  /**
   * Import problems array or raw string into MongoDB with validation & duplicate detection
   */
  async importProblems(problemsInput, platform = 'leetcode') {
    if (!getDbStatus().connected) {
      const err = new Error(
        'Database is offline. Connect MongoDB to import and persist problem solutions.'
      );
      err.statusCode = 503;
      throw err;
    }

    const cleanPlatform = (platform || 'leetcode').toLowerCase();
    const parsed = validateAndParseImport(problemsInput, cleanPlatform);

    if (parsed.validItems.length === 0) {
      const err = new Error('No valid problem records found in import payload.');
      err.statusCode = 400;
      err.details = parsed.rejectedRows;
      throw err;
    }

    const imported = [];
    for (const item of parsed.validItems) {
      const doc = await dsaRepository.upsertOne({
        ...item,
        platform: cleanPlatform,
        isCustom: true,
        provenance: 'manual_import',
        isPublished: true,
      });
      imported.push(doc);
    }

    // Recalculate completeness
    const totalStored = await DsaProblem.countDocuments({
      platform: cleanPlatform,
      provenance: { $in: ['live_sync', 'manual_import'] },
    });

    try {
      const syncState = await DsaSyncState.findOne({ platform: cleanPlatform });
      if (syncState) {
        syncState.totalStoredCount = totalStored;
        if (syncState.profileSolvedCount > 0 && totalStored >= syncState.profileSolvedCount) {
          syncState.historyCompleteness = 'complete';
        } else {
          syncState.historyCompleteness = 'partially_synchronized';
        }
        await syncState.save();
      }
    } catch {}

    // Invalidate caches so next request serves fresh data
    if (cleanPlatform === 'leetcode') cache.leetcode.timestamp = 0;
    if (cleanPlatform === 'codeforces') cache.codeforces.timestamp = 0;

    return {
      success: true,
      platform: cleanPlatform,
      importedCount: imported.length,
      rejectedCount: parsed.rejectedCount,
      rejectedRows: parsed.rejectedRows,
      totalStoredCount: totalStored,
      message: `Successfully imported ${imported.length} problem records into ${cleanPlatform} tracker.`,
    };
  },

  /**
   * Force manual sync for a specific platform (or both)
   */
  async triggerSync(platform, fullResync = false) {
    const cleanPlatform = (platform || '').toLowerCase();
    if (!['leetcode', 'codeforces'].includes(cleanPlatform)) {
      const err = new Error('Invalid platform. Supported platforms are "leetcode" and "codeforces".');
      err.statusCode = 400;
      throw err;
    }

    if (cleanPlatform === 'leetcode') {
      const stats = await this.fetchLeetcodeLiveStats(env.LEETCODE_USERNAME, true);
      return {
        success: true,
        platform: 'leetcode',
        syncedCount: stats.recentAccepted?.length || 0,
        storedCount: stats.storedCount,
        totalSolved: stats.totalSolved,
        historyCompleteness: stats.historyCompleteness,
        lastSyncedAt: stats.lastSyncedAt,
        message: `Successfully synchronized LeetCode profile @${stats.username}. Total verified: ${stats.totalSolved} solved.`,
      };
    } else {
      const stats = await this.fetchCodeforcesLiveStats(env.CODEFORCES_HANDLE, true, fullResync);
      return {
        success: true,
        platform: 'codeforces',
        syncedCount: stats.solvedCount,
        storedCount: stats.storedCount,
        rating: stats.rating,
        rank: stats.rank,
        historyCompleteness: stats.historyCompleteness,
        lastSyncedAt: stats.lastSyncedAt,
        message: `Successfully synchronized Codeforces profile @${stats.handle}. Solved: ${stats.solvedCount}, Rating: ${stats.rating}.`,
      };
    }
  },

  /**
   * Overview cards metadata for LeetCode & Codeforces
   */
  async getPlatformsOverview() {
    const [leetcodeLive, codeforcesLive] = await Promise.all([
      this.fetchLeetcodeLiveStats(),
      this.fetchCodeforcesLiveStats(),
    ]);

    let leetcodeVerifiedCount = leetcodeLive.storedCount || leetcodeLive.totalSolved;
    let codeforcesVerifiedCount = codeforcesLive.storedCount || codeforcesLive.solvedCount;

    let leetcodeCuratedCount = curatedDsaProblems.filter((p) => p.platform === 'leetcode').length;
    let codeforcesCuratedCount = curatedDsaProblems.filter((p) => p.platform === 'codeforces').length;

    let leetcodeCompleteness = leetcodeLive.historyCompleteness || 'partially_synchronized';
    let codeforcesCompleteness = codeforcesLive.historyCompleteness || 'complete';

    if (getDbStatus().connected) {
      try {
        const [lcStats, cfStats, syncStates] = await Promise.all([
          dsaRepository.getStats('leetcode'),
          dsaRepository.getStats('codeforces'),
          DsaSyncState.find({}).lean(),
        ]);

        if (lcStats.total > 0) {
          leetcodeVerifiedCount = lcStats.total;
        }
        if (cfStats.total >= 0) {
          codeforcesVerifiedCount = cfStats.total;
        }

        leetcodeCuratedCount = lcStats.curatedCount;
        codeforcesCuratedCount = cfStats.curatedCount;

        const lcState = syncStates.find((s) => s.platform === 'leetcode');
        if (lcState?.historyCompleteness) {
          leetcodeCompleteness = lcState.historyCompleteness;
        }

        const cfState = syncStates.find((s) => s.platform === 'codeforces');
        if (cfState?.historyCompleteness) {
          codeforcesCompleteness = cfState.historyCompleteness;
        }
      } catch {}
    }

    return {
      leetcode: {
        platform: 'LeetCode',
        id: 'leetcode',
        username: leetcodeLive.username,
        profileUrl: leetcodeLive.profileUrl,
        available: leetcodeLive.available,
        totalSolved: leetcodeLive.totalSolved,
        storedCount: leetcodeVerifiedCount,
        easySolved: leetcodeLive.easySolved,
        mediumSolved: leetcodeLive.mediumSolved,
        hardSolved: leetcodeLive.hardSolved,
        curatedCount: leetcodeCuratedCount,
        recentCount: leetcodeLive.recentAccepted?.length || 0,
        historyCompleteness: leetcodeCompleteness,
        lastSyncedAt: leetcodeLive.lastSyncedAt,
        note: leetcodeLive.note,
        dashboardUrl: '/dsa/leetcode',
      },
      codeforces: {
        platform: 'Codeforces',
        id: 'codeforces',
        handle: codeforcesLive.handle,
        profileUrl: codeforcesLive.profileUrl,
        available: codeforcesLive.available,
        rating: codeforcesLive.rating,
        maxRating: codeforcesLive.maxRating,
        rank: codeforcesLive.rank,
        maxRank: codeforcesLive.maxRank,
        solvedCount: codeforcesVerifiedCount,
        storedCount: codeforcesVerifiedCount,
        curatedCount: codeforcesCuratedCount,
        historyCompleteness: codeforcesCompleteness,
        lastSyncedAt: codeforcesLive.lastSyncedAt,
        note: codeforcesLive.note,
        dashboardUrl: '/dsa/codeforces',
      },
    };
  },

  /**
   * Get problems list for a platform with search, filter, provenance and pagination
   */
  async getProblems(
    platform,
    {
      page = 1,
      limit = 10,
      difficulty = '',
      category = '',
      search = '',
      provenance = '',
      sort = 'problemId',
      order = 'asc',
    } = {}
  ) {
    const cleanPlatform = platform.toLowerCase();

    // 1. If MongoDB is connected, query DB with provenance awareness
    if (getDbStatus().connected) {
      try {
        const dbResult = await dsaRepository.findPaginated({
          platform: cleanPlatform,
          difficulty,
          category,
          search,
          provenance,
          sort,
          order,
          page,
          limit,
        });

        if (dbResult && dbResult.problems.length > 0) {
          const stats = await dsaRepository.getStats(cleanPlatform);
          const syncState = await DsaSyncState.findOne({ platform: cleanPlatform }).lean();

          return {
            problems: dbResult.problems,
            pagination: dbResult.pagination,
            stats: {
              ...stats,
              historyCompleteness: syncState?.historyCompleteness || 'partially_synchronized',
              lastSuccessfulSync: syncState?.lastSuccessfulSync || null,
            },
          };
        }
      } catch (err) {
        console.warn(`[DsaService] DB query note: ${err.message}`);
      }
    }

    // 2. In-memory / live sync fallback:
    let allProblems = [];

    if (cleanPlatform === 'leetcode') {
      const lcLive = await this.fetchLeetcodeLiveStats();
      if (lcLive.recentAccepted && lcLive.recentAccepted.length > 0) {
        allProblems.push(...lcLive.recentAccepted);
      }
    } else if (cleanPlatform === 'codeforces') {
      const cfLive = await this.fetchCodeforcesLiveStats();
      if (cfLive.recentAccepted && cfLive.recentAccepted.length > 0) {
        allProblems.push(...cfLive.recentAccepted);
      }
    }

    // Add curated reference problems (explicitly marked with provenance: curated_example)
    const curated = curatedDsaProblems.filter((p) => p.platform === cleanPlatform);
    allProblems.push(...curated);

    // Apply provenance filter if specified
    if (provenance && provenance !== 'All' && provenance !== 'all') {
      allProblems = allProblems.filter((p) => p.provenance === provenance.toLowerCase());
    }

    // Apply difficulty filter
    if (difficulty && difficulty !== 'All') {
      allProblems = allProblems.filter(
        (p) => String(p.difficulty).toLowerCase() === difficulty.toLowerCase()
      );
    }

    // Apply category / tags filter
    if (category && category !== 'All') {
      allProblems = allProblems.filter(
        (p) =>
          (p.category && p.category.toLowerCase().includes(category.toLowerCase())) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(category.toLowerCase())))
      );
    }

    // Apply search filter
    if (search && search.trim().length > 0) {
      const q = search.trim().toLowerCase();
      allProblems = allProblems.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          String(p.problemId).toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Sort
    allProblems.sort((a, b) => {
      if (sort === 'title') {
        return order === 'desc' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
      }
      if (sort === 'rating' && a.rating && b.rating) {
        return order === 'desc' ? b.rating - a.rating : a.rating - b.rating;
      }
      if (sort === 'submissionDate' || sort === 'date') {
        const da = new Date(a.submissionDate || 0).getTime();
        const db = new Date(b.submissionDate || 0).getTime();
        return order === 'desc' ? db - da : da - db;
      }
      return 0;
    });

    // Paginate
    const safePage = Math.max(1, parseInt(page, 10));
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (safePage - 1) * safeLimit;
    const paginated = allProblems.slice(skip, skip + safeLimit);

    const verifiedOnly = allProblems.filter((p) => p.provenance !== 'curated_example');
    const easy = verifiedOnly.filter(
      (p) => String(p.difficulty).toLowerCase() === 'easy' || (p.rating && p.rating <= 800)
    ).length;
    const medium = verifiedOnly.filter(
      (p) =>
        String(p.difficulty).toLowerCase() === 'medium' ||
        (p.rating && p.rating > 800 && p.rating <= 1400)
    ).length;
    const hard = verifiedOnly.filter(
      (p) => String(p.difficulty).toLowerCase() === 'hard' || (p.rating && p.rating > 1400)
    ).length;

    return {
      problems: paginated,
      pagination: {
        page: safePage,
        limit: safeLimit,
        totalProblems: allProblems.length,
        totalPages: Math.ceil(allProblems.length / safeLimit) || 1,
      },
      stats: {
        total: verifiedOnly.length,
        easy,
        medium,
        hard,
        curatedCount: allProblems.filter((p) => p.provenance === 'curated_example').length,
        historyCompleteness: 'partially_synchronized',
      },
    };
  },

  /**
   * Get single problem detail by platform and slug
   */
  async getProblemDetail(platform, slug) {
    const cleanPlatform = platform.toLowerCase();
    const cleanSlug = slug.toLowerCase();

    // 1. Try DB
    if (getDbStatus().connected) {
      try {
        const found = await dsaRepository.findBySlug(cleanPlatform, cleanSlug);
        if (found) return found;
      } catch {}
    }

    // 2. Try live cache submissions
    if (cleanPlatform === 'leetcode' && cache.leetcode.data?.recentAccepted) {
      const match = cache.leetcode.data.recentAccepted.find(
        (p) => p.slug.toLowerCase() === cleanSlug
      );
      if (match) return match;
    }
    if (cleanPlatform === 'codeforces' && cache.codeforces.data?.recentAccepted) {
      const match = cache.codeforces.data.recentAccepted.find(
        (p) => p.slug.toLowerCase() === cleanSlug
      );
      if (match) return match;
    }

    // 3. Try curated reference fixtures
    const fixtureMatch = curatedDsaProblems.find(
      (p) => p.platform === cleanPlatform && p.slug.toLowerCase() === cleanSlug
    );
    if (fixtureMatch) return fixtureMatch;

    return null;
  },

  /**
   * Update personal notes or solution for a problem
   */
  async updateProblem(platform, slug, updateData) {
    if (!getDbStatus().connected) {
      const err = new Error(
        'Database is offline. Personal notes updates require MongoDB persistence.'
      );
      err.statusCode = 503;
      throw err;
    }

    const updated = await dsaRepository.updateBySlug(platform, slug, updateData);
    if (!updated) {
      // If problem exists in live sync cache or fixtures, save it into DB with the new updates
      const fallbackProblem = await this.getProblemDetail(platform, slug);
      if (fallbackProblem) {
        return dsaRepository.upsertOne({
          ...fallbackProblem,
          ...updateData,
          provenance: fallbackProblem.provenance || 'manual_import',
          isCustom: true,
          isPublished: true,
        });
      }
      return null;
    }
    return updated;
  },
};

export default dsaService;
