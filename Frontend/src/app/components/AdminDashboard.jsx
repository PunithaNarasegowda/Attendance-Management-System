import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Users, BookOpen, UserPlus, GraduationCap, LogOut, UserCog, BookMarked, UsersRound } from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  // Form states
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student',
    rollNo: '',
    employeeId: '',
    batchYear: '',
  });

  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    credits: 3,
    department: '',
  });

  const [newSection, setNewSection] = useState({
    courseId: '',
    name: '',
    batchYear: '',
    facultyId: '',
  });

  const [enrollmentData, setEnrollmentData] = useState({
    studentId: '',
    courseId: '',
    sectionId: '',
  });

  const [assignmentData, setAssignmentData] = useState({
    sectionId: '',
    facultyId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, coursesData, sectionsData] = await Promise.all([
        api.admin.getUsers(),
        api.admin.getCourses(),
        api.admin.getSections(),
      ]);

      setUsers(usersData.users || []);
      setCourses(coursesData.courses || []);
      setSections(sectionsData.sections || []);
      setFaculty(usersData.users?.filter((u) => u.role === 'faculty') || []);
      setStudents(usersData.users?.filter((u) => u.role === 'student') || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.signup(newUser);
      toast.success('User created successfully');
      setNewUser({
        email: '',
        password: '',
        name: '',
        role: 'student',
        rollNo: '',
        employeeId: '',
        batchYear: '',
      });
      setActiveModal(null);
      loadData();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createCourse(newCourse);
      toast.success('Course created successfully');
      setNewCourse({ code: '', name: '', credits: 3, department: '' });
      setActiveModal(null);
      loadData();
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error(error.message || 'Failed to create course');
    }
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    try {
      await api.admin.enrollStudent(enrollmentData);
      toast.success('Student enrolled successfully');
      setEnrollmentData({ studentId: '', courseId: '', sectionId: '' });
      setActiveModal(null);
    } catch (error) {
      console.error('Error enrolling student:', error);
      toast.error(error.message || 'Failed to enroll student');
    }
  };

  const handleAssignFaculty = async (e) => {
    e.preventDefault();
    try {
      await api.admin.assignFaculty(assignmentData);
      toast.success('Faculty assigned successfully');
      setAssignmentData({ sectionId: '', facultyId: '' });
      setActiveModal(null);
      loadData();
    } catch (error) {
      console.error('Error assigning faculty:', error);
      toast.error(error.message || 'Failed to assign faculty');
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-80 bg-[#1a237e] text-white p-6 flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-white p-2 rounded-lg">
            <GraduationCap className="h-8 w-8 text-[#1a237e]" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AMS</h1>
            <p className="text-xs text-blue-200">Admin Control</p>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <h2 className="text-sm text-blue-300 mb-4">PRIMARY ACTIONS</h2>
          
          <Dialog open={activeModal === 'enrollFaculty'} onOpenChange={(open) => setActiveModal(open ? 'enrollFaculty' : null)}>
            <DialogTrigger asChild>
              <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-none h-16">
                <UserCog className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Enroll Faculty</div>
                  <div className="text-xs text-blue-200">Add new faculty</div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Enroll Faculty</DialogTitle>
                <DialogDescription>Create a new faculty account</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value, role: 'faculty' })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Employee ID</Label>
                    <Input
                      value={newUser.employeeId}
                      onChange={(e) => setNewUser({ ...newUser, employeeId: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-[#1a237e] hover:bg-[#283593]">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Faculty Account
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={activeModal === 'assignCourse'} onOpenChange={(open) => setActiveModal(open ? 'assignCourse' : null)}>
            <DialogTrigger asChild>
              <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-none h-16">
                <BookMarked className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Assign Course to Faculty</div>
                  <div className="text-xs text-blue-200">Link faculty & sections</div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Faculty to Section</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAssignFaculty} className="space-y-4">
                <div className="space-y-2">
                  <Label>Section</Label>
                  <Select value={assignmentData.sectionId} onValueChange={(value) => setAssignmentData({ ...assignmentData, sectionId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => {
                        const course = courses.find(c => c.id === section.courseId);
                        return (
                          <SelectItem key={section.id} value={section.id}>
                            {course?.code} - Section {section.name} (Batch {section.batchYear})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Faculty</Label>
                  <Select value={assignmentData.facultyId} onValueChange={(value) => setAssignmentData({ ...assignmentData, facultyId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculty.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name} ({f.employeeId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-[#1a237e] hover:bg-[#283593]">Assign Faculty</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={activeModal === 'enrollStudents'} onOpenChange={(open) => setActiveModal(open ? 'enrollStudents' : null)}>
            <DialogTrigger asChild>
              <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-none h-16">
                <UsersRound className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Enroll Students</div>
                  <div className="text-xs text-blue-200">Add students to sections</div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Enroll Students</DialogTitle>
                <DialogDescription>Create new student account or enroll existing student</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="enroll" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="enroll">Enroll to Section</TabsTrigger>
                  <TabsTrigger value="create">Create New Student</TabsTrigger>
                </TabsList>
                <TabsContent value="enroll">
                  <form onSubmit={handleEnrollStudent} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Student</Label>
                      <Select value={enrollmentData.studentId} onValueChange={(value) => setEnrollmentData({ ...enrollmentData, studentId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name} ({student.rollNo})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Course</Label>
                      <Select 
                        value={enrollmentData.courseId} 
                        onValueChange={(value) => {
                          setEnrollmentData({ ...enrollmentData, courseId: value, sectionId: '' });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.code} - {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Select value={enrollmentData.sectionId} onValueChange={(value) => setEnrollmentData({ ...enrollmentData, sectionId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections
                            .filter(s => s.courseId === enrollmentData.courseId)
                            .map((section) => (
                              <SelectItem key={section.id} value={section.id}>
                                {section.name} (Batch {section.batchYear})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full bg-[#1a237e] hover:bg-[#283593]">Enroll Student</Button>
                  </form>
                </TabsContent>
                <TabsContent value="create">
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value, role: 'student' })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <Input
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Roll Number</Label>
                        <Input
                          value={newUser.rollNo}
                          onChange={(e) => setNewUser({ ...newUser, rollNo: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Batch Year</Label>
                        <Input
                          type="number"
                          value={newUser.batchYear}
                          onChange={(e) => setNewUser({ ...newUser, batchYear: e.target.value })}
                          placeholder="e.g., 2024"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-[#1a237e] hover:bg-[#283593]">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Student Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          <Dialog open={activeModal === 'addCourse'} onOpenChange={(open) => setActiveModal(open ? 'addCourse' : null)}>
            <DialogTrigger asChild>
              <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-none h-16">
                <BookOpen className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Add New Course</div>
                  <div className="text-xs text-blue-200">Create course entries</div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Course Code</Label>
                    <Input
                      value={newCourse.code}
                      onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                      placeholder="e.g., CS101"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Course Name</Label>
                    <Input
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                      placeholder="e.g., Data Structures"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Credits</Label>
                    <Input
                      type="number"
                      value={newCourse.credits}
                      onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input
                      value={newCourse.department}
                      onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                      placeholder="e.g., CSE"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-[#1a237e] hover:bg-[#283593]">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Button variant="ghost" onClick={onLogout} className="mt-auto text-white hover:bg-white/10">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Top Navigation */}
        <div className="mb-8">
          <h2 className="text-3xl text-gray-900">Admin Command Center</h2>
          <p className="text-gray-600">Manage users, courses, and system configuration</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Users</CardTitle>
              <Users className="h-5 w-5 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{users.length}</div>
              <p className="text-xs text-gray-600 mt-1">
                {students.length} students, {faculty.length} faculty
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Courses</CardTitle>
              <BookOpen className="h-5 w-5 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{courses.length}</div>
              <p className="text-xs text-gray-600 mt-1">Active courses</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Sections</CardTitle>
              <GraduationCap className="h-5 w-5 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{sections.length}</div>
              <p className="text-xs text-gray-600 mt-1">
                {sections.filter(s => s.facultyId).length} assigned
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Students</CardTitle>
              <Users className="h-5 w-5 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{students.length}</div>
              <p className="text-xs text-gray-600 mt-1">Registered students</p>
            </CardContent>
          </Card>
        </div>

        {/* Data View Tabs */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Data View</CardTitle>
            <CardDescription>Browse and manage system data</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="students" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="faculty">Faculty</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
              </TabsList>

              <TabsContent value="students">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Batch Year</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.rollNo}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.batchYear || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {students.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No students enrolled yet</p>
                )}
              </TabsContent>

              <TabsContent value="faculty">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {faculty.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell className="font-medium">{f.employeeId || '-'}</TableCell>
                        <TableCell>{f.name}</TableCell>
                        <TableCell>{f.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {faculty.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No faculty members yet</p>
                )}
              </TabsContent>

              <TabsContent value="courses">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Department</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.code}</TableCell>
                        <TableCell>{course.name}</TableCell>
                        <TableCell>{course.credits}</TableCell>
                        <TableCell>{course.department || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {courses.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No courses created yet</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}