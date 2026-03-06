import apiClient from '../utils/apiClient';

/**
 * Get all sections
 */
export const getAllSections = async () => {
  try {
    const response = await apiClient.get('/compat/sections');
    return {
      success: true,
      data: (response.data?.data || []).map((section) => ({
        section_id: section.section_id,
        student_count: section.student_count,
        lecture_count: section.lecture_count,
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch sections',
    };
  }
};

/**
 * Get section by ID
 */
export const getSectionById = async (sectionId) => {
  try {
    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch section',
    };
  }
};

/**
 * Create new section
 */
export const createSection = async (sectionData) => {
  try {
    const response = await apiClient.post('/compat/sections', {
      section_id: sectionData.section_id,
    });
    return { success: true, data: response.data?.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create section',
    };
  }
};

/**
 * Update section
 */
export const updateSection = async (sectionId, sectionData) => {
  try {
    return {
      success: false,
      error: 'Section update is not supported by this backend schema',
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update section',
    };
  }
};

/**
 * Delete section
 */
export const deleteSection = async (sectionId) => {
  try {
    const response = await apiClient.delete(`/compat/sections/${sectionId}`);
    return { success: true, data: response.data?.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete section',
    };
  }
};

/**
 * Get students in a section
 */
export const getSectionStudents = async (sectionId) => {
  try {
    const [courseId, sectionName] = String(sectionId).split(':');
    if (!courseId || !sectionName) {
      return { success: false, error: 'Invalid section identifier format' };
    }

    const response = await apiClient.get(`/compat/sections/${courseId}/${sectionName}/students`);
    return { success: true, data: response.data?.data || [] };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch students',
    };
  }
};

/**
 * Get sections for a specific course
 */
export const getCourseSections = async (courseId) => {
  try {
    const response = await apiClient.get(`/compat/courses/${courseId}/sections`);
    return { success: true, data: response.data?.data || [] };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch course sections',
    };
  }
};

/**
 * Get all course-section mappings
 */
export const getAllCourseSectionMappings = async () => {
  try {
    const response = await apiClient.get('/compat/course-sections');
    return { success: true, data: response.data?.data || [] };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch course-section mappings',
    };
  }
};

/**
 * Create course-section mapping
 */
export const createCourseSectionMapping = async (mappingData) => {
  try {
    const response = await apiClient.post('/compat/course-sections', {
      course_id: mappingData.course_id,
      section_id: mappingData.section_id,
    });
    return { success: true, data: response.data?.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create course-section mapping',
    };
  }
};

/**
 * Delete course-section mapping
 */
export const deleteCourseSectionMapping = async (courseId, sectionId) => {
  try {
    const response = await apiClient.delete(`/compat/course-sections/${courseId}/${sectionId}`);
    return { success: true, data: response.data?.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete course-section mapping',
    };
  }
};

const sectionService = {
  getAllSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
  getSectionStudents,
  getCourseSections,
  getAllCourseSectionMappings,
  createCourseSectionMapping,
  deleteCourseSectionMapping,
};

export default sectionService;
