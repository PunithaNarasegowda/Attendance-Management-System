import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X, GraduationCap, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Button from './Button';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {user ? (
              <button
                type="button"
                onClick={onMenuClick}
                className="mr-2 inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-accent transition-colors focus-visible:ring-ring/50 focus-visible:ring-[3px] md:hidden"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            ) : null}

            <Link
              to="/"
              className="flex items-center gap-2 rounded-md focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
              <GraduationCap className="h-7 w-7 text-primary" />
              <span className="text-base font-semibold tracking-tight">AMS</span>
              <span className="ml-2 text-sm text-muted-foreground hidden sm:block">
                Attendance Management System
              </span>
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-accent transition-colors focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? (
                  <Sun size={18} className="text-accent-foreground" />
                ) : (
                  <Moon size={18} className="text-accent-foreground" />
                )}
              </button>

              <div className="hidden sm:flex items-center gap-2 px-2">
                <User size={18} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{user.name || user.email}</span>
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
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-accent transition-colors focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? (
                  <Sun size={18} className="text-accent-foreground" />
                ) : (
                  <Moon size={18} className="text-accent-foreground" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
