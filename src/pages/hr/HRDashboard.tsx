import { Users, Clock, FileCheck } from "lucide-react";
import StatCard from "@/components/ui/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// TODO: Integrate with backend API - use dashboardService.getHRDashboard()
const HRDashboard = () => {
  // Data will come from backend API
  const recentActivities: any[] = [];
  const pendingLeaves: any[] = [];
  const todayAttendance: any[] = [];
  const totalEmployees = 0;
  const presentToday = 0;
  const attendancePercentage = "0";
  const pendingLeavesCount = 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">HR Dashboard</h1>
        <p className="text-muted-foreground">Overview of your workforce</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          icon={Users}
          variant="accent"
        />
        <StatCard
          title="Present Today"
          value={presentToday}
          subtitle={`${attendancePercentage}% attendance`}
          icon={Clock}
          variant="success"
        />
        <StatCard
          title="Pending Leaves"
          value={pendingLeavesCount}
          subtitle="Needs approval"
          icon={FileCheck}
          variant="warning"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Attendance */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today's Attendance</CardTitle>
            <a href="/hr/attendance" className="text-sm text-accent hover:underline">
              View all
            </a>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      No attendance data available
                    </TableCell>
                  </TableRow>
                ) : (
                  todayAttendance.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-accent/10 text-accent text-xs">
                              {record.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{record.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{record.checkIn || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            record.status === "On Time"
                              ? "bg-success text-success-foreground"
                              : record.status === "Late"
                              ? "bg-warning text-warning-foreground"
                              : "bg-destructive text-destructive-foreground"
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">No recent activities</p>
              ) : (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-2 w-2 rounded-full ${
                        activity.type === "leave"
                          ? "bg-warning"
                          : activity.type === "attendance"
                          ? "bg-accent"
                          : activity.type === "new"
                          ? "bg-success"
                          : "bg-muted-foreground"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.employee}
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Leave Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pending Leave Requests</CardTitle>
          <a href="/hr/leave-approval" className="text-sm text-accent hover:underline">
            View all
          </a>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingLeaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No pending leave requests
                  </TableCell>
                </TableRow>
              ) : (
                pendingLeaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-accent/10 text-accent text-xs">
                            {leave.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{leave.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{leave.type}</TableCell>
                    <TableCell>{leave.from}</TableCell>
                    <TableCell>{leave.to}</TableCell>
                    <TableCell>{leave.days}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button className="rounded bg-success px-3 py-1 text-xs font-medium text-success-foreground hover:bg-success/90">
                          Approve
                        </button>
                        <button className="rounded bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground hover:bg-destructive/90">
                          Reject
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRDashboard;
