import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API_BASE = "http://localhost:8080/api"; // your Spring Boot backend URL

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const isAuthenticated = !!token;

  // ===== REGISTER =====
  const register = async (name, email, password, role) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) throw new Error("Registration failed");
    return await res.json();
  };

  // ===== LOGIN =====
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Invalid credentials");
    const data = await res.json();

    setToken(data.token);
    localStorage.setItem("token", data.token);

    // set basic user info
    setUser({ email: data.email, role: data.role, name: data.name });

    // fetch full profile safely after login
    try {
      await fetchProfile(data.token);
    } catch (err) {
      console.warn("Failed to fetch profile:", err);
    }

    return data;
  };

  // ===== FETCH PROFILE =====
  const fetchProfile = async (overrideToken) => {
    const t = overrideToken || token;
    if (!t) return null;

    const res = await fetch(`${API_BASE}/profile`, {
      headers: { Authorization: `Bearer ${t}` },
    });

    if (!res.ok) throw new Error("Failed to fetch profile");
    const data = await res.json();
    setUser(data);
    return data;
  };

  // ===== UPDATE PROFILE =====
  const updateProfile = async (updates) => {
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${API_BASE}/profile`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error("Failed to update profile");
    const data = await res.json();
    setUser(data);
    return data;
  };

  // ===== LOGOUT =====
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // ===== AUTO-FETCH PROFILE ON PAGE LOAD =====
  useEffect(() => {
    if (token && !user) {
      fetchProfile().catch(err => console.warn("Failed to fetch profile:", err));
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout, fetchProfile, updateProfile }}
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
