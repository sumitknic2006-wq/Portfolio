import { apiClient } from './apiClient.js';
import { contactService } from './contact.service.js';

export async function checkServerHealth() {
  try {
    return await apiClient.get('/health');
  } catch (error) {
    return { success: false, status: 'offline', error: error.message };
  }
}

export async function submitContactMessage(payload) {
  return contactService.sendContactMessage(payload);
}
