import mongoose from 'mongoose';

/**
 * Mongoose schema for Achievements, Certifications, and Hackathon sprint records
 */
const achievementSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Unique achievement identifier is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, 'Issuer is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    categoryTag: {
      type: String,
      required: [true, 'Category tag is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    date: {
      type: String,
      trim: true,
    },
    badgeType: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    details: [
      {
        type: String,
        trim: true,
      },
    ],
    credentialUrl: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      default: 'Participant',
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
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

achievementSchema.index({ isPublished: 1, categoryTag: 1, displayOrder: 1 });

export const Achievement =
  mongoose.models.Achievement || mongoose.model('Achievement', achievementSchema);
export default Achievement;
