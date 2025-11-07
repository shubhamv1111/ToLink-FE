'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, User as ApiUser } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  profilePhoto?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  updateProfilePhoto: (photoUrl: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authApi.getMe();
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          createdAt: userData.createdAt,
        });
      } catch (error) {
        // Not authenticated or session expired
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userData = await authApi.login(email, password);
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt,
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userData = await authApi.signup(name, email, password);
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt,
      });
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const userData = await authApi.updateProfile({
        name: data.name,
        email: data.email,
      });
      setUser({
        ...user,
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt,
      });
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const updateProfilePhoto = async (photoUrl: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...user, profilePhoto: photoUrl };
      setUser(updatedUser);
      localStorage.setItem('tolink_user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Profile photo update error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    updateProfilePhoto
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 