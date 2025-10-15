import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { LoginRequest, LoginResponse, User, UserRole } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          this.storeAuthData(response);
          this.currentUserSubject.next(this.getUserFromResponse(response));
        }),
        catchError(error => {
          this.clearAuthData();
          return throwError(() => this.handleAuthError(error));
        })
      );
  }

  logout(): void {
    this.clearAuthData();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Проверяем expiration токена, если он есть в localStorage
    const expiration = localStorage.getItem('tokenExpiration');
    if (expiration) {
      return new Date().getTime() < Number(expiration);
    }

    // Если нет expiration, проверяем что токен существует
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.roles.includes(role) : false;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.currentUserSubject.value;
    return user ? roles.some(role => user.roles.includes(role)) : false;
  }

  isStudent(): boolean {
    return this.hasRole(UserRole.Student);
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.Admin);
  }

  isTeacher(): boolean {
    return this.hasRole(UserRole.Teacher);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Получение профиля с сервера
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
          this.updateStoredUser(user);
        }),
        catchError(error => {
          this.clearAuthData();
          return throwError(() => this.handleAuthError(error));
        })
      );
  }

  // Обновление профиля
  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, userData)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
          this.updateStoredUser(user);
        }),
        catchError(error => throwError(() => this.handleAuthError(error)))
      );
  }

  // Смена пароля
  changePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, passwordData)
      .pipe(
        catchError(error => throwError(() => this.handleAuthError(error)))
      );
  }

  // Восстановление пароля
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email })
      .pipe(
        catchError(error => throwError(() => this.handleAuthError(error)))
      );
  }

  // Refresh token
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        tap(response => {
          this.storeAuthData(response);
          this.currentUserSubject.next(this.getUserFromResponse(response));
        }),
        catchError(error => {
          this.clearAuthData();
          return throwError(() => this.handleAuthError(error));
        })
      );
  }

  // Проверка необходимости обновления токена
  shouldRefreshToken(): boolean {
    const expiration = localStorage.getItem('tokenExpiration');
    if (!expiration) return false;

    // Обновляем токен за 5 минут до истечения
    const refreshThreshold = 5 * 60 * 1000; // 5 минут
    return new Date().getTime() > (Number(expiration) - refreshThreshold);
  }

  // Получение headers для авторизованных запросов
  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private storeAuthData(response: LoginResponse): void {
    localStorage.setItem('token', response.token);

    // Сохраняем expiration если есть
    if (response.expiresIn) {
      const expiration = new Date().getTime() + (response.expiresIn * 1000);
      localStorage.setItem('tokenExpiration', expiration.toString());
    }

    const user = this.getUserFromResponse(response);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    const token = this.getToken();

    if (userStr && token && this.isAuthenticated()) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearAuthData();
      }
    }
  }

  private updateStoredUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private getUserFromResponse(response: LoginResponse): User {
    return {
      id: response.userId,
      userName: response.userName,
      email: response.email,
      roles: response.roles,
      passwordHash: '', // Не храним пароль на фронтенде
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private handleAuthError(error: any): string {
    if (error.status === 401) {
      this.clearAuthData();
      return 'Сессия истекла. Пожалуйста, войдите снова.';
    } else if (error.status === 403) {
      return 'Недостаточно прав для выполнения действия.';
    } else if (error.status === 400) {
      return error.error?.message || 'Неверные данные.';
    } else if (error.status === 0) {
      return 'Ошибка соединения с сервером.';
    } else {
      return error.error?.message || 'Произошла ошибка при авторизации.';
    }
  }
}
