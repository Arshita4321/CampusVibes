import React, { createContext, useContext, useState, useEffect } from 'react';
import { KEYS, getFromStorage, saveToStorage, DEFAULT_USERS } from '../utils/storage';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getFromStorage(KEYS.CURRENT_USER, DEFAULT_USERS[0]));
  const [users, setUsers] = useState(() => getFromStorage(KEYS.USERS, DEFAULT_USERS));
  const { success, error, info } = useToast();

  useEffect(() => {
    saveToStorage(KEYS.CURRENT_USER, user);
  }, [user]);

  useEffect(() => {
    saveToStorage(KEYS.USERS, users);
  }, [users]);

  // Login handler
  const login = (email, password) => {
    const existingUsers = getFromStorage(KEYS.USERS, DEFAULT_USERS);
    const found = existingUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!found) {
      error('No account found with this email. Please check your credentials or register.');
      return false;
    }

    if (found.password !== password) {
      error('Incorrect password. Please try again.');
      return false;
    }

    setUser(found);
    success(`Welcome back, ${found.name}! Logged in as ${found.role === 'organizer' ? 'Organizer' : 'Student'}.`);
    return true;
  };

  // Register handler
  const register = (userData) => {
    const existingUsers = getFromStorage(KEYS.USERS, DEFAULT_USERS);
    const exists = existingUsers.some(
      (u) => u.email.toLowerCase() === userData.email.trim().toLowerCase()
    );

    if (exists) {
      error('An account with this email already exists.');
      return false;
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      role: userData.role || 'student',
      department: userData.department || 'General Studies',
      college: userData.college || 'Tech University',
      phone: userData.phone || '+1 (555) 000-0000',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      joinedDate: new Date().toISOString()
    };

    const updated = [...existingUsers, newUser];
    setUsers(updated);
    saveToStorage(KEYS.USERS, updated);
    setUser(newUser);
    success(`Account created successfully! Welcome to CampusVibe, ${newUser.name}.`);
    return true;
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEYS.CURRENT_USER);
    info('You have been logged out.');
  };

  // Profile update
  const updateProfile = (updatedFields) => {
    if (!user) return false;

    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);

    const existingUsers = getFromStorage(KEYS.USERS, DEFAULT_USERS);
    const updatedUsers = existingUsers.map((u) => (u.id === user.id ? updatedUser : u));
    setUsers(updatedUsers);
    saveToStorage(KEYS.USERS, updatedUsers);

    success('Profile updated successfully!');
    return true;
  };

  // Switch to demo accounts easily
  const switchDemoAccount = (role) => {
    const existingUsers = getFromStorage(KEYS.USERS, DEFAULT_USERS);
    const target = existingUsers.find((u) => u.role === role);
    if (target) {
      setUser(target);
      success(`Switched role to demo ${role}: ${target.name}`);
    }
  };

  const isAuthenticated = !!user;
  const isStudent = user?.role === 'student';
  const isOrganizer = user?.role === 'organizer';

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        login,
        register,
        logout,
        updateProfile,
        switchDemoAccount,
        isAuthenticated,
        isStudent,
        isOrganizer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

