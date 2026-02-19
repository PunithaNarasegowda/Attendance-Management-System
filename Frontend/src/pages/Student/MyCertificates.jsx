import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import { useAuth } from '../../contexts/AuthContext';
import attendanceService from '../../services/attendanceService';
import { formatDisplayDate } from '../../utils/dateUtils';

const MyCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    setLoading(true);
    const result = await attendanceService.getAttendanceByStudent(user.id);
    
    if (result.success) {
      // Filter only records with medical certificates
      const withCertificates = result.data.filter(
        (record) => record.medical_certificate_path
      );
      setCertificates(withCertificates);
    } else {
      setAlert({ type: 'error', message: result.error });
    }
    
    setLoading(false);
  };

  const getStatusBadge = (record) => {
    if (record.medical_approved === null) {
      return <Badge variant="warning">Pending Review</Badge>;
    } else if (record.medical_approved) {
      return <Badge variant="success">Approved</Badge>;
    } else {
      return <Badge variant="danger">Rejected</Badge>;
    }
  };

  const headers = [
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
      render: (row) => getStatusBadge(row),
    },
    {
      key: 'upload_date',
      label: 'Uploaded On',
      render: (row) => formatDisplayDate(row.upload_date || row.lecture_date),
    },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Medical Certificates</h1>

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
          emptyMessage="No certificates uploaded yet"
        />
      </Card>
    </div>
  );
};

export default MyCertificates;
