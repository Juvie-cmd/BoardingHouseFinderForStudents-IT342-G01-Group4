import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Wait for user info

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Allow admin to access all routes
  if (allowedRoles && !allowedRoles.includes(user?.role) && user?.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
}
