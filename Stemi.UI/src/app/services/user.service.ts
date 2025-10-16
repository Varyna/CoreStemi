import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  userName: string;
  email: string;
  roles: string[]; // или UserRole[] если используете enum
  createdAt: string;
  updatedAt: string;
  status?: string;
}

export interface UserListResponse {
  users: User[];
  totalCount: number;
}

export interface UserImportResult {
  successfullyImported: number;
  failed: number;
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.production
    ? `${environment.apiUrl}/api`
    : '/api';

  constructor(private http: HttpClient) { }

  // Получить всех пользователей
  getUsers(): Observable<User[]> {
    return this.http.get<UserListResponse>(`${this.apiUrl}/users`).pipe(
      map(response => response.users),
      catchError(this.handleError)
    );
  }

  // Получить пользователя по ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Удалить пользователя
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Импорт пользователей из Excel
  importUsersFromExcel(file: File): Observable<UserImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UserImportResult>(`${this.apiUrl}/users/import`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Скачать шаблон для импорта
  downloadTemplate(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/users/template`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Создать пользователя (если нужно)
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user).pipe(
      catchError(this.handleError)
    );
  }

  // Обновить пользователя (если нужно)
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  // Обработка ошибок
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Произошла неизвестная ошибка';

    if (error.error instanceof ErrorEvent) {
      // Клиентская ошибка
      errorMessage = `Ошибка: ${error.error.message}`;
    } else {
      // Серверная ошибка
      switch (error.status) {
        case 0:
          errorMessage = 'Нет соединения с сервером. Проверьте подключение к интернету.';
          break;
        case 400:
          // Пытаемся получить детальную ошибку от сервера
          if (error.error && error.error.errors) {
            const serverErrors = error.error.errors;
            if (Array.isArray(serverErrors)) {
              errorMessage = serverErrors.join(', ');
            } else if (typeof serverErrors === 'string') {
              errorMessage = serverErrors;
            }
          } else {
            errorMessage = 'Некорректный запрос. Проверьте введенные данные.';
          }
          break;
        case 401:
          errorMessage = 'Неавторизованный доступ. Требуется авторизация.';
          break;
        case 403:
          errorMessage = 'Доступ запрещен. Недостаточно прав.';
          break;
        case 404:
          errorMessage = 'Ресурс не найден.';
          break;
        case 409:
          errorMessage = 'Конфликт данных. Возможно, пользователь с таким email или именем уже существует.';
          break;
        case 500:
          errorMessage = 'Внутренняя ошибка сервера. Попробуйте позже.';
          break;
        default:
          errorMessage = `Ошибка сервера: ${error.status} - ${error.message}`;
      }
    }

    console.error('Ошибка HTTP:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
