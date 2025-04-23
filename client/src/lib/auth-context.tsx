"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { User, getCurrentUser, login as loginService, logout as logoutService, register as registerService, LoginData, RegisterData } from '@/services/auth';

interface ExtendedSession {
  user?: {
    email?: string | null;
    name?: string | null;
  };
  provider?: string;
  accessToken?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession() as { data: ExtendedSession | null, status: string };

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (status === 'authenticated' && session?.user) {
          // If we have a session from NextAuth, try to get the user from our backend
          const currentUser = getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // If no user in localStorage but we have a session, try to authenticate with backend
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/social-login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: session.user.email,
                provider: session.provider,
                accessToken: session.accessToken,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
              setUser(data.user);
            }
          }
        } else if (status === 'unauthenticated') {
          // If no session, check if we have a user in localStorage
          const currentUser = getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [session, status]);

  const login = async (data: LoginData) => {
    try {
      const response = await loginService(data);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await registerService(data);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user || status === 'authenticated',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 