// src/App.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppRoutes } from './routes';
import { Header } from "./components/Shared/Header";
import { ErrorBoundary } from "./components/Shared/ErrorBoundary";

import "./App.css"; 

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = (destination) => {
    if (destination === 'home') {
      if (user?.role === 'student') navigate('/search');
      else if (user?.role === 'landlord') navigate('/landlord/dashboard');
      else if (user?.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } else if (destination === 'search') {
      navigate('/search');
    } else if (destination === 'dashboard') {
      if (user?.role === 'landlord') navigate('/landlord/dashboard');
      else if (user?.role === 'admin') navigate('/admin/dashboard');
    } else if (destination === 'profile') {
      if (user?.role === 'student') navigate('/student/profile');
      else if (user?.role === 'landlord') navigate('/landlord/profile');
      else if (user?.role === 'admin') navigate('/admin/profile');
    }
  };

  return (
    <>
      {isAuthenticated && <Header onNavigate={handleNavigate} />}

      <AppRoutes />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}


