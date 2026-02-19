import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Users, Calendar, ChevronRight, ArrowLeft } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import sectionService from '../../services/sectionService';

const CourseSections = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const batchYear = searchParams.get('batch');
  const courseId = searchParams.get('course');
  
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      loadSections();
    }
  }, [courseId]);

  const loadSections = async () => {
    setLoading(true);
    
    const result = await sectionService.getCourseSections(courseId);
    
    if (result.success) {
      setSections(result.data);
    }

    setLoading(false);
  };

  const handleSectionClick = (sectionId) => {
    navigate(`/faculty/lectures?batch=${batchYear}&course=${courseId}&section=${sectionId}`);
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
          onClick={() => navigate(`/faculty/courses?batch=${batchYear}`)}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Courses
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">{courseId} - Sections</h1>
        <p className="text-muted-foreground">Select a section to manage lectures and attendance</p>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8">
              <p className="text-muted-foreground text-center">No sections found for this course</p>
            </CardContent>
          </Card>
        ) : (
          sections.map((section) => (
            <Card 
              key={section.section_id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-primary"
              onClick={() => handleSectionClick(section.section_id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Users className="text-purple-600" size={32} />
                  </div>
                  <ChevronRight className="text-muted-foreground" size={20} />
                </div>
                
                <div className="mb-3">
                  <h3 className="text-2xl font-bold mb-2">Section {section.section_id}</h3>
                  <Badge variant="secondary">{courseId}</Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-muted-foreground">Students:</span>
                    <span className="font-bold text-lg">{section.student_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-muted-foreground">Lectures:</span>
                    <span className="font-bold text-lg">{section.lecture_count || 0}</span>
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

export default CourseSections;
