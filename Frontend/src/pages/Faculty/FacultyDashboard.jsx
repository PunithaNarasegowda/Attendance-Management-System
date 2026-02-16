import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Users, GraduationCap, ChevronRight } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import facultyService from '../../services/facultyService';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [stats, setStats] = useState({
    totalBatches: 0,
    totalCourses: 0,
    totalLectures: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    const coursesResult = await facultyService.getFacultyCourses(user.id);
    
    if (coursesResult.success) {
      // Group courses by batch year
      const batchGroups = {};
      coursesResult.data.forEach(course => {
        const batchYear = course.batch_year || 'Unknown';
        if (!batchGroups[batchYear]) {
          batchGroups[batchYear] = {
            year: batchYear,
            courses: [],
            totalStudents: 0,
            totalLectures: 0,
          };
        }
        batchGroups[batchYear].courses.push(course);
        batchGroups[batchYear].totalStudents += course.student_count || 0;
        batchGroups[batchYear].totalLectures += course.lecture_count || 0;
      });

      const batchesArray = Object.values(batchGroups).sort((a, b) => 
        b.year.localeCompare(a.year)
      );
      
      setBatches(batchesArray);
      
      setStats({
        totalBatches: batchesArray.length,
        totalCourses: coursesResult.data.length,
        totalLectures: batchesArray.reduce((sum, b) => sum + b.totalLectures, 0),
        totalStudents: batchesArray.reduce((sum, b) => sum + b.totalStudents, 0),
      });
    }

    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  const handleBatchClick = (batchYear) => {
    navigate(`/faculty/courses?batch=${batchYear}`);
  };

  const statCards = [
    {
      title: 'Batches',
      value: stats.totalBatches,
      icon: GraduationCap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Total Lectures',
      value: stats.totalLectures,
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Faculty Dashboard</h1>
      <p className="text-muted-foreground mb-6">Welcome, {user.name}! Select a batch to view courses.</p>

      {/* Stats Cards */}
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

      {/* Batch Year Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Select Batch Year</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Click on a batch to view and manage courses
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-8">
                <p className="text-muted-foreground text-center">No batches assigned yet</p>
              </CardContent>
            </Card>
          ) : (
            batches.map((batch) => (
              <Card 
                key={batch.year} 
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-primary"
                onClick={() => handleBatchClick(batch.year)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <GraduationCap className="text-blue-600" size={32} />
                    </div>
                    <ChevronRight className="text-muted-foreground" size={20} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">Batch {batch.year}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground">Courses:</span>
                      <span className="font-bold text-lg">{batch.courses.length}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground">Students:</span>
                      <span className="font-bold text-lg">{batch.totalStudents}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground">Lectures:</span>
                      <span className="font-bold text-lg">{batch.totalLectures}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <span className="font-medium">Select Batch</span>
            </div>
            <ChevronRight className="text-muted-foreground" size={16} />
            <div className="flex items-center gap-2">
              <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <span className="font-medium">Choose Course</span>
            </div>
            <ChevronRight className="text-muted-foreground" size={16} />
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <span className="font-medium">Select Section</span>
            </div>
            <ChevronRight className="text-muted-foreground" size={16} />
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
              <span className="font-medium">Manage Lectures</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyDashboard;
