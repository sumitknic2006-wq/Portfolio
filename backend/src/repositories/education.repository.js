import { Education } from '../models/Education.js';

export const educationRepository = {
  async findAll(filter = {}) {
    const query = { isPublished: true, ...filter };
    return Education.find(query).sort({ displayOrder: 1, createdAt: 1 }).lean();
  },

  async upsertById(id, data) {
    return Education.findOneAndUpdate(
      { id: id.trim() },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
  },
};

export default educationRepository;
