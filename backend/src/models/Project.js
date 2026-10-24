import mongoose from 'mongoose';

/**
 * Mongoose schema for Portfolio Projects (Phase 4 integration)
 */
const projectSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    categoryTag: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      default: '/images/project-placeholder.svg',
    },
    summary: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    problem: String,
    solution: String,
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    features: [String],
    contribution: String,
    architecture: String,
    challenges: String,
    liveDemo: {
      type: String,
      default: '#',
    },
    backendUrl: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: 'https://github.com/sumitknic2006-wq',
    },
    statusBadge: {
      type: String,
      default: 'Prototype',
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
