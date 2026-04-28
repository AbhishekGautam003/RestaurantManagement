import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const roleHierarchy = {
      customer: 1,
      staff: 2,
      admin: 3,
    };

    if ((roleHierarchy[user.role] || 0) < (roleHierarchy[requiredRole] || 0)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
