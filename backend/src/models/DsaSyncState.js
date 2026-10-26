import mongoose from 'mongoose';

/**
 * Mongoose schema for persistent synchronization state and telemetry
 * Tracks incremental sync positions, execution timestamps, batches, and completeness
 */
const dsaSyncStateSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      unique: true,
      enum: ['leetcode', 'codeforces'],
      lowercase: true,
      index: true,
    },
    handle: {
      type: String,
      required: true,
      trim: true,
    },
    lastSuccessfulSync: {
      type: Date,
      default: null,
    },
    lastSyncAttempt: {
      type: Date,
      default: null,
    },
    lastProcessedSubmissionId: {
      type: String,
      default: null,
    },
    syncStatus: {
      type: String,
      enum: ['idle', 'in_progress', 'success', 'verified_empty', 'partial', 'error'],
      default: 'idle',
    },
    profileSolvedCount: {
      type: Number,
      default: 0,
    },
    totalStoredCount: {
      type: Number,
      default: 0,
    },
    batchesProcessed: {
      type: Number,
      default: 0,
    },
    lastErrorMessage: {
      type: String,
      default: null,
    },
    historyCompleteness: {
      type: String,
      enum: ['complete', 'partially_synchronized', 'awaiting_historical_import'],
      default: 'partially_synchronized',
    },
    syncMetadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const DsaSyncState =
  mongoose.models.DsaSyncState || mongoose.model('DsaSyncState', dsaSyncStateSchema);

export default DsaSyncState;
