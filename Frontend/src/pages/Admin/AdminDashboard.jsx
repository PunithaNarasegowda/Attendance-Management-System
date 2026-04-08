import { useState, useEffect } from 'react';
import { Users, BookOpen, GraduationCap, Calendar } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import studentService from '../../services/studentService';
import facultyService from '../../services/facultyService';
import courseService from '../../services/courseService';
import PageHeader from '../../components/PageHeader';
import { Link } from 'react-router-dom';

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
      color: 'text-[color:var(--chart-1)]',
      bg: 'bg-white/10',
    },
    {
      title: 'Total Faculty',
      value: stats.totalFaculty,
      icon: Users,
      color: 'text-[color:var(--chart-2)]',
      bg: 'bg-white/10',
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-[color:var(--chart-1)]',
      bg: 'bg-white/10',
    },
    {
      title: 'Active Lectures',
      value: stats.activeLectures,
      icon: Calendar,
      color: 'text-[color:var(--chart-2)]',
      bg: 'bg-white/10',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of students, faculty, courses, and recent activity."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-[var(--glass-shadow)] transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-2xl border border-white/10`}>
                  <stat.icon className={stat.color} size={28} />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/admin/students"
                className="group block rounded-2xl border border-border bg-card/35 backdrop-blur p-4 hover:shadow-[var(--glow-mint)] transition-shadow"
              >
                <h3 className="font-semibold tracking-tight mb-1 group-hover:text-foreground">Manage Students</h3>
                <p className="text-sm text-muted-foreground">Enroll and manage student records</p>
              </Link>
              <Link
                to="/admin/faculty"
                className="group block rounded-2xl border border-border bg-card/35 backdrop-blur p-4 hover:shadow-[var(--glow-cyan)] transition-shadow"
              >
                <h3 className="font-semibold tracking-tight mb-1 group-hover:text-foreground">Manage Faculty</h3>
                <p className="text-sm text-muted-foreground">Add and assign faculty members</p>
              </Link>
              <Link
                to="/admin/courses"
                className="group block rounded-2xl border border-border bg-card/35 backdrop-blur p-4 hover:shadow-[var(--glow-primary)] transition-shadow"
              >
                <h3 className="font-semibold tracking-tight mb-1 group-hover:text-foreground">Manage Courses</h3>
                <p className="text-sm text-muted-foreground">Create and configure courses</p>
              </Link>
              <Link
                to="/admin/sections"
                className="group block rounded-2xl border border-border bg-card/35 backdrop-blur p-4 hover:shadow-[var(--glow-primary)] transition-shadow"
              >
                <h3 className="font-semibold tracking-tight mb-1 group-hover:text-foreground">Manage Sections</h3>
                <p className="text-sm text-muted-foreground">Create sections and course mappings</p>
              </Link>
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
