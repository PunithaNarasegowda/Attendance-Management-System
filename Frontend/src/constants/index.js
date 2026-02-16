// User Roles
export const ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student',
};

// Lecture Status
export const LECTURE_STATUS = {
  SCHEDULED: 'scheduled',
  ONGOING: 'ongoing',
  FINALIZED: 'finalized',
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  MEDICAL: 'medical',
};

// Medical Certificate Status
export const CERTIFICATE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Attendance Percentage Thresholds
export const ATTENDANCE_THRESHOLDS = {
  CRITICAL: 75,
  WARNING: 85,
  EXCELLENT: 90,
};

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// File Upload Config
export const FILE_UPLOAD = {
  MAX_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880, // 5MB
  ALLOWED_TYPES: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'application/pdf,image/jpeg,image/png,image/jpg').split(','),
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
};
