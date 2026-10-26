/**
 * Robust parser & validator for DSA historical import files (JSON & CSV)
 * Supports multiple platform export conventions and custom tracking formats.
 */

/**
 * Slugify a title or identifier into a clean URL-safe string
 */
export function slugify(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Parse CSV text into an array of objects
 */
export function parseCsv(csvString) {
  if (!csvString || typeof csvString !== 'string') return [];

  const lines = [];
  let currentLine = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < csvString.length; i++) {
    const char = csvString[i];
    const nextChar = csvString[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentLine.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentLine.push(currentCell.trim());
      if (currentLine.some((c) => c.length > 0)) {
        lines.push(currentLine);
      }
      currentLine = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentLine.length > 0) {
    currentLine.push(currentCell.trim());
    if (currentLine.some((c) => c.length > 0)) {
      lines.push(currentLine);
    }
  }

  if (lines.length < 2) return [];

  const rawHeaders = lines[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const rows = [];

  for (let l = 1; l < lines.length; l++) {
    const values = lines[l];
    const rowObj = {};
    for (let c = 0; c < rawHeaders.length; c++) {
      const header = rawHeaders[c];
      rowObj[header] = values[c] || '';
    }
    rows.push(rowObj);
  }

  return rows;
}

/**
 * Normalize a single raw record into the standard DSA problem schema
 */
export function normalizeRecord(raw, defaultPlatform = 'leetcode', index = 1) {
  const platform = (raw.platform || raw.source || defaultPlatform).toLowerCase();
  
  // Extract problem ID from common field names
  const problemId = String(
    raw.problemid ||
      raw.problem_id ||
      raw.id ||
      raw.frontend_id ||
      raw.frontendid ||
      raw.number ||
      raw.index ||
      raw['#'] ||
      ''
  ).trim();

  // Extract title
  const title = String(
    raw.title ||
      raw.name ||
      raw.problemname ||
      raw.problem_title ||
      raw.problem ||
      ''
  ).trim();

  if (!title) {
    return {
      valid: false,
      reason: `Row ${index}: Missing problem title.`,
    };
  }

  // Derive slug
  let slug = (raw.slug || raw.titleslug || raw.title_slug || '').trim().toLowerCase();
  if (!slug) {
    if (platform === 'leetcode') {
      slug = title ? slugify(title) : `leetcode-${problemId}`;
    } else {
      slug = problemId
        ? `cf-${problemId.toLowerCase()}`
        : `cf-${slugify(title)}`;
    }
  }

  // Normalize difficulty
  let difficulty = (raw.difficulty || raw.level || raw.diff || 'Medium').trim();
  const dLower = difficulty.toLowerCase();
  if (dLower.includes('easy')) difficulty = 'Easy';
  else if (dLower.includes('hard')) difficulty = 'Hard';
  else if (dLower.includes('med')) difficulty = 'Medium';
  else if (platform === 'codeforces' && !isNaN(parseInt(difficulty, 10))) {
    difficulty = String(parseInt(difficulty, 10));
  } else if (platform === 'leetcode') {
    difficulty = 'Medium';
  }

  // Extract category and tags
  let tags = [];
  if (Array.isArray(raw.tags)) {
    tags = raw.tags.map((t) => String(t).trim()).filter(Boolean);
  } else if (typeof raw.tags === 'string' && raw.tags.trim().length > 0) {
    tags = raw.tags
      .split(/[,;|]/)
      .map((t) => t.trim())
      .filter(Boolean);
  }

  const category = (
    raw.category ||
    raw.topic ||
    tags[0] ||
    (platform === 'leetcode' ? 'Algorithms' : 'Implementation')
  ).trim();

  // Extract problem URL
  let problemUrl = (raw.problemurl || raw.url || raw.link || '').trim();
  if (!problemUrl) {
    if (platform === 'leetcode') {
      problemUrl = `https://leetcode.com/problems/${slug}/`;
    } else {
      problemUrl = `https://codeforces.com/problemset`;
    }
  }

  // Extract submission date
  let submissionDate = new Date();
  const dateCandidate = raw.submissiondate || raw.date || raw.solvedat || raw.timestamp;
  if (dateCandidate) {
    const parsedDate = new Date(dateCandidate);
    if (!isNaN(parsedDate.getTime())) {
      submissionDate = parsedDate;
    }
  }

  return {
    valid: true,
    data: {
      slug,
      platform,
      problemId: problemId || slug,
      title: title || `Problem ${problemId}`,
      difficulty,
      rating: !isNaN(parseInt(difficulty, 10)) ? parseInt(difficulty, 10) : null,
      category,
      tags: tags.length > 0 ? tags : [category],
      problemUrl,
      language: raw.language || 'C++',
      status: 'Solved',
      submissionDate,
      provenance: 'manual_import',
      isCustom: true,
      sourceCode: raw.sourcecode || raw.code || raw.solution || '',
      summary: raw.summary || (title ? `${platform === 'leetcode' ? 'LeetCode' : 'Codeforces'}: ${title}` : ''),
      approach: raw.approach || raw.notes || raw.explanation || '',
      dryRun: raw.dryrun || '',
      timeComplexity: raw.timecomplexity || raw.time_complexity || 'O(N)',
      spaceComplexity: raw.spacecomplexity || raw.space_complexity || 'O(1)',
    },
  };
}

/**
 * Validate and prepare raw input (JSON or CSV) for preview and import
 */
export function validateAndParseImport(rawInput, defaultPlatform = 'leetcode') {
  let records = [];
  let format = 'json';

  if (Array.isArray(rawInput)) {
    records = rawInput;
    format = 'json';
  } else if (typeof rawInput === 'string') {
    const trimmed = rawInput.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        records = Array.isArray(parsed) ? parsed : [parsed];
        format = 'json';
      } catch (err) {
        throw new Error(`JSON format invalid: ${err.message}`);
      }
    } else {
      // Treat as CSV
      records = parseCsv(trimmed);
      format = 'csv';
      if (records.length === 0) {
        throw new Error('Unable to parse CSV. Ensure valid headers such as problemId, title, difficulty.');
      }
    }
  } else if (typeof rawInput === 'object' && rawInput !== null) {
    records = [rawInput];
    format = 'json';
  } else {
    throw new Error('Unsupported input format. Must be a JSON array, JSON object, or CSV string.');
  }

  const validItems = [];
  const rejectedRows = [];
  const seenSlugs = new Set();

  records.forEach((raw, idx) => {
    const norm = normalizeRecord(raw, defaultPlatform, idx + 1);
    if (!norm.valid) {
      rejectedRows.push({
        rowNumber: idx + 1,
        reason: norm.reason,
        raw,
      });
    } else {
      // Internal deduplication within the import file
      if (seenSlugs.has(norm.data.slug)) {
        rejectedRows.push({
          rowNumber: idx + 1,
          reason: `Duplicate problem slug "${norm.data.slug}" within import batch.`,
          raw,
        });
      } else {
        seenSlugs.add(norm.data.slug);
        validItems.push(norm.data);
      }
    }
  });

  return {
    format,
    totalParsed: records.length,
    parsedCount: records.length,
    validCount: validItems.length,
    rejectedCount: rejectedRows.length,
    validItems,
    rejectedRows,
  };
}
