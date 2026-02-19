import { useState, useEffect } from 'react';
import { BookOpen, Calendar, TrendingUp, FileText } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import AttendancePercentageCard from '../../components/AttendancePercentageCard';
import { useAuth } from '../../contexts/AuthContext';
import studentService from '../../services/studentService';
import attendanceService from '../../services/attendanceService';
import { calculateAttendancePercentage } from '../../utils/attendanceCalculator';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    const coursesResult = await studentService.getStudentCourses(user.id);
    
    if (coursesResult.success) {
      // Load attendance for each course
      const coursesWithAttendance = await Promise.all(
        coursesResult.data.map(async (course) => {
          const attendanceResult = await attendanceService.getStudentCourseSummary(
            user.id,
            course.course_id
          );
          
          if (attendanceResult.success) {
            const stats = calculateAttendancePercentage(attendanceResult.data);
            return { ...course, ...stats };
          }
          
          return course;
        })
      );
      
      setCourses(coursesWithAttendance);
    }

    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  const totalCourses = courses.length;
  const avgAttendance = courses.length > 0
    ? (courses.reduce((sum, c) => sum + (c.percentage || 0), 0) / courses.length).toFixed(2)
    : 0;

  const statCards = [
    {
      title: 'Enrolled Courses',
      value: totalCourses,
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Average Attendance',
      value: `${avgAttendance}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Total Lectures',
      value: courses.reduce((sum, c) => sum + (c.total || 0), 0),
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Pending Certificates',
      value: 0,
      icon: FileText,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      <p className="text-muted-foreground mb-6">Welcome, {user.name}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon className={stat.color} size={32} />
              </div>
            </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">Course Attendance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <AttendancePercentageCard
            key={course.course_id}
            courseName={course.course_name}
            percentage={course.percentage || 0}
            present={course.present || 0}
            total={course.total || 0}
          />
        ))}
        {courses.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-8">
              <p className="text-muted-foreground text-center">No courses enrolled yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
