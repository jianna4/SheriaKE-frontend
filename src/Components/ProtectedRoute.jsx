// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // User doesn't have permission - redirect based on their role
    if (user?.role === 'client') {
      return <Navigate to="/client/dashboard" replace />;
    }
    if (user?.role === 'lawyer') {
      return <Navigate to="/lawyer/dashboard" replace />;
    }
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Fallback redirect
    return <Navigate to="/" replace />;
  }

  // Authenticated and authorized - render children
  return children;
};

export default ProtectedRoute;