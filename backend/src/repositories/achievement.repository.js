import { Achievement } from '../models/Achievement.js';

export const achievementRepository = {
  async findAll(filter = {}) {
    const query = { isPublished: true, ...filter };
    return Achievement.find(query).sort({ displayOrder: 1, createdAt: -1 }).lean();
  },

  async upsertById(id, data) {
    return Achievement.findOneAndUpdate(
      { id: id.toLowerCase().trim() },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
  },
};

export default achievementRepository;
