import { apiRequest, apiJson } from '@/lib/api';

export interface Employee {
  _id: string;
  employeeId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  joinDate: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  phone?: string;
  department: string;
  role: string;
  password?: string;
}

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    const response = await apiRequest('/employees');
    const result = await apiJson<{ data: Employee[] }>(response);
    return result.data || result;
  },

  async getById(id: string): Promise<Employee> {
    const response = await apiRequest(`/employees/${id}`);
    return apiJson<Employee>(response);
  },

  async create(data: CreateEmployeeRequest): Promise<Employee> {
    const response = await apiRequest('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return apiJson<Employee>(response);
  },

  async update(id: string, data: Partial<CreateEmployeeRequest>): Promise<Employee> {
    const response = await apiRequest(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return apiJson<Employee>(response);
  },

  async delete(id: string): Promise<void> {
    await apiRequest(`/employees/${id}`, {
      method: 'DELETE',
    });
  },
};
