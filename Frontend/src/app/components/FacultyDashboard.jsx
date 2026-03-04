import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Switch } from './ui/switch';
import { BookOpen, Calendar, LogOut, GraduationCap, User, Plus, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

export function FacultyDashboard({ onLogout }) {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [students, setStudents] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [showCreateLecture, setShowCreateLecture] = useState(false);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [attendanceState, setAttendanceState] = useState({});

  const [newLecture, setNewLecture] = useState({
    date: new Date().toISOString().split('T')[0],
    topic: '',
  });

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const data = await api.faculty.getMySections();
      setSections(data.sections || []);
    } catch (error) {
      console.error('Error loading sections:', error);
      toast.error('Failed to load sections');
    }
  };

  const loadSectionDetails = async (section) => {
    setSelectedSection(section);
    try {
      const [studentsData, lecturesData] = await Promise.all([
        api.faculty.getSectionStudents(section.id),
        api.faculty.getLectures(section.id),
      ]);

      setStudents(studentsData.students || []);
      setLectures(lecturesData.lectures || []);
    } catch (error) {
      console.error('Error loading section details:', error);
      toast.error('Failed to load section details');
    }
  };

  const handleCreateLecture = async (e) => {
    e.preventDefault();
    if (!selectedSection) return;

    try {
      await api.faculty.createLecture({
        sectionId: selectedSection.id,
        date: newLecture.date,
        topic: newLecture.topic,
      });

      toast.success('Lecture created successfully');
      setShowCreateLecture(false);
      setNewLecture({ date: new Date().toISOString().split('T')[0], topic: '' });
      loadSectionDetails(selectedSection);
    } catch (error) {
      console.error('Error creating lecture:', error);
      toast.error(error.message || 'Failed to create lecture');
    }
  };

  const loadLectureAttendance = async (lecture) => {
    setSelectedLecture(lecture);
    try {
      const data = await api.faculty.getLectureAttendance(lecture.id);
      setAttendance(data.attendance || []);
      
      // Initialize attendance state
      const initialState = {};
      students.forEach(student => {
        const existing = data.attendance?.find(a => a.studentId === student.id);
        initialState[student.id] = existing ? existing.status === 'present' : false;
      });
      setAttendanceState(initialState);
      setShowMarkAttendance(true);
    } catch (error) {
      console.error('Error loading attendance:', error);
      toast.error('Failed to load attendance');
    }
  };

  const handleToggleAttendance = async (studentId, isPresent) => {
    if (!selectedLecture) return;

    try {
      await api.faculty.markAttendance({
        lectureId: selectedLecture.id,
        studentId,
        status: isPresent ? 'present' : 'absent',
      });

      setAttendanceState(prev => ({
        ...prev,
        [studentId]: isPresent
      }));
      
      toast.success('Attendance marked');
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error(error.message || 'Failed to mark attendance');
    }
  };

  const handleFinalizeLecture = async (lectureId) => {
    try {
      await api.faculty.finalizeLecture(lectureId);
      toast.success('Lecture finalized successfully');
      if (selectedSection) {
        loadSectionDetails(selectedSection);
      }
      setShowMarkAttendance(false);
    } catch (error) {
      console.error('Error finalizing lecture:', error);
      toast.error(error.message || 'Failed to finalize lecture');
    }
  };

  // Group sections by batch year
  const groupedSections = sections.reduce((acc, section) => {
    const year = section.batchYear || 'Unknown';
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(section);
    return acc;
  }, {});

  const sortedBatchYears = Object.keys(groupedSections).sort((a, b) => b.localeCompare(a));

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
              <span className="text-sm">Faculty Portal</span>
            </div>
            <Button variant="ghost" onClick={onLogout} className="text-white hover:bg-white/10">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!selectedSection ? (
          <>
            <div className="mb-8">
              <h2 className="text-3xl text-gray-900 mb-2">Faculty Teaching Portal</h2>
              <p className="text-gray-600">Manage lectures and track student attendance</p>
            </div>

            {/* Batch Cards Grouped by Year */}
            <div className="space-y-8">
              {sortedBatchYears.map((batchYear) => (
                <div key={batchYear}>
                  <h3 className="text-xl text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#1a237e]" />
                    Batch {batchYear}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedSections[batchYear].map((section) => (
                      <Card
                        key={section.id}
                        className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[#1a237e]"
                        onClick={() => loadSectionDetails(section)}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg text-[#1a237e]">
                                {section.course?.code}
                              </CardTitle>
                              <CardDescription className="text-sm mt-1">
                                Section {section.name}
                              </CardDescription>
                            </div>
                            <BookOpen className="h-5 w-5 text-gray-400" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-600">{section.course?.name}</p>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Total Lectures</span>
                                <span className="font-bold text-[#1a237e] text-lg">
                                  {lectures.filter(l => l.sectionId === section.id).length || 0}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>Credits: {section.course?.credits}</span>
                              <span>•</span>
                              <span>{section.course?.department || 'N/A'}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {sections.length === 0 && (
              <Card className="shadow-md">
                <CardContent className="py-16 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No sections assigned yet</p>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <>
            {/* Section Detail View */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setSelectedSection(null)} className="border-[#1a237e] text-[#1a237e]">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sections
                </Button>
                <div>
                  <h2 className="text-2xl text-gray-900">
                    {selectedSection.course?.code} - {selectedSection.course?.name}
                  </h2>
                  <p className="text-gray-600">
                    Section {selectedSection.name} • Batch {selectedSection.batchYear}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => setShowCreateLecture(true)} 
                className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Lecture
              </Button>
            </div>

            {/* Lectures List */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Lecture History</CardTitle>
                <CardDescription>Click on any lecture to mark attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lectures.map((lecture) => (
                      <TableRow key={lecture.id}>
                        <TableCell className="font-medium">
                          {new Date(lecture.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>{lecture.topic || '-'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={lecture.status === 'finalized' ? 'default' : 'secondary'}
                            style={{
                              backgroundColor: lecture.status === 'finalized' ? '#2e7d32' : '#757575',
                              color: 'white'
                            }}
                          >
                            {lecture.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadLectureAttendance(lecture)}
                            className="border-[#1a237e] text-[#1a237e] hover:bg-[#1a237e] hover:text-white"
                          >
                            Mark Attendance
                          </Button>
                          {lecture.status !== 'finalized' && (
                            <Button
                              size="sm"
                              onClick={() => handleFinalizeLecture(lecture.id)}
                              className="bg-[#2e7d32] hover:bg-[#1b5e20]"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Finalize
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {lectures.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No lectures created yet. Click "Create Lecture" to add one.</p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>

      {/* Create Lecture Dialog */}
      <Dialog open={showCreateLecture} onOpenChange={setShowCreateLecture}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#1a237e]">Create New Lecture</DialogTitle>
            <DialogDescription>Add a new lecture session for this section</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateLecture} className="space-y-4">
            <div className="space-y-2">
              <Label>Lecture Date</Label>
              <Input
                type="date"
                value={newLecture.date}
                onChange={(e) => setNewLecture({ ...newLecture, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Topic (Optional)</Label>
              <Input
                value={newLecture.topic}
                onChange={(e) => setNewLecture({ ...newLecture, topic: e.target.value })}
                placeholder="e.g., Introduction to Algorithms"
              />
            </div>
            <Button type="submit" className="w-full bg-[#1a237e] hover:bg-[#283593]">
              Create Lecture
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Mark Attendance Dialog */}
      <Dialog open={showMarkAttendance} onOpenChange={setShowMarkAttendance}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1a237e]">Marking Sheet</DialogTitle>
            <DialogDescription>
              {selectedLecture && (
                <>
                  Date: {new Date(selectedLecture.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • 
                  Topic: {selectedLecture.topic || 'No topic'} • 
                  Status: {selectedLecture.status}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLecture?.status === 'finalized' && (
            <div className="bg-amber-50 border-2 border-[#ff8f00] p-4 rounded-lg mb-4">
              <p className="text-sm" style={{ color: '#ff8f00' }}>
                ⚠️ This lecture has been finalized. You can still update attendance, but be aware the lecture is marked as complete.
              </p>
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-32">Roll Number</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-right w-40">Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const isPresent = attendanceState[student.id] || false;
                  return (
                    <TableRow key={student.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{student.rollNo}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Label htmlFor={`switch-${student.id}`} className="text-sm text-gray-600">
                            {isPresent ? 'Present' : 'Absent'}
                          </Label>
                          <Switch
                            id={`switch-${student.id}`}
                            checked={isPresent}
                            onCheckedChange={(checked) => handleToggleAttendance(student.id, checked)}
                            className="data-[state=checked]:bg-[#2e7d32]"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {selectedLecture?.status !== 'finalized' && (
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowMarkAttendance(false)}
              >
                Save & Close
              </Button>
              <Button
                onClick={() => handleFinalizeLecture(selectedLecture.id)}
                className="bg-[#2e7d32] hover:bg-[#1b5e20]"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Save & Finalize Lecture
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
