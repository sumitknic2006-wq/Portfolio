import mongoose from 'mongoose';

/**
 * Mongoose schema for Curated & Imported DSA Solved Problems
 * Supports both LeetCode and Codeforces with solution code, dry runs, and complexity analysis.
 */
const dsaProblemSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'Problem slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    platform: {
      type: String,
      required: [true, 'Platform is required (leetcode or codeforces)'],
      enum: ['leetcode', 'codeforces'],
      lowercase: true,
      index: true,
    },
    problemId: {
      type: String,
      required: [true, 'Problem number or ID is required'],
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required (e.g. Easy, Medium, Hard, or rating)'],
      trim: true,
      index: true,
    },
    rating: {
      type: Number,
      default: null,
      index: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    problemUrl: {
      type: String,
      required: [true, 'Original problem URL is required'],
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
      default: '',
    },
    approach: {
      type: String,
      trim: true,
      default: '',
    },
    dryRun: {
      type: String,
      trim: true,
      default: '',
    },
    dryRunSteps: [
      {
        step: { type: Number, required: true },
        description: { type: String, required: true },
        variables: { type: mongoose.Schema.Types.Mixed, default: {} },
        highlight: { type: String, default: '' },
      },
    ],
    timeComplexity: {
      type: String,
      trim: true,
      default: 'O(N)',
    },
    spaceComplexity: {
      type: String,
      trim: true,
      default: 'O(1)',
    },
    sourceCode: {
      type: String,
      trim: true,
      default: '',
    },
    language: {
      type: String,
      trim: true,
      default: 'C++',
    },
    status: {
      type: String,
      enum: ['Solved', 'Attempted', 'Review'],
      default: 'Solved',
      index: true,
    },
    runtime: {
      type: String,
      trim: true,
      default: null,
    },
    memory: {
      type: String,
      trim: true,
      default: null,
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    provenance: {
      type: String,
      enum: ['live_sync', 'manual_import', 'curated_example'],
      default: 'live_sync',
      index: true,
    },
    syncMetadata: {
      lastSyncedAt: { type: Date, default: null },
      submissionId: { type: String, default: null },
      verdict: { type: String, default: null },
      contestId: { type: Number, default: null },
      problemIndex: { type: String, default: null },
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

dsaProblemSchema.index({ platform: 1, difficulty: 1 });
dsaProblemSchema.index({ platform: 1, category: 1 });

export const DsaProblem =
  mongoose.models.DsaProblem || mongoose.model('DsaProblem', dsaProblemSchema);

export default DsaProblem;
