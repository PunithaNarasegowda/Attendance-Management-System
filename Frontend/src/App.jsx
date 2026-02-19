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

import { ROLES } from './constants';
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
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <ManageStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/faculty"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <ManageFaculty />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <ManageCourses />
                </ProtectedRoute>
              }
            />

            {/* Faculty Routes */}
            <Route
              path="/faculty"
              element={
                <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/dashboard"
              element={
                <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/courses"
              element={
                <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                  <BatchCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/sections"
              element={
                <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                  <CourseSections />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/lectures"
              element={
                <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                  <ManageLectures />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/attendance"
              element={
                <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                  <MarkAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/certificates"
              element={
                <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                  <MedicalCertificates />
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/attendance"
              element={
                <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                  <MyAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/upload-certificate"
              element={
                <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                  <UploadCertificate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/certificates"
              element={
                <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
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
