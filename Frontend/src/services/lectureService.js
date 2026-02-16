import apiClient from '../utils/apiClient';

/**
 * Get all lectures
 */
export const getAllLectures = async () => {
  try {
    const response = await apiClient.get('/lectures');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch lectures',
    };
  }
};

/**
 * Get lecture by ID
 */
export const getLectureById = async (lectureId) => {
  try {
    const response = await apiClient.get(`/lectures/${lectureId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch lecture',
    };
  }
};

/**
 * Create new lecture
 */
export const createLecture = async (lectureData) => {
  try {
    const response = await apiClient.post('/lectures', lectureData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create lecture',
    };
  }
};

/**
 * Update lecture
 */
export const updateLecture = async (lectureId, lectureData) => {
  try {
    const response = await apiClient.put(`/lectures/${lectureId}`, lectureData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update lecture',
    };
  }
};

/**
 * Delete lecture
 */
export const deleteLecture = async (lectureId) => {
  try {
    const response = await apiClient.delete(`/lectures/${lectureId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete lecture',
    };
  }
};

/**
 * Get lectures by faculty
 */
export const getLecturesByFaculty = async (facultyId) => {
  try {
    const response = await apiClient.get(`/lectures/faculty/${facultyId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch lectures',
    };
  }
};

/**
 * Get lectures by course and section
 */
export const getLecturesByCourseSection = async (courseId, sectionId) => {
  try {
    const response = await apiClient.get(`/lectures/course/${courseId}/section/${sectionId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch lectures',
    };
  }
};

/**
 * Finalize lecture (lock attendance)
 */
export const finalizeLecture = async (lectureId) => {
  try {
    const response = await apiClient.post(`/lectures/${lectureId}/finalize`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to finalize lecture',
    };
  }
};

const lectureService = {
  getAllLectures,
  getLectureById,
  createLecture,
  updateLecture,
  deleteLecture,
  getLecturesByFaculty,
  getLecturesByCourseSection,
  finalizeLecture,
};

export default lectureService;
