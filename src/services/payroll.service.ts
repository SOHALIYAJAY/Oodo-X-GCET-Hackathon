import { apiRequest, apiJson } from '@/lib/api';

export interface Payroll {
  _id: string;
  employeeId: string;
  month: number;
  year: number;
  basic: number;
  allowance: number;
  deduction: number;
  net: number;
  status: 'Pending' | 'Paid';
  paidAt?: string;
}

export interface CreatePayrollRequest {
  employeeId: string;
  month: number;
  year: number;
  basic: number;
  allowance?: number;
  deduction?: number;
}

export const payrollService = {
  async getMySalary(month?: number, year?: number): Promise<Payroll> {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiRequest(`/payroll/my-salary${query}`);
    return apiJson<Payroll>(response);
  },

  async getAll(month?: number, year?: number, employeeId?: string, status?: string): Promise<Payroll[]> {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    if (employeeId) params.append('employeeId', employeeId);
    if (status) params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiRequest(`/payroll${query}`);
    const result = await apiJson<{ data: Payroll[] }>(response);
    return result.data || result;
  },

  async create(data: CreatePayrollRequest): Promise<Payroll> {
    const response = await apiRequest('/payroll', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return apiJson<Payroll>(response);
  },

  async update(id: string, data: Partial<CreatePayrollRequest>): Promise<Payroll> {
    const response = await apiRequest(`/payroll/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return apiJson<Payroll>(response);
  },

  async markAsPaid(id: string): Promise<Payroll> {
    const response = await apiRequest(`/payroll/${id}/mark-paid`, {
      method: 'PUT',
    });
    return apiJson<Payroll>(response);
  },
};
