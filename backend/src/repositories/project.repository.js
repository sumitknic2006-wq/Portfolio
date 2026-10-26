import { Project } from '../models/Project.js';

export const projectRepository = {
  async findAll(filter = {}, options = {}) {
    const query = { isPublished: true, ...filter };
    return Project.find(query)
      .sort(options.sort || { displayOrder: 1, createdAt: -1 })
      .lean();
  },

  async findBySlug(slug) {
    if (!slug) return null;
    return Project.findOne({ slug: slug.toLowerCase().trim(), isPublished: true }).lean();
  },

  async upsertBySlug(slug, data) {
    return Project.findOneAndUpdate(
      { slug: slug.toLowerCase().trim() },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
  },

  async count(filter = {}) {
    return Project.countDocuments({ isPublished: true, ...filter });
  },
};

export default projectRepository;
