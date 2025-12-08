import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // Also check sessionStorage directly as fallback for race conditions
  const hasStoredToken = !!sessionStorage.getItem("token");
  const storedUser = sessionStorage.getItem("user");
  const parsedStoredUser = storedUser ? JSON.parse(storedUser) : null;
  
  // Use either context state or storage
  const effectivelyAuthenticated = isAuthenticated || hasStoredToken;
  const effectiveUser = user || parsedStoredUser;

  if (isLoading) return <div>Loading...</div>; // Wait for user info

  if (!effectivelyAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(effectiveUser?.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
