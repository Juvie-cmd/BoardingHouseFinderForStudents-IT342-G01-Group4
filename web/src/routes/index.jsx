// src/routes/index. jsx

import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';

import { ListingDetailsWrapper } from './ListingDetailsWrapper';
import { ListingFormWrapper } from './ListingFormWrapper';

import { LandingPage } from '../components/LandingPage/LandingPage';
import { LoginPage } from '../pages/AuthPage/LoginPage';
import { StudentDashboard } from '../pages/StudentPage/StudentDashboard';
import { StudentProfile } from '../pages/StudentPage/Profile';

import { LandlordDashboard } from '../pages/LandlordPage/LandlordDashboard';
import { LandlordProfile } from '../pages/LandlordPage/Profile';

import { AdminDashboard } from '../pages/AdminPage/AdminDashboard';
import { AdminProfile } from '../pages/AdminPage/Profile';

import GoogleCallbackPage from '../pages/GoogleCallback';

// ⭐ Wrapper to inject navigation callbacks into LandlordDashboard
function LandlordDashboardWrapper() {
  const navigate = useNavigate();
  return (
    <LandlordDashboard
      onCreateListing={() => navigate("/landlord/listings/new")}
      onEditListing={(id) => navigate(`/landlord/listings/edit/${id}`)}
    />
  );
}

// ⭐ NEW: Wrapper to inject navigation callback into StudentDashboard
function StudentDashboardWrapper() {
  const navigate = useNavigate();
  return (
    <StudentDashboard
      onViewDetails={(id) => navigate(`/details/${id}`)}
    />
  );
}

export function AppRoutes() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  // Determine home route based on role
  let homeRoute = "/";
  if (isAuthenticated && user) {
    if (user. role === "student") homeRoute = "/search";
    else if (user.role === "landlord") homeRoute = "/landlord/dashboard";
    else if (user. role === "admin") homeRoute = "/admin/dashboard";
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/google-callback" element={<GoogleCallbackPage />} />

      {/* Redirect after login - both /home and /dashboard go to role-based route */}
      <Route path="/home" element={<Navigate to={homeRoute} replace />} />
      <Route path="/dashboard" element={<Navigate to={homeRoute} replace />} />

      {/* Student Routes */}
      <Route path="/search" element={
        <PrivateRoute allowedRoles={['student']}>
          <StudentDashboardWrapper />  {/* ✅ FIXED: Use wrapper with onViewDetails */}
        </PrivateRoute>
      } />
      <Route path="/details/:listingId" element={
        <PrivateRoute allowedRoles={['student']}>
          <ListingDetailsWrapper />
        </PrivateRoute>
      } />
      <Route path="/student/profile" element={
        <PrivateRoute allowedRoles={['student']}>
          <StudentProfile />
        </PrivateRoute>
      } />

      {/* Landlord Routes */}
      <Route path="/landlord/dashboard" element={
        <PrivateRoute allowedRoles={['landlord']}>
          <LandlordDashboardWrapper />
        </PrivateRoute>
      } />

      {/* Create new listing */}
      <Route path="/landlord/listings/new" element={
        <PrivateRoute allowedRoles={['landlord']}>
          <ListingFormWrapper />
        </PrivateRoute>
      } />

      {/* Edit listing */}
      <Route path="/landlord/listings/edit/:listingId" element={
        <PrivateRoute allowedRoles={['landlord']}>
          <ListingFormWrapper />
        </PrivateRoute>
      } />

      <Route path="/landlord/profile" element={
        <PrivateRoute allowedRoles={['landlord']}>
          <LandlordProfile />
        </PrivateRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <PrivateRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </PrivateRoute>
      } />
      <Route path="/admin/profile" element={
        <PrivateRoute allowedRoles={['admin']}>
          <AdminProfile />
        </PrivateRoute>
      } />

      {/* Catch all */}
      <Route path="*" element={<Navigate to={homeRoute} replace />} />
    </Routes>
  );
}