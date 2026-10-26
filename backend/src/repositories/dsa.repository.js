import { DsaProblem } from '../models/DsaProblem.js';

export const dsaRepository = {
  async findPaginated({
    platform,
    difficulty,
    category,
    search,
    provenance,
    sort = 'problemId',
    order = 'asc',
    page = 1,
    limit = 10,
  } = {}) {
    const filter = { isPublished: true };

    if (platform) {
      filter.platform = platform.toLowerCase();
    }

    if (provenance && provenance !== 'All' && provenance !== 'all') {
      filter.provenance = provenance.toLowerCase();
    }

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = new RegExp(`^${difficulty}$`, 'i');
    }

    if (category && category !== 'All') {
      filter.$or = [
        { category: new RegExp(category, 'i') },
        { tags: { $in: [new RegExp(category, 'i')] } },
      ];
    }

    if (search && search.trim().length > 0) {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(sanitized, 'i');
      const searchConditions = [
        { title: searchRegex },
        { problemId: searchRegex },
        { category: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];

      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    const sortOption = {};
    const sortDirection = order === 'desc' ? -1 : 1;
    if (sort === 'title') {
      sortOption.title = sortDirection;
    } else if (sort === 'difficulty') {
      sortOption.difficulty = sortDirection;
    } else if (sort === 'rating') {
      sortOption.rating = sortDirection;
    } else if (sort === 'submissionDate' || sort === 'date') {
      sortOption.submissionDate = sortDirection;
    } else if (sort === 'problemId' || sort === 'id') {
      sortOption.problemId = sortDirection;
    } else {
      sortOption.createdAt = -1;
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10)));

    const [problems, totalCount] = await Promise.all([
      DsaProblem.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      DsaProblem.countDocuments(filter),
    ]);

    return {
      problems,
      pagination: {
        page: Math.max(1, parseInt(page, 10)),
        limit: safeLimit,
        totalProblems: totalCount,
        totalPages: Math.ceil(totalCount / safeLimit) || 1,
      },
    };
  },

  async findBySlug(platform, slug) {
    const query = { slug: slug.toLowerCase() };
    if (platform) {
      query.platform = platform.toLowerCase();
    }
    return DsaProblem.findOne(query).lean();
  },

  async upsertOne(problemData) {
    const slug = problemData.slug.toLowerCase();
    const existing = await DsaProblem.findOne({ slug }).lean();

    if (existing) {
      const merged = { ...problemData };
      // Preserve existing manual edits, source code, and notes if incoming data has empty/missing values
      if (!merged.sourceCode && existing.sourceCode) {
        merged.sourceCode = existing.sourceCode;
      }
      if (!merged.approach && existing.approach) {
        merged.approach = existing.approach;
      }
      if (!merged.dryRun && existing.dryRun) {
        merged.dryRun = existing.dryRun;
      }
      if (
        (!merged.dryRunSteps || merged.dryRunSteps.length === 0) &&
        existing.dryRunSteps &&
        existing.dryRunSteps.length > 0
      ) {
        merged.dryRunSteps = existing.dryRunSteps;
      }
      if (
        (!merged.timeComplexity || merged.timeComplexity === 'O(N)') &&
        existing.timeComplexity
      ) {
        merged.timeComplexity = existing.timeComplexity;
      }
      if (
        (!merged.spaceComplexity || merged.spaceComplexity === 'O(1)') &&
        existing.spaceComplexity
      ) {
        merged.spaceComplexity = existing.spaceComplexity;
      }
      if (existing.language && (!merged.language || merged.language === 'C++')) {
        merged.language = existing.language;
      }
      // Never downgrade a manually imported problem to live_sync
      if (
        existing.provenance &&
        existing.provenance !== 'live_sync' &&
        merged.provenance === 'live_sync'
      ) {
        merged.provenance = existing.provenance;
      }
      if (existing.isCustom) {
        merged.isCustom = true;
      }

      return DsaProblem.findOneAndUpdate(
        { slug },
        { $set: merged },
        { new: true, runValidators: true }
      ).lean();
    }

    return DsaProblem.findOneAndUpdate(
      { slug },
      { $set: problemData },
      { upsert: true, new: true, runValidators: true }
    ).lean();
  },

  async updateBySlug(platform, slug, updateData) {
    const query = { slug: slug.toLowerCase() };
    if (platform) {
      query.platform = platform.toLowerCase();
    }
    return DsaProblem.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
  },

  async getStats(platform) {
    const baseFilter = { isPublished: true };
    if (platform) {
      baseFilter.platform = platform.toLowerCase();
    }

    // Only verified account data (live_sync and manual_import) contribute to live totals
    const verifiedFilter = {
      ...baseFilter,
      provenance: { $in: ['live_sync', 'manual_import'] },
    };

    const [totalVerified, easyVerified, mediumVerified, hardVerified, curatedCount, totalAll] =
      await Promise.all([
        DsaProblem.countDocuments(verifiedFilter),
        DsaProblem.countDocuments({ ...verifiedFilter, difficulty: /^easy$/i }),
        DsaProblem.countDocuments({ ...verifiedFilter, difficulty: /^medium$/i }),
        DsaProblem.countDocuments({ ...verifiedFilter, difficulty: /^hard$/i }),
        DsaProblem.countDocuments({ ...baseFilter, provenance: 'curated_example' }),
        DsaProblem.countDocuments(baseFilter),
      ]);

    return {
      total: totalVerified,
      easy: easyVerified,
      medium: mediumVerified,
      hard: hardVerified,
      curatedCount,
      totalAll,
    };
  },
};

export default dsaRepository;
