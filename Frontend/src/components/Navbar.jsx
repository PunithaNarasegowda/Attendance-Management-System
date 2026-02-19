import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X, GraduationCap, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ROLES } from '../constants';
import { useState } from 'react';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case ROLES.ADMIN:
        return [
          { to: '/admin', label: 'Dashboard' },
          { to: '/admin/faculty', label: 'Faculty' },
          { to: '/admin/students', label: 'Students' },
          { to: '/admin/courses', label: 'Courses' },
        ];
      case ROLES.FACULTY:
        return [
          { to: '/faculty', label: 'Dashboard' },
          { to: '/faculty/certificates', label: 'Medical Certificates' },
        ];
      case ROLES.STUDENT:
        return [
          { to: '/student', label: 'Dashboard' },
          { to: '/student/attendance', label: 'My Attendance' },
          { to: '/student/certificates', label: 'Certificates' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-card shadow-sm border-b border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">AMS</span>
              <span className="ml-2 text-muted-foreground hidden sm:block">Attendance Management System</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex items-center ml-4 pl-4 border-l border-border">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-md hover:bg-accent transition-colors mr-2"
                  title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? (
                    <Sun size={18} className="text-accent-foreground" />
                  ) : (
                    <Moon size={18} className="text-accent-foreground" />
                  )}
                </button>
                <div className="flex items-center mr-4">
                  <User size={18} className="text-muted-foreground mr-2" />
                  <span className="text-sm">{user.name || user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Logout</span>
                </Button>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          {user && (
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-foreground hover:bg-accent p-2 rounded-md transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 transform hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border pt-2 mt-2">
              <div className="px-3 py-2 text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-muted-foreground" />
                  {user.name || user.email}
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-md hover:bg-accent transition-colors"
                  title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? (
                    <Sun size={18} className="text-accent-foreground" />
                  ) : (
                    <Moon size={18} className="text-accent-foreground" />
                  )}
                </button>
              </div>
              <div className="px-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
