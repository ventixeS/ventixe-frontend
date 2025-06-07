import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        const token = authService.getStoredToken();
        
        if (token && storedUser) {
          try {
            setUser(storedUser);
            setIsAuthenticated(true);
            
            try {
              const currentUser = await authService.getCurrentUser();
              setUser(currentUser);
            } catch (refreshError) {
              console.warn('Failed to refresh user data, using stored user:', refreshError);
            }
          } catch (error) {
            console.error('Auth initialization error:', error);
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (initError) {
        console.error('Auth initialization error:', initError);
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const loggedInUser = await authService.login(credentials);
    setUser(loggedInUser);
    setIsAuthenticated(true);
    return loggedInUser;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const verifyEmail = async (token) => {
    return await authService.verifyEmail(token);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    verifyEmail,
    refreshUser,
    checkVerificationStatus: authService.checkVerificationStatus,
    resendVerificationEmail: authService.resendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 