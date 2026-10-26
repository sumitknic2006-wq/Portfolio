import { ContactMessage } from '../models/ContactMessage.js';

export const contactRepository = {
  async create(messageData) {
    return ContactMessage.create(messageData);
  },

  async findRecentByEmail(email, windowMinutes = 15) {
    const since = new Date(Date.now() - windowMinutes * 60 * 1000);
    return ContactMessage.countDocuments({
      email: email.toLowerCase().trim(),
      createdAt: { $gte: since },
    });
  },

  async findById(id) {
    return ContactMessage.findById(id).lean();
  },

  async findPaginated({ page = 1, limit = 10, status, isRead, search } = {}) {
    const filter = {};

    if (status && ['pending', 'processed', 'replied', 'archived'].includes(status)) {
      filter.status = status;
    }

    if (isRead !== undefined && isRead !== null && isRead !== '') {
      filter.isRead = isRead === 'true' || isRead === true;
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { name: regex },
        { email: regex },
        { subject: regex },
        { message: regex },
      ];
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10)));

    const [messages, totalCount] = await Promise.all([
      ContactMessage.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      ContactMessage.countDocuments(filter),
    ]);

    return {
      messages,
      pagination: {
        page: Math.max(1, parseInt(page, 10)),
        limit: safeLimit,
        totalMessages: totalCount,
        totalPages: Math.ceil(totalCount / safeLimit) || 1,
      },
    };
  },

  async updateById(id, updateData) {
    return ContactMessage.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
  },

  async deleteById(id) {
    return ContactMessage.findByIdAndDelete(id).lean();
  },

  async getStats() {
    const [total, unread, pending, replied, archived, latest] = await Promise.all([
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ isRead: false }),
      ContactMessage.countDocuments({ status: 'pending' }),
      ContactMessage.countDocuments({ status: 'replied' }),
      ContactMessage.countDocuments({ status: 'archived' }),
      ContactMessage.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email subject status isRead createdAt')
        .lean(),
    ]);

    return {
      total,
      unread,
      pending,
      replied,
      archived,
      latest,
    };
  },
};

export default contactRepository;
