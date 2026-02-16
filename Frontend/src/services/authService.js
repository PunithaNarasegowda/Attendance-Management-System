import apiClient from '../utils/apiClient';
import { STORAGE_KEYS } from '../constants';

/**
 * Login user (Mock - no backend required)
 */
export const login = async (credentials) => {
  try {
    // Mock login - just use the role from credentials
    const { role } = credentials;
    
    // Create mock user based on role
    let user;
    switch (role) {
      case 'admin':
        user = {
          id: 1,
          name: 'Admin User',
          email: 'admin@nith.ac.in',
          role: 'admin',
        };
        break;
      case 'faculty':
        user = {
          id: 1,
          name: 'Faculty User',
          email: 'faculty@nith.ac.in',
          role: 'faculty',
          facultyId: 'FAC001',
          department: 'Computer Science',
        };
        break;
      case 'student':
        user = {
          id: 1,
          name: 'Student User',
          email: 'student@nith.ac.in',
          role: 'student',
          rollNo: '21MCA001',
          batchYear: 2021,
          department: 'Computer Science',
        };
        break;
      default:
        throw new Error('Invalid role');
    }

    const token = 'mock-jwt-token-' + role;

    // Store in localStorage
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return { success: true, user, token };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Login failed',
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
    const { token } = response.data;

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
