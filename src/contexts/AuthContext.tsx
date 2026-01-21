import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User, UserType, UserRole } from '@/types';
import { dummyUsers } from '@/data/dummyData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userType: UserType, role?: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (userType: UserType, role?: UserRole) => {
    // Find a matching dummy user
    const matchedUser = dummyUsers.find(u => {
      if (userType === 'terminal' && role) {
        return u.type === userType && u.role === role;
      }
      return u.type === userType;
    });

    if (matchedUser) {
      setUser(matchedUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
