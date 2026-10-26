import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import adminService, { getAdminToken, setAdminToken } from '../services/admin.service.js';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await adminService.getMe();
      if (response?.data?.admin) {
        setAdmin(response.data.admin);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
      setAdminToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    const res = await adminService.login(credentials);
    if (res?.data?.admin) {
      setAdmin(res.data.admin);
    }
    return res;
  };

  const logout = async () => {
    try {
      await adminService.logout();
    } finally {
      setAdmin(null);
    }
  };

  const value = {
    admin,
    isAuthenticated: Boolean(admin),
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;
