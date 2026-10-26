import { Profile } from '../models/Profile.js';

export const profileRepository = {
  async findDefault() {
    return Profile.findOne({ isPublished: true })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();
  },

  async upsertDefault(data) {
    return Profile.findOneAndUpdate(
      { isDefault: true },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
  },
};

export default profileRepository;
