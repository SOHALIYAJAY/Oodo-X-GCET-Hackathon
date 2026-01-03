import { apiRequest, apiJson } from '@/lib/api';

export interface EmployeeDashboardData {
  workingDays: number;
  presentDays: number;
  attendancePercentage: string;
  currentMonthSalary: number;
  salaryStatus: string;
  recentAttendance: any[];
  leaveRequests: any[];
}

export interface HRDashboardData {
  totalEmployees: number;
  presentToday: number;
  attendancePercentage: string;
  pendingLeaves: number;
  todayAttendance: any[];
  pendingLeaveRequests: any[];
  recentActivities: any[];
}

export const dashboardService = {
  async getEmployeeDashboard(): Promise<EmployeeDashboardData> {
    const response = await apiRequest('/dashboard/employee');
    return apiJson<EmployeeDashboardData>(response);
  },

  async getHRDashboard(): Promise<HRDashboardData> {
    const response = await apiRequest('/dashboard/hr');
    return apiJson<HRDashboardData>(response);
  },
};
