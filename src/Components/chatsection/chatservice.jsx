// src/services/chatservice.jsx

import api from '../auth/Api';
export const chatService = {
  // Get all chat sessions for the user
  getSessions: async () => {
    try {
      const response = await api.get('/legal/sessions/');
      // Handle both array and object responses
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && typeof response.data === 'object') {
        // If it's a paginated response with results
        if (Array.isArray(response.data.results)) {
          return response.data.results;
        }
        // If it's a single object or other format, return as array
        return [response.data];
      }
      return [];
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  },

  // Get a specific session with messages
  getSession: async (sessionId) => {
    try {
      const response = await api.get(`/legal/sessions/${sessionId}/`);
      return response.data;
    } catch (error) {
      console.error('Error getting session:', error);
      throw error;
    }
  },

  // Send a message - no need to create session separately
  sendMessage: async (sessionId, query, role = 'employee') => {
    try {
      const payload = {
        query,
        role
      };
      // If we have a session ID, include it
      if (sessionId) {
        payload.session_id = sessionId;
      }
      const response = await api.post('/legal/ask/', payload);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Delete a session
  deleteSession: async (sessionId) => {
    try {
      const response = await api.delete(`/legal/sessions/${sessionId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  },

  // Rename/update session
  updateSession: async (sessionId, data) => {
    try {
      const response = await api.patch(`/legal/sessions/${sessionId}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }
};