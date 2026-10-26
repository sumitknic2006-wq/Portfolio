import apiClient from './apiClient.js';

let authToken = localStorage.getItem('sumit_portfolio_admin_token') || null;

export const setAdminToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('sumit_portfolio_admin_token', token);
  } else {
    localStorage.removeItem('sumit_portfolio_admin_token');
  }
};

export const getAdminToken = () => authToken;

const getAuthHeaders = () => {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

export const adminService = {
  async login({ email, password }) {
    const res = await apiClient.post('/admin/auth/login', { email, password });
    if (res?.data?.token) {
      setAdminToken(res.data.token);
    }
    return res;
  },

  async logout() {
    try {
      await apiClient.post('/admin/auth/logout', {}, { headers: getAuthHeaders() });
    } finally {
      setAdminToken(null);
    }
  },

  async getMe() {
    return apiClient.get('/admin/auth/me', { headers: getAuthHeaders() });
  },

  async getStats() {
    return apiClient.get('/admin/messages/stats', { headers: getAuthHeaders() });
  },

  async getMessages({ page = 1, limit = 10, status = '', isRead = '', search = '' } = {}) {
    const params = { page, limit };
    if (status) params.status = status;
    if (isRead !== '') params.isRead = isRead;
    if (search) params.search = search;

    return apiClient.get('/admin/messages', {
      params,
      headers: getAuthHeaders(),
    });
  },

  async getMessageById(id) {
    return apiClient.get(`/admin/messages/${id}`, { headers: getAuthHeaders() });
  },

  async toggleReadStatus(id, isRead) {
    return apiClient.patch(
      `/admin/messages/${id}/read`,
      typeof isRead === 'boolean' ? { isRead } : {},
      { headers: getAuthHeaders() }
    );
  },

  async updateStatus(id, status) {
    return apiClient.patch(
      `/admin/messages/${id}/status`,
      { status },
      { headers: getAuthHeaders() }
    );
  },

  async replyToMessage(id, { replyText, subject }) {
    return apiClient.post(
      `/admin/messages/${id}/reply`,
      { replyText, subject },
      { headers: getAuthHeaders() }
    );
  },

  async deleteMessage(id) {
    return apiClient.delete(`/admin/messages/${id}`, { headers: getAuthHeaders() });
  },
};

export default adminService;
