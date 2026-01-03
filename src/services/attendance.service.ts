import { apiRequest, apiJson } from '@/lib/api';

export interface Attendance {
  _id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  workHours: number;
  extraHours: number;
  status: 'Present' | 'Late' | 'Absent' | 'On Leave';
}

export const attendanceService = {
  async checkIn(): Promise<Attendance> {
    const response = await apiRequest('/attendance/checkin', {
      method: 'POST',
    });
    return apiJson<Attendance>(response);
  },

  async checkOut(): Promise<Attendance> {
    const response = await apiRequest('/attendance/checkout', {
      method: 'POST',
    });
    return apiJson<Attendance>(response);
  },

  async getMyAttendance(startDate?: string, endDate?: string): Promise<Attendance[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiRequest(`/attendance/my-attendance${query}`);
    const result = await apiJson<{ data: Attendance[] }>(response);
    return result.data || result;
  },

  async getAll(employeeId?: string, date?: string, startDate?: string, endDate?: string): Promise<Attendance[]> {
    const params = new URLSearchParams();
    if (employeeId) params.append('employeeId', employeeId);
    if (date) params.append('date', date);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiRequest(`/attendance${query}`);
    const result = await apiJson<{ data: Attendance[] }>(response);
    return result.data || result;
  },

  async update(id: string, data: Partial<Attendance>): Promise<Attendance> {
    const response = await apiRequest(`/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return apiJson<Attendance>(response);
  },
};
