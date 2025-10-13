import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, User, UserRole } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Mock пользователи для демонстрации
  private mockUsers = [
    {
      email: 'student@stemi.ru',
      password: '123456',
      user: {
        id: 'student-1',
        userName: 'Иванов Иван',
        email: 'student@stemi.ru',
        roles: [UserRole.STUDENT]
      }
    },
    {
      email: 'admin@stemi.ru',
      password: 'admin123',
      user: {
        id: 'admin-1',
        userName: 'Администратор',
        email: 'admin@stemi.ru',
        roles: [UserRole.ADMIN]
      }
    }
  ];

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    // Mock авторизация - в реальном приложении заменить на HTTP запрос
    return new Observable<LoginResponse>(observer => {
      setTimeout(() => {
        const user = this.mockUsers.find(u =>
          u.email === loginRequest.email && u.password === loginRequest.password
        );

        if (user) {
          const response: LoginResponse = {
            token: `jwt-token-${user.user.id}`,
            expiresIn: 3600,
            userId: user.user.id,
            userName: user.user.userName,
            roles: user.user.roles,
            email: user.user.email
          };

          this.storeAuthData(response);
          this.loadUserFromToken(response.token);
          observer.next(response);
        } else {
          observer.error('Неверный email или пароль');
        }
        observer.complete();
      }, 1000);
    });

    // Раскомментировать для реального API:
    /*
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          this.storeAuthData(response);
          this.loadUserFromToken(response.token);
        })
      );
    */
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && token.startsWith('jwt-token-');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.roles.includes(role) : false;
  }

  isStudent(): boolean {
    return this.hasRole(UserRole.STUDENT);
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private storeAuthData(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify({
      id: response.userId,
      userName: response.userName,
      email: response.email,
      roles: response.roles
    }));
    localStorage.setItem('userRole', response.roles[0]); // Основная роль
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    const token = this.getToken();

    if (userStr && token && this.isAuthenticated()) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
    }
  }

  private loadUserFromToken(token: string): void {
    // Для mock токена просто загружаем из localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
    }
  }
}
