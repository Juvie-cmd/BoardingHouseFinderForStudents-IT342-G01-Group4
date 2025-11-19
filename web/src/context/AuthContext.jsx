// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API_BASE = "http://localhost:8080/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = !!token;

  // ===== REGISTER =====
  const register = async (name, email, password, role) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await res.json();
      setToken(data.token);
      localStorage.setItem("token", data.token);

      const userData = { email: data.email, role: data.role, name: data.name, id: data.id };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ===== LOGIN =====
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Invalid email or password");
      }

      const data = await res.json();
      setToken(data.token);
      localStorage.setItem("token", data.token);

      const userData = { email: data.email, role: data.role, name: data.name, id: data.id };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ===== GOOGLE OAUTH CALLBACK =====
  const handleGoogleCallback = async ({ token, email, name, role, id, picture }) => {
  setToken(token);
  localStorage.setItem("token", token);

  const userData = { email, name, role, id: Number(id), picture };
  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));

  // Optional: fetch full profile from backend
  if (token) {
    try {
      await fetchProfile();
    } catch (err) {
      console.warn("Failed to fetch profile after Google login:", err);
    }
  }
};


  // ===== FETCH PROFILE =====
  const fetchProfile = async () => {
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          logout();
          return null;
        }
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Fetch profile error:", error);
      throw error;
    }
  };

  // ===== UPDATE PROFILE =====
  const updateProfile = async (updates) => {
    if (!token) throw new Error("Not authenticated");

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await res.json();
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  // ===== LOGOUT =====
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // ===== RESTORE USER FROM LOCALSTORAGE ON PAGE LOAD =====
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      setUser(JSON.parse(storedUser));
    } else if (token && !user) {
      fetchProfile().catch(err => {
        console.warn("Failed to fetch profile on load:", err);
      });
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isAuthenticated, 
        isLoading,
        login, 
        register, 
        logout, 
        fetchProfile, 
        updateProfile,
        handleGoogleCallback
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
