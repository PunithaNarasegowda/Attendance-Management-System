import { useState, useEffect } from 'react';
import { Users, BookOpen, GraduationCap, Calendar } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import studentService from '../../services/studentService';
import facultyService from '../../services/facultyService';
import courseService from '../../services/courseService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0,
    activeLectures: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    
    const [studentsResult, facultyResult, coursesResult] = await Promise.all([
      studentService.getAllStudents(),
      facultyService.getAllFaculty(),
      courseService.getAllCourses(),
    ]);

    setStats({
      totalStudents: studentsResult.success ? studentsResult.data.length : 0,
      totalFaculty: facultyResult.success ? facultyResult.data.length : 0,
      totalCourses: coursesResult.success ? coursesResult.data.length : 0,
      activeLectures: 0, // This would come from lecture service
    });

    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: GraduationCap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Total Faculty',
      value: stats.totalFaculty,
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Active Lectures',
      value: stats.activeLectures,
      icon: Calendar,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/admin/students"
                className="block p-4 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
              >
                <h3 className="font-semibold mb-1">Manage Students</h3>
                <p className="text-sm text-muted-foreground">Enroll and manage student records</p>
              </a>
              <a
                href="/admin/faculty"
                className="block p-4 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
              >
                <h3 className="font-semibold mb-1">Manage Faculty</h3>
                <p className="text-sm text-muted-foreground">Add and assign faculty members</p>
              </a>
              <a
                href="/admin/courses"
                className="block p-4 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
              >
                <h3 className="font-semibold mb-1">Manage Courses</h3>
                <p className="text-sm text-muted-foreground">Create and configure courses</p>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">No recent activity</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
