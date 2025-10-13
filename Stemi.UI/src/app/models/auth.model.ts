export interface LoginRequest {
  email: string;
  password: string;
  role?: string; // Добавляем роль для демо
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  userId: string;
  userName: string;
  roles: string[];
  email: string;
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
  role: string;
}

// Роли системы
export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin'
}
