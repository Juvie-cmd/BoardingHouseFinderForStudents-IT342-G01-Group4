import { Routes, Route, Navigate } from 'react-router-dom';
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

export function AppRoutes() {
  const { isAuthenticated, user, loading } = useAuth();

if (loading) return <div>Loading...</div>; // ✅ keep this

let homeRoute = "/";
if (isAuthenticated && user) {  // Only when user is loaded
  if (user.role === "student") homeRoute = "/search";
  else if (user.role === "landlord") homeRoute = "/landlord/dashboard";
  else if (user.role === "admin") homeRoute = "/admin/dashboard";
}

  return (
    <Routes>
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

      {/* ===== New Google OAuth callback route ===== */}
     <Route path="/google-callback" element={<GoogleCallbackPage />} />



      <Route path="/home" element={<Navigate to={homeRoute} replace />} />

      <Route path="/search" element={
        <PrivateRoute allowedRoles={['student']}>
          <StudentDashboard />
        </PrivateRoute>
      }/>
      <Route path="/details/:listingId" element={
        <PrivateRoute allowedRoles={['student']}>
          <ListingDetailsWrapper />
        </PrivateRoute>
      }/>
      <Route path="/student/profile" element={
        <PrivateRoute allowedRoles={['student']}>
          <StudentProfile />
        </PrivateRoute>
      }/>

      <Route path="/landlord/dashboard" element={
        <PrivateRoute allowedRoles={['landlord']}>
          <LandlordDashboard />
        </PrivateRoute>
      }/>
      <Route path="/landlord/listings/new" element={
        <PrivateRoute allowedRoles={['landlord']}>
          <ListingFormWrapper />
        </PrivateRoute>
      }/>
      <Route path="/landlord/listings/edit/:listingId" element={
        <PrivateRoute allowedRoles={['landlord']}>
          <ListingFormWrapper />
        </PrivateRoute>
      }/>
      <Route path="/landlord/profile" element={
        <PrivateRoute allowedRoles={['landlord']}>
          <LandlordProfile />
        </PrivateRoute>
      }/>

      <Route path="/admin/dashboard" element={
        <PrivateRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </PrivateRoute>
      }/>
      <Route path="/admin/profile" element={
        <PrivateRoute allowedRoles={['admin']}>
          <AdminProfile />
        </PrivateRoute>
      }/>

      <Route path="*" element={<Navigate to={homeRoute} replace />} />
    </Routes>
  );
}
