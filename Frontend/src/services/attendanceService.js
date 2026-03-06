import apiClient from '../utils/apiClient';

const mapAttendanceRecord = (record) => ({
  ...record,
  course_id: record.course_id || record.course_code || null,
  section_id: record.section_id || record.section_name || null,
  medical_certificate_path: null,
  medical_approved: null,
});

/**
 * Get attendance for a lecture
 */
export const getAttendanceByLecture = async (lectureId) => {
  try {
    const response = await apiClient.get(`/compat/attendance/lecture/${lectureId}`);
    return { success: true, data: response.data?.data || [] };
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
    const response = await apiClient.get(`/compat/attendance/student/${rollNo}`);
    return { success: true, data: (response.data?.data || []).map(mapAttendanceRecord) };
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
    return { success: true, data: [] };
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
    const normalized = Array.isArray(attendanceData) ? attendanceData : [];

    for (const record of normalized) {
      const payload = {
        roll_no: String(record.roll_no),
        lecture_id: Number(lectureId),
        is_present: !!record.is_present,
      };
      await apiClient.post('/compat/attendance/mark', payload);
    }

    return { success: true, data: null };
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
    const response = await apiClient.post('/compat/attendance/mark', {
      roll_no: String(rollNo),
      lecture_id: Number(lectureId),
      is_present: isPresent,
    });
    return { success: true, data: response.data?.data };
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
    const response = await apiClient.get(`/compat/attendance/student/${rollNo}/course/${courseId}`);
    const filtered = response.data?.data || [];
    return { success: true, data: filtered.map(mapAttendanceRecord) };
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
    return {
      success: false,
      error: 'Medical certificate upload endpoint is not available in backend yet',
    };
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
    return { success: true, data: [] };
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
    return {
      success: false,
      error: 'Medical certificate review endpoint is not available in backend yet',
    };
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
