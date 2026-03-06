import { useEffect, useState } from 'react';
import { Plus, Trash2, Link } from 'lucide-react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import sectionService from '../../services/sectionService';
import courseService from '../../services/courseService';

const ManageSections = () => {
  const [sections, setSections] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [sectionForm, setSectionForm] = useState({
    section_id: '',
  });
  const [mappingForm, setMappingForm] = useState({
    course_id: '',
    section_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [sectionsResult, mappingsResult, coursesResult] = await Promise.all([
      sectionService.getAllSections(),
      sectionService.getAllCourseSectionMappings(),
      courseService.getAllCourses(),
    ]);

    if (sectionsResult.success) setSections(sectionsResult.data);
    else setAlert({ type: 'error', message: sectionsResult.error });

    if (mappingsResult.success) setMappings(mappingsResult.data);
    else setAlert({ type: 'error', message: mappingsResult.error });

    if (coursesResult.success) setCourses(coursesResult.data);
    else setAlert({ type: 'error', message: coursesResult.error });

    setLoading(false);
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();

    const result = await sectionService.createSection({
      section_id: sectionForm.section_id.trim().toUpperCase(),
    });

    if (result.success) {
      setAlert({ type: 'success', message: 'Section created successfully.' });
      handleCloseSectionModal();
      loadData();
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleMappingSubmit = async (e) => {
    e.preventDefault();

    const result = await sectionService.createCourseSectionMapping({
      course_id: mappingForm.course_id,
      section_id: mappingForm.section_id,
    });

    if (result.success) {
      setAlert({ type: 'success', message: 'Course-section mapping created successfully.' });
      handleCloseMappingModal();
      loadData();
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleDelete = async (sectionId) => {
    if (!confirm(`Delete section ${sectionId}?`)) return;

    const result = await sectionService.deleteSection(sectionId);
    if (result.success) {
      setAlert({ type: 'success', message: 'Section deleted successfully.' });
      loadData();
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleDeleteMapping = async (courseId, sectionId) => {
    if (!confirm(`Delete mapping ${courseId} -> ${sectionId}?`)) return;

    const result = await sectionService.deleteCourseSectionMapping(courseId, sectionId);
    if (result.success) {
      setAlert({ type: 'success', message: 'Course-section mapping deleted successfully.' });
      loadData();
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleCloseSectionModal = () => {
    setShowSectionModal(false);
    setSectionForm({
      section_id: '',
    });
  };

  const handleCloseMappingModal = () => {
    setShowMappingModal(false);
    setMappingForm({
      course_id: '',
      section_id: '',
    });
  };

  const headers = [
    { key: 'section_id', label: 'Section' },
    { key: 'student_count', label: 'Students' },
    { key: 'lecture_count', label: 'Lectures' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          onClick={() => handleDelete(row.section_id)}
          className="text-red-600 hover:text-red-800"
          title="Delete section"
        >
          <Trash2 size={18} />
        </button>
      ),
    },
  ];

  const mappingHeaders = [
    { key: 'course_id', label: 'Course ID' },
    { key: 'course_name', label: 'Course Name' },
    { key: 'section_id', label: 'Section' },
    { key: 'student_count', label: 'Students' },
    { key: 'lecture_count', label: 'Lectures' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          onClick={() => handleDeleteMapping(row.course_id, row.section_id)}
          className="text-red-600 hover:text-red-800"
          title="Delete mapping"
        >
          <Trash2 size={18} />
        </button>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Sections</h1>
        <Button
          type="button"
          onClick={() => setShowSectionModal(true)}
          variant="primary"
          className="flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Section
        </Button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-4"
        />
      )}

      <Card>
        <Table headers={headers} data={sections} emptyMessage="No sections found" />
      </Card>

      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Course-Section Mapping</h2>
        <Button
          type="button"
          onClick={() => setShowMappingModal(true)}
          variant="outline"
          className="flex items-center"
        >
          <Link size={18} className="mr-2" />
          Map Course to Section
        </Button>
      </div>

      <Card>
        <Table headers={mappingHeaders} data={mappings} emptyMessage="No course-section mappings found" />
      </Card>

      <Modal isOpen={showSectionModal} onClose={handleCloseSectionModal} title="Add Section">
        <form onSubmit={handleSectionSubmit}>
          <Input
            label="Section ID"
            id="section_id"
            value={sectionForm.section_id}
            onChange={(e) => setSectionForm({ ...sectionForm, section_id: e.target.value })}
            placeholder="A"
            required
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="ghost" onClick={handleCloseSectionModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showMappingModal} onClose={handleCloseMappingModal} title="Map Course to Section">
        <form onSubmit={handleMappingSubmit}>
          <Select
            label="Course"
            id="mapping_course_id"
            value={mappingForm.course_id}
            onChange={(e) => setMappingForm({ ...mappingForm, course_id: e.target.value })}
            options={courses.map((course) => ({
              value: course.course_id,
              label: `${course.course_id} - ${course.course_name}`,
            }))}
            placeholder="Select a course"
            required
          />
          <Select
            label="Section"
            id="mapping_section_id"
            value={mappingForm.section_id}
            onChange={(e) => setMappingForm({ ...mappingForm, section_id: e.target.value })}
            options={sections.map((section) => ({ value: section.section_id, label: section.section_id }))}
            placeholder="Select a section"
            required
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="ghost" onClick={handleCloseMappingModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Mapping
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageSections;
