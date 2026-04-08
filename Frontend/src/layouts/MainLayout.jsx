import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';

const MainLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = useMemo(() => {
    if (!user) return [];
    const path = location.pathname;

    if (path.startsWith('/faculty')) {
      return [
        { to: '/faculty', label: 'Dashboard' },
        { to: '/faculty/courses', label: 'Courses' },
        { to: '/faculty/sections', label: 'Sections' },
        { to: '/faculty/lectures', label: 'Lectures' },
        { to: '/faculty/attendance', label: 'Attendance' },
        { to: '/faculty/certificates', label: 'Medical Certificates' },
      ];
    }

    if (path.startsWith('/student')) {
      return [
        { to: '/student', label: 'Dashboard' },
        { to: '/student/attendance', label: 'My Attendance' },
        { to: '/student/upload-certificate', label: 'Upload Certificate' },
        { to: '/student/certificates', label: 'My Certificates' },
      ];
    }

    return [
      { to: '/admin', label: 'Dashboard' },
      { to: '/admin/faculty', label: 'Faculty' },
      { to: '/admin/students', label: 'Students' },
      { to: '/admin/courses', label: 'Courses' },
      { to: '/admin/sections', label: 'Sections' },
    ];
  }, [location.pathname, user]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        {user ? (
          <div className="hidden md:block">
            <Sidebar links={links} />
          </div>
        ) : null}

        {/* Mobile sidebar (drawer) */}
        {user && sidebarOpen ? (
          <div className="md:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0">
              <Sidebar links={links} onNavigate={() => setSidebarOpen(false)} />
            </div>
          </div>
        ) : null}

        <div className="flex-1 min-w-0">
          <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
