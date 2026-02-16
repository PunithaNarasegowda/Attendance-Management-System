import apiClient from '../utils/apiClient';

/**
 * Get all sections
 */
export const getAllSections = async () => {
  try {
    const response = await apiClient.get('/sections');
    return { success: true, data: response.data };
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
    const response = await apiClient.get(`/sections/${sectionId}`);
    return { success: true, data: response.data };
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
    const response = await apiClient.post('/sections', sectionData);
    return { success: true, data: response.data };
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
    const response = await apiClient.put(`/sections/${sectionId}`, sectionData);
    return { success: true, data: response.data };
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
    const response = await apiClient.delete(`/sections/${sectionId}`);
    return { success: true, data: response.data };
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
    const response = await apiClient.get(`/sections/${sectionId}/students`);
    return { success: true, data: response.data };
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
    const response = await apiClient.get(`/courses/${courseId}/sections`);
    return { success: true, data: response.data };
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
