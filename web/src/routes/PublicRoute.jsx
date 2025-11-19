// src/routes/PublicRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PublicRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Wait for user info

  let homeRoute = "/";
  if (isAuthenticated && user) {  // Only when user is loaded
    if (user.role === 'student') homeRoute = "/search";
    else if (user.role === 'landlord') homeRoute = "/landlord/dashboard"; 
    else if (user.role === 'admin') homeRoute = "/admin/dashboard";     
  }

  return isAuthenticated ? <Navigate to={homeRoute} replace /> : children;
}
