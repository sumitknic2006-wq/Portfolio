import { apiClient } from './apiClient.js';

export const assistantService = {
  /**
   * Check if backend AI provider is configured and available
   */
  async getStatus() {
    try {
      const res = await apiClient.get('/assistant/status');
      return res.data || { configured: false, provider: 'gemini' };
    } catch {
      return { configured: false, provider: 'gemini' };
    }
  },

  /**
   * Send question to AI Portfolio Assistant
   */
  async sendMessage(message, language = 'en', conversationHistory = []) {
    const res = await apiClient.post(
      '/assistant/chat',
      {
        message,
        language,
        conversationHistory,
      },
      { timeout: 35000 }
    );
    return res.data;
  },
};

export default assistantService;
