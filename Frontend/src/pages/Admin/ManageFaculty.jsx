import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import facultyService from '../../services/facultyService';

const ManageFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    faculty_id: '',
    name: '',
    email: '',
    department: '',
  });

  useEffect(() => {
    loadFaculty();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = editingFaculty
      ? await facultyService.updateFaculty(editingFaculty.faculty_id, formData)
      : await facultyService.createFaculty(formData);

    if (result.success) {
      setAlert({
        type: 'success',
        message: `Faculty ${editingFaculty ? 'updated' : 'created'} successfully`,
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
      department: fac.department,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFaculty(null);
    setFormData({
      faculty_id: '',
      name: '',
      email: '',
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
          onClick={() => setShowModal(true)}
          variant="primary"
          className="flex items-center"
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
          <Input
            label="Department"
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            required
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingFaculty ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageFaculty;
