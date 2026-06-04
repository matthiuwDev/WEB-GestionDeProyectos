export interface LoginCredentials {
  email?: string | null;
  password?: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  status: string;
  data: User;
  token: string;
}