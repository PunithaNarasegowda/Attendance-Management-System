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
import studentService from '../../services/studentService';
import courseService from '../../services/courseService';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [assigningStudent, setAssigningStudent] = useState(null);
  const [alert, setAlert] = useState(null);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    roll_no: '',
    name: '',
    email: '',
    password: '',
    batch_year: '',
    department: '',
  });
  const [assignCourseId, setAssignCourseId] = useState('');

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
    setShowAssignModal(true);
  };

  const handleAssignCourse = async (e) => {
    e.preventDefault();
    if (!assigningStudent) return;

    const result = await studentService.enrollStudentInCourse(assigningStudent.roll_no, assignCourseId);
    if (result.success) {
      setAlert({ type: 'success', message: 'Student assigned to course successfully.' });
      setShowAssignModal(false);
      setAssigningStudent(null);
      setAssignCourseId('');
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
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(row.roll_no)}
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
        <h1 className="text-3xl font-bold text-gray-900">Manage Students</h1>
        <Button
          type="button"
          onClick={() => setShowModal(true)}
          variant="primary"
          className="flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Student
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
        <Table headers={headers} data={students} emptyMessage="No students found" />
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
          <Input
            label="Department"
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
        }}
        title={assigningStudent ? `Assign Course to ${assigningStudent.name}` : 'Assign Course'}
      >
        <form onSubmit={handleAssignCourse}>
          <Select
            label="Course"
            id="assign_course_id"
            value={assignCourseId}
            onChange={(e) => setAssignCourseId(e.target.value)}
            options={courses.map((course) => ({ value: course.course_id, label: `${course.course_id} - ${course.course_name}` }))}
            placeholder="Select a course"
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
