import { useState, useEffect } from 'react';
import Card from '../../components/Card';
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
  const [allAttendanceRecords, setAllAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const [coursesResult, attendanceResult] = await Promise.all([
      studentService.getStudentCourses(user.id),
      attendanceService.getAttendanceByStudent(user.id),
    ]);

    if (coursesResult.success) {
      setCourses(coursesResult.data);
      if (coursesResult.data.length > 0) {
        setSelectedCourse(coursesResult.data[0].course_id);
      }
    } else {
      setAlert({ type: 'error', message: coursesResult.error });
    }

    if (attendanceResult.success) {
      setAllAttendanceRecords(attendanceResult.data);
    } else {
      setAlert({ type: 'error', message: attendanceResult.error });
    }

    setLoading(false);
  };

  const getRecordsByCourse = (courseId) =>
    allAttendanceRecords
      .filter((record) => record.course_id === courseId)
      .sort((a, b) => {
        if (a.lecture_date === b.lecture_date) {
          return Number(b.lecture_id) - Number(a.lecture_id);
        }
        return String(b.lecture_date).localeCompare(String(a.lecture_date));
      });

  const courseSummaries = courses.map((course) => {
    const records = getRecordsByCourse(course.course_id);
    return {
      ...course,
      stats: calculateAttendancePercentage(records),
      records,
    };
  });

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

  const selectedCourseSummary = courseSummaries.find((c) => c.course_id === selectedCourse);
  const selectedCourseRecords = selectedCourseSummary?.records || [];
  const selectedCourseStats = selectedCourseSummary?.stats || null;

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

      {courses.length === 0 ? (
        <Card>
          <p className="text-gray-600 text-center py-8">No courses enrolled yet.</p>
        </Card>
      ) : (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Course Attendance</h2>
          <p className="text-sm text-gray-600 mb-4">Click a course card to view lecture-wise present/absent status.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {courseSummaries.map((course) => {
              const isSelected = selectedCourse === course.course_id;
              return (
                <button
                  key={course.course_id}
                  type="button"
                  onClick={() => setSelectedCourse(course.course_id)}
                  className={`text-left rounded-lg transition-all ${isSelected ? 'ring-2 ring-primary-500 shadow-lg' : 'hover:shadow-md'}`}
                >
                  <AttendancePercentageCard
                    courseName={`${course.course_id} - ${course.course_name}`}
                    percentage={course.stats.percentage}
                    present={course.stats.present}
                    total={course.stats.total}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedCourse && (
        <Card title={`Attendance Details - ${selectedCourseSummary?.course_name || selectedCourse}`}>
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
                  {selectedCourseRecords.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    selectedCourseRecords.map((record) => (
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

      {selectedCourseStats && selectedCourseStats.percentage < 75 && (
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
