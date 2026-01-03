import { apiRequest, apiJson, setAuthToken, removeAuthToken } from '@/lib/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  companyName: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await apiJson<AuthResponse>(response);
    if (result.token) {
      setAuthToken(result.token);
    }
    return result;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await apiJson<AuthResponse>(response);
    if (result.token) {
      setAuthToken(result.token);
    }
    return result;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiRequest('/auth/me');
    const result = await apiJson<{ user: User }>(response);
    return result.user;
  },

  logout(): void {
    removeAuthToken();
  },
};
