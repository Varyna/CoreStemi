import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  userName: string;
  email: string;
  roles: string[];
  createdAt: string;
}

export interface UserImportResult {
  totalRows: number;
  successfullyImported: number;
  failed: number;
  errors: string[];
  importedUsers: User[];
  hasMoreErrors?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Автоматически определяем URL в зависимости от environment
  private apiUrl = environment.production
    ? `${environment.apiUrl}/api`  // Для production: полный URL
    : '/api';                     // Для development: относительный путь (работает через proxy)

  constructor(private http: HttpClient) { }

  // Получить всех пользователей
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      catchError(this.handleError)
    );
  }

  // Получить пользователя по ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Получить пользователей по роли
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/role/${role}`).pipe(
      catchError(this.handleError)
    );
  }

  // Создать пользователя
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user).pipe(
      catchError(this.handleError)
    );
  }

  // Обновить пользователя
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user).pipe(
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

    return this.http.post<UserImportResult>(`${this.apiUrl}/import/users/excel`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Скачать шаблон для импорта
  downloadTemplate(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/import/users/template`, {
      responseType: 'blob'
    }).pipe(
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
          errorMessage = 'Некорректный запрос. Проверьте введенные данные.';
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
