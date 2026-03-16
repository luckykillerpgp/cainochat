import React, {createContext, useContext, useState, useEffect} from 'react';
import {getSession, logout as authLogout, upgradeToPaidTier} from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const stored = await getSession();
    setUser(stored);
    setLoading(false);
  }

  async function login(userData) {
    setUser(userData);
  }

  async function logout() {
    await authLogout();
    setUser(null);
  }

  async function upgrade(tier) {
    const updated = await upgradeToPaidTier();
    if (updated) {
      setUser(updated);
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isPaid: user?.tier === 'paid',
    login,
    logout,
    upgrade,
    refresh: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
