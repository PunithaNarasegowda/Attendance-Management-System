import apiClient from '../utils/apiClient';

const mapFaculty = (faculty) => ({
  faculty_id: faculty.faculty_id,
  name: faculty.name,
  email: faculty.email,
  department: faculty.department,
  login_email: faculty.login_email,
  temporary_password: faculty.temporary_password,
  role: faculty.role,
});

/**
 * Get all faculty
 */
export const getAllFaculty = async () => {
  try {
    const response = await apiClient.get('/compat/faculty');
    return { success: true, data: (response.data?.data || []).map(mapFaculty) };
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
    const response = await apiClient.get('/compat/faculty');
    const faculty = (response.data?.data || []).find((item) => item.faculty_id === facultyId);
    return { success: true, data: faculty ? mapFaculty(faculty) : null };
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
    const response = await apiClient.post('/compat/faculty', {
      faculty_id: facultyData.faculty_id,
      name: facultyData.name,
      email: facultyData.email,
      password: facultyData.password,
      department: facultyData.department,
    });
    return { success: true, data: mapFaculty(response.data?.data || {}) };
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
    const response = await apiClient.put(`/compat/faculty/${facultyId}`, {
      name: facultyData.name,
      email: facultyData.email,
      department: facultyData.department,
    });
    return { success: true, data: mapFaculty(response.data?.data || {}) };
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
    const response = await apiClient.delete(`/compat/faculty/${facultyId}`);
    return { success: true, data: response.data?.data };
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
    const response = await apiClient.get(`/compat/faculty/${facultyId}/courses`);
    return {
      success: true,
      data: (response.data?.data || []).map((course) => ({
        course_id: course.course_id,
        course_name: course.course_name,
        section_id: course.section_id,
        batch_year: course.batch_year,
        student_count: course.student_count,
        lecture_count: course.lecture_count,
      })),
    };
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
    const response = await apiClient.post(`/compat/faculty/${facultyId}/assign`, {
      course_id: courseId,
      section_id: sectionId,
    });
    return { success: true, data: response.data?.data };
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
