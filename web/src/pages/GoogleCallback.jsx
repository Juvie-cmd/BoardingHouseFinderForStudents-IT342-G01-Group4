// src/pages/GoogleCallback.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Helper to get the correct dashboard route based on role
function getDashboardRoute(role) {
  switch (role?.toLowerCase()) {
    case 'student': return '/search';
    case 'landlord': return '/landlord/dashboard';
    case 'admin': return '/admin/dashboard';
    default: return '/';
  }
}

export default function GoogleCallback() {
  const { handleGoogleCallback } = useAuth();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      const token = searchParams.get("token");
      const email = searchParams.get("email");
      const name = searchParams.get("name");
      const role = searchParams.get("role");
      const id = searchParams.get("id");
      const picture = searchParams.get("picture");

      if (token && email && name && role) {
        try {
          // Wait for the auth context to fully process the callback
          await handleGoogleCallback({ token, email, name, role, id, picture });
          
          // Use window.location for a full page navigation
          // This ensures all components properly initialize with the new auth state
          const targetRoute = getDashboardRoute(role);
          
          // Small delay then do a full navigation (not SPA navigation)
          setTimeout(() => {
            window.location.href = targetRoute;
          }, 100);
        } catch (err) {
          console.error("Google callback error:", err);
          setError("Failed to complete login. Please try again.");
          setProcessing(false);
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      } else {
        // If something went wrong, fallback
        console.warn("Missing Google callback params:", { token: !!token, email: !!email, name: !!name, role: !!role });
        setError("Invalid login response. Redirecting...");
        setProcessing(false);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    };

    processCallback();
  }, [searchParams, handleGoogleCallback]);

  if (error) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>{error}</div>;
  }

  return <div style={{ padding: '2rem', textAlign: 'center' }}>Logging you in...</div>;
}
