// src/context/AuthContext.jsx

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Mock database of registered users (in real app, this comes from backend)
  const [registeredUsers, setRegisteredUsers] = useState({});

  const isAuthenticated = !!user;

  // Mock login function
  const login = async (email, password) => {
    await sleep(1000); // Simulate API call
    console.log("Logging in with:", { email, password });

    // Check for admin credentials
    if (email === 'admin@boardinghouse.com' && password === 'admin123') {
      setUser({
        name: 'Administrator',
        email: email,
        role: 'admin',
      });
      return;
    }

    // Check if user exists in registered users
    const registeredUser = registeredUsers[email];
    const userName = email.split('@')[0];

    // Determine role based on registered user or email domain
    let userRole = 'student'; // default
    if (registeredUser) {
      userRole = registeredUser.role;
    } else {
      // For demo purposes: determine role by email pattern
      if (email.includes('landlord') || email.includes('owner')) {
        userRole = 'landlord';
      }
    }

    setUser({
      name: registeredUser?.name || userName,
      email: email,
      role: userRole,
    });
  };

  // Mock register function
  const register = async (name, email, password, role) => {
    await sleep(1000); // Simulate API call
    console.log("Registering with:", { name, email, password, role });

    // Store the registered user
    setRegisteredUsers(prev => ({
      ...prev,
      [email]: { name, email, role }
    }));

    return { success: true, message: 'Account created successfully!' };
  };

  // Mock logout function
  const logout = () => {
    setUser(null);
    return { success: true, message: 'You have been successfully logged out!' };
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}