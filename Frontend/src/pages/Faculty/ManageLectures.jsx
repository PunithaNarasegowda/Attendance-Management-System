import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import { useAuth } from '../../contexts/AuthContext';
import lectureService from '../../services/lectureService';
import { formatDisplayDate, getCurrentDate } from '../../utils/dateUtils';
import { LECTURE_STATUS } from '../../constants';

const ManageLectures = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const batchYear = searchParams.get('batch');
  const courseId = searchParams.get('course');
  const sectionId = searchParams.get('section');

  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    lecture_date: getCurrentDate(),
  });

  useEffect(() => {
    if (courseId && sectionId) {
      loadLectures();
    }
  }, [courseId, sectionId]);

  const loadLectures = async () => {
    setLoading(true);
    
    const result = await lectureService.getLecturesByFaculty(user.id);

    if (result.success) {
      // Filter lectures by course and section
      const filteredLectures = result.data.filter(
        lecture => lecture.course_id === courseId && lecture.section_id === sectionId
      );
      setLectures(filteredLectures);
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const lectureData = {
      course_id: courseId,
      section_id: sectionId,
      lecture_date: formData.lecture_date,
      faculty_id: user.id,
      status: LECTURE_STATUS.SCHEDULED,
    };

    const result = await lectureService.createLecture(lectureData);

    if (result.success) {
      setAlert({ type: 'success', message: 'Lecture created successfully' });
      loadLectures();
      handleCloseModal();
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleDelete = async (lectureId) => {
    const result = await lectureService.deleteLecture(lectureId);

    if (result.success) {
      setAlert({ type: 'success', message: 'Lecture deleted successfully' });
      loadLectures();
      setDeleteConfirm(null);
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleMarkAttendance = (lectureId) => {
    navigate(`/faculty/attendance?lecture=${lectureId}&course=${courseId}&section=${sectionId}`);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      lecture_date: getCurrentDate(),
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      [LECTURE_STATUS.SCHEDULED]: 'info',
      [LECTURE_STATUS.ONGOING]: 'warning',
      [LECTURE_STATUS.FINALIZED]: 'success',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const headers = [
    { key: 'lecture_id', label: 'Lecture ID' },
    {
      key: 'lecture_date',
      label: 'Date',
      render: (row) => formatDisplayDate(row.lecture_date),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => handleMarkAttendance(row.lecture_id)}
          >
            <CheckCircle size={16} className="mr-1" />
            Attendance
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteConfirm(row.lecture_id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/faculty/sections?batch=${batchYear}&course=${courseId}`)}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Sections
        </Button>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Lectures</h1>
            <p className="text-muted-foreground">
              {courseId} - Section {sectionId} - Batch {batchYear}
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            variant="default"
            className="flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Lecture
          </Button>
        </div>
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
        <CardHeader>
          <CardTitle>Lectures List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table headers={headers} data={lectures} emptyMessage="No lectures found for this section" />
        </CardContent>
      </Card>

      {/* Add Lecture Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal} title="Add New Lecture">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="bg-accent p-3 rounded-lg mb-4">
              <p className="text-sm"><strong>Course:</strong> {courseId}</p>
              <p className="text-sm"><strong>Section:</strong> {sectionId}</p>
              <p className="text-sm"><strong>Batch:</strong> {batchYear}</p>
            </div>
          </div>
          <Input
            label="Lecture Date"
            id="lecture_date"
            type="date"
            value={formData.lecture_date}
            onChange={(e) => setFormData({ ...formData, lecture_date: e.target.value })}
            required
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Create Lecture
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={deleteConfirm !== null} 
        onClose={() => setDeleteConfirm(null)} 
        title="Delete Lecture"
      >
        <div>
          <p className="mb-6">Are you sure you want to delete this lecture? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageLectures;
