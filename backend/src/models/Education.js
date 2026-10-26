import mongoose from 'mongoose';

/**
 * Mongoose schema for Education records
 */
const educationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Unique education identifier is required'],
      unique: true,
      trim: true,
      index: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree title is required'],
      trim: true,
    },
    university: {
      type: String,
      required: [true, 'University name is required'],
      trim: true,
    },
    institute: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Academic duration is required'],
      trim: true,
    },
    currentYear: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    coreCoursework: [
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

export const Education = mongoose.models.Education || mongoose.model('Education', educationSchema);
export default Education;
