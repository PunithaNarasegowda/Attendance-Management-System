import { useState, useEffect } from 'react';
import { Upload, FileText } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import attendanceService from '../../services/attendanceService';
import { formatDisplayDate } from '../../utils/dateUtils';
import { FILE_UPLOAD } from '../../constants';

const UploadCertificate = () => {
  const { user } = useAuth();
  const [absences, setAbsences] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadAbsences();
  }, []);

  const loadAbsences = async () => {
    setLoading(true);
    const result = await attendanceService.getAttendanceByStudent(user.id);
    
    if (result.success) {
      // Filter only absences without medical certificate or rejected certificates
      const filteredAbsences = result.data.filter(
        (record) => !record.is_present && !record.medical_certificate_path
      );
      setAbsences(filteredAbsences);
    } else {
      setAlert({ type: 'error', message: result.error });
    }
    
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

    // Validate file type
    if (!FILE_UPLOAD.ALLOWED_TYPES.includes(selectedFile.type)) {
      setAlert({
        type: 'error',
        message: 'Invalid file type. Please upload PDF, JPG, or PNG files only.',
      });
      return;
    }

    // Validate file size
    if (selectedFile.size > FILE_UPLOAD.MAX_SIZE) {
      setAlert({
        type: 'error',
        message: `File size exceeds ${FILE_UPLOAD.MAX_SIZE / 1048576}MB limit.`,
      });
      return;
    }

    setFile(selectedFile);
    setAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLecture || !file) {
      setAlert({ type: 'error', message: 'Please select a lecture and upload a certificate.' });
      return;
    }

    setUploading(true);

    const result = await attendanceService.uploadMedicalCertificate(
      user.id,
      selectedLecture,
      file
    );

    if (result.success) {
      setAlert({ type: 'success', message: 'Certificate uploaded successfully!' });
      setSelectedLecture('');
      setFile(null);
      loadAbsences();
    } else {
      setAlert({ type: 'error', message: result.error });
    }

    setUploading(false);
  };

  const absenceOptions = absences.map((absence) => ({
    value: absence.lecture_id,
    label: `${absence.course_id} - ${formatDisplayDate(absence.lecture_date)}`,
  }));

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload Medical Certificate</h1>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-4"
        />
      )}

      {absences.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No absences found that require medical certificates.</p>
          </div>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleSubmit}>
            <Select
              label="Select Absent Lecture"
              id="lecture"
              value={selectedLecture}
              onChange={(e) => setSelectedLecture(e.target.value)}
              options={absenceOptions}
              placeholder="Choose a lecture"
              required
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Certificate <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-500 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept={FILE_UPLOAD.ALLOWED_TYPES.join(',')}
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, PNG, JPG up to 5MB</p>
                  {file && (
                    <p className="text-sm text-green-600 font-medium mt-2">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={uploading}
                className="flex items-center"
              >
                {uploading ? (
                  'Uploading...'
                ) : (
                  <>
                    <Upload size={18} className="mr-2" />
                    Submit Certificate
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default UploadCertificate;
