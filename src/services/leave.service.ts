import { apiRequest, apiJson } from '@/lib/api';

export interface Leave {
  _id: string;
  employeeId: string;
  type: 'Sick Leave' | 'Paid Leave' | 'Unpaid Leave' | 'Personal Leave' | 'Annual Leave';
  from: string;
  to: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  appliedOn: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface CreateLeaveRequest {
  type: Leave['type'];
  from: string;
  to: string;
  reason: string;
}

export const leaveService = {
  async create(data: CreateLeaveRequest): Promise<Leave> {
    const response = await apiRequest('/leaves', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return apiJson<Leave>(response);
  },

  async getMyLeaves(): Promise<Leave[]> {
    const response = await apiRequest('/leaves/my-leaves');
    const result = await apiJson<{ data: Leave[] }>(response);
    return result.data || result;
  },

  async getAll(status?: string, employeeId?: string): Promise<Leave[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (employeeId) params.append('employeeId', employeeId);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiRequest(`/leaves${query}`);
    const result = await apiJson<{ data: Leave[] }>(response);
    return result.data || result;
  },

  async getById(id: string): Promise<Leave> {
    const response = await apiRequest(`/leaves/${id}`);
    return apiJson<Leave>(response);
  },

  async approve(id: string): Promise<Leave> {
    const response = await apiRequest(`/leaves/${id}/approve`, {
      method: 'PUT',
    });
    return apiJson<Leave>(response);
  },

  async reject(id: string, rejectionReason?: string): Promise<Leave> {
    const response = await apiRequest(`/leaves/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ rejectionReason }),
    });
    return apiJson<Leave>(response);
  },
};
