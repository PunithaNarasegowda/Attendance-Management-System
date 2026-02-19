import apiClient from '../utils/apiClient';

/**
 * Get all students
 */
export const getAllStudents = async () => {
  try {
    const response = await apiClient.get('/students');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch students',
    };
  }
};

/**
 * Get student by roll number
 */
export const getStudentByRollNo = async (rollNo) => {
  try {
    const response = await apiClient.get(`/students/${rollNo}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch student',
    };
  }
};

/**
 * Create new student
 */
export const createStudent = async (studentData) => {
  try {
    const response = await apiClient.post('/students', studentData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create student',
    };
  }
};

/**
 * Update student
 */
export const updateStudent = async (rollNo, studentData) => {
  try {
    const response = await apiClient.put(`/students/${rollNo}`, studentData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update student',
    };
  }
};

/**
 * Delete student
 */
export const deleteStudent = async (rollNo) => {
  try {
    const response = await apiClient.delete(`/students/${rollNo}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete student',
    };
  }
};

/**
 * Get students by batch year
 */
export const getStudentsByBatch = async (batchYear) => {
  try {
    const response = await apiClient.get(`/students/batch/${batchYear}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch students',
    };
  }
};

/**
 * Get student's enrolled courses
 */
export const getStudentCourses = async (rollNo) => {
  try {
    const response = await apiClient.get(`/students/${rollNo}/courses`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch courses',
    };
  }
};

/**
 * Enroll student in course
 */
export const enrollStudentInCourse = async (rollNo, courseId, sectionId) => {
  try {
    const response = await apiClient.post(`/students/${rollNo}/enroll`, {
      courseId,
      sectionId,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to enroll student',
    };
  }
};

const studentService = {
  getAllStudents,
  getStudentByRollNo,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByBatch,
  getStudentCourses,
  enrollStudentInCourse,
};

export default studentService;
