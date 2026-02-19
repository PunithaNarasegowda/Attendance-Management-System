import { useState, useEffect } from 'react';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import Badge from '../../components/Badge';
import { useAuth } from '../../contexts/AuthContext';
import facultyService from '../../services/facultyService';

const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const result = await facultyService.getFacultyCourses(user.id);
    
    if (result.success) {
      setCourses(result.data);
    } else {
      setAlert({ type: 'error', message: result.error });
    }
    
    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Courses</h1>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-4"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <Card className="col-span-full">
            <p className="text-gray-600 text-center py-8">No courses assigned yet</p>
          </Card>
        ) : (
          courses.map((course) => (
            <Card key={course.course_id} className="hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{course.course_id}</h3>
                  <Badge variant="primary">Active</Badge>
                </div>
                <p className="text-gray-700 font-medium">{course.course_name}</p>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Section:</span>
                  <span className="font-medium">{course.section_id || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Students:</span>
                  <span className="font-medium">{course.student_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lectures:</span>
                  <span className="font-medium">{course.lecture_count || 0}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <a
                  href={`/faculty/attendance?course=${course.course_id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View Attendance →
                </a>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MyCourses;
