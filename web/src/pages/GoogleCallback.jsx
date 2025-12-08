// src/pages/GoogleCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleCallback() {
  const { handleGoogleCallback } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

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
          
          // Small delay to ensure state is propagated
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Now navigate to dashboard
          navigate("/dashboard", { replace: true });
        } catch (err) {
          console.error("Google callback error:", err);
          setError("Failed to complete login. Please try again.");
          setTimeout(() => navigate("/login", { replace: true }), 2000);
        }
      } else {
        // If something went wrong, fallback
        console.warn("Missing Google callback params:", { token: !!token, email: !!email, name: !!name, role: !!role });
        setError("Invalid login response. Redirecting...");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
    };

    processCallback();
  }, [searchParams, handleGoogleCallback, navigate]);

  if (error) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>{error}</div>;
  }

  return <div style={{ padding: '2rem', textAlign: 'center' }}>Logging you in...</div>;
}
