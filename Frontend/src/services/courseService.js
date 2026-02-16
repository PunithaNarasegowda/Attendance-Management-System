import apiClient from '../utils/apiClient';

/**
 * Get all courses
 */
export const getAllCourses = async () => {
  try {
    const response = await apiClient.get('/courses');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch courses',
    };
  }
};

/**
 * Get course by ID
 */
export const getCourseById = async (courseId) => {
  try {
    const response = await apiClient.get(`/courses/${courseId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch course',
    };
  }
};

/**
 * Create new course
 */
export const createCourse = async (courseData) => {
  try {
    const response = await apiClient.post('/courses', courseData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create course',
    };
  }
};

/**
 * Update course
 */
export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await apiClient.put(`/courses/${courseId}`, courseData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update course',
    };
  }
};

/**
 * Delete course
 */
export const deleteCourse = async (courseId) => {
  try {
    const response = await apiClient.delete(`/courses/${courseId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete course',
    };
  }
};

/**
 * Get sections for a course
 */
export const getCourseSections = async (courseId) => {
  try {
    const response = await apiClient.get(`/courses/${courseId}/sections`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch sections',
    };
  }
};

const courseService = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseSections,
};

export default courseService;
