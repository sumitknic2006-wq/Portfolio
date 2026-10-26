import mongoose from 'mongoose';

/**
 * Mongoose schema for Portfolio Skill Categories
 */
const skillItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    focus: {
      type: String,
      required: [true, 'Skill focus is required'],
      trim: true,
    },
    level: {
      type: String,
      required: [true, 'Skill level is required'],
      trim: true,
    },
  },
  { _id: false }
);

const skillCategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    categoryKey: {
      type: String,
      required: [true, 'Category key is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Category description is required'],
      trim: true,
    },
    skills: [skillItemSchema],
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

skillCategorySchema.index({ isPublished: 1, displayOrder: 1 });

export const Skill = mongoose.models.Skill || mongoose.model('Skill', skillCategorySchema);
export default Skill;
