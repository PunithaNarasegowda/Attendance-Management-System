import apiClient from '../utils/apiClient';

const mapStudent = (student) => ({
  roll_no: student.roll_no,
  name: student.name,
  email: student.email,
  batch_year: student.batch_year,
  department: student.department,
  login_email: student.login_email,
  temporary_password: student.temporary_password,
  role: student.role,
});

/**
 * Get all students
 */
export const getAllStudents = async () => {
  try {
    const response = await apiClient.get('/compat/students');
    return { success: true, data: (response.data?.data || []).map(mapStudent) };
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
    const response = await apiClient.get('/compat/students');
    const student = (response.data?.data || []).find((item) => item.roll_no === rollNo);
    return { success: true, data: student ? mapStudent(student) : null };
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
    const response = await apiClient.post('/compat/students', {
      roll_no: studentData.roll_no,
      name: studentData.name,
      email: studentData.email,
      password: studentData.password,
      batch_year: Number(studentData.batch_year),
      department: studentData.department,
    });
    return { success: true, data: mapStudent(response.data?.data || {}) };
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
    const response = await apiClient.put(`/compat/students/${rollNo}`, {
      name: studentData.name,
      batch_year: Number(studentData.batch_year),
      department: studentData.department,
    });
    return { success: true, data: mapStudent(response.data?.data || {}) };
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
    const response = await apiClient.delete(`/compat/students/${rollNo}`);
    return { success: true, data: response.data?.data };
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
    const response = await apiClient.get('/compat/students');
    return {
      success: true,
      data: (response.data?.data || [])
        .filter((student) => String(student.batch_year) === String(batchYear))
        .map(mapStudent),
    };
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
    const response = await apiClient.get(`/compat/students/${rollNo}/courses`);
    return {
      success: true,
      data: (response.data?.data || []).map((course) => ({
        course_id: course.course_id,
        course_name: course.course_name,
        section_id: course.section_id,
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
 * Enroll student in course
 */
export const enrollStudentInCourse = async (rollNo, courseId, sectionId) => {
  try {
    const response = await apiClient.post(`/compat/students/${rollNo}/enroll`, {
      course_id: courseId,
      section_id: sectionId,
    });
    return { success: true, data: response.data?.data };
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
