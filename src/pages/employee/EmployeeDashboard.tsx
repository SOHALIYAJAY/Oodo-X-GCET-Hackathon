import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, DollarSign, CheckCircle } from "lucide-react";
import StatCard from "@/components/ui/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { dashboardService } from "@/services/dashboard.service";
import { format } from "date-fns";

const EmployeeDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['employee-dashboard'],
    queryFn: () => dashboardService.getEmployeeDashboard(),
  });

  const formatTime = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'hh:mm a');
    } catch {
      return dateString;
    }
  };

  const formatHours = (minutes: number) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return <div className="space-y-6">Loading...</div>;
  }

  if (error) {
    return <div className="space-y-6">Error loading dashboard data</div>;
  }

  const dashboardData = data || {
    workingDays: 0,
    presentDays: 0,
    attendancePercentage: '0',
    currentMonthSalary: 0,
    salaryStatus: 'Pending',
    recentAttendance: [],
    leaveRequests: [],
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground">Here's your work summary for this month</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Working Days"
          value={dashboardData.workingDays}
          subtitle="This month"
          icon={Calendar}
          variant="default"
        />
        <StatCard
          title="Present Days"
          value={dashboardData.presentDays}
          subtitle={`${dashboardData.attendancePercentage}% attendance`}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="This Month Salary"
          value={`$${dashboardData.currentMonthSalary.toLocaleString()}`}
          subtitle={dashboardData.salaryStatus}
          icon={DollarSign}
          variant="warning"
        />
      </div>

      {/* Tables Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Attendance */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Attendance</h2>
            <a href="/employee/attendance" className="text-sm text-accent hover:underline">
              View all
            </a>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData.recentAttendance?.slice(0, 5).map((record: any) => (
                <TableRow key={record._id || record.date}>
                  <TableCell className="font-medium">{format(new Date(record.date), 'yyyy-MM-dd')}</TableCell>
                  <TableCell>{formatTime(record.checkIn)}</TableCell>
                  <TableCell>{formatTime(record.checkOut)}</TableCell>
                  <TableCell>
                    <span className="font-medium">{formatHours(record.workHours || 0)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Leave Status */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Leave Requests</h2>
            <a href="/employee/leave" className="text-sm text-accent hover:underline">
              Apply leave
            </a>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData.leaveRequests?.slice(0, 5).map((leave: any) => (
                <TableRow key={leave._id}>
                  <TableCell className="font-medium">{leave.type}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(leave.from), 'yyyy-MM-dd')} - {format(new Date(leave.to), 'yyyy-MM-dd')}
                  </TableCell>
                  <TableCell>{leave.days}</TableCell>
                  <TableCell>
                    <Badge
                      variant={leave.status === "Approved" ? "default" : "secondary"}
                      className={
                        leave.status === "Approved"
                          ? "bg-success text-success-foreground"
                          : leave.status === "Pending"
                          ? "bg-warning text-warning-foreground"
                          : "bg-destructive text-destructive-foreground"
                      }
                    >
                      {leave.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
