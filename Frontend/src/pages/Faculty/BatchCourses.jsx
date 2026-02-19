import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, Users, Calendar, ChevronRight, ArrowLeft } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import facultyService from '../../services/facultyService';

const BatchCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const batchYear = searchParams.get('batch');
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (batchYear) {
      loadCourses();
    }
  }, [batchYear]);

  const loadCourses = async () => {
    setLoading(true);
    
    const result = await facultyService.getFacultyCourses(user.id);
    
    if (result.success) {
      // Filter courses by batch year
      const batchCourses = result.data.filter(
        course => (course.batch_year || 'Unknown') === batchYear
      );
      setCourses(batchCourses);
    }

    setLoading(false);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/faculty/sections?batch=${batchYear}&course=${courseId}`);
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/faculty/dashboard')}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">Batch {batchYear} - Courses</h1>
        <p className="text-muted-foreground">Select a course to view sections</p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8">
              <p className="text-muted-foreground text-center">No courses found for this batch</p>
            </CardContent>
          </Card>
        ) : (
          courses.map((course) => (
            <Card 
              key={course.course_id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-primary"
              onClick={() => handleCourseClick(course.course_id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <BookOpen className="text-green-600" size={32} />
                  </div>
                  <ChevronRight className="text-muted-foreground" size={20} />
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{course.course_id}</Badge>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{course.course_name}</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-muted-foreground">Students:</span>
                    <span className="font-bold text-lg">{course.student_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-muted-foreground">Lectures:</span>
                    <span className="font-bold text-lg">{course.lecture_count || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BatchCourses;
