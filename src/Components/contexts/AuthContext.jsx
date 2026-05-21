// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../auth/Auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('access_token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }

    // Listen for logout events
    const handleLogout = () => {
      logout();
    };
    window.addEventListener('auth_logout', handleLogout);
    
    return () => window.removeEventListener('auth_logout', handleLogout);
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to load user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    await authService.login(username, password);
    await loadUser();
    return true;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    // Optionally auto-login after registration
    // await login(userData.username, userData.password);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData) => {
    const updatedUser = await authService.updateProfile(profileData);
    setUser(updatedUser);
    return updatedUser;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    requestEmailVerification: authService.requestEmailVerification,
    verifyEmail: authService.verifyEmail,
    requestPhoneVerification: authService.requestPhoneVerification,
    verifyPhone: authService.verifyPhone,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};