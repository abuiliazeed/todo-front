'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  credentials: { username: string; password: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const userData = await getCurrentUser(username, password);
      setUser(userData);
      setCredentials({ username, password });
      localStorage.setItem('auth', JSON.stringify({ username, password }));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setCredentials(null);
    localStorage.removeItem('auth');
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const { username, password } = JSON.parse(storedAuth);
      login(username, password).catch(() => {
        localStorage.removeItem('auth');
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        credentials,
      }}
    >
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
