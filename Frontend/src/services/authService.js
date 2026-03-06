import apiClient from '../utils/apiClient';
import { STORAGE_KEYS } from '../constants';

/**
 * Login user
 */
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    const payload = response.data || {};
    const user = payload.user;
    const token = payload.access_token;

    if (!user || !token) {
      return { success: false, error: 'Invalid login response from server' };
    }

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    if (payload.refresh_token) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, payload.refresh_token);
    }

    return { success: true, user, token };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || error.response?.data?.message || 'Login failed',
    };
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

/**
 * Get current token
 */
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Refresh token
 */
export const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refresh) return { success: false };

    const response = await apiClient.post('/auth/refresh', { refreshToken: refresh });
    const token = response.data?.access_token;

    if (!token) {
      return { success: false };
    }

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    return { success: true, token };
  } catch (error) {
    logout();
    return { success: false };
  }
};

/**
 * Change password
 */
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await apiClient.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return { success: true, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Password change failed',
    };
  }
};

const authService = {
  login,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
  refreshToken,
  changePassword,
};

export default authService;
