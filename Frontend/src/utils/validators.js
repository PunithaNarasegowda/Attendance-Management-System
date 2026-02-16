/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate roll number format (numeric)
 */
export const validateRollNo = (rollNo) => {
  return /^\d+$/.test(rollNo);
};

/**
 * Validate faculty ID (numeric)
 */
export const validateFacultyId = (facultyId) => {
  return /^\d+$/.test(facultyId);
};

/**
 * Validate course ID (alphanumeric)
 */
export const validateCourseId = (courseId) => {
  return /^[A-Za-z0-9]+$/.test(courseId);
};

/**
 * Validate file size
 */
export const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

/**
 * Validate file type
 */
export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate batch year
 */
export const validateBatchYear = (year) => {
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year);
  return yearNum >= 2000 && yearNum <= currentYear + 5;
};

/**
 * Validate phone number (10 digits)
 */
export const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

/**
 * Validate name (only letters and spaces)
 */
export const validateName = (name) => {
  return /^[A-Za-z\s]+$/.test(name);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Get validation error message
 */
export const getValidationMessage = (field, value, rules = {}) => {
  if (rules.required && !value) {
    return `${field} is required`;
  }

  if (rules.minLength && value.length < rules.minLength) {
    return `${field} must be at least ${rules.minLength} characters`;
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return `${field} must be at most ${rules.maxLength} characters`;
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.message || `${field} format is invalid`;
  }

  return '';
};
