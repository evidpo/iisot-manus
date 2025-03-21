"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user types
export type UserRole = 'specialist' | 'manager' | 'hr' | 'employee' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user session on mount
  useEffect(() => {
    const checkUserSession = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call to authenticate
      // For demo purposes, we'll simulate a successful login with mock data
      
      // Check if user exists in localStorage (for demo)
      const usersStr = localStorage.getItem('users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      const foundUser = users.find((u: any) => u.email === email);
      
      if (foundUser && foundUser.password === password) {
        // Create user session without password
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (
    email: string, 
    password: string, 
    fullName: string, 
    role: UserRole
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call to register
      // For demo purposes, we'll store in localStorage
      
      // Check if user already exists
      const usersStr = localStorage.getItem('users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      if (users.some((u: any) => u.email === email)) {
        return false; // User already exists
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password, // In a real app, this would be hashed
        fullName,
        role
      };
      
      // Save to "database"
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Log in the user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
