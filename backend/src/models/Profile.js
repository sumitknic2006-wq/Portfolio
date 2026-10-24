import mongoose from 'mongoose';

/**
 * Mongoose schema for Developer Profile (Phase 4 integration)
 */
const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    organization: { type: String, required: true },
    duration: { type: String, required: true },
    location: { type: String, default: 'India' },
    status: { type: String, default: 'Active Participant' },
    highlights: [String],
    skills: [String],
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    headline: { type: String, required: true },
    avatar: String,
    university: String,
    institute: String,
    degree: String,
    duration: String,
    currentYear: String,
    email: String,
    phone: String,
    location: String,
    socials: {
      github: String,
      linkedin: String,
      twitter: String,
      leetcode: String,
    },
    careerObjective: String,
    experiences: [experienceSchema],
  },
  { timestamps: true }
);

export const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
export default Profile;
