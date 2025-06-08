import api from './api';

export const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const userData = response.data;
      
      if (!userData || !userData.token) {
        throw new Error('Invalid login response from server');
      }

      const { token, ...user } = userData;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        this.logout();
      }
      throw new Error(error.response?.data?.message || 'Failed to get user data');
    }
  },

  async verifyEmail(token) {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Email verification failed');
    }
  },

  async checkVerificationStatus(email) {
    try {
      const response = await api.get(`/emailverification/status/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check verification status');
    }
  },

  async resendVerificationEmail(email) {
    try {
      const response = await api.post('/emailverification/resend', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to resend verification email');
    }
  },

  getStoredUser() {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined' || user === 'null') {
      return null;
    }
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('user'); // Clean up invalid data
      return null;
    }
  },

  getStoredToken() {
    return localStorage.getItem('authToken');
  },

  isAuthenticated() {
    return !!this.getStoredToken();
  }
}; 