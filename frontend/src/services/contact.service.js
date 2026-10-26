import { apiClient } from './apiClient.js';

export const contactService = {
  /**
   * Persist a validated contact inquiry into MongoDB via POST /api/v1/contact
   * Returns confirmation payload { id, status: 'stored_successfully', createdAt }
   */
  async sendContactMessage(payload) {
    const res = await apiClient.post('/contact', payload);
    return res;
  },
};

export default contactService;
