// src/services/auth.js
import api from './Api';

export const authService = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  // Login
  login: async (username, password) => {
    const response = await api.post('/auth/token/', { username, password });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.patch('/auth/me/', profileData);
    return response.data;
  },

  // Request email verification
  requestEmailVerification: async () => {
    const response = await api.post('/auth/email/request-verification/');
    return response.data;
  },

  // Verify email
  verifyEmail: async (userId, token) => {
    const response = await api.post('/auth/email/verify/', { user_id: userId, token });
    return response.data;
  },

  // Request phone verification
  requestPhoneVerification: async () => {
    const response = await api.post('/auth/phone/request-verification/');
    return response.data;
  },

  // Verify phone
  verifyPhone: async (code) => {
    const response = await api.post('/auth/phone/verify/', { code });
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};