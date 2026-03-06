import apiClient from '../utils/apiClient';

const mapLecture = (lecture) => ({
  lecture_id: lecture.lecture_id,
  lecture_date: lecture.lecture_date,
  status:
    String(lecture.status || '').toLowerCase() === 'completed'
      ? 'finalized'
      : String(lecture.status || '').toLowerCase(),
  course_id: lecture.course_id,
  section_id: lecture.section_name,
  section_key: `${lecture.course_id}:${lecture.section_name}`,
  faculty_id: lecture.faculty_id,
});

/**
 * Get all lectures
 */
export const getAllLectures = async () => {
  try {
    return { success: false, error: 'Use getLecturesByFaculty for this backend' };
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
    return { success: false, error: 'Use getLecturesByFaculty and filter by lecture id' };
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
    const lectureId = Number(Date.now().toString().slice(-7));
    const response = await apiClient.post('/compat/lectures', {
      lecture_id: lectureId,
      lecture_date: lectureData.lecture_date,
      status: 'ongoing',
      course_id: lectureData.course_id,
      section_id: lectureData.section_id,
      faculty_id: lectureData.faculty_id,
    });

    return {
      success: true,
      data: {
        lecture_id: response.data?.data?.lecture_id || lectureId,
      },
    };
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
    return { success: false, error: 'Lecture update is not supported' };
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
    const response = await apiClient.delete(`/compat/lectures/${lectureId}`);
    return { success: true, data: response.data?.data };
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
    const response = await apiClient.get(`/compat/lectures/faculty/${facultyId}`);
    return { success: true, data: (response.data?.data || []).map(mapLecture) };
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
    return { success: false, error: 'Use getLecturesByFaculty and filter by course/section' };
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
    const response = await apiClient.post(`/compat/lectures/${lectureId}/finalize`);
    return { success: true, data: response.data?.data };
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
