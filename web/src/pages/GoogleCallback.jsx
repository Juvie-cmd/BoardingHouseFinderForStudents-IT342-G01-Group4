// src/pages/GoogleCallback.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleCallback() {
  const { handleGoogleCallback } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const role = searchParams.get("role");
    const id = searchParams.get("id"); // optional if you send it

    if (token && email && name && role) {
      // Pass data to your AuthContext handler
      handleGoogleCallback({ token, email, name, role, id });

      // Redirect to your desired page after login
      navigate("/dashboard"); // or "/profile"
    } else {
      // If something went wrong, fallback
      navigate("/login");
    }
  }, [searchParams, handleGoogleCallback, navigate]);

  return <div>Logging you in...</div>;
}
