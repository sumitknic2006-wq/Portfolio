import { Skill } from '../models/Skill.js';

export const skillRepository = {
  async findAll(filter = {}) {
    const query = { isPublished: true, ...filter };
    return Skill.find(query).sort({ displayOrder: 1, createdAt: 1 }).lean();
  },

  async findByCategoryKey(categoryKey) {
    if (!categoryKey) return null;
    return Skill.findOne({
      categoryKey: categoryKey.toLowerCase().trim(),
      isPublished: true,
    }).lean();
  },

  async upsertByCategoryKey(categoryKey, data) {
    return Skill.findOneAndUpdate(
      { categoryKey: categoryKey.toLowerCase().trim() },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
  },
};

export default skillRepository;
