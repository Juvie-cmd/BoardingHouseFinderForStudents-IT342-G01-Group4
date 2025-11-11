import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API_BASE = "http://localhost:8080/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
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
      setUser({ email: data.email, role: data.role, name: data.name, id: data.id });
      
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
      
      // Store token
      setToken(data.token);
      localStorage.setItem("token", data.token);

      // Set user from response
      setUser({ 
        email: data.email, 
        role: data.role, 
        name: data.name, 
        id: data.id 
      });

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
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
          logout(); // Token expired
          return null;
        }
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      const profileData = data.data || data;
      setUser(profileData);
      return profileData;
    } catch (error) {
      console.error("Fetch profile error:", error);
      throw error;
    }
  };

  // ===== UPDATE PROFILE =====
  const updateProfile = async (updates) => {
    if (!token) throw new Error("Not authenticated");

    setIsLoading(true);
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
      const profileData = data.data || data;
      setUser(profileData);
      return profileData;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ===== LOGOUT =====
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // ===== AUTO-FETCH PROFILE ON PAGE LOAD (ONLY ONCE) =====
  useEffect(() => {
    const initializeAuth = async () => {
      if (token && !user && !isInitialized) {
        setIsLoading(true);
        try {
          await fetchProfile();
        } catch (err) {
          console.warn("Failed to fetch profile on load:", err);
          // If profile fetch fails, clear invalid token
          logout();
        } finally {
          setIsLoading(false);
          setIsInitialized(true);
        }
      } else if (!token) {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [token, isInitialized]); // Remove 'user' from dependencies

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isAuthenticated, 
        isLoading,
        isInitialized,
        login, 
        register, 
        logout, 
        fetchProfile, 
        updateProfile 
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