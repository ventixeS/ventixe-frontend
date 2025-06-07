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
      console.log('AuthContext: Initializing authentication...');
      try {
        const storedUser = authService.getStoredUser();
        const token = authService.getStoredToken();
        console.log('AuthContext: Stored token:', token);
        console.log('AuthContext: Stored user:', storedUser);
        
        if (token && storedUser) {
          console.log('AuthContext: Token and user found in storage. Setting auth state.');
          setUser(storedUser);
          setIsAuthenticated(true);
          
          try {
            console.log('AuthContext: Refreshing user data from server...');
            const currentUser = await authService.getCurrentUser();
            console.log('AuthContext: Refreshed user data:', currentUser);
            setUser(currentUser);
          } catch (refreshError) {
            console.warn('AuthContext: Failed to refresh user data, continuing with stored user.', refreshError);
          }
        } else {
          console.log('AuthContext: No token or user in storage.');
        }
      } catch (initError) {
        console.error('AuthContext: Critical error during auth initialization.', initError);
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
        console.log('AuthContext: Initialization complete.');
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    console.log('AuthContext: Attempting to log in...');
    try {
      const loggedInUser = await authService.login(credentials);
      console.log('AuthContext: Login successful. User data:', loggedInUser);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      return loggedInUser;
    } catch (error) {
      console.error('AuthContext: Login failed.', error);
      throw error;
    }
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