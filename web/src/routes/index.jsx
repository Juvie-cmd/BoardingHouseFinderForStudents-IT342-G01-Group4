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

export function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  let homeRoute = "/";
  if (isAuthenticated) {
    if (user?.role === 'student') homeRoute = "/search";
    else if (user?.role === 'landlord') homeRoute = "/landlord/dashboard";
    else if (user?.role === 'admin') homeRoute = "/admin/dashboard";
    else homeRoute = "/search";
  }

  return (
    <Routes>
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

      <Route path="/home" element={<Navigate to={homeRoute} replace />} />

      <Route
        path="/search"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentDashboard onViewDetails={(id) => navigate(`/details/${id}`)} />
          </PrivateRoute>
        }
      />
      <Route
        path="/details/:listingId"
        element={<PrivateRoute allowedRoles={['student']}><ListingDetailsWrapper /></PrivateRoute>}
      />
      <Route
        path="/student/profile"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentProfile />
          </PrivateRoute>
        }
      />

      <Route
        path="/landlord/dashboard"
        element={
          <PrivateRoute allowedRoles={['landlord']}>
            <LandlordDashboard
              onCreateListing={() => navigate('/landlord/listings/new')}
              onEditListing={(id) => navigate(`/landlord/listings/edit/${id}`)}
            />
          </PrivateRoute>
        }
      />
      <Route
        path="/landlord/listings/new"
        element={
          <PrivateRoute allowedRoles={['landlord']}>
            <ListingFormWrapper />
          </PrivateRoute>
        }
      />
      <Route
        path="/landlord/listings/edit/:listingId"
        element={
          <PrivateRoute allowedRoles={['landlord']}>
            <ListingFormWrapper />
          </PrivateRoute>
        }
      />
      <Route
        path="/landlord/profile"
        element={
          <PrivateRoute allowedRoles={['landlord']}>
            <LandlordProfile />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminProfile />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to={homeRoute} replace />} />
    </Routes>
  );
}