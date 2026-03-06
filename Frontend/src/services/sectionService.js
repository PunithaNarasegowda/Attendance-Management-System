import apiClient from '../utils/apiClient';

/**
 * Get all sections
 */
export const getAllSections = async () => {
  try {
    return { success: true, data: [] };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch sections',
    };
  }
};

/**
 * Get section by ID
 */
export const getSectionById = async (sectionId) => {
  try {
    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch section',
    };
  }
};

/**
 * Create new section
 */
export const createSection = async (sectionData) => {
  try {
    return { success: false, error: 'Section creation is not available in compatibility mode' };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create section',
    };
  }
};

/**
 * Update section
 */
export const updateSection = async (sectionId, sectionData) => {
  try {
    return {
      success: false,
      error: 'Section update is not supported by this backend schema',
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update section',
    };
  }
};

/**
 * Delete section
 */
export const deleteSection = async (sectionId) => {
  try {
    return {
      success: false,
      error: 'Section delete is not supported by this backend schema',
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete section',
    };
  }
};

/**
 * Get students in a section
 */
export const getSectionStudents = async (sectionId) => {
  try {
    const [courseId, sectionName] = String(sectionId).split(':');
    if (!courseId || !sectionName) {
      return { success: false, error: 'Invalid section identifier format' };
    }

    const response = await apiClient.get(`/compat/sections/${courseId}/${sectionName}/students`);
    return { success: true, data: response.data?.data || [] };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch students',
    };
  }
};

/**
 * Get sections for a specific course
 */
export const getCourseSections = async (courseId) => {
  try {
    const response = await apiClient.get(`/compat/courses/${courseId}/sections`);
    return { success: true, data: response.data?.data || [] };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch course sections',
    };
  }
};

const sectionService = {
  getAllSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
  getSectionStudents,
  getCourseSections,
};

export default sectionService;
