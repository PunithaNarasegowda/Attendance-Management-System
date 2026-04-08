import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, Users, UserRound, BookOpen, Rows3 } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../contexts/AuthContext';

const iconFor = (to) => {
  if (to === '/admin' || to === '/faculty' || to === '/student') return LayoutDashboard;
  if (to.includes('/students')) return Users;
  if (to.includes('/faculty')) return UserRound;
  if (to.includes('/courses')) return BookOpen;
  if (to.includes('/sections')) return Rows3;
  return LayoutDashboard;
};

const Sidebar = ({ links, onNavigate }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (to) => {
    const path = location.pathname;
    if (to === '/admin') return path === '/admin';
    return path === to || path.startsWith(`${to}/`);
  };

  return (
    <aside
      className={cn(
        "h-full w-64 shrink-0 border-r border-[color:var(--sidebar-border)]",
        "bg-[color:var(--sidebar)] text-[color:var(--sidebar-foreground)]",
      )}
    >
      <div className="h-16 px-4 flex items-center gap-2 border-b border-[color:var(--sidebar-border)]">
        <div className="size-9 rounded-xl bg-white/15 flex items-center justify-center">
          <GraduationCap className="size-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold leading-tight">AMS</div>
          <div className="text-xs text-white/80 truncate">Attendance Management</div>
        </div>
      </div>

      <div className="p-3">
        <div className="px-3 py-2 text-xs uppercase tracking-wider text-white/70">
          {user?.role ? `${user.role} menu` : 'Menu'}
        </div>
        <nav className="mt-1 space-y-1">
          {links.map((link) => {
            const Icon = iconFor(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={isActive(link.to) ? 'page' : undefined}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive(link.to)
                    ? "bg-[color:var(--sidebar-accent)] text-white shadow-sm"
                    : "text-white/90 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="size-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

