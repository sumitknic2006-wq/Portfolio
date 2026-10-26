import mongoose from 'mongoose';

/**
 * Mongoose schema for Developer Profile
 * Uses a single public profile strategy with isDefault flag.
 */
const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Developer name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role title is required'],
      trim: true,
    },
    headline: {
      type: String,
      required: [true, 'Headline is required'],
      trim: true,
    },
    introduction: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
    },
    university: {
      type: String,
      required: [true, 'University is required'],
      trim: true,
    },
    institute: {
      type: String,
      trim: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree program is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    currentYear: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
      default: '/files/README.md',
    },
    avatar: {
      type: String,
      default: '/images/sumit.png',
    },
    avatarFallback: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    socials: {
      github: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      leetcode: { type: String, trim: true },
    },
    careerObjective: {
      type: String,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: true,
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

export const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
export default Profile;
