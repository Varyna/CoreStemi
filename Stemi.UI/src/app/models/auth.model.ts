export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  userId: string;
  userName: string;
  roles: string[];
}

export interface User {
  id: string;
  email: string;
  userName: string;
  roles: string[];
}

export interface RegisterRequest {
  email: string;
  password: string;
  userName: string;
  firstName: string;
  lastName: string;
}
