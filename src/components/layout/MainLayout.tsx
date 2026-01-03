import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { cn } from "@/lib/utils";
import { useAuth } from '@/context/AuthContext';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [userRole, setUserRole] = useState<"employee" | "hr">(
    (user?.role as "employee" | "hr") || "employee"
  );
  const navigate = useNavigate();
  const location = useLocation();

  const userName = user?.name || (userRole === "employee" ? "John Smith" : "Sarah Johnson");

  useEffect(() => {
    // Keep local role in sync if user changes
    if (user?.role) setUserRole(user.role as "employee" | "hr");
  }, [user]);

  useEffect(() => {
    // Redirect to appropriate dashboard when role changes
    if (userRole === "employee" && location.pathname.startsWith("/hr")) {
      navigate("/employee/dashboard");
    } else if (userRole === "hr" && location.pathname.startsWith("/employee")) {
      navigate("/hr/dashboard");
    }
  }, [userRole, location.pathname, navigate]);

  const handleRoleChange = (role: "employee" | "hr") => {
    setUserRole(role);
    if (role === "employee") {
      navigate("/employee/dashboard");
    } else {
      navigate("/hr/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} onRoleChange={handleRoleChange} />
      <div className={cn("transition-all duration-300 ml-64")}>
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
