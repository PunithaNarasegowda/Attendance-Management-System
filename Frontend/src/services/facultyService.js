import apiClient from '../utils/apiClient';

/**
 * Get all faculty
 */
export const getAllFaculty = async () => {
  try {
    const response = await apiClient.get('/faculty');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch faculty',
    };
  }
};

/**
 * Get faculty by ID
 */
export const getFacultyById = async (facultyId) => {
  try {
    const response = await apiClient.get(`/faculty/${facultyId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch faculty',
    };
  }
};

/**
 * Create new faculty
 */
export const createFaculty = async (facultyData) => {
  try {
    const response = await apiClient.post('/faculty', facultyData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create faculty',
    };
  }
};

/**
 * Update faculty
 */
export const updateFaculty = async (facultyId, facultyData) => {
  try {
    const response = await apiClient.put(`/faculty/${facultyId}`, facultyData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update faculty',
    };
  }
};

/**
 * Delete faculty
 */
export const deleteFaculty = async (facultyId) => {
  try {
    const response = await apiClient.delete(`/faculty/${facultyId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete faculty',
    };
  }
};

/**
 * Get faculty's assigned courses
 */
export const getFacultyCourses = async (facultyId) => {
  try {
    const response = await apiClient.get(`/faculty/${facultyId}/courses`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch courses',
    };
  }
};

/**
 * Assign faculty to course and section
 */
export const assignFacultyToCourse = async (facultyId, courseId, sectionId) => {
  try {
    const response = await apiClient.post(`/faculty/${facultyId}/assign`, {
      courseId,
      sectionId,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to assign faculty',
    };
  }
};

const facultyService = {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyCourses,
  assignFacultyToCourse,
};

export default facultyService;
