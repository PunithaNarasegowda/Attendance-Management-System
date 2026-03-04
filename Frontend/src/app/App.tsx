import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase-client";
import { projectId } from "/utils/supabase/info";
import { LoginPage } from "./components/LoginPage";
import { FirstTimeSetup } from "./components/FirstTimeSetup";
import { AdminDashboard } from "./components/AdminDashboard";
import { FacultyDashboard } from "./components/FacultyDashboard";
import { StudentDashboard } from "./components/StudentDashboard";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        localStorage.setItem("accessToken", session.access_token);
        
        // Get user profile to determine role
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-005ee2bb/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );
        
        if (response.ok) {
          const userData = await response.json();
          const currentUser = userData.users?.find(
            (u) => u.id === session.user.id
          );
          
          if (currentUser) {
            setUserRole(currentUser.role);
            setIsAuthenticated(true);
          }
        }
      }
    } catch (error) {
      console.error("Session check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userId, role) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a237e] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showSetup) {
      return (
        <>
          <FirstTimeSetup
            onComplete={() => setShowSetup(false)}
          />
          <Toaster />
        </>
      );
    }

    return (
      <>
        <LoginPage
          onLogin={handleLogin}
          onShowSetup={() => setShowSetup(true)}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      {userRole === "admin" && (
        <AdminDashboard onLogout={handleLogout} />
      )}
      {userRole === "faculty" && (
        <FacultyDashboard onLogout={handleLogout} />
      )}
      {userRole === "student" && (
        <StudentDashboard onLogout={handleLogout} />
      )}
      <Toaster />
    </>
  );
}