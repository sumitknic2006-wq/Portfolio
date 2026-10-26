import mongoose from 'mongoose';

/**
 * Mongoose schema for Portfolio Projects (Phase 4 integration)
 * Features unique slug enforcement, category indexing, and publication state filters.
 */
const projectSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'],
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Subtitle cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    categoryTag: {
      type: String,
      required: [true, 'Category tag is required'],
      trim: true,
      lowercase: true,
      index: true,
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
      required: [true, 'Project summary is required'],
      trim: true,
      maxlength: [500, 'Summary cannot exceed 500 characters'],
    },
    description: {
      type: String,
      required: [true, 'Detailed project description is required'],
      trim: true,
    },
    problem: {
      type: String,
      trim: true,
    },
    solution: {
      type: String,
      trim: true,
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    contribution: {
      type: String,
      trim: true,
    },
    architecture: {
      type: String,
      trim: true,
    },
    challenges: {
      type: String,
      trim: true,
    },
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
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
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

// Compound index for optimized category and publication filtering
projectSchema.index({ isPublished: 1, categoryTag: 1, displayOrder: 1 });

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
