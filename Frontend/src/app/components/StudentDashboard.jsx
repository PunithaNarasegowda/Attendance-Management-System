import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { BookOpen, Calendar, LogOut, GraduationCap, User, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

export function StudentDashboard({ onLogout }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await api.student.getMyCourses();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const loadAttendance = async (course) => {
    setSelectedCourse(course);
    try {
      const data = await api.student.getMyAttendance(course.sectionId);
      setAttendanceData(data);
      setShowHistory(true);
    } catch (error) {
      console.error('Error loading attendance:', error);
      toast.error('Failed to load attendance');
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return '#2e7d32'; // Green
    if (percentage >= 60) return '#ff8f00'; // Amber
    return '#d32f2f'; // Red
  };

  const CircularProgress = ({ percentage, size = 120 }) => {
    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const color = getAttendanceColor(percentage);

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e0e0e0"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>
            {percentage}%
          </span>
          <span className="text-xs text-gray-500">Attendance</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <header className="bg-[#1a237e] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-[#1a237e]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AMS</h1>
              <p className="text-xs text-blue-200">Attendance Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
              <User className="h-4 w-4" />
              <span className="text-sm">Student Portal</span>
            </div>
            <Button variant="ghost" onClick={onLogout} className="text-white hover:bg-white/10">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl text-gray-900 mb-2">My Learning Dashboard</h2>
          <p className="text-gray-600">Track your attendance and academic progress</p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.sectionId}
              className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[#1a237e]"
              onClick={() => loadAttendance(course)}
            >
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-[#1a237e]">
                      {course.course?.code}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {course.course?.name}
                    </CardDescription>
                  </div>
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-4">
                  {/* Circular Progress would go here in actual implementation */}
                  <div className="w-28 h-28 rounded-full border-8 border-gray-200 flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">--</div>
                      <div className="text-xs text-gray-500">Click to view</div>
                    </div>
                  </div>
                  
                  <div className="w-full space-y-2 text-sm text-gray-600 mt-4">
                    <div className="flex justify-between">
                      <span>Section:</span>
                      <span className="font-medium">{course.section?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Faculty:</span>
                      <span className="font-medium">{course.faculty?.name || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Credits:</span>
                      <span className="font-medium">{course.course?.credits}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <Card className="shadow-md">
            <CardContent className="py-16 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No courses enrolled yet</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Attendance History Modal */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#1a237e]">
              {selectedCourse?.course?.code} - {selectedCourse?.course?.name}
            </DialogTitle>
            <DialogDescription>
              Section {selectedCourse?.section?.name} • Faculty: {selectedCourse?.faculty?.name || 'Not assigned'}
            </DialogDescription>
          </DialogHeader>

          {attendanceData && (
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1 flex justify-center items-center py-4">
                  <CircularProgress percentage={parseFloat(attendanceData.statistics.percentage)} />
                </div>
                
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-600">Total Lectures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{attendanceData.statistics.totalLectures}</div>
                    <p className="text-xs text-gray-500 mt-1">Finalized lectures</p>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-600">Attended</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: '#2e7d32' }}>
                      {attendanceData.statistics.attendedLectures}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Classes present</p>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-600">Missed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: '#d32f2f' }}>
                      {attendanceData.statistics.totalLectures - attendanceData.statistics.attendedLectures}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Classes absent</p>
                  </CardContent>
                </Card>
              </div>

              {/* Warning Messages */}
              {parseFloat(attendanceData.statistics.percentage) < 75 && (
                <Card className="border-2" style={{ borderColor: getAttendanceColor(parseFloat(attendanceData.statistics.percentage)), backgroundColor: `${getAttendanceColor(parseFloat(attendanceData.statistics.percentage))}10` }}>
                  <CardHeader>
                    <CardTitle style={{ color: getAttendanceColor(parseFloat(attendanceData.statistics.percentage)) }}>
                      ⚠️ Attendance Warning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm" style={{ color: getAttendanceColor(parseFloat(attendanceData.statistics.percentage)) }}>
                      {parseFloat(attendanceData.statistics.percentage) < 60 ? (
                        <>
                          <strong>Critical:</strong> Your attendance is below 60%. This may affect your eligibility for the examination.
                        </>
                      ) : (
                        <>
                          <strong>Warning:</strong> Your attendance is below 75%. Please ensure regular attendance to meet the minimum requirement.
                        </>
                      )}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Attendance History Table */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Attendance History</CardTitle>
                  <CardDescription>Chronological record of all lectures</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lecture Date</TableHead>
                        <TableHead>Topic</TableHead>
                        <TableHead>Lecture Status</TableHead>
                        <TableHead>Attendance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceData.attendanceRecords
                        .sort((a, b) => new Date(b.lecture.date).getTime() - new Date(a.lecture.date).getTime())
                        .map((record, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                {new Date(record.lecture.date).toLocaleDateString('en-US', { 
                                  weekday: 'short',
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                            </TableCell>
                            <TableCell>{record.lecture.topic || '-'}</TableCell>
                            <TableCell>
                              <Badge variant={record.lecture.status === 'finalized' ? 'default' : 'secondary'}>
                                {record.lecture.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {record.lecture.status === 'finalized' ? (
                                record.attendance ? (
                                  <Badge
                                    variant={record.attendance.status === 'present' ? 'default' : 'destructive'}
                                    style={{
                                      backgroundColor: record.attendance.status === 'present' ? '#2e7d32' : '#d32f2f',
                                      color: 'white'
                                    }}
                                  >
                                    {record.attendance.status === 'present' ? '✓ Present' : '✗ Absent'}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Not marked</Badge>
                                )
                              ) : (
                                <Badge variant="outline">Pending</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  {attendanceData.attendanceRecords.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No lecture records available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
