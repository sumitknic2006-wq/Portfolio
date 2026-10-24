import mongoose from 'mongoose';

/**
 * Mongoose schema for Portfolio Skill Categories (Phase 4 integration)
 */
const skillItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    focus: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const skillCategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    categoryKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    skills: [skillItemSchema],
  },
  {
    timestamps: true,
  }
);

export const Skill = mongoose.models.Skill || mongoose.model('Skill', skillCategorySchema);
export default Skill;
