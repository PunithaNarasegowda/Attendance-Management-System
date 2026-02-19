import apiClient from '../utils/apiClient';

/**
 * Get attendance for a lecture
 */
export const getAttendanceByLecture = async (lectureId) => {
  try {
    const response = await apiClient.get(`/attendance/lecture/${lectureId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch attendance',
    };
  }
};

/**
 * Get attendance for a student
 */
export const getAttendanceByStudent = async (rollNo) => {
  try {
    const response = await apiClient.get(`/attendance/student/${rollNo}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch attendance',
    };
  }
};

/**
 * Get attendance report for course and section
 */
export const getAttendanceReport = async (courseId, sectionId) => {
  try {
    const response = await apiClient.get(`/attendance/report/${courseId}/${sectionId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch attendance report',
    };
  }
};

/**
 * Mark attendance for a lecture
 */
export const markAttendance = async (lectureId, attendanceData) => {
  try {
    const response = await apiClient.post(`/attendance/lecture/${lectureId}`, attendanceData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to mark attendance',
    };
  }
};

/**
 * Update attendance record
 */
export const updateAttendance = async (rollNo, lectureId, isPresent) => {
  try {
    const response = await apiClient.put(`/attendance/${rollNo}/${lectureId}`, {
      is_present: isPresent,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update attendance',
    };
  }
};

/**
 * Get student attendance summary for a course
 */
export const getStudentCourseSummary = async (rollNo, courseId) => {
  try {
    const response = await apiClient.get(`/attendance/student/${rollNo}/course/${courseId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch summary',
    };
  }
};

/**
 * Upload medical certificate
 */
export const uploadMedicalCertificate = async (rollNo, lectureId, file) => {
  try {
    const formData = new FormData();
    formData.append('certificate', file);
    formData.append('roll_no', rollNo);
    formData.append('lecture_id', lectureId);

    const response = await apiClient.post('/attendance/medical-certificate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to upload certificate',
    };
  }
};

/**
 * Get pending medical certificates
 */
export const getPendingCertificates = async (facultyId) => {
  try {
    const response = await apiClient.get(`/attendance/medical-certificates/pending/${facultyId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch certificates',
    };
  }
};

/**
 * Approve/Reject medical certificate
 */
export const updateCertificateStatus = async (rollNo, lectureId, approved) => {
  try {
    const response = await apiClient.put(`/attendance/${rollNo}/${lectureId}/certificate`, {
      medical_approved: approved,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update certificate',
    };
  }
};

const attendanceService = {
  getAttendanceByLecture,
  getAttendanceByStudent,
  getAttendanceReport,
  markAttendance,
  updateAttendance,
  getStudentCourseSummary,
  uploadMedicalCertificate,
  getPendingCertificates,
  updateCertificateStatus,
};

export default attendanceService;
