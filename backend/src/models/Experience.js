import mongoose from 'mongoose';

/**
 * Mongoose schema for Professional Experience and Roles
 */
const experienceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Unique experience identifier is required'],
      unique: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      required: [true, 'Role title is required'],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    location: {
      type: String,
      default: 'India',
      trim: true,
    },
    status: {
      type: String,
      default: 'Active Participant',
      trim: true,
    },
    highlights: [
      {
        type: String,
        trim: true,
      },
    ],
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
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

export const Experience =
  mongoose.models.Experience || mongoose.model('Experience', experienceSchema);
export default Experience;
