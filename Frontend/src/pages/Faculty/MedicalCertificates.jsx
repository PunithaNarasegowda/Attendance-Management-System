import { useState, useEffect } from 'react';
import { Check, X, FileText } from 'lucide-react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import attendanceService from '../../services/attendanceService';
import { formatDisplayDate } from '../../utils/dateUtils';

const MedicalCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    setLoading(true);
    const result = await attendanceService.getPendingCertificates(user.id);
    
    if (result.success) {
      setCertificates(result.data);
    } else {
      setAlert({ type: 'error', message: result.error });
    }
    
    setLoading(false);
  };

  const handleApprove = async (rollNo, lectureId) => {
    const result = await attendanceService.updateCertificateStatus(rollNo, lectureId, true);
    
    if (result.success) {
      setAlert({ type: 'success', message: 'Certificate approved successfully' });
      loadCertificates();
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleReject = async (rollNo, lectureId) => {
    if (!confirm('Are you sure you want to reject this certificate?')) return;

    const result = await attendanceService.updateCertificateStatus(rollNo, lectureId, false);
    
    if (result.success) {
      setAlert({ type: 'success', message: 'Certificate rejected' });
      loadCertificates();
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const headers = [
    { key: 'roll_no', label: 'Roll No' },
    { key: 'student_name', label: 'Student Name' },
    { key: 'course_id', label: 'Course' },
    {
      key: 'lecture_date',
      label: 'Lecture Date',
      render: (row) => formatDisplayDate(row.lecture_date),
    },
    {
      key: 'certificate',
      label: 'Certificate',
      render: (row) => (
        <a
          href={row.medical_certificate_path}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 flex items-center"
        >
          <FileText size={16} className="mr-1" />
          View
        </a>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        if (row.medical_approved === null) {
          return <Badge variant="warning">Pending</Badge>;
        } else if (row.medical_approved) {
          return <Badge variant="success">Approved</Badge>;
        } else {
          return <Badge variant="danger">Rejected</Badge>;
        }
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) =>
        row.medical_approved === null ? (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="success"
              onClick={() => handleApprove(row.roll_no, row.lecture_id)}
            >
              <Check size={16} />
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleReject(row.roll_no, row.lecture_id)}
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <span className="text-gray-500 text-sm">Processed</span>
        ),
    },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Medical Certificates</h1>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-4"
        />
      )}

      <Card>
        <Table
          headers={headers}
          data={certificates}
          emptyMessage="No medical certificates to review"
        />
      </Card>
    </div>
  );
};

export default MedicalCertificates;
