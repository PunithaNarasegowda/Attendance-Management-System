import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageStudents from './pages/Admin/ManageStudents';
import ManageFaculty from './pages/Admin/ManageFaculty';
import ManageCourses from './pages/Admin/ManageCourses';
import ManageSections from './pages/Admin/ManageSections';

// Faculty Pages
import FacultyDashboard from './pages/Faculty/FacultyDashboard';
import BatchCourses from './pages/Faculty/BatchCourses';
import CourseSections from './pages/Faculty/CourseSections';
import ManageLectures from './pages/Faculty/ManageLectures';
import MarkAttendance from './pages/Faculty/MarkAttendance';
import MedicalCertificates from './pages/Faculty/MedicalCertificates';

// Student Pages
import StudentDashboard from './pages/Student/StudentDashboard';
import MyAttendance from './pages/Student/MyAttendance';
import UploadCertificate from './pages/Student/UploadCertificate';
import MyCertificates from './pages/Student/MyCertificates';
import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes with Layout */}
          <Route element={<MainLayout />}>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute>
                  <ManageStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/faculty"
              element={
                <ProtectedRoute>
                  <ManageFaculty />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute>
                  <ManageCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sections"
              element={
                <ProtectedRoute>
                  <ManageSections />
                </ProtectedRoute>
              }
            />

            {/* Faculty Routes */}
            <Route
              path="/faculty"
              element={
                <ProtectedRoute>
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/dashboard"
              element={
                <ProtectedRoute>
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/courses"
              element={
                <ProtectedRoute>
                  <BatchCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/sections"
              element={
                <ProtectedRoute>
                  <CourseSections />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/lectures"
              element={
                <ProtectedRoute>
                  <ManageLectures />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/attendance"
              element={
                <ProtectedRoute>
                  <MarkAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/certificates"
              element={
                <ProtectedRoute>
                  <MedicalCertificates />
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/attendance"
              element={
                <ProtectedRoute>
                  <MyAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/upload-certificate"
              element={
                <ProtectedRoute>
                  <UploadCertificate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/certificates"
              element={
                <ProtectedRoute>
                  <MyCertificates />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
