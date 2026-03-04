import { useEffect } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AdminDashboard } from "./components/AdminDashboard";
import { FacultyDashboard } from "./components/FacultyDashboard";
import { StudentDashboard } from "./components/StudentDashboard";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

function PageSwitcher() {
  const location = useLocation();

  useEffect(() => {
    if (["/admin", "/faculty", "/student"].includes(location.pathname)) {
      window.localStorage.setItem("ams_frontend_temp_last_route", location.pathname);
    }
  }, [location.pathname]);

  const getLinkClass = (path) => {
    const active = location.pathname === path;
    return `px-3 py-2 rounded-md text-sm border transition ${
      active
        ? "bg-[#1a237e] text-white border-[#1a237e]"
        : "bg-white text-[#1a237e] border-[#1a237e]/30 hover:bg-[#1a237e]/10"
    }`;
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/95 border border-gray-200 rounded-lg p-2 shadow-md">
      <Link to="/admin" className={getLinkClass("/admin")}>Admin</Link>
      <Link to="/faculty" className={getLinkClass("/faculty")}>Faculty</Link>
      <Link to="/student" className={getLinkClass("/student")}>Student</Link>
    </div>
  );
}

function AppRoutes() {
  const savedRoute = window.localStorage.getItem("ams_frontend_temp_last_route");
  const defaultRoute =
    savedRoute === "/faculty" || savedRoute === "/student" || savedRoute === "/admin"
      ? savedRoute
      : "/admin";

  const handleLogout = () => {
    toast.info("Login is disabled in this build.");
  };

  return (
    <>
      <PageSwitcher />
      <Routes>
        <Route path="/" element={<Navigate to={defaultRoute} replace />} />
        <Route path="/admin" element={<AdminDashboard onLogout={handleLogout} />} />
        <Route path="/faculty" element={<FacultyDashboard onLogout={handleLogout} />} />
        <Route path="/student" element={<StudentDashboard onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to={defaultRoute} replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
