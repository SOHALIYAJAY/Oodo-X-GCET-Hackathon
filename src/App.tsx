import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import EmployeeAttendance from "./pages/employee/EmployeeAttendance";
import ApplyLeave from "./pages/employee/ApplyLeave";
import SalaryPage from "./pages/employee/SalaryPage";
import HRDashboard from "./pages/hr/HRDashboard";
import EmployeeManagement from "./pages/hr/EmployeeManagement";
import AttendanceManagement from "./pages/hr/AttendanceManagement";
import LeaveApproval from "./pages/hr/LeaveApproval";
import PayrollManagement from "./pages/hr/PayrollManagement";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Navigate to="/employee/dashboard" replace />} />

            {/* Protected main layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* Employee Routes */}
              <Route path="employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="employee/profile" element={<EmployeeProfile />} />
              <Route path="employee/attendance" element={<EmployeeAttendance />} />
              <Route path="employee/leave" element={<ApplyLeave />} />
              <Route path="employee/salary" element={<SalaryPage />} />
              {/* HR Routes */}
              <Route path="hr/dashboard" element={<HRDashboard />} />
              <Route path="hr/employees" element={<EmployeeManagement />} />
              <Route path="hr/attendance" element={<AttendanceManagement />} />
              <Route path="hr/leave-approval" element={<LeaveApproval />} />
              <Route path="hr/payroll" element={<PayrollManagement />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
