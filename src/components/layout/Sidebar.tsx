import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Clock,
  CalendarDays,
  DollarSign,
  Users,
  ClipboardCheck,
  FileCheck,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userRole: "employee" | "hr";
  onRoleChange: (role: "employee" | "hr") => void;
}

const employeeMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/employee/dashboard" },
  { icon: User, label: "My Profile", path: "/employee/profile" },
  { icon: Clock, label: "Attendance", path: "/employee/attendance" },
  { icon: CalendarDays, label: "Apply Leave", path: "/employee/leave" },
  { icon: DollarSign, label: "Salary", path: "/employee/salary" },
];

const hrMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/hr/dashboard" },
  { icon: Users, label: "Employees", path: "/hr/employees" },
  { icon: ClipboardCheck, label: "Attendance", path: "/hr/attendance" },
  { icon: FileCheck, label: "Leave Requests", path: "/hr/leave-approval" },
  { icon: CreditCard, label: "Payroll", path: "/hr/payroll" },
];

const Sidebar = ({ userRole, onRoleChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = userRole === "employee" ? employeeMenuItems : hrMenuItems;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Clock className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">
              Dayflow
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Role Switcher */}
      <div className="border-b border-sidebar-border p-3">
        <div
          className={cn(
            "flex rounded-lg bg-sidebar-accent p-1",
            collapsed && "flex-col gap-1"
          )}
        >
          <button
            onClick={() => onRoleChange("employee")}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              userRole === "employee"
                ? "bg-accent text-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-border"
            )}
          >
            {collapsed ? "E" : "Employee"}
          </button>
          <button
            onClick={() => onRoleChange("hr")}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              userRole === "hr"
                ? "bg-accent text-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-border"
            )}
          >
            {collapsed ? "HR" : "HR Admin"}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-3">
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
