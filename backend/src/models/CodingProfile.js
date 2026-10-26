import mongoose from 'mongoose';

/**
 * Mongoose schema for Verified Developer & Competitive Coding Profiles
 */
const codingProfileSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: [true, 'Platform name is required (e.g., github, leetcode)'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    username: {
      type: String,
      trim: true,
    },
    profileUrl: {
      type: String,
      required: [true, 'Profile URL is required'],
      trim: true,
    },
    primaryLanguage: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
      default: 'Active',
    },
    verifiedHighlights: [
      {
        type: String,
        trim: true,
      },
    ],
    focusParadigms: [
      {
        type: String,
        trim: true,
      },
    ],
    displayOrder: {
      type: Number,
      default: 0,
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

export const CodingProfile =
  mongoose.models.CodingProfile || mongoose.model('CodingProfile', codingProfileSchema);
export default CodingProfile;
