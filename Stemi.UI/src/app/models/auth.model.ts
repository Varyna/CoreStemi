export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  userId: string;
  userName: string;
  roles: UserRole[];
  email: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  roles?: UserRole[];
}

export interface User {
  id: string;
  userName: string;
  email: string;
  passwordHash: string;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  Student = 0,
  Admin = 1,
  Teacher = 2
}

// Дополнительные интерфейсы для расширенной функциональности
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Для работы с ролями в UI
export const UserRoleLabels: { [key in UserRole]: string } = {
  [UserRole.Student]: 'Студент',
  [UserRole.Admin]: 'Администратор',
  [UserRole.Teacher]: 'Преподаватель'
};

// Хелпер функции для работы с ролями
export function getUserRoleLabel(role: UserRole): string {
  return UserRoleLabels[role];
}

export function hasRole(user: User | null, role: UserRole): boolean {
  return user ? user.roles.includes(role) : false;
}

export function hasAnyRole(user: User | null, roles: UserRole[]): boolean {
  return user ? roles.some(role => user.roles.includes(role)) : false;
}
