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
import PageHeader from '../../components/PageHeader';
import studentService from '../../services/studentService';
import courseService from '../../services/courseService';
import sectionService from '../../services/sectionService';
import { DEPARTMENTS } from '../../constants';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [assigningStudent, setAssigningStudent] = useState(null);
  const [alert, setAlert] = useState(null);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedBatchYear, setSelectedBatchYear] = useState('all');
  const [formData, setFormData] = useState({
    roll_no: '',
    name: '',
    email: '',
    password: '',
    batch_year: '',
    department: '',
  });
  const [assignCourseId, setAssignCourseId] = useState('');
  const [assignSectionId, setAssignSectionId] = useState('');

  useEffect(() => {
    loadStudents();
    loadCourses();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    const result = await studentService.getAllStudents();
    if (result.success) {
      setStudents(result.data);
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
    const result = await sectionService.getAllSections();
    if (result.success) {
      setSections(result.data);
    } else {
      setSections([]);
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = editingStudent
      ? await studentService.updateStudent(editingStudent.roll_no, formData)
      : await studentService.createStudent(formData);

    if (result.success) {
      setAlert({
        type: 'success',
        message: `Student ${editingStudent ? 'updated' : 'created'} successfully.`,
      });
      loadStudents();
      handleCloseModal();
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleDelete = async (rollNo) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    const result = await studentService.deleteStudent(rollNo);
    if (result.success) {
      setAlert({ type: 'success', message: 'Student deleted successfully' });
      loadStudents();
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      roll_no: student.roll_no,
      name: student.name,
      email: student.email || '',
      password: '',
      batch_year: student.batch_year,
      department: student.department,
    });
    setShowModal(true);
  };

  const handleOpenAssignModal = (student) => {
    setAssigningStudent(student);
    setAssignCourseId('');
    setAssignSectionId('');
    setSections([]);
    setShowAssignModal(true);
  };

  const handleAssignCourseChange = async (courseId) => {
    setAssignCourseId(courseId);
    setAssignSectionId('');
    await loadSections(courseId);
  };

  const handleAssignCourse = async (e) => {
    e.preventDefault();
    if (!assigningStudent) return;

    const result = await studentService.enrollStudentInCourse(
      assigningStudent.roll_no,
      assignCourseId,
      assignSectionId,
    );
    if (result.success) {
      setAlert({ type: 'success', message: 'Student assigned to section successfully.' });
      setShowAssignModal(false);
      setAssigningStudent(null);
      setAssignCourseId('');
      setAssignSectionId('');
      setSections([]);
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      roll_no: '',
      name: '',
      email: '',
      password: '',
      batch_year: '',
      department: '',
    });
  };

  const headers = [
    { key: 'roll_no', label: 'Roll Number' },
    { key: 'name', label: 'Name' },
    { key: 'batch_year', label: 'Batch Year' },
    { key: 'department', label: 'Department' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(row.roll_no)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => handleOpenAssignModal(row)}
            className="text-green-600 hover:text-green-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            title="Assign to section"
          >
            <Link size={18} />
          </button>
        </div>
      ),
    },
  ];

  const batchYearOptions = [
    { value: 'all', label: 'All Batch Years' },
    ...Array.from(new Set(students.map((student) => String(student.batch_year || 'Unassigned'))))
      .sort((a, b) => {
        if (a === 'Unassigned') return 1;
        if (b === 'Unassigned') return -1;
        return Number(b) - Number(a);
      })
      .map((year) => ({ value: year, label: `Batch ${year}` })),
  ];

  const filteredStudents =
    selectedBatchYear === 'all'
      ? students
      : students.filter((student) => String(student.batch_year || 'Unassigned') === selectedBatchYear);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Students"
        description="Create, edit, assign sections, and filter students by batch year."
        actions={
          <Button
            type="button"
            onClick={() => setShowModal(true)}
            variant="primary"
            className="flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Student
          </Button>
        }
      />

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-4"
        />
      )}

      <Card>
        <Card.Content className="pt-6">
        <Select
          label="Filter by Batch Year"
          id="batch_filter"
          value={selectedBatchYear}
          onChange={(e) => setSelectedBatchYear(e.target.value)}
          options={batchYearOptions}
          placeholder="Select batch year"
        />
        </Card.Content>
      </Card>

      <Card>
        <Card.Content className="pt-6">
          <Table
            headers={headers}
            data={filteredStudents}
            emptyMessage={
              selectedBatchYear === 'all'
                ? 'No students found'
                : `No students found for batch ${selectedBatchYear}`
            }
          />
        </Card.Content>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingStudent ? 'Edit Student' : 'Add Student'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Roll Number"
            id="roll_no"
            value={formData.roll_no}
            onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
            required
            disabled={!!editingStudent}
          />
          <Input
            label="Name"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          {!editingStudent && (
            <Input
              label="Email (optional)"
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Auto-generated if empty"
            />
          )}
          {!editingStudent && (
            <Input
              label="Password (optional)"
              id="password"
              type="text"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Auto-generated if empty"
            />
          )}
          <Input
            label="Batch Year"
            id="batch_year"
            type="number"
            value={formData.batch_year}
            onChange={(e) => setFormData({ ...formData, batch_year: e.target.value })}
            required
          />
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
              {editingStudent ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setAssigningStudent(null);
          setAssignCourseId('');
          setAssignSectionId('');
          setSections([]);
        }}
        title={assigningStudent ? `Assign Section to ${assigningStudent.name}` : 'Assign Section'}
      >
        <form onSubmit={handleAssignCourse}>
          <Select
            label="Course"
            id="assign_course_id"
            value={assignCourseId}
            onChange={(e) => handleAssignCourseChange(e.target.value)}
            options={courses.map((course) => ({ value: course.course_id, label: `${course.course_id} - ${course.course_name}` }))}
            placeholder="Select a course"
            required
          />

          <Select
            label="Section"
            id="assign_section_id"
            value={assignSectionId}
            onChange={(e) => setAssignSectionId(e.target.value)}
            options={sections.map((section) => ({ value: section.section_id, label: section.section_id }))}
            placeholder={assignCourseId ? 'Select a section' : 'Select a course first'}
            disabled={!assignCourseId}
            required
          />

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowAssignModal(false);
                setAssigningStudent(null);
                setAssignCourseId('');
                setAssignSectionId('');
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

export default ManageStudents;
