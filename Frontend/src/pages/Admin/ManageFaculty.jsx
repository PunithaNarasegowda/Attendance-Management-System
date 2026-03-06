import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Link } from 'lucide-react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import facultyService from '../../services/facultyService';
import courseService from '../../services/courseService';
import { DEPARTMENTS } from '../../constants';

const ManageFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [assigningFaculty, setAssigningFaculty] = useState(null);
  const [alert, setAlert] = useState(null);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    faculty_id: '',
    name: '',
    email: '',
    password: '',
    department: '',
  });
  const [assignForm, setAssignForm] = useState({
    course_id: '',
    section_id: '',
  });

  useEffect(() => {
    loadFaculty();
    loadCourses();
  }, []);

  const loadFaculty = async () => {
    setLoading(true);
    const result = await facultyService.getAllFaculty();
    if (result.success) {
      setFaculty(result.data);
    } else {
      setAlert({ type: 'error', message: result.error });
    }
    setLoading(false);
  };

  const loadCourses = async () => {
    const result = await courseService.getAllCourses();
    if (result.success) {
      setCourses(result.data);
    }
  };

  const loadSections = async (courseId) => {
    if (!courseId) {
      setSections([]);
      return;
    }
    const result = await courseService.getCourseSections(courseId);
    if (result.success) {
      setSections(result.data);
    } else {
      setSections([]);
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = editingFaculty
      ? await facultyService.updateFaculty(editingFaculty.faculty_id, formData)
      : await facultyService.createFaculty(formData);

    if (result.success) {
      setAlert({
        type: 'success',
        message: `Faculty ${editingFaculty ? 'updated' : 'created'} successfully.`,
      });
      loadFaculty();
      handleCloseModal();
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleDelete = async (facultyId) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;

    const result = await facultyService.deleteFaculty(facultyId);
    if (result.success) {
      setAlert({ type: 'success', message: 'Faculty deleted successfully' });
      loadFaculty();
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleEdit = (fac) => {
    setEditingFaculty(fac);
    setFormData({
      faculty_id: fac.faculty_id,
      name: fac.name,
      email: fac.email,
      password: '',
      department: fac.department,
    });
    setShowModal(true);
  };

  const handleOpenAssignModal = async (fac) => {
    setAssigningFaculty(fac);
    setAssignForm({ course_id: '', section_id: '' });
    setSections([]);
    setShowAssignModal(true);
  };

  const handleCourseSelection = async (courseId) => {
    setAssignForm({ course_id: courseId, section_id: '' });
    await loadSections(courseId);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assigningFaculty) return;

    const result = await facultyService.assignFacultyToCourse(
      assigningFaculty.faculty_id,
      assignForm.course_id,
      assignForm.section_id,
    );

    if (result.success) {
      setAlert({ type: 'success', message: 'Faculty assigned to course successfully.' });
      setShowAssignModal(false);
      setAssigningFaculty(null);
      setAssignForm({ course_id: '', section_id: '' });
      setSections([]);
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFaculty(null);
    setFormData({
      faculty_id: '',
      name: '',
      email: '',
      password: '',
      department: '',
    });
  };

  const headers = [
    { key: 'faculty_id', label: 'Faculty ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(row.faculty_id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => handleOpenAssignModal(row)}
            className="text-green-600 hover:text-green-800"
            title="Assign course"
          >
            <Link size={18} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Faculty</h1>
        <Button
          type="button"
          onClick={() => setShowModal(true)}
          variant="outline"
          className="flex items-center border-[#1a237e] text-[#1a237e] hover:bg-[#1a237e]/10"
        >
          <Plus size={20} className="mr-2" />
          Add Faculty
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
        <Table headers={headers} data={faculty} emptyMessage="No faculty found" />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingFaculty ? 'Edit Faculty' : 'Add Faculty'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Faculty ID"
            id="faculty_id"
            value={formData.faculty_id}
            onChange={(e) => setFormData({ ...formData, faculty_id: e.target.value })}
            required
            disabled={!!editingFaculty}
          />
          <Input
            label="Name"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          {!editingFaculty && (
            <Input
              label="Password (optional)"
              id="password"
              type="text"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Auto-generated if empty"
            />
          )}
          <Select
            label="Department"
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            options={DEPARTMENTS}
            placeholder="Select department"
            required
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingFaculty ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setAssigningFaculty(null);
          setAssignForm({ course_id: '', section_id: '' });
          setSections([]);
        }}
        title={assigningFaculty ? `Assign Course to ${assigningFaculty.name}` : 'Assign Course'}
      >
        <form onSubmit={handleAssign}>
          <Select
            label="Course"
            id="course_id"
            value={assignForm.course_id}
            onChange={(e) => handleCourseSelection(e.target.value)}
            options={courses.map((course) => ({ value: course.course_id, label: `${course.course_id} - ${course.course_name}` }))}
            placeholder="Select a course"
            required
          />

          <Select
            label="Section"
            id="section_id"
            value={assignForm.section_id}
            onChange={(e) => setAssignForm({ ...assignForm, section_id: e.target.value })}
            options={sections.map((section) => ({ value: section.section_id, label: section.section_id }))}
            placeholder={assignForm.course_id ? 'Select a section' : 'Select a course first'}
            disabled={!assignForm.course_id}
            required
          />

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowAssignModal(false);
                setAssigningFaculty(null);
                setAssignForm({ course_id: '', section_id: '' });
                setSections([]);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Assign
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageFaculty;
