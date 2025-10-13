import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth'; // Будет перенаправлено через proxy
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    // Для демо - временный mock, замените на реальный API call
    const mockResponse: LoginResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      expiresIn: 3600,
      userId: 'user-' + Date.now(),
      userName: loginRequest.email,
      roles: ['student', 'user']
    };

    return new Observable<LoginResponse>(observer => {
      setTimeout(() => {
        this.storeAuthData(mockResponse);
        this.loadUserFromToken(mockResponse.token);
        observer.next(mockResponse);
        observer.complete();
      }, 1000);
    });

    // Раскомментируйте когда API будет готово:
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
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Для mock токена просто проверяем наличие
      if (token.startsWith('mock-jwt-token-')) {
        return true;
      }

      // Для реального JWT проверяем expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.roles.includes(role) : false;
  }

  private storeAuthData(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify({
      id: response.userId,
      userName: response.userName,
      roles: response.roles
    }));
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
    if (token.startsWith('mock-jwt-token-')) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      }
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user: User = {
        id: payload.userId,
        email: payload.email,
        userName: payload.userName,
        roles: payload.roles || []
      };
      this.currentUserSubject.next(user);
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  }
}
