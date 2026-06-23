// src/Components/contexts/chatcontext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

import { useAuth } from './AuthContext';
import { chatService } from '../chatsection/chatservice';
const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load sessions when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    } else {
      setSessions([]);
      setCurrentSession(null);
      setMessages([]);
    }
  }, [isAuthenticated]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await chatService.getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async (role = 'employee') => {
    // Since we don't have a create endpoint, we just return a placeholder
    // The session will be created when the first message is sent
    const tempSession = {
      id: `temp-${Date.now()}`,
      title: 'New Chat',
      role: role,
      created_at: new Date().toISOString(),
      messages: []
    };
    setCurrentSession(tempSession);
    setMessages([]);
    return tempSession;
  };

  const loadSession = async (sessionId) => {
    try {
      setLoading(true);
      const session = await chatService.getSession(sessionId);
      setCurrentSession(session);
      // Format messages from session
      const formattedMessages = session.messages?.map(msg => ({
        id: msg.id || Date.now(),
        type: msg.sender === 'user' ? 'user' : 'bot',
        content: msg.content,
        timestamp: new Date(msg.created_at || Date.now())
      })) || [];
      setMessages(formattedMessages);
      return session;
    } catch (error) {
      console.error('Failed to load session:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (query, role = 'employee') => {
    if (!query.trim()) return;

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: query,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      let sessionId = currentSession?.id;

      // Check if sessionId is a temporary ID (starts with 'temp-')
      // Convert to string first to avoid errors
      const sessionIdStr = sessionId ? String(sessionId) : null;
      
      // If session ID starts with 'temp-', it's not a real session yet
      if (sessionIdStr && sessionIdStr.startsWith('temp-')) {
        sessionId = null;
      }

      // Send message to backend
      const response = await chatService.sendMessage(sessionId, query, role);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.answer || response.message || 'I received your message.',
        sources: response.sources,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

      // If a real session was created, update it
      if (response.session_id && !sessionId) {
        // Load the real session
        const realSession = await chatService.getSession(response.session_id);
        setCurrentSession(realSession);
        // Refresh sessions list
        await loadSessions();
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `❌ **Error**: ${error.response?.data?.detail || error.message || 'Failed to get response'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      throw error;
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      await chatService.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
      throw error;
    }
  };

  const updateSessionTitle = async (sessionId, title) => {
    try {
      const updated = await chatService.updateSession(sessionId, { title });
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, title: updated.title } : s
      ));
      if (currentSession?.id === sessionId) {
        setCurrentSession(prev => ({ ...prev, title: updated.title }));
      }
    } catch (error) {
      console.error('Failed to update session:', error);
      throw error;
    }
  };

  const clearGuestChat = () => {
    setMessages([]);
    setCurrentSession(null);
  };

  const value = {
    sessions,
    currentSession,
    messages,
    loading,
    sidebarOpen,
    setSidebarOpen,
    loadSessions,
    createNewSession,
    loadSession,
    sendMessage,
    deleteSession,
    updateSessionTitle,
    clearGuestChat,
    isAuthenticated
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};