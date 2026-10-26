import { Experience } from '../models/Experience.js';

export const experienceRepository = {
  async findAll(filter = {}) {
    const query = { isPublished: true, ...filter };
    return Experience.find(query).sort({ displayOrder: 1, createdAt: 1 }).lean();
  },

  async upsertById(id, data) {
    return Experience.findOneAndUpdate(
      { id: id.trim() },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
  },
};

export default experienceRepository;
