import { CodingProfile } from '../models/CodingProfile.js';

export const codingProfileRepository = {
  async findAll(filter = {}) {
    const query = { isPublished: true, ...filter };
    return CodingProfile.find(query).sort({ displayOrder: 1 }).lean();
  },

  async upsertByPlatform(platform, data) {
    return CodingProfile.findOneAndUpdate(
      { platform: platform.toLowerCase().trim() },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
  },
};

export default codingProfileRepository;
