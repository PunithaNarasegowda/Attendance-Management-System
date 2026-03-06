import apiClient from '../utils/apiClient';

const mapCourse = (course) => ({
  course_id: course.course_id,
  course_name: course.course_name,
});

/**
 * Get all courses
 */
export const getAllCourses = async () => {
  try {
    const response = await apiClient.get('/compat/courses');
    return { success: true, data: (response.data?.data || []).map(mapCourse) };
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
    const response = await apiClient.get('/compat/courses');
    const course = (response.data?.data || []).find((item) => item.course_id === courseId);
    return { success: true, data: course ? mapCourse(course) : null };
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
    const response = await apiClient.post('/compat/courses', {
      course_id: courseData.course_id,
      course_name: courseData.course_name,
    });
    return { success: true, data: mapCourse(response.data?.data || {}) };
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
    const response = await apiClient.put(`/compat/courses/${courseId}`, {
      course_name: courseData.course_name,
    });
    return { success: true, data: mapCourse(response.data?.data || {}) };
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
    const response = await apiClient.delete(`/compat/courses/${courseId}`);
    return { success: true, data: response.data?.data };
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
    const response = await apiClient.get(`/compat/courses/${courseId}/sections`);
    return {
      success: true,
      data: response.data?.data || [],
    };
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
