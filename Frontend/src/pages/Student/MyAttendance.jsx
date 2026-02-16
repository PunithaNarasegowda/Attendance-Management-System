import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import Card from '../../components/Card';
import Select from '../../components/Select';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import AttendancePercentageCard from '../../components/AttendancePercentageCard';
import { useAuth } from '../../contexts/AuthContext';
import studentService from '../../services/studentService';
import attendanceService from '../../services/attendanceService';
import { formatDisplayDate } from '../../utils/dateUtils';
import { calculateAttendancePercentage } from '../../utils/attendanceCalculator';

const MyAttendance = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadAttendance(selectedCourse);
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    setLoading(true);
    const result = await studentService.getStudentCourses(user.id);
    
    if (result.success) {
      setCourses(result.data);
      if (result.data.length > 0) {
        setSelectedCourse(result.data[0].course_id);
      }
    } else {
      setAlert({ type: 'error', message: result.error });
    }
    
    setLoading(false);
  };

  const loadAttendance = async (courseId) => {
    setLoading(true);
    const result = await attendanceService.getStudentCourseSummary(user.id, courseId);
    
    if (result.success) {
      setAttendanceRecords(result.data);
      setStats(calculateAttendancePercentage(result.data));
    } else {
      setAlert({ type: 'error', message: result.error });
    }
    
    setLoading(false);
  };

  const courseOptions = courses.map((c) => ({
    value: c.course_id,
    label: `${c.course_id} - ${c.course_name}`,
  }));

  const getStatusBadge = (record) => {
    if (record.is_present) {
      return <Badge variant="success">Present</Badge>;
    } else if (record.medical_approved) {
      return <Badge variant="info">Medical Approved</Badge>;
    } else if (record.medical_certificate_path) {
      return <Badge variant="warning">Medical Pending</Badge>;
    } else {
      return <Badge variant="danger">Absent</Badge>;
    }
  };

  if (loading && courses.length === 0) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  const selectedCourseData = courses.find((c) => c.course_id === selectedCourse);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Attendance</h1>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-4"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <Card>
            <Select
              label={
                <div className="flex items-center">
                  <Filter size={16} className="mr-2" />
                  Filter by Course
                </div>
              }
              id="course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              options={courseOptions}
            />
          </Card>
        </div>

        {stats && selectedCourseData && (
          <div className="lg:col-span-2">
            <AttendancePercentageCard
              courseName={selectedCourseData.course_name}
              percentage={stats.percentage}
              present={stats.present}
              total={stats.total}
            />
          </div>
        )}
      </div>

      {selectedCourse && (
        <Card title="Attendance Details">
          {loading ? (
            <LoadingSpinner size="md" className="py-8" />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Lecture ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Section
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendanceRecords.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    attendanceRecords.map((record) => (
                      <tr key={record.lecture_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.lecture_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDisplayDate(record.lecture_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.section_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {getStatusBadge(record)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {stats && stats.percentage < 75 && (
        <Alert
          type="warning"
          message={`Your attendance is below 75%. You need to attend more lectures to improve your percentage.`}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default MyAttendance;
